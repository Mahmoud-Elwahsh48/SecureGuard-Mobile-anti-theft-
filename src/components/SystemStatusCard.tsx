import React from 'react';
import { Shield, ShieldAlert, Camera, MapPin, Mail, Power, CheckCircle, AlertTriangle, KeyRound } from 'lucide-react';
import { PermissionStatus, SecuritySettings } from '../types';

interface SystemStatusProps {
  permissions: PermissionStatus;
  settings: SecuritySettings;
  failedCount: number;
  logsCount: number;
  onOpenSimulator: () => void;
  onOpenFakePowerMenu: () => void;
  onArmToggle: () => void;
}

export const SystemStatusCard: React.FC<SystemStatusProps> = ({
  permissions,
  settings,
  failedCount,
  logsCount,
  onOpenSimulator,
  onOpenFakePowerMenu,
  onArmToggle,
}) => {
  const allPermissionsOK = permissions.camera === 'granted' && permissions.location === 'granted' && permissions.deviceAdmin;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-slate-100 shadow-xl space-y-5">
      {/* Top Banner */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-xl flex items-center justify-center ${settings.isArmed ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'}`}>
            {settings.isArmed ? <Shield size={28} className="animate-pulse" /> : <ShieldAlert size={28} />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold tracking-tight">System Protection</h2>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${settings.isArmed ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'}`}>
                {settings.isArmed ? 'ACTIVE & ARMED' : 'PAUSED'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {settings.isArmed
                ? `Triggers photo & location alert after ${settings.attemptThreshold} failed unlock attempt${settings.attemptThreshold > 1 ? 's' : ''}`
                : 'Protection is temporarily disarmed.'}
            </p>
          </div>
        </div>

        <button
          onClick={onArmToggle}
          className={`px-4 py-2.5 rounded-xl font-semibold text-xs tracking-wider uppercase transition-all shadow-md ${
            settings.isArmed
              ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-900/30'
              : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/30'
          }`}
        >
          {settings.isArmed ? 'Disarm Guard' : 'Arm Protection'}
        </button>
      </div>

      {/* Quick Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
        <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-1">
            <span>Threshold</span>
            <KeyRound size={14} className="text-blue-400" />
          </div>
          <div className="text-lg font-bold text-slate-100">{settings.attemptThreshold} Attempt{settings.attemptThreshold > 1 ? 's' : ''}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Current fail count: <span className="text-amber-400 font-semibold">{failedCount}</span></div>
        </div>

        <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-1">
            <span>Intruder Snaps</span>
            <Camera size={14} className="text-purple-400" />
          </div>
          <div className="text-lg font-bold text-slate-100">{logsCount} Saved</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Silent selfie enabled</div>
        </div>

        <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-1">
            <span>GPS Tracking</span>
            <MapPin size={14} className="text-emerald-400" />
          </div>
          <div className="text-lg font-bold text-emerald-400">High Precision</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Reverse geocoding active</div>
        </div>

        <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-1">
            <span>Email Alerts</span>
            <Mail size={14} className="text-sky-400" />
          </div>
          <div className="text-xs font-bold text-slate-200 truncate">{settings.alertEmail}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Instant dispatch</div>
        </div>
      </div>

      {/* Permissions and Quick Test Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950/90 border border-slate-800 rounded-xl p-3.5">
        <div className="flex items-center gap-2">
          {allPermissionsOK ? (
            <CheckCircle size={18} className="text-emerald-400" />
          ) : (
            <AlertTriangle size={18} className="text-amber-400 animate-bounce" />
          )}
          <span className="text-xs font-medium text-slate-300">
            {allPermissionsOK ? 'All Android Security Permissions & Device Admin Active' : 'Permission Action Required'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenFakePowerMenu}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium transition"
          >
            <Power size={14} className="text-rose-400" />
            <span>Test Fake Power Shield</span>
          </button>

          <button
            onClick={onOpenSimulator}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow-sm transition"
          >
            <KeyRound size={14} />
            <span>Simulate Lock Screen Fail</span>
          </button>
        </div>
      </div>
    </div>
  );
};
