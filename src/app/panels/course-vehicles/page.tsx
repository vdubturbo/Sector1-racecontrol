'use client';

import { useState, useEffect, useCallback } from 'react';
import { PanelHeader } from '@/components/layout/PanelHeader';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useBridgeSocket } from '@/hooks/useBridgeSocket';
import { useBroadcastChannel } from '@/hooks/useBroadcastChannel';
import { useAuth } from '@/hooks/useAuth';
import { useActiveSession } from '@/hooks/useActiveSession';
import { supabase } from '@/lib/supabase';
import type { Database } from '@/lib/database.types';
import type { FlagColor } from '@/types/racing';

type CourseVehicle = Database['public']['Tables']['course_vehicles']['Row'];
type Deployment = Database['public']['Tables']['course_vehicle_deployments']['Row'];

// Roles mirror the course_vehicles.role CHECK constraint (migration 060).
const ROLES = ['safety_car', 'pace_car', 'medical', 'recovery', 'course_car', 'official'] as const;

const ROLE_LABEL: Record<string, string> = {
  safety_car: 'Safety Car',
  pace_car: 'Pace Car',
  medical: 'Medical',
  recovery: 'Recovery',
  course_car: 'Course Car',
  official: 'Official',
};

// Default deployment_type for a manual deploy, derived from the vehicle's role.
// Mirrors roleToDeploymentType in the server ingest service.
const ROLE_TO_DEPLOYMENT_TYPE: Record<string, string> = {
  safety_car: 'safety_car',
  pace_car: 'pace',
  medical: 'other',
  recovery: 'recovery',
  course_car: 'other',
  official: 'other',
};

const DEFAULT_COLOR = '#f59e0b';

interface VehicleForm {
  id?: string;
  sentinel_serial: string;
  role: string;
  label: string;
  color: string;
  icon: string;
  enabled: boolean;
}

const EMPTY_FORM: VehicleForm = {
  sentinel_serial: '',
  role: 'safety_car',
  label: '',
  color: DEFAULT_COLOR,
  icon: '',
  enabled: true,
};

