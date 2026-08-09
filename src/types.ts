export interface IntruderLog {
  id: string;
  timestamp: string;
  failedAttempts: number;
  photoUrl: string;
  latitude: number;
  longitude: number;
  accuracy: number;
  estimatedAddress: string;
  emailSent: boolean;
  emailRecipient: string;
  deviceStatus: 'Locked' | 'Unlocked' | 'Shielded';
  notes?: string;
}

export interface SecuritySettings {
  attemptThreshold: number; // 1, 2, or 3 failed attempts
  alertEmail: string;
  enablePhotoCapture: boolean;
  enableGpsLogging: boolean;
  enableEmailAlerts: boolean;
  enableFakePowerMenu: boolean;
  enableDeviceAdmin: boolean;
  soundAlarmOnIntruder: boolean;
  stealthMode: boolean; // hides app notification when triggered
  isArmed: boolean;
}

export interface PermissionStatus {
  camera: 'granted' | 'denied' | 'prompt';
  location: 'granted' | 'denied' | 'prompt';
  deviceAdmin: boolean;
  usageStats: boolean;
  drawOverApps: boolean;
}
