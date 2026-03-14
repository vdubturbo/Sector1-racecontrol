export type PanelId =
  | 'timing'
  | 'control-log'
  | 'incidents'
  | 'directory'
  | 'flags'
  | 'track-map'
  | 'classifications'
  | 'comms';

export type PanelStatus = 'closed' | 'connected' | 'disconnected';

export interface PanelDefinition {
  id: PanelId;
  name: string;
  description: string;
  route: string;
  icon: string;
  windowFeatures: string;
}

export interface PanelState {
  id: PanelId;
  status: PanelStatus;
  windowRef: Window | null;
}
