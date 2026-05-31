'use client';

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useQuadContext } from '../QuadContext';
import type { QuadViewProps } from '../types';
import type { Database } from '@/lib/database.types';

type CourseVehicle = Database['public']['Tables']['course_vehicles']['Row'];
type Deployment = Database['public']['Tables']['course_vehicle_deployments']['Row'];

const ROLE_LABEL: Record<string, string> = {
  safety_car: 'Safety Car',
  pace_car: 'Pace Car',
  medical: 'Medical',
  recovery: 'Recovery',
  course_car: 'Course Car',
  official: 'Official',
};

function sinceLabel(iso: string, now: number): string {
  const ms = now - Date.parse(iso);
  if (!Number.isFinite(ms) || ms < 0) return '0:00';
  const total = Math.floor(ms / 1000);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

/**
 * Read-only dashboard summary of configured course vehicles and their live
 * deployment status. Configuration + manual deploy/clear live in the popout
 * Course Vehicles panel; this view is at-a-glance status only.
 */
export function CourseVehiclesView(_props: QuadViewProps) {
  const { eventUuid, sessionUuid, userId } = useQuadContext();
  const [vehicles, setVehicles] = useState<CourseVehicle[]>([]);
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Configured vehicles (event-scoped) + realtime.
  const loadVehicles = useCallback(async (eId: string) => {
    const { data, error: err } = await supabase
      .from('course_vehicles')
      .select('*')
      .eq('event_id', eId)
      .order('label', { ascending: true });
    if (err) { setError(err.message); return; }
    setError(null);
    setVehicles(data ?? []);
  }, []);

  useEffect(() => {
    if (!eventUuid || !userId) { setVehicles([]); return; }
    setLoading(true);
    loadVehicles(eventUuid).finally(() => setLoading(false));
    const channel = supabase
      .channel(`cv-view-vehicles-${eventUuid}`)
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'course_vehicles', filter: `event_id=eq.${eventUuid}` },
        () => { loadVehicles(eventUuid); })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [eventUuid, userId, loadVehicles]);

  // Open deployments (session-scoped) + realtime + poll safety net.
  const loadDeployments = useCallback(async (sId: string) => {
    const { data, error: err } = await supabase
      .from('course_vehicle_deployments')
      .select('*')
      .eq('session_id', sId)
      .is('cleared_at', null);
    if (err) { setError(err.message); return; }
    setDeployments(data ?? []);
  }, []);

  useEffect(() => {
    if (!sessionUuid || !userId) { setDeployments([]); return; }
    loadDeployments(sessionUuid);
    const channel = supabase
      .channel(`cv-view-deploys-${sessionUuid}`)
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'course_vehicle_deployments', filter: `session_id=eq.${sessionUuid}` },
        () => { loadDeployments(sessionUuid); })
      .subscribe();
    const poll = setInterval(() => { loadDeployments(sessionUuid); }, 5000);
    return () => { supabase.removeChannel(channel); clearInterval(poll); };
  }, [sessionUuid, userId, loadDeployments]);

  // 1s tick so the "deployed for" timer advances between realtime events.
  const [, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  // Open deployment per vehicle (one open row per vehicle is DB-guaranteed).
  const openByVehicle = new Map<string, Deployment>();
  for (const d of deployments) {
    if (d.cleared_at === null && !openByVehicle.has(d.course_vehicle_id)) {
      openByVehicle.set(d.course_vehicle_id, d);
    }
  }
  const deployedCount = vehicles.filter((v) => openByVehicle.has(v.id)).length;

  if (!eventUuid) {
    return <Centered>Select an event</Centered>;
  }
  if (error) {
    return <Centered className="text-status-red text-center">{error}</Centered>;
  }
  if (loading && vehicles.length === 0) {
    return <Centered>Loading…</Centered>;
  }
  if (vehicles.length === 0) {
    return (
      <div className="flex flex-col">
        <SummaryBanner deployedCount={0} total={0} />
        <div className="flex-1 flex items-center justify-center text-text-muted text-xs py-6">
          No course vehicles configured
        </div>
      </div>
    );
  }

  const now = Date.now();
  // Deployed first, then enabled standby, then disabled; alpha by label within.
  const rank = (v: CourseVehicle) => (openByVehicle.has(v.id) ? 0 : v.enabled ? 1 : 2);
  const rows = [...vehicles].sort((a, b) => rank(a) - rank(b) || a.label.localeCompare(b.label));

  return (
    <div className="flex flex-col">
      <SummaryBanner deployedCount={deployedCount} total={vehicles.length} />
      <div className="grid grid-cols-[1fr_auto_auto] gap-3 px-3 py-1.5 border-b border-border-default bg-bg-surface text-xs uppercase tracking-wider text-text-secondary font-semibold">
        <span>Vehicle</span>
        <span className="text-right">Status</span>
        <span className="text-right pl-2">For</span>
      </div>

      <div className="divide-y divide-border-default/50">
        {rows.map((v) => {
          const open = openByVehicle.get(v.id);
          return (
            <div key={v.id} className="grid grid-cols-[1fr_auto_auto] gap-3 px-3 py-2 items-center">
              <div className="min-w-0 flex items-center gap-2">
                <span
                  className="inline-block w-3 h-3 rounded-sm shrink-0"
                  style={{ backgroundColor: v.color }}
                />
                <span className="text-sm font-semibold text-text-primary truncate" title={v.label}>
                  {v.label}
                </span>
                <span className="text-xs text-text-muted shrink-0">
                  {ROLE_LABEL[v.role] ?? v.role}
                </span>
              </div>

              <div className="text-right whitespace-nowrap">
                {open ? (
                  <span className="inline-flex items-center gap-1.5">
                    <span className="inline-flex items-center px-1.5 py-0.5 text-[0.625rem] font-bold uppercase tracking-wider rounded border border-status-red/50 text-status-red bg-status-red/10">
                      Deployed
                    </span>
                    <span className="text-xs text-text-secondary">{open.deployment_type}</span>
                    <span className="text-[0.625rem] uppercase tracking-wider text-text-muted">
                      {open.trigger_source === 'manual' ? 'man' : 'auto'}
                    </span>
                  </span>
                ) : v.enabled ? (
                  <span className="text-xs uppercase tracking-wider text-status-green/80 font-semibold">
                    Standby
                  </span>
                ) : (
                  <span className="text-xs uppercase tracking-wider text-text-muted font-semibold">
                    Disabled
                  </span>
                )}
              </div>

              <span className="font-data text-sm tabular-nums text-right pl-2 whitespace-nowrap text-accent-orange">
                {open ? sinceLabel(open.deployed_at, now) : '—'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SummaryBanner({ deployedCount, total }: { deployedCount: number; total: number }) {
  const caution = deployedCount > 0;
  return (
    <div className="flex items-center justify-center gap-2 px-3 py-1.5 bg-bg-surface border-b border-border-default">
      <span
        className={`font-data text-lg font-bold tabular-nums leading-none ${caution ? 'text-status-red' : 'text-status-green'}`}
      >
        {caution ? deployedCount : '✓'}
      </span>
      <span className="text-[0.625rem] uppercase tracking-wider text-text-secondary font-semibold">
        {caution
          ? deployedCount === 1 ? 'Vehicle Deployed' : 'Vehicles Deployed'
          : `All Clear · ${total} Configured`}
      </span>
    </div>
  );
}

function Centered({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`h-full flex items-center justify-center text-text-muted text-xs px-3 ${className}`}>
      {children}
    </div>
  );
}