export default function CourseVehiclesPanel() {
  const bridge = useBridgeSocket();
  const { user } = useAuth();
  const [flagColor, setFlagColor] = useState<FlagColor | null>(null);

  useBroadcastChannel({
    onEventSelected: (msg) => bridge.selectEvent(msg.eventId),
    onFlagChange: (msg) => setFlagColor(msg.flagColor),
  });

  const { session } = useActiveSession(bridge.selectedEventId, user?.id ?? null);
  const eventUuid = session?.eventUuid ?? null;
  const sessionUuid = session?.sessionUuid ?? null;

  const eventName = bridge.availableEvents.find(
    (e) => e.eventId === bridge.selectedEventId
  )?.name ?? bridge.selectedEventId ?? null;

  const [vehicles, setVehicles] = useState<CourseVehicle[]>([]);
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [form, setForm] = useState<VehicleForm>(EMPTY_FORM);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // ----- Config CRUD: load + realtime -----
  const loadVehicles = useCallback(async (eId: string) => {
    const { data, error: err } = await supabase
      .from('course_vehicles')
      .select('*')
      .eq('event_id', eId)
      .order('label', { ascending: true });
    if (err) { setError(err.message); return; }
    setVehicles(data ?? []);
  }, []);

  useEffect(() => {
    if (!eventUuid) { setVehicles([]); return; }
    loadVehicles(eventUuid);
    const channel = supabase
      .channel(`course-vehicles-${eventUuid}`)
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'course_vehicles', filter: `event_id=eq.${eventUuid}` },
        () => { loadVehicles(eventUuid); })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [eventUuid, loadVehicles]);

  // ----- Deployments: load + realtime + poll safety net -----
  const loadDeployments = useCallback(async (sId: string) => {
    const { data, error: err } = await supabase
      .from('course_vehicle_deployments')
      .select('*')
      .eq('session_id', sId)
      .order('deployed_at', { ascending: false })
      .limit(50);
    if (err) { setError(err.message); return; }
    setDeployments(data ?? []);
  }, []);

  useEffect(() => {
    if (!sessionUuid) { setDeployments([]); return; }
    loadDeployments(sessionUuid);
    const channel = supabase
      .channel(`course-deployments-${sessionUuid}`)
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'course_vehicle_deployments', filter: `session_id=eq.${sessionUuid}` },
        () => { loadDeployments(sessionUuid); })
      .subscribe();
    // Realtime inserts have proven unreliable for some tables (see
    // useActivePitStops); a 5s poll keeps the live caution state prompt.
    const poll = setInterval(() => { loadDeployments(sessionUuid); }, 5000);
    return () => { supabase.removeChannel(channel); clearInterval(poll); };
  }, [sessionUuid, loadDeployments]);

  // Open deployment (cleared_at null) keyed by course_vehicle_id.
  const openByVehicle = new Map<string, Deployment>();
  for (const d of deployments) {
    if (d.cleared_at === null && !openByVehicle.has(d.course_vehicle_id)) {
      openByVehicle.set(d.course_vehicle_id, d);
    }
  }

  // ----- Config handlers -----
  const resetForm = () => { setForm(EMPTY_FORM); setError(null); };

  const saveVehicle = async () => {
    if (!eventUuid) { setError('No active event'); return; }
    const serial = form.sentinel_serial.trim();
    const label = form.label.trim();
    if (!serial) { setError('Sentinel serial is required (the telemetry serial the device broadcasts on)'); return; }
    if (!label) { setError('Label is required'); return; }

    setBusy(true);
    setError(null);
    try {
      if (form.id) {
        const { error: err } = await supabase
          .from('course_vehicles')
          .update({
            sentinel_serial: serial,
            role: form.role,
            label,
            color: form.color,
            icon: form.icon.trim() || null,
            enabled: form.enabled,
          })
          .eq('id', form.id);
        if (err) throw err;
      } else {
        const { error: err } = await supabase
          .from('course_vehicles')
          .insert({
            event_id: eventUuid,
            sentinel_serial: serial,
            role: form.role,
            label,
            color: form.color,
            icon: form.icon.trim() || null,
            enabled: form.enabled,
          });
        if (err) throw err;
      }
      resetForm();
      await loadVehicles(eventUuid);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  };

  const editVehicle = (v: CourseVehicle) => {
    setForm({
      id: v.id,
      sentinel_serial: v.sentinel_serial,
      role: v.role,
      label: v.label,
      color: v.color,
      icon: v.icon ?? '',
      enabled: v.enabled,
    });
    setError(null);
  };

  const toggleEnabled = async (v: CourseVehicle) => {
    setError(null);
    const { error: err } = await supabase
      .from('course_vehicles')
      .update({ enabled: !v.enabled })
      .eq('id', v.id);
    if (err) setError(err.message);
    else if (eventUuid) await loadVehicles(eventUuid);
  };

  const deleteVehicle = async (v: CourseVehicle) => {
    setError(null);
    const { error: err } = await supabase.from('course_vehicles').delete().eq('id', v.id);
    if (err) {
      // FK is ON DELETE NO ACTION: a vehicle with deployment history can't be
      // deleted. Disabling is the intended "stop tracking" path.
      setError(`Cannot delete "${v.label}" — it likely has deployment history. Disable it instead.`);
    } else if (eventUuid) {
      await loadVehicles(eventUuid);
    }
  };

  // ----- Manual deploy / clear (writes trigger_source='manual') -----
  const leaderLap = (): number | null => {
    const leader = bridge.positions.find((p) => p.overallPosition === 1);
    return leader && Number.isFinite(leader.lastLapCompleted) ? leader.lastLapCompleted : null;
  };

  const manualDeploy = async (v: CourseVehicle, deploymentType: string) => {
    if (!sessionUuid) { setError('No active session to deploy into'); return; }
    setError(null);
    setNotice(null);
    const { error: err } = await supabase
      .from('course_vehicle_deployments')
      .insert({
        session_id: sessionUuid,
        course_vehicle_id: v.id,
        sentinel_serial: v.sentinel_serial,
        deployment_type: deploymentType,
        trigger_source: 'manual',
        deployed_at: new Date().toISOString(),
        deploy_leader_lap: leaderLap(),
      });
    if (err) {
      // 23505 = unique violation on the one-open-deployment index (migration
      // 062): another open row already exists for this (session, serial) — a
      // racing auto-open or another operator beat us. Not an error; the existing
      // open row governs. Refresh from DB so the row's Clear button appears.
      if (err.code === '23505') {
        setNotice(`${v.label} is already deployed.`);
      } else {
        setError(err.message);
      }
      await loadDeployments(sessionUuid);
      return;
    }
    await loadDeployments(sessionUuid);
  };

  const manualClear = async (d: Deployment) => {
    if (!sessionUuid) return;
    setError(null);
    setNotice(null);
    const { error: err } = await supabase
      .from('course_vehicle_deployments')
      .update({
        cleared_at: new Date().toISOString(),
        clear_leader_lap: leaderLap(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', d.id)
      .is('cleared_at', null);
    if (err) setError(err.message);
    else await loadDeployments(sessionUuid);
  };

  const fmtTime = (iso: string | null) =>
    iso ? new Date(iso).toLocaleTimeString([], { hour12: false }) : '—';
  const fmtDuration = (secs: number | null) => {
    if (secs == null) return null;
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  return (
    <>
      <PanelHeader
        panelName="Course Vehicles"
        panelIcon="🚨"
        connectionState={bridge.connectionState}
        eventName={eventName}
        flagColor={bridge.raceState?.flagColor ?? flagColor}
      />

      <div className="flex-1 overflow-auto p-3 space-y-4 font-[var(--font-mono)] text-text-primary">
        {!user && (
          <div className="text-status-yellow text-xs">
            Sign in to the Race Control app to manage course vehicles.
          </div>
        )}
        {user && !eventUuid && (
          <div className="text-text-muted text-xs">
            Select an event (no matching Supabase event found for the current selection).
          </div>
        )}
        {error && (
          <div className="text-status-red text-xs border border-status-red/40 bg-status-red/10 rounded px-2 py-1">
            {error}
          </div>
        )}
        {notice && (
          <div className="text-status-yellow text-xs border border-status-yellow/40 bg-status-yellow/10 rounded px-2 py-1">
            {notice}
          </div>
        )}

        {eventUuid && (
          <>
            {/* ===== Config form ===== */}
            <section>
              <span className="section-header text-xs text-text-muted">
                {form.id ? 'Edit Course Vehicle' : 'Add Course Vehicle'}
              </span>
              <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                <label className="flex flex-col gap-1">
                  <span className="text-text-muted">Sentinel serial (telemetry)</span>
                  <input
                    className="bg-bg-card border border-border-subtle rounded px-2 py-1"
                    value={form.sentinel_serial}
                    onChange={(e) => setForm({ ...form, sentinel_serial: e.target.value })}
                    placeholder="device broadcast serial"
                  />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-text-muted">Label</span>
                  <input
                    className="bg-bg-card border border-border-subtle rounded px-2 py-1"
                    value={form.label}
                    onChange={(e) => setForm({ ...form, label: e.target.value })}
                    placeholder="Safety Car 1"
                  />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-text-muted">Role</span>
                  <select
                    className="bg-bg-card border border-border-subtle rounded px-2 py-1"
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                  >
                    {ROLES.map((r) => <option key={r} value={r}>{ROLE_LABEL[r]}</option>)}
                  </select>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <label className="flex flex-col gap-1">
                    <span className="text-text-muted">Color</span>
                    <input
                      type="color"
                      className="bg-bg-card border border-border-subtle rounded h-7 w-full"
                      value={form.color}
                      onChange={(e) => setForm({ ...form, color: e.target.value })}
                    />
                  </label>
                  <label className="flex flex-col gap-1">
                    <span className="text-text-muted">Icon (opt)</span>
                    <input
                      className="bg-bg-card border border-border-subtle rounded px-2 py-1"
                      value={form.icon}
                      onChange={(e) => setForm({ ...form, icon: e.target.value })}
                      placeholder="🚑"
                    />
                  </label>
                </div>
              </div>
              <div className="mt-2 flex items-center gap-3">
                <label className="flex items-center gap-1 text-xs text-text-muted">
                  <input
                    type="checkbox"
                    checked={form.enabled}
                    onChange={(e) => setForm({ ...form, enabled: e.target.checked })}
                  />
                  Enabled (connect + track this weekend)
                </label>
                <div className="flex-1" />
                {form.id && (
                  <Button variant="ghost" onClick={resetForm} disabled={busy}>Cancel</Button>
                )}
                <Button variant="primary" onClick={saveVehicle} disabled={busy}>
                  {form.id ? 'Save' : 'Add'}
                </Button>
              </div>
            </section>

            {/* ===== Configured vehicles + live state ===== */}
            <section>
              <span className="section-header text-xs text-text-muted">Configured Vehicles</span>
              {vehicles.length === 0 ? (
                <p className="text-text-muted text-xs mt-2">No course vehicles configured for this event.</p>
              ) : (
                <ul className="mt-2 space-y-1.5">
                  {vehicles.map((v) => {
                    const open = openByVehicle.get(v.id);
                    return (
                      <li
                        key={v.id}
                        className="flex items-center gap-2 bg-bg-card border border-border-subtle rounded px-2 py-1.5 text-xs"
                      >
                        <span
                          className="inline-block w-3 h-3 rounded-sm shrink-0"
                          style={{ backgroundColor: v.color }}
                        />
                        <span className="font-semibold">{v.label}</span>
                        <span className="text-text-muted">{ROLE_LABEL[v.role] ?? v.role}</span>
                        <span className="text-text-muted truncate max-w-32" title={v.sentinel_serial}>
                          {v.sentinel_serial}
                        </span>
                        {!v.enabled && <Badge>disabled</Badge>}
                        {open && <Badge variant="red">DEPLOYED</Badge>}
                        <div className="flex-1" />
                        {open ? (
                          <Button variant="primary" onClick={() => manualClear(open)}>Clear</Button>
                        ) : (
                          <Button
                            onClick={() => manualDeploy(v, ROLE_TO_DEPLOYMENT_TYPE[v.role] ?? 'other')}
                            disabled={!sessionUuid || !v.enabled}
                            title={!sessionUuid ? 'No active session' : !v.enabled ? 'Vehicle disabled' : 'Manually deploy'}
                          >
                            Deploy
                          </Button>
                        )}
                        <Button variant="ghost" onClick={() => editVehicle(v)}>Edit</Button>
                        <Button variant="ghost" onClick={() => toggleEnabled(v)}>
                          {v.enabled ? 'Disable' : 'Enable'}
                        </Button>
                        <Button variant="ghost" onClick={() => deleteVehicle(v)}>Delete</Button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>

            {/* ===== Deployment timeline ===== */}
            <section>
              <span className="section-header text-xs text-text-muted">
                Deployment Log {sessionUuid ? '' : '(no active session)'}
              </span>
              {deployments.length === 0 ? (
                <p className="text-text-muted text-xs mt-2">No deployments recorded for this session.</p>
              ) : (
                <ul className="mt-2 space-y-1">
                  {deployments.map((d) => {
                    const v = vehicles.find((x) => x.id === d.course_vehicle_id);
                    const dur = fmtDuration(d.duration_seconds);
                    return (
                      <li key={d.id} className="flex items-center gap-2 text-[0.6875rem] px-2 py-1 border-b border-border-subtle/50">
                        {d.cleared_at === null
                          ? <Badge variant="red">ACTIVE</Badge>
                          : <Badge>closed</Badge>}
                        <span className="font-semibold">{v?.label ?? d.sentinel_serial}</span>
                        <span className="text-text-muted">{d.deployment_type}</span>
                        <Badge variant={d.trigger_source === 'manual' ? 'orange' : 'default'}>
                          {d.trigger_source}
                        </Badge>
                        <div className="flex-1" />
                        <span className="text-text-muted">
                          {fmtTime(d.deployed_at)} → {fmtTime(d.cleared_at)}
                          {d.deploy_leader_lap != null && ` · L${d.deploy_leader_lap}`}
                          {dur && ` · ${dur}`}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>
          </>
        )}
      </div>
    </>
  );
}
