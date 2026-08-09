import React from 'react';
import { IntruderLog } from '../types';
import { Camera, MapPin, Mail, Clock, ExternalLink, Trash2, Eye, ShieldAlert, Navigation } from 'lucide-react';

interface LogsHistoryProps {
  logs: IntruderLog[];
  onSelectLog: (log: IntruderLog) => void;
  onClearLogs: () => void;
}

export const IntruderLogsHistory: React.FC<LogsHistoryProps> = ({
  logs,
  onSelectLog,
  onClearLogs,
}) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-slate-100 space-y-4 shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldAlert className="text-rose-400" size={20} />
          <div>
            <h3 className="font-bold text-slate-100 text-sm tracking-wide">Captured Intruder Log Archive</h3>
            <p className="text-xs text-slate-400">Stores silent photo snapshots, GPS coordinates, and email statuses locally.</p>
          </div>
        </div>

        {logs.length > 0 && (
          <button
            onClick={onClearLogs}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-rose-900/40 text-slate-400 hover:text-rose-300 rounded-lg text-xs font-medium border border-slate-700 transition"
          >
            <Trash2 size={13} />
            <span>Clear Logs</span>
          </button>
        )}
      </div>

      {logs.length === 0 ? (
        <div className="bg-slate-950 p-8 rounded-xl border border-slate-800 text-center space-y-2">
          <Camera size={32} className="mx-auto text-slate-700" />
          <p className="text-xs text-slate-400 font-medium">No intruder breaches logged yet.</p>
          <p className="text-[11px] text-slate-600">Simulate a failed unlock pattern above to test detection capture.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {logs.map((log) => (
            <div
              key={log.id}
              onClick={() => onSelectLog(log)}
              className="bg-slate-950 hover:bg-slate-950/90 border border-slate-800 hover:border-slate-700 rounded-xl p-3.5 transition cursor-pointer flex gap-3.5 group relative"
            >
              {/* Thumbnail Image */}
              <div className="w-20 h-20 rounded-lg bg-slate-900 overflow-hidden shrink-0 border border-slate-800 relative">
                <img src={log.photoUrl} alt="Intruder capture" className="w-full h-full object-cover group-hover:scale-105 transition" />
                <div className="absolute bottom-1 right-1 bg-black/80 px-1 rounded text-[9px] font-bold text-rose-400">
                  {log.failedAttempts} Fail{log.failedAttempts > 1 ? 's' : ''}
                </div>
              </div>

              {/* Text Meta */}
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-slate-400 font-medium flex items-center gap-1">
                    <Clock size={12} className="text-slate-500" />
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                    log.emailSent ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {log.emailSent ? 'EMAIL DISPATCHED' : 'LOGGED'}
                  </span>
                </div>

                <div className="text-xs font-semibold text-slate-200 truncate flex items-center gap-1">
                  <MapPin size={12} className="text-emerald-400 shrink-0" />
                  <span className="truncate">{log.estimatedAddress}</span>
                </div>

                <div className="text-[11px] text-slate-500 font-mono">
                  GPS: {log.latitude.toFixed(4)}, {log.longitude.toFixed(4)}
                </div>

                <div className="pt-1 flex items-center justify-between text-[11px] text-blue-400 group-hover:text-blue-300">
                  <span>View Details & Map</span>
                  <Eye size={12} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
