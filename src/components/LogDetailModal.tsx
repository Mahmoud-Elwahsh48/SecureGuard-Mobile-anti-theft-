import React, { useEffect, useRef } from 'react';
import { IntruderLog } from '../types';
import { X, MapPin, Mail, Clock, Globe, ShieldAlert, Navigation, ExternalLink } from 'lucide-react';
import L from 'leaflet';

interface LogDetailModalProps {
  log: IntruderLog | null;
  onClose: () => void;
}

export const LogDetailModal: React.FC<LogDetailModalProps> = ({ log, onClose }) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!log || !mapContainerRef.current) return;

    // Cleanup existing Leaflet map instance if present
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    try {
      const map = L.map(mapContainerRef.current).setView([log.latitude, log.longitude], 15);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map);

      // Custom pulsing red pin icon for intruder location
      const customIcon = L.divIcon({
        className: 'custom-map-pin',
        html: `<div style="background-color: #ef4444; width: 18px; height: 18px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 12px rgba(239, 68, 68, 0.8);"></div>`,
        iconSize: [18, 18],
        iconAnchor: [9, 9],
      });

      L.marker([log.latitude, log.longitude], { icon: customIcon })
        .addTo(map)
        .bindPopup(`<b>Intruder Alert Spot</b><br/>${log.estimatedAddress}`)
        .openPopup();

      mapInstanceRef.current = map;
    } catch (e) {
      console.warn('Leaflet map load warning:', e);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [log]);

  if (!log) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-950 border border-slate-800 rounded-3xl max-w-xl w-full p-6 text-slate-100 shadow-2xl relative space-y-5 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-100 bg-slate-900 rounded-full"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <ShieldAlert size={22} className="text-rose-400" />
          <div>
            <h3 className="font-bold text-slate-100 text-base">Intruder Snapshot Detail</h3>
            <p className="text-xs text-slate-400">Captured at {new Date(log.timestamp).toLocaleString()}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Photo Frame */}
          <div className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 relative aspect-square">
            <img src={log.photoUrl} alt="Captured Intruder" className="w-full h-full object-cover" />
            <div className="absolute top-3 left-3 bg-rose-600/90 text-white font-bold text-[10px] px-2 py-1 rounded shadow">
              {log.failedAttempts} Failed Unlock Attempt(s)
            </div>
          </div>

          {/* Location Map View */}
          <div className="space-y-2 flex flex-col">
            <div className="text-xs font-semibold text-slate-300 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <MapPin size={14} className="text-emerald-400" />
                <span>Geofenced Location Map</span>
              </span>
              <a
                href={`https://maps.google.com/?q=${log.latitude},${log.longitude}`}
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-blue-400 hover:underline flex items-center gap-1"
              >
                <span>Google Maps</span>
                <ExternalLink size={10} />
              </a>
            </div>

            <div
              ref={mapContainerRef}
              className="w-full h-44 rounded-2xl border border-slate-800 overflow-hidden bg-slate-900 shrink-0"
            />

            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-xs space-y-1 mt-auto">
              <div className="text-slate-400 font-medium">Estimated Street Address:</div>
              <div className="text-slate-100 font-semibold">{log.estimatedAddress}</div>
            </div>
          </div>
        </div>

        {/* Email Status Footer Info */}
        <div className="bg-slate-900/90 p-3.5 rounded-xl border border-slate-800 text-xs flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Mail size={16} className="text-sky-400" />
            <div>
              <span className="text-slate-400">Alert Email Status: </span>
              <span className="font-semibold text-sky-300">{log.emailRecipient}</span>
            </div>
          </div>
          <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full text-[10px] font-mono">
            DISPATCH CONFIRMED
          </span>
        </div>
      </div>
    </div>
  );
};
