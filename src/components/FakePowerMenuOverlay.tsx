import React, { useState } from 'react';
import { Power, Shield, Lock, X, RefreshCw, AlertOctagon, Smartphone } from 'lucide-react';

interface FakePowerMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onTriggerFakeOff: () => void;
}

export const FakePowerMenuOverlay: React.FC<FakePowerMenuProps> = ({
  isOpen,
  onClose,
  onTriggerFakeOff,
}) => {
  const [isFakeOffActive, setIsFakeOffActive] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleFakePowerClick = () => {
    setIsFakeOffActive(true);
    onTriggerFakeOff();
  };

  const handleWakeDevice = () => {
    setIsFakeOffActive(false);
    onClose();
  };

  if (isFakeOffActive) {
    return (
      <div className="fixed inset-0 z-50 bg-black text-white flex flex-col items-center justify-between p-8 font-sans select-none animate-fadeIn">
        <div className="w-full flex justify-end">
          <button
            onClick={handleWakeDevice}
            className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 px-3 py-1.5 rounded-full flex items-center gap-1.5 transition"
          >
            <RefreshCw size={12} className="animate-spin text-emerald-400" />
            <span>Wake Real Device (Owner Secret Tap)</span>
          </button>
        </div>

        <div className="text-center space-y-4 max-w-sm my-auto">
          <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-700">
            <Power size={32} />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-light tracking-wide text-slate-400">Power Off</h2>
            <p className="text-xs text-slate-600">Device turned off.</p>
          </div>
          <div className="p-3 bg-slate-950 border border-slate-900 rounded-xl text-[11px] text-slate-500 font-mono">
            🛡️ CrookCatcher Shielding Active: Phone appears powered down to thieves, but silently records camera, GPS & sends background alerts.
          </div>
        </div>

        <div className="text-[11px] text-slate-700 font-mono">
          CrookCatcher Lock Screen Shield v3.4 • Background Service Alive
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-950 border border-slate-800 rounded-3xl max-w-sm w-full p-6 text-slate-100 shadow-2xl relative space-y-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-100 bg-slate-900 rounded-full"
        >
          <X size={18} />
        </button>

        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto text-rose-400">
            <Power size={24} />
          </div>
          <h2 className="text-lg font-bold text-slate-100">Fake Power Menu Shield</h2>
          <p className="text-xs text-slate-400">
            Intercepts hardware key actions on lock screens to trick intruders into thinking the device shut down.
          </p>
        </div>

        {/* Android Simulated Power Controls */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            onClick={handleFakePowerClick}
            className="flex flex-col items-center justify-center p-4 bg-slate-900 hover:bg-rose-950/40 border border-slate-800 hover:border-rose-500/40 rounded-2xl gap-2 transition group"
          >
            <div className="w-10 h-10 rounded-full bg-rose-600/20 text-rose-400 flex items-center justify-center group-hover:scale-110 transition">
              <Power size={20} />
            </div>
            <span className="text-xs font-semibold text-slate-200">Power Off</span>
            <span className="text-[10px] text-slate-500">Triggers Fake Shut Down</span>
          </button>

          <button
            onClick={handleFakePowerClick}
            className="flex flex-col items-center justify-center p-4 bg-slate-900 hover:bg-emerald-950/40 border border-slate-800 hover:border-emerald-500/40 rounded-2xl gap-2 transition group"
          >
            <div className="w-10 h-10 rounded-full bg-emerald-600/20 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition">
              <RefreshCw size={20} />
            </div>
            <span className="text-xs font-semibold text-slate-200">Restart</span>
            <span className="text-[10px] text-slate-500">Simulates Reboot Loop</span>
          </button>
        </div>

        <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 text-[11px] text-slate-400 space-y-1">
          <div className="font-semibold text-slate-200 flex items-center gap-1">
            <Shield size={12} className="text-emerald-400" />
            <span>Anti-Theft Mechanism (`toggleFakePowerMenu`)</span>
          </div>
          <p>
            When pressed by unauthorized persons, CrookCatcher displays a black mock powered-off screen while continuing high-accuracy GPS tracking and camera snapshots in the background.
          </p>
        </div>
      </div>
    </div>
  );
};
