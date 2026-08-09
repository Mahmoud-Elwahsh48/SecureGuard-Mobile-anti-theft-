import React, { useState } from 'react';
import { Lock, Delete, ArrowRight, ShieldAlert, Key, AlertTriangle, Eye, EyeOff } from 'lucide-react';
import { SecuritySettings } from '../types';

interface LockScreenSimulatorProps {
  isOpen: boolean;
  onClose: () => void;
  settings: SecuritySettings;
  failedCount: number;
  onFailedAttempt: () => void;
  onCorrectUnlock: () => void;
}

export const LockScreenSimulatorModal: React.FC<LockScreenSimulatorProps> = ({
  isOpen,
  onClose,
  settings,
  failedCount,
  onFailedAttempt,
  onCorrectUnlock,
}) => {
  const [pin, setPin] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showPin, setShowPin] = useState<boolean>(false);

  const CORRECT_PIN = '1234';

  if (!isOpen) return null;

  const handleKeyPress = (num: string) => {
    if (pin.length < 4) {
      setPin((prev) => prev + num);
      setErrorMessage(null);
    }
  };

  const handleDelete = () => {
    setPin((prev) => prev.slice(0, -1));
    setErrorMessage(null);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (pin.length === 0) return;

    if (pin === CORRECT_PIN) {
      setErrorMessage(null);
      setPin('');
      onCorrectUnlock();
    } else {
      setErrorMessage('Wrong PIN pattern. Incrementing failed attempt listener...');
      setPin('');
      onFailedAttempt();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-lg flex items-center justify-center p-4">
      <div className="bg-slate-950 border border-slate-800 rounded-3xl max-w-xs w-full p-6 text-slate-100 shadow-2xl space-y-5 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-xs bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 px-2.5 py-1 rounded-full transition"
        >
          Exit Screen
        </button>

        <div className="text-center space-y-1 pt-2">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mx-auto mb-2">
            <Lock size={22} />
          </div>
          <h3 className="font-bold text-slate-100 text-base">Android Lock Screen</h3>
          <p className="text-[11px] text-slate-400">
            Enter PIN (<span className="text-emerald-400 font-mono font-bold">1234</span> for correct) or enter wrong numbers to trigger CrookCatcher.
          </p>
        </div>

        {/* Failed counter indicator */}
        <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 text-center">
          <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Current Unlock Fail Counter</div>
          <div className="text-xl font-mono font-bold text-amber-400 mt-0.5">
            {failedCount} / {settings.attemptThreshold} <span className="text-xs font-sans text-slate-500">Threshold</span>
          </div>
        </div>

        {/* PIN Entry Display dots */}
        <div className="flex justify-center items-center gap-3 py-2">
          {[0, 1, 2, 3].map((index) => {
            const hasChar = pin.length > index;
            return (
              <div
                key={index}
                className={`w-4 h-4 rounded-full border transition-all ${
                  hasChar
                    ? 'bg-blue-500 border-blue-400 scale-110 shadow-lg shadow-blue-500/50'
                    : 'border-slate-700 bg-slate-900'
                }`}
              />
            );
          })}
        </div>

        {errorMessage && (
          <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs p-2.5 rounded-xl text-center font-medium animate-shake">
            {errorMessage}
          </div>
        )}

        {/* Keypad Grid */}
        <div className="grid grid-cols-3 gap-2.5 pt-1">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
            <button
              key={num}
              onClick={() => handleKeyPress(num)}
              className="h-12 rounded-2xl bg-slate-900 hover:bg-slate-800 active:bg-blue-600 active:text-white border border-slate-800/80 text-lg font-mono font-medium text-slate-200 transition shadow-sm"
            >
              {num}
            </button>
          ))}
          <button
            onClick={handleDelete}
            className="h-12 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-800/80 flex items-center justify-center transition"
          >
            <Delete size={18} />
          </button>
          <button
            onClick={() => handleKeyPress('0')}
            className="h-12 rounded-2xl bg-slate-900 hover:bg-slate-800 active:bg-blue-600 active:text-white border border-slate-800/80 text-lg font-mono font-medium text-slate-200 transition shadow-sm"
          >
            0
          </button>
          <button
            onClick={handleSubmit}
            className="h-12 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold flex items-center justify-center transition shadow-md shadow-blue-900/40"
          >
            <ArrowRight size={20} />
          </button>
        </div>

        <div className="text-[10px] text-center text-slate-500 font-mono">
          `onFailedUnlock` Listener Hook Operational
        </div>
      </div>
    </div>
  );
};
