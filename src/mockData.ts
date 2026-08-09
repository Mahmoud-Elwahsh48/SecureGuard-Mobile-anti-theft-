import { IntruderLog, SecuritySettings, PermissionStatus } from './types';

export const DEFAULT_SETTINGS: SecuritySettings = {
  attemptThreshold: 2,
  alertEmail: 'owner@example.com',
  enablePhotoCapture: true,
  enableGpsLogging: true,
  enableEmailAlerts: true,
  enableFakePowerMenu: true,
  enableDeviceAdmin: true,
  soundAlarmOnIntruder: false,
  stealthMode: true,
  isArmed: true,
};

export const INITIAL_PERMISSIONS: PermissionStatus = {
  camera: 'granted',
  location: 'granted',
  deviceAdmin: true,
  usageStats: true,
  drawOverApps: true,
};

export const MOCK_INTRUDER_LOGS: IntruderLog[] = [
  {
    id: 'log-101',
    timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    failedAttempts: 2,
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    latitude: 37.774929,
    longitude: -122.419416,
    accuracy: 8.5,
    estimatedAddress: '742 Market Street, San Francisco, CA 94103',
    emailSent: true,
    emailRecipient: 'owner@example.com',
    deviceStatus: 'Locked',
    notes: 'Failed PIN entries at Market St store front.'
  },
  {
    id: 'log-102',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    failedAttempts: 3,
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    latitude: 37.783342,
    longitude: -122.416712,
    accuracy: 12.0,
    estimatedAddress: '50 Geary St, San Francisco, CA 94108',
    emailSent: true,
    emailRecipient: 'owner@example.com',
    deviceStatus: 'Shielded',
    notes: 'Intruder attempted fake power off button press.'
  }
];
