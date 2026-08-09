import React, { useState } from 'react';
import { ShieldCheck, Lock, Camera, MapPin, Eye, CheckCircle2, AlertCircle, RefreshCw, KeyRound } from 'lucide-react';
import { PermissionStatus, SecuritySettings } from '../types';

interface PermissionsPanelProps {
  permissions: PermissionStatus;
  settings: SecuritySettings;
  onUpdatePermissions: (newPerms: PermissionStatus) => void;
  onUpdateSettings: (newSettings: SecuritySettings) => void;
}

export const PermissionsSettingsPanel: React.FC<PermissionsPanelProps> = ({
  permissions,
  settings,
  onUpdatePermissions,
  onUpdateSettings,
}) => {
  const [emailInput, setEmailInput] = useState<string>(settings.alertEmail);
  const [savedNotice, setSavedNotice] = useState<boolean>(false);

  const togglePermission = (key: keyof PermissionStatus) => {
    if (key === 'camera' || key === 'location') {
      const current = permissions[key];
      const next = current === 'granted' ? 'denied' : 'granted';
      onUpdatePermissions({ ...permissions, [key]: next });
    } else {
      onUpdatePermissions({ ...permissions, [key]: !permissions[key] });
    }
  };

  const handleSaveEmail = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings({ ...settings, alertEmail: emailInput });
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-slate-100 space-y-6 shadow-lg">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="text-emerald-400" size={22} />
          <div>
            <h3 className="font-bold text-slate-100 text-sm tracking-wide">Device Admin & Permissions (`checkSecurityPermissions`)</h3>
            <p className="text-xs text-slate-400">Verifies mandatory system-level privileges required to prevent unauthorized app uninstall & tampering.</p>
          </div>
        </div>
      </div>

      {/* Permission Toggles Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Device Administrator */}
        <div className={`p-3.5 rounded-xl border transition flex items-center justify-between ${permissions.deviceAdmin ? 'bg-slate-950 border-emerald-500/30' : 'bg-slate-950 border-rose-500/30'}`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${permissions.deviceAdmin ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
              <Lock size={18} />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-200">Device Administrator</div>
              <div className="text-[10px] text-slate-400">Prevents anti-theft app uninstall without PIN</div>
            </div>
          </div>
          <button
            onClick={() => togglePermission('deviceAdmin')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${permissions.deviceAdmin ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'}`}
          >
            {permissions.deviceAdmin ? 'ACTIVE' : 'GRANT'}
          </button>
        </div>

        {/* Camera Permission */}
        <div className={`p-3.5 rounded-xl border transition flex items-center justify-between ${permissions.camera === 'granted' ? 'bg-slate-950 border-emerald-500/30' : 'bg-slate-950 border-amber-500/30'}`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${permissions.camera === 'granted' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
              <Camera size={18} />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-200">Front Camera Access</div>
              <div className="text-[10px] text-slate-400">Silent background intruder photos</div>
            </div>
          </div>
          <button
            onClick={() => togglePermission('camera')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${permissions.camera === 'granted' ? 'bg-emerald-600 text-white' : 'bg-amber-600 text-white'}`}
          >
            {permissions.camera === 'granted' ? 'GRANTED' : 'ALLOW'}
          </button>
        </div>

        {/* Location GPS */}
        <div className={`p-3.5 rounded-xl border transition flex items-center justify-between ${permissions.location === 'granted' ? 'bg-slate-950 border-emerald-500/30' : 'bg-slate-950 border-amber-500/30'}`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${permissions.location === 'granted' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
              <MapPin size={18} />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-200">High-Precision Location</div>
              <div className="text-[10px] text-slate-400">GPS & Network coordinates logging</div>
            </div>
          </div>
          <button
            onClick={() => togglePermission('location')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${permissions.location === 'granted' ? 'bg-emerald-600 text-white' : 'bg-amber-600 text-white'}`}
          >
            {permissions.location === 'granted' ? 'GRANTED' : 'ALLOW'}
          </button>
        </div>

        {/* Overlay / Lock Shield */}
        <div className={`p-3.5 rounded-xl border transition flex items-center justify-between ${permissions.drawOverApps ? 'bg-slate-950 border-emerald-500/30' : 'bg-slate-950 border-slate-800'}`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${permissions.drawOverApps ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>
              <Eye size={18} />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-200">Draw Over Apps</div>
              <div className="text-[10px] text-slate-400">Fake power menu overlay screen</div>
            </div>
          </div>
          <button
            onClick={() => togglePermission('drawOverApps')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${permissions.drawOverApps ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-200'}`}
          >
            {permissions.drawOverApps ? 'ENABLED' : 'ENABLE'}
          </button>
        </div>
      </div>

      {/* Threshold & Alert Email Config Form */}
      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-4">
        <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Trigger Thresholds & Owner Email</h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-slate-400 font-medium block mb-1.5">
              Failed Unlock Attempts Threshold (`onFailedUnlock`)
            </label>
            <div className="flex gap-2">
              {[1, 2, 3].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => onUpdateSettings({ ...settings, attemptThreshold: num })}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold border transition ${
                    settings.attemptThreshold === num
                      ? 'bg-blue-600 border-blue-500 text-white shadow'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {num} Attempt{num > 1 ? 's' : ''}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSaveEmail}>
            <label className="text-xs text-slate-400 font-medium block mb-1.5">
              Registered Alert Recipient Email
            </label>
            <div className="flex gap-2">
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                required
                className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 font-mono focus:outline-none focus:border-blue-500 flex-1"
                placeholder="owner@example.com"
              />
              <button
                type="submit"
                className="px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold transition"
              >
                Save
              </button>
            </div>
          </form>
        </div>

        {savedNotice && (
          <div className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
            <CheckCircle2 size={13} />
            <span>Settings and recipient email successfully saved.</span>
          </div>
        )}
      </div>
    </div>
  );
};
