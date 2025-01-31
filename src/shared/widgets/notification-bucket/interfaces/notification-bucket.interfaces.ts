export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface NotificationAction {
  callback: () => void;
  label: string;
}

export interface Notification {
  id: string;
  message: string;
  type: NotificationType;
  liveSpanSec?: number;
  permanent?: boolean;
  action?: NotificationAction;
}

export interface NotificationPayload {
  id: string;
  message: string;
  type: NotificationType;
  selfDestructionCallback: void | null;
  action?: NotificationAction;
  // selfRenderingCallback: (variableToUpdate: any) => Promise<boolean>;
}
