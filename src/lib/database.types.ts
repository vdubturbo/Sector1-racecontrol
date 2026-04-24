export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      active_redmist_connections: {
        Row: {
          connected_at: string | null
          connection_metadata: Json | null
          connection_status: string | null
          created_at: string | null
          data_packets_received: number | null
          disconnected_at: string | null
          error_message: string | null
          event_id: string
          id: string
          last_data_at: string | null
          redmist_event_id: string
          redmist_session_id: string | null
          session_id: string | null
          updated_at: string | null
        }
        Insert: {
          connected_at?: string | null
          connection_metadata?: Json | null
          connection_status?: string | null
          created_at?: string | null
          data_packets_received?: number | null
          disconnected_at?: string | null
          error_message?: string | null
          event_id: string
          id?: string
          last_data_at?: string | null
          redmist_event_id: string
          redmist_session_id?: string | null
          session_id?: string | null
          updated_at?: string | null
        }
        Update: {
          connected_at?: string | null
          connection_metadata?: Json | null
          connection_status?: string | null
          created_at?: string | null
          data_packets_received?: number | null
          disconnected_at?: string | null
          error_message?: string | null
          event_id?: string
          id?: string
          last_data_at?: string | null
          redmist_event_id?: string
          redmist_session_id?: string | null
          session_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "active_redmist_connections_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "racing_events"
            referencedColumns: ["event_id"]
          },
          {
            foreignKeyName: "active_redmist_connections_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "v_active_sessions_summary"
            referencedColumns: ["event_id"]
          },
          {
            foreignKeyName: "active_redmist_connections_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "racing_sessions"
            referencedColumns: ["session_id"]
          },
          {
            foreignKeyName: "active_redmist_connections_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "v_active_sessions_summary"
            referencedColumns: ["session_id"]
          },
        ]
      }
      ai_prompts: {
        Row: {
          created_at: string | null
          description: string | null
          prompt_id: string
          prompt_key: string
          prompt_name: string
          prompt_text: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          prompt_id?: string
          prompt_key: string
          prompt_name: string
          prompt_text: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          prompt_id?: string
          prompt_key?: string
          prompt_name?: string
          prompt_text?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      broadcast_tokens: {
        Row: {
          created_at: string
          expires_at: string
          graphic_type: string
          id: string
          last_used_at: string | null
          revoked: boolean
          revoked_at: string | null
          revoked_reason: string | null
          session_id: string
          token_hash: string
          use_count: number
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at: string
          graphic_type: string
          id?: string
          last_used_at?: string | null
          revoked?: boolean
          revoked_at?: string | null
          revoked_reason?: string | null
          session_id: string
          token_hash: string
          use_count?: number
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string
          graphic_type?: string
          id?: string
          last_used_at?: string | null
          revoked?: boolean
          revoked_at?: string | null
          revoked_reason?: string | null
          session_id?: string
          token_hash?: string
          use_count?: number
          user_id?: string
        }
        Relationships: []
      }
      car_driver_assignments: {
        Row: {
          assignment_id: string
          car_id: string | null
          created_at: string | null
          driver_id: string | null
          end_time: string | null
          is_primary: boolean | null
          session_id: string | null
          start_time: string | null
          stint_number: number | null
        }
        Insert: {
          assignment_id?: string
          car_id?: string | null
          created_at?: string | null
          driver_id?: string | null
          end_time?: string | null
          is_primary?: boolean | null
          session_id?: string | null
          start_time?: string | null
          stint_number?: number | null
        }
        Update: {
          assignment_id?: string
          car_id?: string | null
          created_at?: string | null
          driver_id?: string | null
          end_time?: string | null
          is_primary?: boolean | null
          session_id?: string | null
          start_time?: string | null
          stint_number?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "car_driver_assignments_car_id_fkey"
            columns: ["car_id"]
            isOneToOne: false
            referencedRelation: "racing_cars"
            referencedColumns: ["car_id"]
          },
          {
            foreignKeyName: "car_driver_assignments_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "active_drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "car_driver_assignments_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "car_driver_assignments_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "racing_sessions"
            referencedColumns: ["session_id"]
          },
          {
            foreignKeyName: "car_driver_assignments_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "v_active_sessions_summary"
            referencedColumns: ["session_id"]
          },
        ]
      }
      car_profiles: {
        Row: {
          avg_lap_time_seconds: number | null
          car_class: string | null
          car_config: Json | null
          car_name: string | null
          car_number: string
          color: string | null
          created_at: string | null
          default_fuel_consumption: number | null
          displacement_cc: number | null
          dry_weight_kg: number | null
          engine_type: string | null
          fuel_tank_size_liters: number | null
          fuel_type: string | null
          fuel_unit: string | null
          id: string
          is_active: boolean | null
          make: string | null
          model: string | null
          owner_user_id: string | null
          photo_url: string | null
          photo_urls: Json | null
          race_duration_minutes: number | null
          series_id: string | null
          series_metadata: Json | null
          team_id: string | null
          telemetry_config: Json | null
          track_baselines: Json | null
          updated_at: string | null
          year: number | null
          yellow_flag_multiplier: number | null
        }
        Insert: {
          avg_lap_time_seconds?: number | null
          car_class?: string | null
          car_config?: Json | null
          car_name?: string | null
          car_number: string
          color?: string | null
          created_at?: string | null
          default_fuel_consumption?: number | null
          displacement_cc?: number | null
          dry_weight_kg?: number | null
          engine_type?: string | null
          fuel_tank_size_liters?: number | null
          fuel_type?: string | null
          fuel_unit?: string | null
          id?: string
          is_active?: boolean | null
          make?: string | null
          model?: string | null
          owner_user_id?: string | null
          photo_url?: string | null
          photo_urls?: Json | null
          race_duration_minutes?: number | null
          series_id?: string | null
          series_metadata?: Json | null
          team_id?: string | null
          telemetry_config?: Json | null
          track_baselines?: Json | null
          updated_at?: string | null
          year?: number | null
          yellow_flag_multiplier?: number | null
        }
        Update: {
          avg_lap_time_seconds?: number | null
          car_class?: string | null
          car_config?: Json | null
          car_name?: string | null
          car_number?: string
          color?: string | null
          created_at?: string | null
          default_fuel_consumption?: number | null
          displacement_cc?: number | null
          dry_weight_kg?: number | null
          engine_type?: string | null
          fuel_tank_size_liters?: number | null
          fuel_type?: string | null
          fuel_unit?: string | null
          id?: string
          is_active?: boolean | null
          make?: string | null
          model?: string | null
          owner_user_id?: string | null
          photo_url?: string | null
          photo_urls?: Json | null
          race_duration_minutes?: number | null
          series_id?: string | null
          series_metadata?: Json | null
          team_id?: string | null
          telemetry_config?: Json | null
          track_baselines?: Json | null
          updated_at?: string | null
          year?: number | null
          yellow_flag_multiplier?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "car_profiles_series_id_fkey"
            columns: ["series_id"]
            isOneToOne: false
            referencedRelation: "series"
            referencedColumns: ["series_id"]
          },
          {
            foreignKeyName: "car_profiles_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "orphaned_teams"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "car_profiles_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "team_ownership_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "car_profiles_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "team_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "car_profiles_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "team_subscription_status"
            referencedColumns: ["team_id"]
          },
        ]
      }
      data_sharing_permissions: {
        Row: {
          access_level: string
          created_at: string | null
          created_by: string
          id: string
          owner_team_id: string
          resource_id: string | null
          resource_type: string
          shared_with_team_id: string | null
          shared_with_user_id: string | null
          valid_from: string | null
          valid_until: string | null
        }
        Insert: {
          access_level: string
          created_at?: string | null
          created_by: string
          id?: string
          owner_team_id: string
          resource_id?: string | null
          resource_type: string
          shared_with_team_id?: string | null
          shared_with_user_id?: string | null
          valid_from?: string | null
          valid_until?: string | null
        }
        Update: {
          access_level?: string
          created_at?: string | null
          created_by?: string
          id?: string
          owner_team_id?: string
          resource_id?: string | null
          resource_type?: string
          shared_with_team_id?: string | null
          shared_with_user_id?: string | null
          valid_from?: string | null
          valid_until?: string | null
        }
        Relationships: []
      }
      driver_changes: {
        Row: {
          change_lap: number | null
          change_time: string
          created_at: string | null
          from_driver_id: string | null
          id: string
          notes: string | null
          participant_id: string
          pit_stop_id: string | null
          reason: string | null
          session_id: string
          to_driver_id: string
        }
        Insert: {
          change_lap?: number | null
          change_time: string
          created_at?: string | null
          from_driver_id?: string | null
          id?: string
          notes?: string | null
          participant_id: string
          pit_stop_id?: string | null
          reason?: string | null
          session_id: string
          to_driver_id: string
        }
        Update: {
          change_lap?: number | null
          change_time?: string
          created_at?: string | null
          from_driver_id?: string | null
          id?: string
          notes?: string | null
          participant_id?: string
          pit_stop_id?: string | null
          reason?: string | null
          session_id?: string
          to_driver_id?: string
        }
        Relationships: []
      }
      driver_invitations: {
        Row: {
          created_at: string | null
          driver_id: string
          email: string
          expires_at: string
          id: string
          invited_by: string | null
          token: string
          used_at: string | null
        }
        Insert: {
          created_at?: string | null
          driver_id: string
          email: string
          expires_at?: string
          id?: string
          invited_by?: string | null
          token?: string
          used_at?: string | null
        }
        Update: {
          created_at?: string | null
          driver_id?: string
          email?: string
          expires_at?: string
          id?: string
          invited_by?: string | null
          token?: string
          used_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "driver_invitations_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "active_drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "driver_invitations_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
        ]
      }
      drivers: {
        Row: {
          claimed_at: string | null
          created_at: string | null
          created_from_event: string | null
          date_of_birth: string | null
          deleted_at: string | null
          display_name: string
          email: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          experience: string | null
          first_name: string | null
          flagtronics_id: number | null
          id: string
          invited_at: string | null
          is_active: boolean | null
          last_name: string | null
          license_number: string | null
          license_type: string | null
          nationality: string | null
          nickname: string | null
          notes: string | null
          profile_photo_url: string | null
          status: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          claimed_at?: string | null
          created_at?: string | null
          created_from_event?: string | null
          date_of_birth?: string | null
          deleted_at?: string | null
          display_name: string
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          experience?: string | null
          first_name?: string | null
          flagtronics_id?: number | null
          id?: string
          invited_at?: string | null
          is_active?: boolean | null
          last_name?: string | null
          license_number?: string | null
          license_type?: string | null
          nationality?: string | null
          nickname?: string | null
          notes?: string | null
          profile_photo_url?: string | null
          status?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          claimed_at?: string | null
          created_at?: string | null
          created_from_event?: string | null
          date_of_birth?: string | null
          deleted_at?: string | null
          display_name?: string
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          experience?: string | null
          first_name?: string | null
          flagtronics_id?: number | null
          id?: string
          invited_at?: string | null
          is_active?: boolean | null
          last_name?: string | null
          license_number?: string | null
          license_type?: string | null
          nationality?: string | null
          nickname?: string | null
          notes?: string | null
          profile_photo_url?: string | null
          status?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      event_activations: {
        Row: {
          activated_at: string | null
          activated_by: string | null
          activation_id: string
          car_class: string | null
          car_id: string
          car_number: string
          created_at: string | null
          deactivated_at: string | null
          event_id: string
          override_fuel_consumption: number | null
          override_notes: string | null
          updated_at: string | null
        }
        Insert: {
          activated_at?: string | null
          activated_by?: string | null
          activation_id?: string
          car_class?: string | null
          car_id: string
          car_number: string
          created_at?: string | null
          deactivated_at?: string | null
          event_id: string
          override_fuel_consumption?: number | null
          override_notes?: string | null
          updated_at?: string | null
        }
        Update: {
          activated_at?: string | null
          activated_by?: string | null
          activation_id?: string
          car_class?: string | null
          car_id?: string
          car_number?: string
          created_at?: string | null
          deactivated_at?: string | null
          event_id?: string
          override_fuel_consumption?: number | null
          override_notes?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_activations_car_id_fkey"
            columns: ["car_id"]
            isOneToOne: false
            referencedRelation: "car_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_activations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "racing_events"
            referencedColumns: ["event_id"]
          },
          {
            foreignKeyName: "event_activations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "v_active_sessions_summary"
            referencedColumns: ["event_id"]
          },
        ]
      }
      event_schedule: {
        Row: {
          created_at: string | null
          current_entries: number | null
          description: string | null
          entry_fee: string | null
          event_end_date: string
          event_name: string
          event_start_date: string
          event_type: string | null
          featured: boolean | null
          max_entries: number | null
          metadata: Json | null
          notes: string | null
          registration_deadline: string | null
          registration_open: boolean | null
          registration_url: string | null
          schedule_id: string
          series_id: string | null
          status: string | null
          track_configuration: string | null
          track_length_miles: number | null
          track_location: string | null
          track_name: string
          updated_at: string | null
          website_url: string | null
        }
        Insert: {
          created_at?: string | null
          current_entries?: number | null
          description?: string | null
          entry_fee?: string | null
          event_end_date: string
          event_name: string
          event_start_date: string
          event_type?: string | null
          featured?: boolean | null
          max_entries?: number | null
          metadata?: Json | null
          notes?: string | null
          registration_deadline?: string | null
          registration_open?: boolean | null
          registration_url?: string | null
          schedule_id?: string
          series_id?: string | null
          status?: string | null
          track_configuration?: string | null
          track_length_miles?: number | null
          track_location?: string | null
          track_name: string
          updated_at?: string | null
          website_url?: string | null
        }
        Update: {
          created_at?: string | null
          current_entries?: number | null
          description?: string | null
          entry_fee?: string | null
          event_end_date?: string
          event_name?: string
          event_start_date?: string
          event_type?: string | null
          featured?: boolean | null
          max_entries?: number | null
          metadata?: Json | null
          notes?: string | null
          registration_deadline?: string | null
          registration_open?: boolean | null
          registration_url?: string | null
          schedule_id?: string
          series_id?: string | null
          status?: string | null
          track_configuration?: string | null
          track_length_miles?: number | null
          track_location?: string | null
          track_name?: string
          updated_at?: string | null
          website_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_schedule_series_id_fkey"
            columns: ["series_id"]
            isOneToOne: false
            referencedRelation: "series"
            referencedColumns: ["series_id"]
          },
        ]
      }
      event_sector_overrides: {
        Row: {
          created_at: string | null
          created_by: string | null
          event_id: string
          id: string
          reason: string | null
          sector_config: Json
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          event_id: string
          id?: string
          reason?: string | null
          sector_config: Json
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          event_id?: string
          id?: string
          reason?: string | null
          sector_config?: Json
        }
        Relationships: [
          {
            foreignKeyName: "event_sector_overrides_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: true
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          created_at: string | null
          custom_sectors: Json | null
          end_date: string | null
          event_config: Json | null
          event_date: string
          event_status: string | null
          external_event_id: string | null
          external_metadata: Json | null
          external_timing_system: string | null
          id: string
          is_active: boolean | null
          name: string
          series_id: string
          subscription_revenue: number | null
          track_id: string | null
          updated_at: string | null
          weekend_number: number | null
        }
        Insert: {
          created_at?: string | null
          custom_sectors?: Json | null
          end_date?: string | null
          event_config?: Json | null
          event_date: string
          event_status?: string | null
          external_event_id?: string | null
          external_metadata?: Json | null
          external_timing_system?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          series_id: string
          subscription_revenue?: number | null
          track_id?: string | null
          updated_at?: string | null
          weekend_number?: number | null
        }
        Update: {
          created_at?: string | null
          custom_sectors?: Json | null
          end_date?: string | null
          event_config?: Json | null
          event_date?: string
          event_status?: string | null
          external_event_id?: string | null
          external_metadata?: Json | null
          external_timing_system?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          series_id?: string
          subscription_revenue?: number | null
          track_id?: string | null
          updated_at?: string | null
          weekend_number?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "events_track_id_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "tracks"
            referencedColumns: ["id"]
          },
        ]
      }
      experience_config: {
        Row: {
          config: Json
          id: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          config?: Json
          id?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          config?: Json
          id?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      faq_topics: {
        Row: {
          category: string
          created_at: string | null
          description: string | null
          id: string
          is_public: boolean | null
          is_published: boolean | null
          slug: string
          sort_order: number | null
          title: string
          transcript: string | null
          updated_at: string | null
          video_url: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          is_published?: boolean | null
          slug: string
          sort_order?: number | null
          title: string
          transcript?: string | null
          updated_at?: string | null
          video_url?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          is_published?: boolean | null
          slug?: string
          sort_order?: number | null
          title?: string
          transcript?: string | null
          updated_at?: string | null
          video_url?: string | null
        }
        Relationships: []
      }
      fuel_plan_stints: {
        Row: {
          created_at: string | null
          end_lap: number
          estimated_duration_minutes: number | null
          fuel_at_end: number
          fuel_at_start: number
          fuel_to_add: number | null
          id: string
          is_pit_stop_after: boolean | null
          laps_in_stint: number
          plan_id: string
          start_lap: number
          stint_number: number
        }
        Insert: {
          created_at?: string | null
          end_lap: number
          estimated_duration_minutes?: number | null
          fuel_at_end: number
          fuel_at_start: number
          fuel_to_add?: number | null
          id?: string
          is_pit_stop_after?: boolean | null
          laps_in_stint: number
          plan_id: string
          start_lap: number
          stint_number: number
        }
        Update: {
          created_at?: string | null
          end_lap?: number
          estimated_duration_minutes?: number | null
          fuel_at_end?: number
          fuel_at_start?: number
          fuel_to_add?: number | null
          id?: string
          is_pit_stop_after?: boolean | null
          laps_in_stint?: number
          plan_id?: string
          start_lap?: number
          stint_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_fuel_stints_plan"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "fuel_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      fuel_plans: {
        Row: {
          car_id: string
          confidence_level: number | null
          created_at: string | null
          estimated_avg_lap_time_seconds: number
          estimated_total_laps: number
          id: string
          plan_type: string | null
          planned_pit_stops: number
          planned_stint_count: number
          race_duration_minutes: number
          session_id: string
          updated_at: string | null
        }
        Insert: {
          car_id: string
          confidence_level?: number | null
          created_at?: string | null
          estimated_avg_lap_time_seconds: number
          estimated_total_laps: number
          id?: string
          plan_type?: string | null
          planned_pit_stops: number
          planned_stint_count: number
          race_duration_minutes: number
          session_id: string
          updated_at?: string | null
        }
        Update: {
          car_id?: string
          confidence_level?: number | null
          created_at?: string | null
          estimated_avg_lap_time_seconds?: number
          estimated_total_laps?: number
          id?: string
          plan_type?: string | null
          planned_pit_stops?: number
          planned_stint_count?: number
          race_duration_minutes?: number
          session_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_fuel_plans_car"
            columns: ["car_id"]
            isOneToOne: false
            referencedRelation: "car_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_fuel_plans_session"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "racing_sessions"
            referencedColumns: ["session_id"]
          },
          {
            foreignKeyName: "fk_fuel_plans_session"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "v_active_sessions_summary"
            referencedColumns: ["session_id"]
          },
        ]
      }
      fuel_strategy_summary: {
        Row: {
          actual_pit_stops: number | null
          actual_total_laps: number | null
          avg_fuel_per_lap_green: number | null
          avg_fuel_per_lap_yellow: number | null
          car_id: string
          created_at: string | null
          fuel_saved_by_yellows: number | null
          id: string
          lap_count_variance_pct: number | null
          lessons_learned: string | null
          pit_count_variance: number | null
          plan_accuracy_score: number | null
          planned_pit_stops: number | null
          planned_total_laps: number | null
          session_id: string
          strategy_notes: string | null
          total_fuel_consumed: number | null
          total_green_laps: number | null
          total_red_laps: number | null
          total_yellow_laps: number | null
        }
        Insert: {
          actual_pit_stops?: number | null
          actual_total_laps?: number | null
          avg_fuel_per_lap_green?: number | null
          avg_fuel_per_lap_yellow?: number | null
          car_id: string
          created_at?: string | null
          fuel_saved_by_yellows?: number | null
          id?: string
          lap_count_variance_pct?: number | null
          lessons_learned?: string | null
          pit_count_variance?: number | null
          plan_accuracy_score?: number | null
          planned_pit_stops?: number | null
          planned_total_laps?: number | null
          session_id: string
          strategy_notes?: string | null
          total_fuel_consumed?: number | null
          total_green_laps?: number | null
          total_red_laps?: number | null
          total_yellow_laps?: number | null
        }
        Update: {
          actual_pit_stops?: number | null
          actual_total_laps?: number | null
          avg_fuel_per_lap_green?: number | null
          avg_fuel_per_lap_yellow?: number | null
          car_id?: string
          created_at?: string | null
          fuel_saved_by_yellows?: number | null
          id?: string
          lap_count_variance_pct?: number | null
          lessons_learned?: string | null
          pit_count_variance?: number | null
          plan_accuracy_score?: number | null
          planned_pit_stops?: number | null
          planned_total_laps?: number | null
          session_id?: string
          strategy_notes?: string | null
          total_fuel_consumed?: number | null
          total_green_laps?: number | null
          total_red_laps?: number | null
          total_yellow_laps?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_fuel_summary_car"
            columns: ["car_id"]
            isOneToOne: false
            referencedRelation: "car_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_fuel_summary_session"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "racing_sessions"
            referencedColumns: ["session_id"]
          },
          {
            foreignKeyName: "fk_fuel_summary_session"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "v_active_sessions_summary"
            referencedColumns: ["session_id"]
          },
        ]
      }
      lap_fuel_data: {
        Row: {
          car_id: string
          confidence_score: number | null
          consumption_rate_used: number | null
          data_source: string | null
          fuel_consumed_this_lap: number
          fuel_level_measured: number | null
          fuel_remaining_calculated: number
          green_flag_percent: number | null
          id: string
          is_estimated: boolean | null
          lap_number: number
          lap_time_ms: number | null
          predominant_flag: string | null
          session_id: string
          stint_number: number | null
          timestamp: string | null
          yellow_flag_percent: number | null
        }
        Insert: {
          car_id: string
          confidence_score?: number | null
          consumption_rate_used?: number | null
          data_source?: string | null
          fuel_consumed_this_lap: number
          fuel_level_measured?: number | null
          fuel_remaining_calculated: number
          green_flag_percent?: number | null
          id?: string
          is_estimated?: boolean | null
          lap_number: number
          lap_time_ms?: number | null
          predominant_flag?: string | null
          session_id: string
          stint_number?: number | null
          timestamp?: string | null
          yellow_flag_percent?: number | null
        }
        Update: {
          car_id?: string
          confidence_score?: number | null
          consumption_rate_used?: number | null
          data_source?: string | null
          fuel_consumed_this_lap?: number
          fuel_level_measured?: number | null
          fuel_remaining_calculated?: number
          green_flag_percent?: number | null
          id?: string
          is_estimated?: boolean | null
          lap_number?: number
          lap_time_ms?: number | null
          predominant_flag?: string | null
          session_id?: string
          stint_number?: number | null
          timestamp?: string | null
          yellow_flag_percent?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_lap_fuel_car"
            columns: ["car_id"]
            isOneToOne: false
            referencedRelation: "car_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_lap_fuel_session"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "racing_sessions"
            referencedColumns: ["session_id"]
          },
          {
            foreignKeyName: "fk_lap_fuel_session"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "v_active_sessions_summary"
            referencedColumns: ["session_id"]
          },
        ]
      }
      lap_times: {
        Row: {
          car_id: string | null
          created_at: string | null
          driver_id: string | null
          flag_status: string | null
          is_best_lap: boolean | null
          is_in_pit: boolean | null
          is_personal_best: boolean | null
          lap_id: string
          lap_number: number
          lap_time_display: string | null
          lap_time_ms: number
          participant_id: string | null
          position_in_class: number | null
          position_overall: number | null
          sector_1_ms: number | null
          sector_2_ms: number | null
          sector_3_ms: number | null
          session_id: string | null
          timestamp: string
        }
        Insert: {
          car_id?: string | null
          created_at?: string | null
          driver_id?: string | null
          flag_status?: string | null
          is_best_lap?: boolean | null
          is_in_pit?: boolean | null
          is_personal_best?: boolean | null
          lap_id?: string
          lap_number: number
          lap_time_display?: string | null
          lap_time_ms: number
          participant_id?: string | null
          position_in_class?: number | null
          position_overall?: number | null
          sector_1_ms?: number | null
          sector_2_ms?: number | null
          sector_3_ms?: number | null
          session_id?: string | null
          timestamp?: string
        }
        Update: {
          car_id?: string | null
          created_at?: string | null
          driver_id?: string | null
          flag_status?: string | null
          is_best_lap?: boolean | null
          is_in_pit?: boolean | null
          is_personal_best?: boolean | null
          lap_id?: string
          lap_number?: number
          lap_time_display?: string | null
          lap_time_ms?: number
          participant_id?: string | null
          position_in_class?: number | null
          position_overall?: number | null
          sector_1_ms?: number | null
          sector_2_ms?: number | null
          sector_3_ms?: number | null
          session_id?: string | null
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "lap_times_car_id_fkey"
            columns: ["car_id"]
            isOneToOne: false
            referencedRelation: "racing_cars"
            referencedColumns: ["car_id"]
          },
          {
            foreignKeyName: "lap_times_new_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "active_drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lap_times_new_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lap_times_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "session_participants"
            referencedColumns: ["participant_id"]
          },
          {
            foreignKeyName: "lap_times_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "racing_sessions"
            referencedColumns: ["session_id"]
          },
          {
            foreignKeyName: "lap_times_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "v_active_sessions_summary"
            referencedColumns: ["session_id"]
          },
        ]
      }
      live_car_positions: {
        Row: {
          average_lap_time_ms: number | null
          best_lap_time_ms: number | null
          car_number: string
          confidence_level: number | null
          current_driver_id: string | null
          current_lap_number: number | null
          data_source: string | null
          gap_to_ahead_ms: number | null
          gap_to_leader_ms: number | null
          heading_degrees: number | null
          is_in_pit: boolean | null
          last_lap_time_ms: number | null
          last_sector_crossed: string | null
          last_timing_point: string | null
          last_timing_point_time: string | null
          participant_id: string | null
          pit_entry_time: string | null
          position_in_class: number | null
          position_overall: number | null
          redmist_last_update: string | null
          sector_times: Json | null
          session_id: string
          speed_mph: number | null
          telemetry_last_update: string | null
          total_laps: number | null
          track_position_meters: number | null
          track_position_percent: number | null
          updated_at: string | null
        }
        Insert: {
          average_lap_time_ms?: number | null
          best_lap_time_ms?: number | null
          car_number: string
          confidence_level?: number | null
          current_driver_id?: string | null
          current_lap_number?: number | null
          data_source?: string | null
          gap_to_ahead_ms?: number | null
          gap_to_leader_ms?: number | null
          heading_degrees?: number | null
          is_in_pit?: boolean | null
          last_lap_time_ms?: number | null
          last_sector_crossed?: string | null
          last_timing_point?: string | null
          last_timing_point_time?: string | null
          participant_id?: string | null
          pit_entry_time?: string | null
          position_in_class?: number | null
          position_overall?: number | null
          redmist_last_update?: string | null
          sector_times?: Json | null
          session_id: string
          speed_mph?: number | null
          telemetry_last_update?: string | null
          total_laps?: number | null
          track_position_meters?: number | null
          track_position_percent?: number | null
          updated_at?: string | null
        }
        Update: {
          average_lap_time_ms?: number | null
          best_lap_time_ms?: number | null
          car_number?: string
          confidence_level?: number | null
          current_driver_id?: string | null
          current_lap_number?: number | null
          data_source?: string | null
          gap_to_ahead_ms?: number | null
          gap_to_leader_ms?: number | null
          heading_degrees?: number | null
          is_in_pit?: boolean | null
          last_lap_time_ms?: number | null
          last_sector_crossed?: string | null
          last_timing_point?: string | null
          last_timing_point_time?: string | null
          participant_id?: string | null
          pit_entry_time?: string | null
          position_in_class?: number | null
          position_overall?: number | null
          redmist_last_update?: string | null
          sector_times?: Json | null
          session_id?: string
          speed_mph?: number | null
          telemetry_last_update?: string | null
          total_laps?: number | null
          track_position_meters?: number | null
          track_position_percent?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      manufacturers: {
        Row: {
          category: string | null
          created_at: string | null
          display_name: string
          id: string
          is_active: boolean | null
          logo_url: string | null
          name: string
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          display_name: string
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          name: string
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          display_name?: string
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      newsletter_signups: {
        Row: {
          created_at: string | null
          email: string
          id: string
          mailchimp_member_id: string | null
          mailchimp_sync_at: string | null
          mailchimp_synced: boolean | null
          notes: string | null
          source: string | null
          status: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          mailchimp_member_id?: string | null
          mailchimp_sync_at?: string | null
          mailchimp_synced?: boolean | null
          notes?: string | null
          source?: string | null
          status?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          mailchimp_member_id?: string | null
          mailchimp_sync_at?: string | null
          mailchimp_synced?: boolean | null
          notes?: string | null
          source?: string | null
          status?: string | null
        }
        Relationships: []
      }
      notification_preferences: {
        Row: {
          created_at: string | null
          email_frequency: string | null
          event_updates: boolean | null
          id: string
          race_reports: boolean | null
          series_announcements: boolean | null
          team_updates: boolean | null
          unsubscribe_token: string | null
          unsubscribed_at: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          email_frequency?: string | null
          event_updates?: boolean | null
          id?: string
          race_reports?: boolean | null
          series_announcements?: boolean | null
          team_updates?: boolean | null
          unsubscribe_token?: string | null
          unsubscribed_at?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          email_frequency?: string | null
          event_updates?: boolean | null
          id?: string
          race_reports?: boolean | null
          series_announcements?: boolean | null
          team_updates?: boolean | null
          unsubscribe_token?: string | null
          unsubscribed_at?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      pit_stop_fuel: {
        Row: {
          car_id: string
          fuel_added: number
          fuel_after_pit: number
          fuel_before_pit: number
          id: string
          notes: string | null
          pit_duration_seconds: number | null
          pit_lap: number
          pit_reason: string | null
          planned_fuel_add: number | null
          session_id: string
          timestamp: string | null
          variance_from_plan: number | null
        }
        Insert: {
          car_id: string
          fuel_added: number
          fuel_after_pit: number
          fuel_before_pit: number
          id?: string
          notes?: string | null
          pit_duration_seconds?: number | null
          pit_lap: number
          pit_reason?: string | null
          planned_fuel_add?: number | null
          session_id: string
          timestamp?: string | null
          variance_from_plan?: number | null
        }
        Update: {
          car_id?: string
          fuel_added?: number
          fuel_after_pit?: number
          fuel_before_pit?: number
          id?: string
          notes?: string | null
          pit_duration_seconds?: number | null
          pit_lap?: number
          pit_reason?: string | null
          planned_fuel_add?: number | null
          session_id?: string
          timestamp?: string | null
          variance_from_plan?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_pit_fuel_car"
            columns: ["car_id"]
            isOneToOne: false
            referencedRelation: "car_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_pit_fuel_session"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "racing_sessions"
            referencedColumns: ["session_id"]
          },
          {
            foreignKeyName: "fk_pit_fuel_session"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "v_active_sessions_summary"
            referencedColumns: ["session_id"]
          },
        ]
      }
      pit_stops: {
        Row: {
          car_number: string
          created_at: string | null
          driver_change: boolean | null
          driver_change_id: string | null
          fuel_added_liters: number | null
          fuel_remaining_before_stop_liters: number | null
          id: string
          is_successful: boolean | null
          lap_number: number
          notes: string | null
          participant_id: string
          penalty_duration_seconds: number | null
          penalty_incurred: boolean | null
          penalty_seconds: number | null
          penalty_type: string | null
          pit_duration_seconds: number | null
          pit_in_time: string
          pit_lane_time_seconds: number | null
          pit_out_time: string | null
          service_performed: string[] | null
          service_time_seconds: number | null
          session_id: string
          tires_changed: string[] | null
          updated_at: string | null
        }
        Insert: {
          car_number: string
          created_at?: string | null
          driver_change?: boolean | null
          driver_change_id?: string | null
          fuel_added_liters?: number | null
          fuel_remaining_before_stop_liters?: number | null
          id?: string
          is_successful?: boolean | null
          lap_number: number
          notes?: string | null
          participant_id: string
          penalty_duration_seconds?: number | null
          penalty_incurred?: boolean | null
          penalty_seconds?: number | null
          penalty_type?: string | null
          pit_duration_seconds?: number | null
          pit_in_time: string
          pit_lane_time_seconds?: number | null
          pit_out_time?: string | null
          service_performed?: string[] | null
          service_time_seconds?: number | null
          session_id: string
          tires_changed?: string[] | null
          updated_at?: string | null
        }
        Update: {
          car_number?: string
          created_at?: string | null
          driver_change?: boolean | null
          driver_change_id?: string | null
          fuel_added_liters?: number | null
          fuel_remaining_before_stop_liters?: number | null
          id?: string
          is_successful?: boolean | null
          lap_number?: number
          notes?: string | null
          participant_id?: string
          penalty_duration_seconds?: number | null
          penalty_incurred?: boolean | null
          penalty_seconds?: number | null
          penalty_type?: string | null
          pit_duration_seconds?: number | null
          pit_in_time?: string
          pit_lane_time_seconds?: number | null
          pit_out_time?: string | null
          service_performed?: string[] | null
          service_time_seconds?: number | null
          session_id?: string
          tires_changed?: string[] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      racing_cars: {
        Row: {
          car_class: string | null
          car_id: string
          car_number: string
          created_at: string | null
          fuel_tank_size: number | null
          make: string | null
          model: string | null
          team_id: string | null
          updated_at: string | null
          year: number | null
        }
        Insert: {
          car_class?: string | null
          car_id?: string
          car_number: string
          created_at?: string | null
          fuel_tank_size?: number | null
          make?: string | null
          model?: string | null
          team_id?: string | null
          updated_at?: string | null
          year?: number | null
        }
        Update: {
          car_class?: string | null
          car_id?: string
          car_number?: string
          created_at?: string | null
          fuel_tank_size?: number | null
          make?: string | null
          model?: string | null
          team_id?: string | null
          updated_at?: string | null
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "racing_cars_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "racing_teams"
            referencedColumns: ["team_id"]
          },
        ]
      }
      racing_events: {
        Row: {
          actual_end: string | null
          actual_start: string | null
          created_at: string | null
          data_source_type: string | null
          data_source_url: string | null
          event_date: string | null
          event_hash: string | null
          event_id: string
          event_name: string
          event_timezone: string | null
          external_event_id: string | null
          external_metadata: Json | null
          external_timing_system: string | null
          location: string | null
          organization: string | null
          redmist_event_id: string
          scheduled_end: string | null
          scheduled_start: string | null
          series: string | null
          series_id: string | null
          status: string | null
          timezone: string | null
          track_id: string | null
          track_name_override: string | null
          updated_at: string | null
        }
        Insert: {
          actual_end?: string | null
          actual_start?: string | null
          created_at?: string | null
          data_source_type?: string | null
          data_source_url?: string | null
          event_date?: string | null
          event_hash?: string | null
          event_id?: string
          event_name: string
          event_timezone?: string | null
          external_event_id?: string | null
          external_metadata?: Json | null
          external_timing_system?: string | null
          location?: string | null
          organization?: string | null
          redmist_event_id: string
          scheduled_end?: string | null
          scheduled_start?: string | null
          series?: string | null
          series_id?: string | null
          status?: string | null
          timezone?: string | null
          track_id?: string | null
          track_name_override?: string | null
          updated_at?: string | null
        }
        Update: {
          actual_end?: string | null
          actual_start?: string | null
          created_at?: string | null
          data_source_type?: string | null
          data_source_url?: string | null
          event_date?: string | null
          event_hash?: string | null
          event_id?: string
          event_name?: string
          event_timezone?: string | null
          external_event_id?: string | null
          external_metadata?: Json | null
          external_timing_system?: string | null
          location?: string | null
          organization?: string | null
          redmist_event_id?: string
          scheduled_end?: string | null
          scheduled_start?: string | null
          series?: string | null
          series_id?: string | null
          status?: string | null
          timezone?: string | null
          track_id?: string | null
          track_name_override?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "racing_events_series_id_fkey"
            columns: ["series_id"]
            isOneToOne: false
            referencedRelation: "series"
            referencedColumns: ["series_id"]
          },
          {
            foreignKeyName: "racing_events_track_id_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "tracks"
            referencedColumns: ["id"]
          },
        ]
      }
      racing_series: {
        Row: {
          created_at: string | null
          description: string | null
          is_active: boolean | null
          logo_url: string | null
          series_code: string
          series_id: string
          series_name: string
          updated_at: string | null
          website_url: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          is_active?: boolean | null
          logo_url?: string | null
          series_code: string
          series_id?: string
          series_name: string
          updated_at?: string | null
          website_url?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          is_active?: boolean | null
          logo_url?: string | null
          series_code?: string
          series_id?: string
          series_name?: string
          updated_at?: string | null
          website_url?: string | null
        }
        Relationships: []
      }
      racing_sessions: {
        Row: {
          actual_end: string | null
          actual_start: string | null
          auto_close_threshold_minutes: number | null
          created_at: string | null
          duration_minutes: number | null
          event_id: string | null
          external_metadata: Json | null
          external_session_id: string | null
          last_activity_at: string | null
          redmist_session_id: string | null
          scheduled_end: string | null
          scheduled_start: string | null
          session_id: string
          session_name: string
          session_number: number | null
          session_type: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          actual_end?: string | null
          actual_start?: string | null
          auto_close_threshold_minutes?: number | null
          created_at?: string | null
          duration_minutes?: number | null
          event_id?: string | null
          external_metadata?: Json | null
          external_session_id?: string | null
          last_activity_at?: string | null
          redmist_session_id?: string | null
          scheduled_end?: string | null
          scheduled_start?: string | null
          session_id?: string
          session_name: string
          session_number?: number | null
          session_type?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          actual_end?: string | null
          actual_start?: string | null
          auto_close_threshold_minutes?: number | null
          created_at?: string | null
          duration_minutes?: number | null
          event_id?: string | null
          external_metadata?: Json | null
          external_session_id?: string | null
          last_activity_at?: string | null
          redmist_session_id?: string | null
          scheduled_end?: string | null
          scheduled_start?: string | null
          session_id?: string
          session_name?: string
          session_number?: number | null
          session_type?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "racing_sessions_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "racing_events"
            referencedColumns: ["event_id"]
          },
          {
            foreignKeyName: "racing_sessions_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "v_active_sessions_summary"
            referencedColumns: ["event_id"]
          },
        ]
      }
      racing_teams: {
        Row: {
          created_at: string | null
          organization: string | null
          series: string | null
          team_id: string
          team_name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          organization?: string | null
          series?: string | null
          team_id?: string
          team_name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          organization?: string | null
          series?: string | null
          team_id?: string
          team_name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      rule_chunks: {
        Row: {
          chunk_index: number
          content: string
          created_at: string
          embedding: string | null
          heading_path: string | null
          id: string
          page_number: number | null
          rulebook_id: string
          section_label: string | null
          token_count: number | null
        }
        Insert: {
          chunk_index: number
          content: string
          created_at?: string
          embedding?: string | null
          heading_path?: string | null
          id?: string
          page_number?: number | null
          rulebook_id: string
          section_label?: string | null
          token_count?: number | null
        }
        Update: {
          chunk_index?: number
          content?: string
          created_at?: string
          embedding?: string | null
          heading_path?: string | null
          id?: string
          page_number?: number | null
          rulebook_id?: string
          section_label?: string | null
          token_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "rule_chunks_rulebook_id_fkey"
            columns: ["rulebook_id"]
            isOneToOne: false
            referencedRelation: "rulebooks"
            referencedColumns: ["id"]
          },
        ]
      }
      rulebooks: {
        Row: {
          chunk_count: number | null
          created_by: string | null
          effective_date: string | null
          file_path: string
          id: string
          is_active: boolean
          page_count: number | null
          processing_error: string | null
          status: string
          title: string
          uploaded_at: string
          version_label: string | null
        }
        Insert: {
          chunk_count?: number | null
          created_by?: string | null
          effective_date?: string | null
          file_path: string
          id?: string
          is_active?: boolean
          page_count?: number | null
          processing_error?: string | null
          status?: string
          title: string
          uploaded_at?: string
          version_label?: string | null
        }
        Update: {
          chunk_count?: number | null
          created_by?: string | null
          effective_date?: string | null
          file_path?: string
          id?: string
          is_active?: boolean
          page_count?: number | null
          processing_error?: string | null
          status?: string
          title?: string
          uploaded_at?: string
          version_label?: string | null
        }
        Relationships: []
      }
      seat_applications: {
        Row: {
          amount_charged_cents: number | null
          applicant_user_id: string
          applied_at: string | null
          approved_at: string | null
          confirmed_at: string | null
          created_at: string | null
          driver_id: string
          id: string
          listing_id: string
          message: string | null
          platform_fee_cents: number | null
          refund_amount_cents: number | null
          refund_reason: string | null
          refunded_at: string | null
          refunded_by: string | null
          rejection_reason: string | null
          status: Database["public"]["Enums"]["application_status"]
          status_changed_at: string | null
          status_changed_by: string | null
          stripe_payment_intent_id: string | null
          stripe_payment_method_id: string | null
          stripe_refund_id: string | null
          stripe_setup_intent_id: string | null
          team_notes: string | null
          team_payout_cents: number | null
          updated_at: string | null
        }
        Insert: {
          amount_charged_cents?: number | null
          applicant_user_id: string
          applied_at?: string | null
          approved_at?: string | null
          confirmed_at?: string | null
          created_at?: string | null
          driver_id: string
          id?: string
          listing_id: string
          message?: string | null
          platform_fee_cents?: number | null
          refund_amount_cents?: number | null
          refund_reason?: string | null
          refunded_at?: string | null
          refunded_by?: string | null
          rejection_reason?: string | null
          status?: Database["public"]["Enums"]["application_status"]
          status_changed_at?: string | null
          status_changed_by?: string | null
          stripe_payment_intent_id?: string | null
          stripe_payment_method_id?: string | null
          stripe_refund_id?: string | null
          stripe_setup_intent_id?: string | null
          team_notes?: string | null
          team_payout_cents?: number | null
          updated_at?: string | null
        }
        Update: {
          amount_charged_cents?: number | null
          applicant_user_id?: string
          applied_at?: string | null
          approved_at?: string | null
          confirmed_at?: string | null
          created_at?: string | null
          driver_id?: string
          id?: string
          listing_id?: string
          message?: string | null
          platform_fee_cents?: number | null
          refund_amount_cents?: number | null
          refund_reason?: string | null
          refunded_at?: string | null
          refunded_by?: string | null
          rejection_reason?: string | null
          status?: Database["public"]["Enums"]["application_status"]
          status_changed_at?: string | null
          status_changed_by?: string | null
          stripe_payment_intent_id?: string | null
          stripe_payment_method_id?: string | null
          stripe_refund_id?: string | null
          stripe_setup_intent_id?: string | null
          team_notes?: string | null
          team_payout_cents?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "seat_applications_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "active_drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "seat_applications_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "seat_applications_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "seat_listings"
            referencedColumns: ["id"]
          },
        ]
      }
      seat_listings: {
        Row: {
          available_seats: number
          car_class: string | null
          car_id: string | null
          created_at: string | null
          created_by: string
          currency: string
          description: string | null
          event_id: string | null
          expires_at: string | null
          id: string
          min_experience: string | null
          platform_fee_flat_cents: number
          platform_fee_percent: number
          price_cents: number
          published_at: string | null
          required_license_types: string[] | null
          requirements_text: string | null
          seat_type: string
          series: string | null
          session_id: string | null
          status: Database["public"]["Enums"]["listing_status"]
          team_id: string
          test_day_available: boolean | null
          title: string
          total_seats: number
          updated_at: string | null
        }
        Insert: {
          available_seats?: number
          car_class?: string | null
          car_id?: string | null
          created_at?: string | null
          created_by: string
          currency?: string
          description?: string | null
          event_id?: string | null
          expires_at?: string | null
          id?: string
          min_experience?: string | null
          platform_fee_flat_cents?: number
          platform_fee_percent?: number
          price_cents: number
          published_at?: string | null
          required_license_types?: string[] | null
          requirements_text?: string | null
          seat_type: string
          series?: string | null
          session_id?: string | null
          status?: Database["public"]["Enums"]["listing_status"]
          team_id: string
          test_day_available?: boolean | null
          title: string
          total_seats?: number
          updated_at?: string | null
        }
        Update: {
          available_seats?: number
          car_class?: string | null
          car_id?: string | null
          created_at?: string | null
          created_by?: string
          currency?: string
          description?: string | null
          event_id?: string | null
          expires_at?: string | null
          id?: string
          min_experience?: string | null
          platform_fee_flat_cents?: number
          platform_fee_percent?: number
          price_cents?: number
          published_at?: string | null
          required_license_types?: string[] | null
          requirements_text?: string | null
          seat_type?: string
          series?: string | null
          session_id?: string | null
          status?: Database["public"]["Enums"]["listing_status"]
          team_id?: string
          test_day_available?: boolean | null
          title?: string
          total_seats?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "seat_listings_car_id_fkey"
            columns: ["car_id"]
            isOneToOne: false
            referencedRelation: "car_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "seat_listings_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "racing_events"
            referencedColumns: ["event_id"]
          },
          {
            foreignKeyName: "seat_listings_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "v_active_sessions_summary"
            referencedColumns: ["event_id"]
          },
          {
            foreignKeyName: "seat_listings_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "racing_sessions"
            referencedColumns: ["session_id"]
          },
          {
            foreignKeyName: "seat_listings_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "v_active_sessions_summary"
            referencedColumns: ["session_id"]
          },
          {
            foreignKeyName: "seat_listings_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "orphaned_teams"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "seat_listings_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "team_ownership_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "seat_listings_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "team_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "seat_listings_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "team_subscription_status"
            referencedColumns: ["team_id"]
          },
        ]
      }
      seat_purchases: {
        Row: {
          application_id: string
          created_at: string | null
          currency: string
          driver_id: string
          event_id: string
          id: string
          listing_id: string
          participant_id: string | null
          platform_fee_cents: number
          price_cents: number
          purchase_status: string
          purchased_at: string | null
          session_id: string | null
          stripe_charge_id: string | null
          stripe_payment_intent_id: string
          stripe_transfer_id: string | null
          team_id: string
          team_payout_cents: number
        }
        Insert: {
          application_id: string
          created_at?: string | null
          currency?: string
          driver_id: string
          event_id: string
          id?: string
          listing_id: string
          participant_id?: string | null
          platform_fee_cents: number
          price_cents: number
          purchase_status?: string
          purchased_at?: string | null
          session_id?: string | null
          stripe_charge_id?: string | null
          stripe_payment_intent_id: string
          stripe_transfer_id?: string | null
          team_id: string
          team_payout_cents: number
        }
        Update: {
          application_id?: string
          created_at?: string | null
          currency?: string
          driver_id?: string
          event_id?: string
          id?: string
          listing_id?: string
          participant_id?: string | null
          platform_fee_cents?: number
          price_cents?: number
          purchase_status?: string
          purchased_at?: string | null
          session_id?: string | null
          stripe_charge_id?: string | null
          stripe_payment_intent_id?: string
          stripe_transfer_id?: string | null
          team_id?: string
          team_payout_cents?: number
        }
        Relationships: [
          {
            foreignKeyName: "seat_purchases_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "seat_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "seat_purchases_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "active_drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "seat_purchases_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "seat_purchases_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "racing_events"
            referencedColumns: ["event_id"]
          },
          {
            foreignKeyName: "seat_purchases_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "v_active_sessions_summary"
            referencedColumns: ["event_id"]
          },
          {
            foreignKeyName: "seat_purchases_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "seat_listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "seat_purchases_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "session_participants"
            referencedColumns: ["participant_id"]
          },
          {
            foreignKeyName: "seat_purchases_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "racing_sessions"
            referencedColumns: ["session_id"]
          },
          {
            foreignKeyName: "seat_purchases_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "v_active_sessions_summary"
            referencedColumns: ["session_id"]
          },
          {
            foreignKeyName: "seat_purchases_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "orphaned_teams"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "seat_purchases_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "team_ownership_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "seat_purchases_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "team_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "seat_purchases_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "team_subscription_status"
            referencedColumns: ["team_id"]
          },
        ]
      }
      series: {
        Row: {
          active: boolean | null
          created_at: string | null
          description: string | null
          logo_url: string | null
          organization: string | null
          primary_color: string | null
          season_year: number | null
          secondary_color: string | null
          series_code: string | null
          series_id: string
          series_name: string
          series_type: string | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          description?: string | null
          logo_url?: string | null
          organization?: string | null
          primary_color?: string | null
          season_year?: number | null
          secondary_color?: string | null
          series_code?: string | null
          series_id?: string
          series_name: string
          series_type?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          description?: string | null
          logo_url?: string | null
          organization?: string | null
          primary_color?: string | null
          season_year?: number | null
          secondary_color?: string | null
          series_code?: string | null
          series_id?: string
          series_name?: string
          series_type?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Relationships: []
      }
      series_aliases: {
        Row: {
          alias_id: string
          alias_name: string
          alias_type: string | null
          created_at: string | null
          created_by: string | null
          series_id: string
        }
        Insert: {
          alias_id?: string
          alias_name: string
          alias_type?: string | null
          created_at?: string | null
          created_by?: string | null
          series_id: string
        }
        Update: {
          alias_id?: string
          alias_name?: string
          alias_type?: string | null
          created_at?: string | null
          created_by?: string | null
          series_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "series_aliases_series_id_fkey"
            columns: ["series_id"]
            isOneToOne: false
            referencedRelation: "series"
            referencedColumns: ["series_id"]
          },
        ]
      }
      series_classes: {
        Row: {
          class_code: string
          class_color: string
          class_name: string
          class_order: number | null
          created_at: string | null
          id: string
          is_active: boolean | null
          series_id: string | null
          updated_at: string | null
        }
        Insert: {
          class_code: string
          class_color: string
          class_name: string
          class_order?: number | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          series_id?: string | null
          updated_at?: string | null
        }
        Update: {
          class_code?: string
          class_color?: string
          class_name?: string
          class_order?: number | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          series_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "series_classes_series_id_fkey"
            columns: ["series_id"]
            isOneToOne: false
            referencedRelation: "series"
            referencedColumns: ["series_id"]
          },
        ]
      }
      series_config: {
        Row: {
          auto_close_enabled: boolean | null
          config_id: string
          config_metadata: Json | null
          created_at: string | null
          default_session_threshold_minutes: number | null
          include_session_number: boolean | null
          red_flag_threshold_minutes: number | null
          series_id: string
          updated_at: string | null
          use_short_names: boolean | null
          yellow_flag_threshold_minutes: number | null
        }
        Insert: {
          auto_close_enabled?: boolean | null
          config_id?: string
          config_metadata?: Json | null
          created_at?: string | null
          default_session_threshold_minutes?: number | null
          include_session_number?: boolean | null
          red_flag_threshold_minutes?: number | null
          series_id: string
          updated_at?: string | null
          use_short_names?: boolean | null
          yellow_flag_threshold_minutes?: number | null
        }
        Update: {
          auto_close_enabled?: boolean | null
          config_id?: string
          config_metadata?: Json | null
          created_at?: string | null
          default_session_threshold_minutes?: number | null
          include_session_number?: boolean | null
          red_flag_threshold_minutes?: number | null
          series_id?: string
          updated_at?: string | null
          use_short_names?: boolean | null
          yellow_flag_threshold_minutes?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "series_config_series_id_fkey"
            columns: ["series_id"]
            isOneToOne: true
            referencedRelation: "series"
            referencedColumns: ["series_id"]
          },
        ]
      }
      session_drivers: {
        Row: {
          created_at: string | null
          driver_id: string | null
          driver_order: number | null
          is_primary: boolean | null
          participant_id: string
          session_driver_id: string
          stint_count: number | null
          stint_start_time: string | null
          total_laps: number | null
          total_time_ms: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          driver_id?: string | null
          driver_order?: number | null
          is_primary?: boolean | null
          participant_id: string
          session_driver_id?: string
          stint_count?: number | null
          stint_start_time?: string | null
          total_laps?: number | null
          total_time_ms?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          driver_id?: string | null
          driver_order?: number | null
          is_primary?: boolean | null
          participant_id?: string
          session_driver_id?: string
          stint_count?: number | null
          stint_start_time?: string | null
          total_laps?: number | null
          total_time_ms?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "session_drivers_new_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "active_drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "session_drivers_new_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "session_drivers_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "session_participants"
            referencedColumns: ["participant_id"]
          },
        ]
      }
      session_events: {
        Row: {
          created_at: string | null
          description: string | null
          event_id: string
          event_subtype: string | null
          event_time: string
          event_type: string
          lap_number: number | null
          metadata: Json | null
          participant_id: string | null
          session_id: string
          severity: string | null
          track_position: number | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          event_id?: string
          event_subtype?: string | null
          event_time: string
          event_type: string
          lap_number?: number | null
          metadata?: Json | null
          participant_id?: string | null
          session_id: string
          severity?: string | null
          track_position?: number | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          event_id?: string
          event_subtype?: string | null
          event_time?: string
          event_type?: string
          lap_number?: number | null
          metadata?: Json | null
          participant_id?: string | null
          session_id?: string
          severity?: string | null
          track_position?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "session_events_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "session_participants"
            referencedColumns: ["participant_id"]
          },
          {
            foreignKeyName: "session_events_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "racing_sessions"
            referencedColumns: ["session_id"]
          },
          {
            foreignKeyName: "session_events_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "v_active_sessions_summary"
            referencedColumns: ["session_id"]
          },
        ]
      }
      session_flag_events: {
        Row: {
          created_at: string | null
          flag_status: string
          id: string
          lap_number: number | null
          reason: string | null
          session_id: string
          timestamp: string
        }
        Insert: {
          created_at?: string | null
          flag_status: string
          id?: string
          lap_number?: number | null
          reason?: string | null
          session_id: string
          timestamp?: string
        }
        Update: {
          created_at?: string | null
          flag_status?: string
          id?: string
          lap_number?: number | null
          reason?: string | null
          session_id?: string
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_flag_events_session"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "racing_sessions"
            referencedColumns: ["session_id"]
          },
          {
            foreignKeyName: "fk_flag_events_session"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "v_active_sessions_summary"
            referencedColumns: ["session_id"]
          },
        ]
      }
      session_participants: {
        Row: {
          car_class: string | null
          car_id: string | null
          car_number: string
          car_profile_id: string | null
          created_at: string | null
          entry_metadata: Json | null
          finish_position: number | null
          flagtronics_id: string | null
          grid_position: number | null
          incar_video_url: string | null
          participant_id: string
          session_id: string
          status: string | null
          team_id: string | null
          total_laps: number | null
          transponder_id: string | null
          transponder_number: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          car_class?: string | null
          car_id?: string | null
          car_number: string
          car_profile_id?: string | null
          created_at?: string | null
          entry_metadata?: Json | null
          finish_position?: number | null
          flagtronics_id?: string | null
          grid_position?: number | null
          incar_video_url?: string | null
          participant_id?: string
          session_id: string
          status?: string | null
          team_id?: string | null
          total_laps?: number | null
          transponder_id?: string | null
          transponder_number?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          car_class?: string | null
          car_id?: string | null
          car_number?: string
          car_profile_id?: string | null
          created_at?: string | null
          entry_metadata?: Json | null
          finish_position?: number | null
          flagtronics_id?: string | null
          grid_position?: number | null
          incar_video_url?: string | null
          participant_id?: string
          session_id?: string
          status?: string | null
          team_id?: string | null
          total_laps?: number | null
          transponder_id?: string | null
          transponder_number?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "session_participants_car_id_fkey"
            columns: ["car_id"]
            isOneToOne: false
            referencedRelation: "racing_cars"
            referencedColumns: ["car_id"]
          },
          {
            foreignKeyName: "session_participants_car_profile_id_fkey"
            columns: ["car_profile_id"]
            isOneToOne: false
            referencedRelation: "car_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "session_participants_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "racing_sessions"
            referencedColumns: ["session_id"]
          },
          {
            foreignKeyName: "session_participants_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "v_active_sessions_summary"
            referencedColumns: ["session_id"]
          },
          {
            foreignKeyName: "session_participants_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "racing_teams"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "session_participants_transponder_id_fkey"
            columns: ["transponder_id"]
            isOneToOne: false
            referencedRelation: "transponders"
            referencedColumns: ["transponder_id"]
          },
          {
            foreignKeyName: "session_participants_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      sessions: {
        Row: {
          actual_end: string | null
          actual_start: string | null
          created_at: string | null
          current_flag: string | null
          event_id: string
          external_metadata: Json | null
          external_session_id: string | null
          id: string
          name: string
          scheduled_duration_minutes: number | null
          scheduled_end: string | null
          scheduled_start: string | null
          scoring_config: Json | null
          session_notes: string | null
          session_order: number
          session_type: string
          status: string
          track_conditions: Json | null
          updated_at: string | null
          weather_conditions: Json | null
        }
        Insert: {
          actual_end?: string | null
          actual_start?: string | null
          created_at?: string | null
          current_flag?: string | null
          event_id: string
          external_metadata?: Json | null
          external_session_id?: string | null
          id?: string
          name: string
          scheduled_duration_minutes?: number | null
          scheduled_end?: string | null
          scheduled_start?: string | null
          scoring_config?: Json | null
          session_notes?: string | null
          session_order?: number
          session_type: string
          status?: string
          track_conditions?: Json | null
          updated_at?: string | null
          weather_conditions?: Json | null
        }
        Update: {
          actual_end?: string | null
          actual_start?: string | null
          created_at?: string | null
          current_flag?: string | null
          event_id?: string
          external_metadata?: Json | null
          external_session_id?: string | null
          id?: string
          name?: string
          scheduled_duration_minutes?: number | null
          scheduled_end?: string | null
          scheduled_start?: string | null
          scoring_config?: Json | null
          session_notes?: string | null
          session_order?: number
          session_type?: string
          status?: string
          track_conditions?: Json | null
          updated_at?: string | null
          weather_conditions?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "sessions_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      speedhive_analysis_settings: {
        Row: {
          created_at: string | null
          id: string
          setting_name: string
          setting_value: Json
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          setting_name: string
          setting_value: Json
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          setting_name?: string
          setting_value?: Json
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      speedhive_imports: {
        Row: {
          country: string | null
          created_at: string | null
          event_date: string | null
          event_name: string
          import_id: string
          imported_at: string | null
          imported_by: string | null
          location: string | null
          organization_id: string | null
          organization_name: string | null
          raw_data: Json | null
          speedhive_event_id: string
          sport: string | null
          status: string | null
          track_name: string | null
          updated_at: string | null
        }
        Insert: {
          country?: string | null
          created_at?: string | null
          event_date?: string | null
          event_name: string
          import_id?: string
          imported_at?: string | null
          imported_by?: string | null
          location?: string | null
          organization_id?: string | null
          organization_name?: string | null
          raw_data?: Json | null
          speedhive_event_id: string
          sport?: string | null
          status?: string | null
          track_name?: string | null
          updated_at?: string | null
        }
        Update: {
          country?: string | null
          created_at?: string | null
          event_date?: string | null
          event_name?: string
          import_id?: string
          imported_at?: string | null
          imported_by?: string | null
          location?: string | null
          organization_id?: string | null
          organization_name?: string | null
          raw_data?: Json | null
          speedhive_event_id?: string
          sport?: string | null
          status?: string | null
          track_name?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      speedhive_name_aliases: {
        Row: {
          alias_type: string
          canonical_name: string
          created_at: string | null
          created_by: string | null
          id: string
          original_name: string
        }
        Insert: {
          alias_type: string
          canonical_name: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          original_name: string
        }
        Update: {
          alias_type?: string
          canonical_name?: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          original_name?: string
        }
        Relationships: []
      }
      speedhive_projections: {
        Row: {
          car_class: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          name: string
          projection_data: Json
          recency_weight_decay: number | null
          source_import_ids: string[]
          source_run_ids: string[] | null
          stint_duration_minutes: number
          track_name: string | null
          updated_at: string | null
        }
        Insert: {
          car_class?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          name: string
          projection_data: Json
          recency_weight_decay?: number | null
          source_import_ids: string[]
          source_run_ids?: string[] | null
          stint_duration_minutes?: number
          track_name?: string | null
          updated_at?: string | null
        }
        Update: {
          car_class?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          name?: string
          projection_data?: Json
          recency_weight_decay?: number | null
          source_import_ids?: string[]
          source_run_ids?: string[] | null
          stint_duration_minutes?: number
          track_name?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      speedhive_results: {
        Row: {
          best_lap: string | null
          best_lap_ms: number | null
          best_lap_number: number | null
          car_class: string | null
          car_number: string | null
          class_position: number | null
          created_at: string | null
          gap_to_ahead: string | null
          gap_to_ahead_ms: number | null
          gap_to_leader: string | null
          gap_to_leader_ms: number | null
          lap_times: Json | null
          participant_name: string | null
          position: number | null
          raw_data: Json | null
          result_id: string
          run_id: string
          team_name: string | null
          total_laps: number | null
          total_time: string | null
          total_time_ms: number | null
          transponder_id: string | null
        }
        Insert: {
          best_lap?: string | null
          best_lap_ms?: number | null
          best_lap_number?: number | null
          car_class?: string | null
          car_number?: string | null
          class_position?: number | null
          created_at?: string | null
          gap_to_ahead?: string | null
          gap_to_ahead_ms?: number | null
          gap_to_leader?: string | null
          gap_to_leader_ms?: number | null
          lap_times?: Json | null
          participant_name?: string | null
          position?: number | null
          raw_data?: Json | null
          result_id?: string
          run_id: string
          team_name?: string | null
          total_laps?: number | null
          total_time?: string | null
          total_time_ms?: number | null
          transponder_id?: string | null
        }
        Update: {
          best_lap?: string | null
          best_lap_ms?: number | null
          best_lap_number?: number | null
          car_class?: string | null
          car_number?: string | null
          class_position?: number | null
          created_at?: string | null
          gap_to_ahead?: string | null
          gap_to_ahead_ms?: number | null
          gap_to_leader?: string | null
          gap_to_leader_ms?: number | null
          lap_times?: Json | null
          participant_name?: string | null
          position?: number | null
          raw_data?: Json | null
          result_id?: string
          run_id?: string
          team_name?: string | null
          total_laps?: number | null
          total_time?: string | null
          total_time_ms?: number | null
          transponder_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "speedhive_results_run_id_fkey"
            columns: ["run_id"]
            isOneToOne: false
            referencedRelation: "speedhive_runs"
            referencedColumns: ["run_id"]
          },
        ]
      }
      speedhive_runs: {
        Row: {
          best_lap_time: string | null
          best_lap_time_ms: number | null
          created_at: string | null
          import_id: string
          lap_count: number | null
          participant_count: number | null
          raw_data: Json | null
          run_date: string | null
          run_id: string
          run_name: string
          run_type: string | null
          speedhive_run_id: string
        }
        Insert: {
          best_lap_time?: string | null
          best_lap_time_ms?: number | null
          created_at?: string | null
          import_id: string
          lap_count?: number | null
          participant_count?: number | null
          raw_data?: Json | null
          run_date?: string | null
          run_id?: string
          run_name: string
          run_type?: string | null
          speedhive_run_id: string
        }
        Update: {
          best_lap_time?: string | null
          best_lap_time_ms?: number | null
          created_at?: string | null
          import_id?: string
          lap_count?: number | null
          participant_count?: number | null
          raw_data?: Json | null
          run_date?: string | null
          run_id?: string
          run_name?: string
          run_type?: string | null
          speedhive_run_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "speedhive_runs_import_id_fkey"
            columns: ["import_id"]
            isOneToOne: false
            referencedRelation: "speedhive_imports"
            referencedColumns: ["import_id"]
          },
        ]
      }
      speedhive_stint_summaries: {
        Row: {
          avg_pace_ms: number | null
          avg_pace_with_yellows_ms: number | null
          car_class: string | null
          car_count: number | null
          created_at: string | null
          detection_threshold_used: number
          end_lap: number
          fastest_lap_ms: number | null
          green_laps: number
          id: string
          median_pace_ms: number | null
          run_id: string
          slowest_green_lap_ms: number | null
          start_lap: number
          std_dev_ms: number | null
          stint_duration_minutes: number
          stint_number: number
          total_laps: number
          yellow_laps: number
        }
        Insert: {
          avg_pace_ms?: number | null
          avg_pace_with_yellows_ms?: number | null
          car_class?: string | null
          car_count?: number | null
          created_at?: string | null
          detection_threshold_used?: number
          end_lap: number
          fastest_lap_ms?: number | null
          green_laps: number
          id?: string
          median_pace_ms?: number | null
          run_id: string
          slowest_green_lap_ms?: number | null
          start_lap: number
          std_dev_ms?: number | null
          stint_duration_minutes?: number
          stint_number: number
          total_laps: number
          yellow_laps: number
        }
        Update: {
          avg_pace_ms?: number | null
          avg_pace_with_yellows_ms?: number | null
          car_class?: string | null
          car_count?: number | null
          created_at?: string | null
          detection_threshold_used?: number
          end_lap?: number
          fastest_lap_ms?: number | null
          green_laps?: number
          id?: string
          median_pace_ms?: number | null
          run_id?: string
          slowest_green_lap_ms?: number | null
          start_lap?: number
          std_dev_ms?: number | null
          stint_duration_minutes?: number
          stint_number?: number
          total_laps?: number
          yellow_laps?: number
        }
        Relationships: [
          {
            foreignKeyName: "speedhive_stint_summaries_run_id_fkey"
            columns: ["run_id"]
            isOneToOne: false
            referencedRelation: "speedhive_runs"
            referencedColumns: ["run_id"]
          },
        ]
      }
      speedhive_yellow_laps: {
        Row: {
          avg_field_time_ms: number
          baseline_avg_ms: number
          cars_affected: number
          cars_total: number
          confirmed_at: string | null
          confirmed_by: string | null
          created_at: string | null
          detection_threshold: number
          field_pct_affected: number
          field_pct_threshold: number
          id: string
          lap_number: number
          manually_confirmed: boolean | null
          run_id: string
        }
        Insert: {
          avg_field_time_ms: number
          baseline_avg_ms: number
          cars_affected: number
          cars_total: number
          confirmed_at?: string | null
          confirmed_by?: string | null
          created_at?: string | null
          detection_threshold?: number
          field_pct_affected: number
          field_pct_threshold?: number
          id?: string
          lap_number: number
          manually_confirmed?: boolean | null
          run_id: string
        }
        Update: {
          avg_field_time_ms?: number
          baseline_avg_ms?: number
          cars_affected?: number
          cars_total?: number
          confirmed_at?: string | null
          confirmed_by?: string | null
          created_at?: string | null
          detection_threshold?: number
          field_pct_affected?: number
          field_pct_threshold?: number
          id?: string
          lap_number?: number
          manually_confirmed?: boolean | null
          run_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "speedhive_yellow_laps_run_id_fkey"
            columns: ["run_id"]
            isOneToOne: false
            referencedRelation: "speedhive_runs"
            referencedColumns: ["run_id"]
          },
        ]
      }
      store_products: {
        Row: {
          buy_url: string | null
          category: string
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          price_cents: number | null
          sort_order: number | null
          status: string
          title: string
          updated_at: string | null
        }
        Insert: {
          buy_url?: string | null
          category: string
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          price_cents?: number | null
          sort_order?: number | null
          status?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          buy_url?: string | null
          category?: string
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          price_cents?: number | null
          sort_order?: number | null
          status?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      stream_user_sync: {
        Row: {
          created_at: string
          last_error: string | null
          stream_user_id: string
          synced_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          last_error?: string | null
          stream_user_id: string
          synced_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          last_error?: string | null
          stream_user_id?: string
          synced_at?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      subscription_events: {
        Row: {
          created_at: string | null
          event_data: Json | null
          event_type: string
          id: string
          processed_at: string | null
          stripe_event_id: string | null
          team_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          event_data?: Json | null
          event_type: string
          id?: string
          processed_at?: string | null
          stripe_event_id?: string | null
          team_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          event_data?: Json | null
          event_type?: string
          id?: string
          processed_at?: string | null
          stripe_event_id?: string | null
          team_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscription_events_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "orphaned_teams"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "subscription_events_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "team_ownership_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscription_events_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "team_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscription_events_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "team_subscription_status"
            referencedColumns: ["team_id"]
          },
        ]
      }
      subscription_slots: {
        Row: {
          activated_at: string | null
          created_at: string | null
          owner_user_id: string | null
          slot_id: string
          slot_label: string | null
          status: string | null
          subscription_id: string | null
          transponder_id: string | null
          transponder_number: string | null
          updated_at: string | null
        }
        Insert: {
          activated_at?: string | null
          created_at?: string | null
          owner_user_id?: string | null
          slot_id?: string
          slot_label?: string | null
          status?: string | null
          subscription_id?: string | null
          transponder_id?: string | null
          transponder_number?: string | null
          updated_at?: string | null
        }
        Update: {
          activated_at?: string | null
          created_at?: string | null
          owner_user_id?: string | null
          slot_id?: string
          slot_label?: string | null
          status?: string | null
          subscription_id?: string | null
          transponder_id?: string | null
          transponder_number?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscription_slots_transponder_id_fkey"
            columns: ["transponder_id"]
            isOneToOne: false
            referencedRelation: "transponders"
            referencedColumns: ["transponder_id"]
          },
        ]
      }
      system_config: {
        Row: {
          config_key: string
          config_value: Json
          created_at: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          config_key: string
          config_value?: Json
          created_at?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          config_key?: string
          config_value?: Json
          created_at?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      team_members: {
        Row: {
          id: string
          invited_by: string | null
          is_active: boolean | null
          joined_at: string | null
          role: string
          team_id: string
          user_id: string
        }
        Insert: {
          id?: string
          invited_by?: string | null
          is_active?: boolean | null
          joined_at?: string | null
          role: string
          team_id: string
          user_id: string
        }
        Update: {
          id?: string
          invited_by?: string | null
          is_active?: boolean | null
          joined_at?: string | null
          role?: string
          team_id?: string
          user_id?: string
        }
        Relationships: []
      }
      team_profiles: {
        Row: {
          billing_contact: Json | null
          created_at: string | null
          created_by: string | null
          id: string
          is_active: boolean | null
          logo_url: string | null
          name: string
          organization: string | null
          owned_by: string | null
          primary_color: string | null
          primary_contact_email: string | null
          secondary_color: string | null
          series: string | null
          short_name: string | null
          subscription_expires_at: string | null
          subscription_tier: string | null
          team_config: Json | null
          updated_at: string | null
        }
        Insert: {
          billing_contact?: Json | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          name: string
          organization?: string | null
          owned_by?: string | null
          primary_color?: string | null
          primary_contact_email?: string | null
          secondary_color?: string | null
          series?: string | null
          short_name?: string | null
          subscription_expires_at?: string | null
          subscription_tier?: string | null
          team_config?: Json | null
          updated_at?: string | null
        }
        Update: {
          billing_contact?: Json | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          name?: string
          organization?: string | null
          owned_by?: string | null
          primary_color?: string | null
          primary_contact_email?: string | null
          secondary_color?: string | null
          series?: string | null
          short_name?: string | null
          subscription_expires_at?: string | null
          subscription_tier?: string | null
          team_config?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      team_series_access: {
        Row: {
          access_level: string
          expires_at: string | null
          granted_at: string | null
          granted_by: string | null
          id: string
          series_id: string
          team_id: string
        }
        Insert: {
          access_level?: string
          expires_at?: string | null
          granted_at?: string | null
          granted_by?: string | null
          id?: string
          series_id: string
          team_id: string
        }
        Update: {
          access_level?: string
          expires_at?: string | null
          granted_at?: string | null
          granted_by?: string | null
          id?: string
          series_id?: string
          team_id?: string
        }
        Relationships: []
      }
      team_stripe_accounts: {
        Row: {
          business_type: string | null
          charges_enabled: boolean | null
          country: string | null
          created_at: string | null
          default_currency: string | null
          details_submitted: boolean | null
          id: string
          last_webhook_at: string | null
          last_webhook_event_id: string | null
          onboarding_status: Database["public"]["Enums"]["stripe_onboarding_status"]
          payouts_enabled: boolean | null
          stripe_account_id: string
          team_id: string
          updated_at: string | null
        }
        Insert: {
          business_type?: string | null
          charges_enabled?: boolean | null
          country?: string | null
          created_at?: string | null
          default_currency?: string | null
          details_submitted?: boolean | null
          id?: string
          last_webhook_at?: string | null
          last_webhook_event_id?: string | null
          onboarding_status?: Database["public"]["Enums"]["stripe_onboarding_status"]
          payouts_enabled?: boolean | null
          stripe_account_id: string
          team_id: string
          updated_at?: string | null
        }
        Update: {
          business_type?: string | null
          charges_enabled?: boolean | null
          country?: string | null
          created_at?: string | null
          default_currency?: string | null
          details_submitted?: boolean | null
          id?: string
          last_webhook_at?: string | null
          last_webhook_event_id?: string | null
          onboarding_status?: Database["public"]["Enums"]["stripe_onboarding_status"]
          payouts_enabled?: boolean | null
          stripe_account_id?: string
          team_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "team_stripe_accounts_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: true
            referencedRelation: "orphaned_teams"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "team_stripe_accounts_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: true
            referencedRelation: "team_ownership_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_stripe_accounts_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: true
            referencedRelation: "team_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_stripe_accounts_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: true
            referencedRelation: "team_subscription_status"
            referencedColumns: ["team_id"]
          },
        ]
      }
      telemetry_data: {
        Row: {
          captured_at: string
          car_profile_id: string
          created_at: string | null
          id: number
          sensor_data: Json
          user_id: string
        }
        Insert: {
          captured_at?: string
          car_profile_id: string
          created_at?: string | null
          id?: number
          sensor_data: Json
          user_id: string
        }
        Update: {
          captured_at?: string
          car_profile_id?: string
          created_at?: string | null
          id?: number
          sensor_data?: Json
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "telemetry_data_car_profile_id_fkey"
            columns: ["car_profile_id"]
            isOneToOne: false
            referencedRelation: "car_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      ticker_messages: {
        Row: {
          created_at: string | null
          created_by: string | null
          display_order: number
          icon: string
          id: string
          is_active: boolean | null
          message: string
          type: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          display_order?: number
          icon?: string
          id?: string
          is_active?: boolean | null
          message: string
          type: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          display_order?: number
          icon?: string
          id?: string
          is_active?: boolean | null
          message?: string
          type?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      track_data: {
        Row: {
          coordinates: Json
          created_at: string | null
          id: string
          processed_features: Json | null
          raw_data_url: string | null
          reference_points: Json | null
          track_id: string
        }
        Insert: {
          coordinates: Json
          created_at?: string | null
          id?: string
          processed_features?: Json | null
          raw_data_url?: string | null
          reference_points?: Json | null
          track_id: string
        }
        Update: {
          coordinates?: Json
          created_at?: string | null
          id?: string
          processed_features?: Json | null
          raw_data_url?: string | null
          reference_points?: Json | null
          track_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "track_data_track_id_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "tracks"
            referencedColumns: ["id"]
          },
        ]
      }
      track_layouts: {
        Row: {
          coordinate_data: Json | null
          created_at: string | null
          id: string
          is_default: boolean | null
          layout_name: string
          layout_type: string | null
          length_meters: number
          sectors: Json
          track_id: string
          turns: number | null
          updated_at: string | null
        }
        Insert: {
          coordinate_data?: Json | null
          created_at?: string | null
          id?: string
          is_default?: boolean | null
          layout_name: string
          layout_type?: string | null
          length_meters: number
          sectors: Json
          track_id: string
          turns?: number | null
          updated_at?: string | null
        }
        Update: {
          coordinate_data?: Json | null
          created_at?: string | null
          id?: string
          is_default?: boolean | null
          layout_name?: string
          layout_type?: string | null
          length_meters?: number
          sectors?: Json
          track_id?: string
          turns?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "track_layouts_track_id_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "tracks"
            referencedColumns: ["id"]
          },
        ]
      }
      track_timing_points: {
        Row: {
          created_at: string | null
          gps_latitude: number | null
          gps_longitude: number | null
          id: string
          is_active: boolean | null
          metadata: Json | null
          point_name: string
          point_type: string
          track_id: string
          track_position_meters: number | null
          track_position_percent: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          gps_latitude?: number | null
          gps_longitude?: number | null
          id?: string
          is_active?: boolean | null
          metadata?: Json | null
          point_name: string
          point_type: string
          track_id: string
          track_position_meters?: number | null
          track_position_percent: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          gps_latitude?: number | null
          gps_longitude?: number | null
          id?: string
          is_active?: boolean | null
          metadata?: Json | null
          point_name?: string
          point_type?: string
          track_id?: string
          track_position_meters?: number | null
          track_position_percent?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "track_timing_points_track_id_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "tracks"
            referencedColumns: ["id"]
          },
        ]
      }
      tracks: {
        Row: {
          banking_degrees: Json | null
          certification_level: string | null
          country: string | null
          created_at: string | null
          default_sectors: Json | null
          direction: string | null
          elevation_change_meters: number | null
          grid_slots: number | null
          id: string
          is_active: boolean | null
          is_default: boolean | null
          last_resurfaced: string | null
          length_meters: number | null
          location: string | null
          metadata: Json | null
          name: string
          pit_lane_length_meters: number | null
          pit_speed_limit_mph: number | null
          surface_type: string | null
          timezone: string | null
          timing_sectors: Json | null
          track_notes: string | null
          track_record_date: string | null
          track_record_holder: string | null
          track_record_ms: number | null
          updated_at: string | null
          version: number | null
        }
        Insert: {
          banking_degrees?: Json | null
          certification_level?: string | null
          country?: string | null
          created_at?: string | null
          default_sectors?: Json | null
          direction?: string | null
          elevation_change_meters?: number | null
          grid_slots?: number | null
          id?: string
          is_active?: boolean | null
          is_default?: boolean | null
          last_resurfaced?: string | null
          length_meters?: number | null
          location?: string | null
          metadata?: Json | null
          name: string
          pit_lane_length_meters?: number | null
          pit_speed_limit_mph?: number | null
          surface_type?: string | null
          timezone?: string | null
          timing_sectors?: Json | null
          track_notes?: string | null
          track_record_date?: string | null
          track_record_holder?: string | null
          track_record_ms?: number | null
          updated_at?: string | null
          version?: number | null
        }
        Update: {
          banking_degrees?: Json | null
          certification_level?: string | null
          country?: string | null
          created_at?: string | null
          default_sectors?: Json | null
          direction?: string | null
          elevation_change_meters?: number | null
          grid_slots?: number | null
          id?: string
          is_active?: boolean | null
          is_default?: boolean | null
          last_resurfaced?: string | null
          length_meters?: number | null
          location?: string | null
          metadata?: Json | null
          name?: string
          pit_lane_length_meters?: number | null
          pit_speed_limit_mph?: number | null
          surface_type?: string | null
          timezone?: string | null
          timing_sectors?: Json | null
          track_notes?: string | null
          track_record_date?: string | null
          track_record_holder?: string | null
          track_record_ms?: number | null
          updated_at?: string | null
          version?: number | null
        }
        Relationships: []
      }
      transponder_assignments: {
        Row: {
          assigned_at: string | null
          assigned_by_user_id: string | null
          assignment_id: string
          car_profile_id: string
          created_at: string | null
          notes: string | null
          transponder_id: string
          unassigned_at: string | null
        }
        Insert: {
          assigned_at?: string | null
          assigned_by_user_id?: string | null
          assignment_id?: string
          car_profile_id: string
          created_at?: string | null
          notes?: string | null
          transponder_id: string
          unassigned_at?: string | null
        }
        Update: {
          assigned_at?: string | null
          assigned_by_user_id?: string | null
          assignment_id?: string
          car_profile_id?: string
          created_at?: string | null
          notes?: string | null
          transponder_id?: string
          unassigned_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transponder_assignments_car_profile_id_fkey"
            columns: ["car_profile_id"]
            isOneToOne: false
            referencedRelation: "car_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transponder_assignments_transponder_id_fkey"
            columns: ["transponder_id"]
            isOneToOne: false
            referencedRelation: "transponders"
            referencedColumns: ["transponder_id"]
          },
        ]
      }
      transponder_registry: {
        Row: {
          car_class: string | null
          car_color: string | null
          car_make: string | null
          car_model: string | null
          car_number: string | null
          car_year: number | null
          created_at: string | null
          id: string
          last_seen_at: string | null
          raw_name: string | null
          source: string | null
          source_event_id: string | null
          source_event_name: string | null
          team_name: string | null
          times_seen: number | null
          transponder_number: string
          updated_at: string | null
        }
        Insert: {
          car_class?: string | null
          car_color?: string | null
          car_make?: string | null
          car_model?: string | null
          car_number?: string | null
          car_year?: number | null
          created_at?: string | null
          id?: string
          last_seen_at?: string | null
          raw_name?: string | null
          source?: string | null
          source_event_id?: string | null
          source_event_name?: string | null
          team_name?: string | null
          times_seen?: number | null
          transponder_number: string
          updated_at?: string | null
        }
        Update: {
          car_class?: string | null
          car_color?: string | null
          car_make?: string | null
          car_model?: string | null
          car_number?: string | null
          car_year?: number | null
          created_at?: string | null
          id?: string
          last_seen_at?: string | null
          raw_name?: string | null
          source?: string | null
          source_event_id?: string | null
          source_event_name?: string | null
          team_name?: string | null
          times_seen?: number | null
          transponder_number?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      transponders: {
        Row: {
          created_at: string | null
          first_seen_at: string | null
          metadata: Json | null
          owner_user_id: string | null
          registered_at: string | null
          series_id: string | null
          status: string | null
          transponder_id: string
          transponder_number: string
          transponder_type: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          first_seen_at?: string | null
          metadata?: Json | null
          owner_user_id?: string | null
          registered_at?: string | null
          series_id?: string | null
          status?: string | null
          transponder_id?: string
          transponder_number: string
          transponder_type?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          first_seen_at?: string | null
          metadata?: Json | null
          owner_user_id?: string | null
          registered_at?: string | null
          series_id?: string | null
          status?: string | null
          transponder_id?: string
          transponder_number?: string
          transponder_type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transponders_series_id_fkey"
            columns: ["series_id"]
            isOneToOne: false
            referencedRelation: "series"
            referencedColumns: ["series_id"]
          },
        ]
      }
      user_invites: {
        Row: {
          accepted_at: string | null
          accepted_by: string | null
          created_at: string | null
          email: string
          id: string
          invite_expires_at: string
          invite_token: string
          invited_by: string | null
          reason: string | null
          status: string
          subscription_expires_at: string | null
          tier: string
          updated_at: string | null
        }
        Insert: {
          accepted_at?: string | null
          accepted_by?: string | null
          created_at?: string | null
          email: string
          id?: string
          invite_expires_at?: string
          invite_token?: string
          invited_by?: string | null
          reason?: string | null
          status?: string
          subscription_expires_at?: string | null
          tier: string
          updated_at?: string | null
        }
        Update: {
          accepted_at?: string | null
          accepted_by?: string | null
          created_at?: string | null
          email?: string
          id?: string
          invite_expires_at?: string
          invite_token?: string
          invited_by?: string | null
          reason?: string | null
          status?: string
          subscription_expires_at?: string | null
          tier?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_invites_accepted_by_fkey"
            columns: ["accepted_by"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_invites_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_preferences: {
        Row: {
          created_at: string | null
          preferences: Json | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          preferences?: Json | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          preferences?: Json | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string
          emergency_contact: Json | null
          full_name: string | null
          id: string
          nationality: string | null
          nickname: string | null
          permissions: Json | null
          phone: string | null
          profile_picture_url: string | null
          racing_license_expiry: string | null
          racing_license_number: string | null
          role: Database["public"]["Enums"]["user_role"]
          team_id: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email: string
          emergency_contact?: Json | null
          full_name?: string | null
          id: string
          nationality?: string | null
          nickname?: string | null
          permissions?: Json | null
          phone?: string | null
          profile_picture_url?: string | null
          racing_license_expiry?: string | null
          racing_license_number?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          team_id?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          emergency_contact?: Json | null
          full_name?: string | null
          id?: string
          nationality?: string | null
          nickname?: string | null
          permissions?: Json | null
          phone?: string | null
          profile_picture_url?: string | null
          racing_license_expiry?: string | null
          racing_license_number?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          team_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_team"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "orphaned_teams"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "fk_team"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "team_ownership_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_team"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "team_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_team"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "team_subscription_status"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "user_profiles_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "orphaned_teams"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "user_profiles_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "team_ownership_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_profiles_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "team_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_profiles_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "team_subscription_status"
            referencedColumns: ["team_id"]
          },
        ]
      }
      user_subscriptions: {
        Row: {
          additional_cars: number
          additional_cars_pending_removal: number
          additional_cars_removal_date: string | null
          admin_granted: boolean | null
          admin_granted_by: string | null
          admin_granted_reason: string | null
          admin_granted_until: string | null
          cancel_at_period_end: boolean | null
          canceled_at: string | null
          created_at: string | null
          current_period_end: string | null
          current_period_start: string | null
          id: string
          included_cars: number
          last_payment_amount_cents: number | null
          last_payment_at: string | null
          metadata: Json | null
          next_invoice_amount_cents: number | null
          orphaned_at: string | null
          payment_method_brand: string | null
          payment_method_last4: string | null
          reconnection_requested_at: string | null
          reconnection_status: string | null
          requested_team_id: string | null
          status: Database["public"]["Enums"]["subscription_status"]
          stripe_customer_id: string | null
          stripe_price_id: string | null
          stripe_subscription_id: string | null
          team_id: string | null
          tier: Database["public"]["Enums"]["subscription_tier"]
          trial_end: string | null
          trial_start: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          additional_cars?: number
          additional_cars_pending_removal?: number
          additional_cars_removal_date?: string | null
          admin_granted?: boolean | null
          admin_granted_by?: string | null
          admin_granted_reason?: string | null
          admin_granted_until?: string | null
          cancel_at_period_end?: boolean | null
          canceled_at?: string | null
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          included_cars?: number
          last_payment_amount_cents?: number | null
          last_payment_at?: string | null
          metadata?: Json | null
          next_invoice_amount_cents?: number | null
          orphaned_at?: string | null
          payment_method_brand?: string | null
          payment_method_last4?: string | null
          reconnection_requested_at?: string | null
          reconnection_status?: string | null
          requested_team_id?: string | null
          status?: Database["public"]["Enums"]["subscription_status"]
          stripe_customer_id?: string | null
          stripe_price_id?: string | null
          stripe_subscription_id?: string | null
          team_id?: string | null
          tier?: Database["public"]["Enums"]["subscription_tier"]
          trial_end?: string | null
          trial_start?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          additional_cars?: number
          additional_cars_pending_removal?: number
          additional_cars_removal_date?: string | null
          admin_granted?: boolean | null
          admin_granted_by?: string | null
          admin_granted_reason?: string | null
          admin_granted_until?: string | null
          cancel_at_period_end?: boolean | null
          canceled_at?: string | null
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          included_cars?: number
          last_payment_amount_cents?: number | null
          last_payment_at?: string | null
          metadata?: Json | null
          next_invoice_amount_cents?: number | null
          orphaned_at?: string | null
          payment_method_brand?: string | null
          payment_method_last4?: string | null
          reconnection_requested_at?: string | null
          reconnection_status?: string | null
          requested_team_id?: string | null
          status?: Database["public"]["Enums"]["subscription_status"]
          stripe_customer_id?: string | null
          stripe_price_id?: string | null
          stripe_subscription_id?: string | null
          team_id?: string | null
          tier?: Database["public"]["Enums"]["subscription_tier"]
          trial_end?: string | null
          trial_start?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_subscriptions_requested_team_id_fkey"
            columns: ["requested_team_id"]
            isOneToOne: false
            referencedRelation: "orphaned_teams"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "team_subscriptions_requested_team_id_fkey"
            columns: ["requested_team_id"]
            isOneToOne: false
            referencedRelation: "team_ownership_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_subscriptions_requested_team_id_fkey"
            columns: ["requested_team_id"]
            isOneToOne: false
            referencedRelation: "team_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_subscriptions_requested_team_id_fkey"
            columns: ["requested_team_id"]
            isOneToOne: false
            referencedRelation: "team_subscription_status"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "team_subscriptions_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "orphaned_teams"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "team_subscriptions_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "team_ownership_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_subscriptions_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "team_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_subscriptions_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "team_subscription_status"
            referencedColumns: ["team_id"]
          },
        ]
      }
      waitlist_emails: {
        Row: {
          created_at: string | null
          email: string
          id: string
          source: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          source?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          source?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      active_drivers: {
        Row: {
          claimed_at: string | null
          created_at: string | null
          created_from_event: string | null
          date_of_birth: string | null
          deleted_at: string | null
          display_name: string | null
          email: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          experience: string | null
          first_name: string | null
          flagtronics_id: number | null
          id: string | null
          invited_at: string | null
          is_active: boolean | null
          last_name: string | null
          license_number: string | null
          license_type: string | null
          nationality: string | null
          nickname: string | null
          notes: string | null
          profile_photo_url: string | null
          status: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          claimed_at?: string | null
          created_at?: string | null
          created_from_event?: string | null
          date_of_birth?: string | null
          deleted_at?: string | null
          display_name?: string | null
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          experience?: string | null
          first_name?: string | null
          flagtronics_id?: number | null
          id?: string | null
          invited_at?: string | null
          is_active?: boolean | null
          last_name?: string | null
          license_number?: string | null
          license_type?: string | null
          nationality?: string | null
          nickname?: string | null
          notes?: string | null
          profile_photo_url?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          claimed_at?: string | null
          created_at?: string | null
          created_from_event?: string | null
          date_of_birth?: string | null
          deleted_at?: string | null
          display_name?: string | null
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          experience?: string | null
          first_name?: string | null
          flagtronics_id?: number | null
          id?: string | null
          invited_at?: string | null
          is_active?: boolean | null
          last_name?: string | null
          license_number?: string | null
          license_type?: string | null
          nationality?: string | null
          nickname?: string | null
          notes?: string | null
          profile_photo_url?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      admin_subscription_overview: {
        Row: {
          additional_cars: number | null
          admin_granted: boolean | null
          admin_granted_by: string | null
          admin_granted_reason: string | null
          admin_granted_until: string | null
          cancel_at_period_end: boolean | null
          created_at: string | null
          current_period_end: string | null
          current_period_start: string | null
          included_cars: number | null
          mrr_cents: number | null
          orphaned_at: string | null
          reconnection_status: string | null
          requested_team_id: string | null
          status: Database["public"]["Enums"]["subscription_status"] | null
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          subscription_id: string | null
          team_id: string | null
          team_name: string | null
          tier: Database["public"]["Enums"]["subscription_tier"] | null
          updated_at: string | null
          user_email: string | null
          user_id: string | null
          user_name: string | null
        }
        Relationships: [
          {
            foreignKeyName: "team_subscriptions_requested_team_id_fkey"
            columns: ["requested_team_id"]
            isOneToOne: false
            referencedRelation: "orphaned_teams"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "team_subscriptions_requested_team_id_fkey"
            columns: ["requested_team_id"]
            isOneToOne: false
            referencedRelation: "team_ownership_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_subscriptions_requested_team_id_fkey"
            columns: ["requested_team_id"]
            isOneToOne: false
            referencedRelation: "team_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_subscriptions_requested_team_id_fkey"
            columns: ["requested_team_id"]
            isOneToOne: false
            referencedRelation: "team_subscription_status"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "team_subscriptions_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "orphaned_teams"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "team_subscriptions_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "team_ownership_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_subscriptions_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "team_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_subscriptions_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "team_subscription_status"
            referencedColumns: ["team_id"]
          },
        ]
      }
      orphaned_teams: {
        Row: {
          car_count: number | null
          last_tier: Database["public"]["Enums"]["subscription_tier"] | null
          orphaned_at: string | null
          previous_owner_email: string | null
          previous_owner_id: string | null
          previous_owner_name: string | null
          team_created_at: string | null
          team_id: string | null
          team_name: string | null
        }
        Relationships: []
      }
      reconnection_requests: {
        Row: {
          reconnection_requested_at: string | null
          reconnection_status: string | null
          requested_team_id: string | null
          requested_team_name: string | null
          subscription_id: string | null
          subscription_status:
            | Database["public"]["Enums"]["subscription_status"]
            | null
          team_car_count: number | null
          tier: Database["public"]["Enums"]["subscription_tier"] | null
          user_email: string | null
          user_id: string | null
          user_name: string | null
        }
        Relationships: [
          {
            foreignKeyName: "team_subscriptions_requested_team_id_fkey"
            columns: ["requested_team_id"]
            isOneToOne: false
            referencedRelation: "orphaned_teams"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "team_subscriptions_requested_team_id_fkey"
            columns: ["requested_team_id"]
            isOneToOne: false
            referencedRelation: "team_ownership_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_subscriptions_requested_team_id_fkey"
            columns: ["requested_team_id"]
            isOneToOne: false
            referencedRelation: "team_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_subscriptions_requested_team_id_fkey"
            columns: ["requested_team_id"]
            isOneToOne: false
            referencedRelation: "team_subscription_status"
            referencedColumns: ["team_id"]
          },
        ]
      }
      team_ownership_view: {
        Row: {
          created_at: string | null
          created_by: string | null
          creator_email: string | null
          creator_name: string | null
          id: string | null
          is_active: boolean | null
          name: string | null
          owned_by: string | null
          owner_email: string | null
          owner_name: string | null
          short_name: string | null
          updated_at: string | null
        }
        Relationships: []
      }
      team_subscription_status: {
        Row: {
          additional_cars: number | null
          admin_granted: boolean | null
          cancel_at_period_end: boolean | null
          current_period_end: string | null
          has_active_subscription: boolean | null
          included_cars: number | null
          orphaned_at: string | null
          owner_email: string | null
          owner_id: string | null
          owner_name: string | null
          status: Database["public"]["Enums"]["subscription_status"] | null
          team_id: string | null
          team_name: string | null
          tier: Database["public"]["Enums"]["subscription_tier"] | null
          total_cars: number | null
        }
        Relationships: []
      }
      v_active_sessions_summary: {
        Row: {
          actual_start: string | null
          effective_threshold: number | null
          event_id: string | null
          event_name: string | null
          last_activity_at: string | null
          last_lap_time: string | null
          minutes_since_activity: number | null
          redmist_event_id: string | null
          series_name: string | null
          session_id: string | null
          session_name: string | null
          session_threshold: number | null
          session_type: string | null
          status: string | null
          total_laps: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      accept_invite: {
        Args: { p_token: string; p_user_id: string }
        Returns: boolean
      }
      activate_session: { Args: { p_session_id: string }; Returns: undefined }
      add_series_alias: {
        Args: {
          p_alias_name: string
          p_alias_type?: string
          p_series_id: string
        }
        Returns: string
      }
      auto_close_inactive_sessions: {
        Args: never
        Returns: {
          closed_session_id: string
          inactive_minutes: number
          reason: string
          session_name: string
        }[]
      }
      calculate_seat_fees: {
        Args: { price_cents: number }
        Returns: {
          platform_fee_flat: number
          platform_fee_percent_amount: number
          team_payout: number
          total_platform_fee: number
        }[]
      }
      calculate_track_position: {
        Args: { latitude: number; longitude: number; track_id: string }
        Returns: number
      }
      calculate_weighted_average: {
        Args: { decay_factor?: number; values_array: number[] }
        Returns: number
      }
      check_inactive_drivers_for_user: {
        Args: { p_email: string }
        Returns: {
          deleted_at: string
          display_name: string
          driver_id: string
          lap_count: number
          last_race_date: string
        }[]
      }
      check_speedhive_import_exists: {
        Args: { p_speedhive_event_id: string }
        Returns: {
          exists_flag: boolean
          import_id: string
          imported_at: string
        }[]
      }
      claim_car_number: {
        Args: { p_car_class?: string; p_car_number: string; p_user_id: string }
        Returns: Json
      }
      claim_driver_profile: {
        Args: {
          p_driver_id: string
          p_invitation_token?: string
          p_user_id: string
        }
        Returns: boolean
      }
      claim_transponder: {
        Args: { p_transponder_number: string; p_user_id: string }
        Returns: {
          out_car_class: string
          out_car_color: string
          out_car_make: string
          out_car_model: string
          out_car_number: string
          out_car_profile_id: string
          out_last_seen_at: string
          out_team_name: string
          out_team_profile_id: string
          out_transponder_id: string
          out_was_precreated: boolean
        }[]
      }
      cleanup_old_racing_data: { Args: never; Returns: undefined }
      cleanup_old_stream_sync_records: { Args: never; Returns: number }
      cleanup_stale_positions: {
        Args: { max_age_hours?: number }
        Returns: number
      }
      clear_all_racing_data: { Args: never; Returns: Json }
      clear_master_data: { Args: never; Returns: Json }
      clear_session_data: { Args: never; Returns: Json }
      complete_event: { Args: { p_event_id: string }; Returns: undefined }
      complete_session: { Args: { p_session_id: string }; Returns: undefined }
      create_session_from_redmist_event: {
        Args: {
          p_event_name: string
          p_organization?: string
          p_redmist_event_id: string
          p_redmist_session_id?: string
          p_session_name?: string
          p_session_type?: string
        }
        Returns: string
      }
      delete_event: { Args: { p_event_id: string }; Returns: Json }
      delete_session: { Args: { p_session_id: string }; Returns: Json }
      delete_team_cascade: { Args: { target_team_id: string }; Returns: Json }
      delete_user_cascade: {
        Args: { target_user_id: string }
        Returns: undefined
      }
      delete_user_only: { Args: { target_user_id: string }; Returns: undefined }
      ensure_transponder_exists: {
        Args: { p_transponder_number: string }
        Returns: string
      }
      expire_old_invites: { Args: never; Returns: number }
      find_active_event_for_transponder: {
        Args: { p_transponder_number: string }
        Returns: {
          car_class: string
          car_number: string
          event_id: string
          event_name: string
          session_id: string
          session_name: string
        }[]
      }
      find_inactive_driver_by_email: {
        Args: { p_email: string }
        Returns: {
          deleted_at: string
          display_name: string
          driver_id: string
          last_active: string
          total_laps: number
        }[]
      }
      fix_jsonb_string_numbers: { Args: { data: Json }; Returns: Json }
      generate_session_name: {
        Args: {
          p_event_name: string
          p_session_number?: number
          p_session_type: string
        }
        Returns: string
      }
      get_active_additional_cars: {
        Args: { p_team_id: string }
        Returns: number
      }
      get_active_redmist_session: {
        Args: never
        Returns: {
          actual_end: string
          actual_start: string
          event_id: string
          event_name: string
          event_redmist_id: string
          redmist_event_id: string
          redmist_session_id: string
          scheduled_end: string
          scheduled_start: string
          session_id: string
          session_name: string
          session_status: string
          session_type: string
        }[]
      }
      get_current_user_role: { Args: never; Returns: string }
      get_default_track: {
        Args: never
        Returns: {
          id: string
          length_meters: number
          location: string
          name: string
        }[]
      }
      get_effective_fuel_config: {
        Args: { p_activation_id: string }
        Returns: {
          fuel_consumption: number
          fuel_tank_capacity: number
          fuel_unit: string
          source: string
          yellow_flag_consumption: number
        }[]
      }
      get_or_create_active_session: {
        Args: { p_event_id: string; p_session_data?: Json }
        Returns: string
      }
      get_or_create_driver_by_flagtronics: {
        Args: {
          p_display_name: string
          p_event_name?: string
          p_first_name?: string
          p_flagtronics_id: number
          p_last_name?: string
        }
        Returns: string
      }
      get_or_create_notification_preferences: {
        Args: { p_user_id: string }
        Returns: {
          created_at: string | null
          email_frequency: string | null
          event_updates: boolean | null
          id: string
          race_reports: boolean | null
          series_announcements: boolean | null
          team_updates: boolean | null
          unsubscribe_token: string | null
          unsubscribed_at: string | null
          updated_at: string | null
          user_id: string
        }
        SetofOptions: {
          from: "*"
          to: "notification_preferences"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      get_or_create_participant_by_transponder: {
        Args: {
          p_car_class?: string
          p_car_number: string
          p_flagtronics_id?: string
          p_session_id: string
          p_team_name?: string
          p_transponder_number: string
        }
        Returns: string
      }
      get_or_create_series_by_organization: {
        Args: { p_organization: string; p_season_year?: number }
        Returns: string
      }
      get_or_create_session_participant: {
        Args: {
          p_car_class: string
          p_car_id: string
          p_car_number: string
          p_session_id: string
          p_team_id: string
        }
        Returns: string
      }
      get_pending_subscription: {
        Args: { p_user_id: string }
        Returns: {
          additional_cars: number
          id: string
          included_cars: number
          status: Database["public"]["Enums"]["subscription_status"]
          stripe_customer_id: string
          stripe_subscription_id: string
          tier: Database["public"]["Enums"]["subscription_tier"]
        }[]
      }
      get_session_by_redmist_id: {
        Args: { p_redmist_event_id: string; p_redmist_session_id?: string }
        Returns: string
      }
      get_session_sectors: { Args: { session_id: string }; Returns: Json }
      get_speedhive_import_stats: {
        Args: never
        Returns: {
          earliest_event: string
          latest_event: string
          total_imports: number
          total_results: number
          total_runs: number
        }[]
      }
      get_subscription_car_limit: {
        Args: { p_team_id: string }
        Returns: number
      }
      get_team_subscription_tier: {
        Args: { p_team_id: string }
        Returns: Database["public"]["Enums"]["subscription_tier"]
      }
      get_upcoming_events: {
        Args: { p_days_ahead?: number; p_limit?: number; p_series_id?: string }
        Returns: {
          description: string
          event_end_date: string
          event_name: string
          event_start_date: string
          event_type: string
          featured: boolean
          logo_url: string
          primary_color: string
          registration_open: boolean
          registration_url: string
          schedule_id: string
          series_code: string
          series_id: string
          series_name: string
          status: string
          track_location: string
          track_name: string
          website_url: string
        }[]
      }
      get_user_claimed_cars: {
        Args: { p_user_id: string }
        Returns: {
          car_class: string
          car_number: string
          created_at: string
          participant_id: string
          session_id: string
          status: string
        }[]
      }
      get_user_linked_team: { Args: { p_user_id: string }; Returns: string }
      get_user_role: { Args: { user_id: string }; Returns: string }
      get_user_subscription: {
        Args: { p_user_id: string }
        Returns: {
          additional_cars: number
          admin_granted: boolean
          id: string
          included_cars: number
          orphaned_at: string
          status: Database["public"]["Enums"]["subscription_status"]
          stripe_customer_id: string
          stripe_subscription_id: string
          team_id: string
          tier: Database["public"]["Enums"]["subscription_tier"]
          user_id: string
        }[]
      }
      get_user_subscription_car_limit: {
        Args: { p_user_id: string }
        Returns: number
      }
      get_user_subscription_tier: {
        Args: { p_user_id: string }
        Returns: Database["public"]["Enums"]["subscription_tier"]
      }
      get_user_team_ids: { Args: { user_id: string }; Returns: string[] }
      get_user_transponders: {
        Args: { p_user_id: string }
        Returns: {
          first_seen_at: string
          last_car_number: string
          last_seen_at: string
          last_team_name: string
          nickname: string
          registered_at: string
          slot_id: string
          slot_status: string
          status: string
          transponder_id: string
          transponder_number: string
        }[]
      }
      get_users_needing_sync: {
        Args: { p_limit?: number }
        Returns: {
          email: string
          last_error: string
          last_synced: string
          user_id: string
        }[]
      }
      get_yellow_laps_for_run: {
        Args: { p_include_unconfirmed?: boolean; p_run_id: string }
        Returns: {
          avg_field_time_ms: number
          baseline_avg_ms: number
          field_pct_affected: number
          is_confirmed: boolean
          lap_number: number
        }[]
      }
      has_active_subscription: { Args: { p_team_id: string }; Returns: boolean }
      has_active_user_subscription: {
        Args: { p_user_id: string }
        Returns: boolean
      }
      has_pending_subscription: {
        Args: { p_user_id: string }
        Returns: boolean
      }
      has_series_access: {
        Args: { series_id: string; user_id: string }
        Returns: boolean
      }
      increment_participant_laps: {
        Args: { p_participant_id: string }
        Returns: undefined
      }
      is_admin: { Args: never; Returns: boolean }
      is_admin_or_race_control: { Args: { user_id: string }; Returns: boolean }
      is_user_locked_to_event: {
        Args: { p_user_id: string }
        Returns: {
          event_id: string
          is_locked: boolean
          locked_at: string
          unlocked_at: string
        }[]
      }
      link_subscription_to_team: {
        Args: { p_team_id: string; p_user_id: string }
        Returns: boolean
      }
      lookup_transponder_for_signup: {
        Args: { p_requesting_user_id: string; p_transponder_number: string }
        Returns: {
          already_claimed: boolean
          car_class: string
          car_color: string
          car_make: string
          car_model: string
          car_number: string
          found_in_registry: boolean
          last_seen_at: string
          owned_by_requester: boolean
          team_name: string
          transponder_uuid: string
        }[]
      }
      mark_past_events_completed: { Args: never; Returns: number }
      mark_stale_redmist_connections: {
        Args: { p_stale_threshold_minutes?: number }
        Returns: number
      }
      mark_stream_sync_failed: {
        Args: { p_error_message: string; p_user_id: string }
        Returns: undefined
      }
      mark_stream_sync_success: {
        Args: { p_stream_user_id: string; p_user_id: string }
        Returns: undefined
      }
      match_rule_chunks: {
        Args: {
          match_count?: number
          query_embedding: string
          rulebook_id_filter: string
          similarity_threshold?: number
        }
        Returns: {
          chunk_index: number
          content: string
          heading_path: string
          id: string
          page_number: number
          rulebook_id: string
          section_label: string
          similarity: number
          token_count: number
        }[]
      }
      needs_stream_sync: { Args: { p_user_id: string }; Returns: boolean }
      preview_cleanup_old_racing_data: {
        Args: never
        Returns: {
          newest_record: string
          oldest_record: string
          records_to_delete: number
          table_name: string
        }[]
      }
      racing_data_storage_stats: {
        Args: never
        Returns: {
          estimated_size: string
          record_count: number
          table_name: string
        }[]
      }
      reactivate_driver: {
        Args: { p_driver_id: string; p_user_id?: string }
        Returns: boolean
      }
      record_broadcast_token_usage: {
        Args: { p_token_hash: string }
        Returns: boolean
      }
      set_default_track: { Args: { p_track_id: string }; Returns: Json }
      show_limit: { Args: never; Returns: number }
      show_trgm: { Args: { "": string }; Returns: string[] }
      unclaim_car_number: {
        Args: { p_car_number: string; p_user_id: string }
        Returns: Json
      }
      unlock_user_from_event: {
        Args: {
          p_unlock_method?: string
          p_unlock_reason?: string
          p_unlocked_by?: string
          p_user_id: string
        }
        Returns: boolean
      }
      unsubscribe_by_token: { Args: { p_token: string }; Returns: boolean }
      update_redmist_connection_activity: {
        Args: { p_redmist_event_id: string; p_redmist_session_id?: string }
        Returns: undefined
      }
      update_session_activity: {
        Args: { p_session_id: string }
        Returns: undefined
      }
      upsert_transponder_registry: {
        Args: {
          p_car_class?: string
          p_car_color?: string
          p_car_make?: string
          p_car_model?: string
          p_car_number?: string
          p_car_year?: number
          p_raw_name?: string
          p_source?: string
          p_source_event_id?: string
          p_source_event_name?: string
          p_team_name?: string
          p_transponder_number: string
        }
        Returns: string
      }
      validate_invite_token: {
        Args: { p_token: string }
        Returns: {
          email: string
          error_message: string
          id: string
          invited_by: string
          is_valid: boolean
          reason: string
          subscription_expires_at: string
          tier: string
        }[]
      }
    }
    Enums: {
      application_status:
        | "pending"
        | "under_review"
        | "approved"
        | "payment_processing"
        | "confirmed"
        | "rejected"
        | "withdrawn"
        | "payment_failed"
        | "refunded"
        | "partially_refunded"
      listing_status:
        | "draft"
        | "active"
        | "paused"
        | "sold"
        | "expired"
        | "cancelled"
      stripe_onboarding_status:
        | "pending"
        | "incomplete"
        | "complete"
        | "restricted"
      subscription_status:
        | "pending"
        | "active"
        | "past_due"
        | "canceled"
        | "incomplete"
        | "trialing"
        | "unpaid"
        | "paused"
        | "inactive"
      subscription_tier: "free" | "team_pro" | "telemetry"
      user_role:
        | "admin"
        | "developer"
        | "demo"
        | "team_owner"
        | "race_engineer"
        | "race_control"
        | "media"
        | "visitor"
        | "driver"
        | "spectator"
        | "series_admin"
        | "pending_setup"
        | "team"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      application_status: [
        "pending",
        "under_review",
        "approved",
        "payment_processing",
        "confirmed",
        "rejected",
        "withdrawn",
        "payment_failed",
        "refunded",
        "partially_refunded",
      ],
      listing_status: [
        "draft",
        "active",
        "paused",
        "sold",
        "expired",
        "cancelled",
      ],
      stripe_onboarding_status: [
        "pending",
        "incomplete",
        "complete",
        "restricted",
      ],
      subscription_status: [
        "pending",
        "active",
        "past_due",
        "canceled",
        "incomplete",
        "trialing",
        "unpaid",
        "paused",
        "inactive",
      ],
      subscription_tier: ["free", "team_pro", "telemetry"],
      user_role: [
        "admin",
        "developer",
        "demo",
        "team_owner",
        "race_engineer",
        "race_control",
        "media",
        "visitor",
        "driver",
        "spectator",
        "series_admin",
        "pending_setup",
        "team",
      ],
    },
  },
} as const
