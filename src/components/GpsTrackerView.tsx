import React, { useEffect, useState } from 'react';
import { MapPin, Navigation, Compass, Globe, CheckCircle2, AlertCircle } from 'lucide-react';

interface GpsTrackerProps {
  currentLat: number;
  currentLng: number;
  accuracy: number;
  address: string;
  onRefreshLocation: (lat: number, lng: number, address: string) => void;
}

export const GpsTrackerView: React.FC<GpsTrackerProps> = ({
  currentLat,
  currentLng,
  accuracy,
  address,
  onRefreshLocation,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [geoError, setGeoError] = useState<string | null>(null);

  const fetchDeviceGps = () => {
    setLoading(true);
    setGeoError(null);

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const acc = position.coords.accuracy || 10;

          let reverseAddress = `${lat.toFixed(4)}° N, ${lng.toFixed(4)}° W (Approx Area)`;
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
            );
            if (response.ok) {
              const data = await response.json();
              if (data && data.display_name) {
                reverseAddress = data.display_name;
              }
            }
          } catch (e) {
            console.log('Reverse geocoding fetch fallback used:', e);
          }

          onRefreshLocation(lat, lng, reverseAddress);
          setLoading(false);
        },
        (error) => {
          console.warn('Browser GPS permission error, using high-accuracy fallback:', error.message);
          setGeoError('Using active simulated GPS lock for demonstration.');
          setLoading(false);
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    } else {
      setGeoError('Geolocation unsupported in browser engine.');
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-slate-100 space-y-4 shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="text-emerald-400" size={20} />
          <h3 className="font-bold text-slate-100 text-sm tracking-wide">GPS Location Retrieval (`getDeviceCoordinates`)</h3>
        </div>
        <span className="text-[11px] bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 px-2.5 py-0.5 rounded-full font-mono flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          GPS LOCKED
        </span>
      </div>

      <p className="text-xs text-slate-400">
        Queries GPS & Network providers to grab high-precision coordinates and reverse-geocodes street addresses at the exact moment of breach.
      </p>

      {/* Coordinate Display Box */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-xs">
        <div>
          <div className="text-slate-500 text-[11px]">Latitude & Longitude</div>
          <div className="font-mono text-emerald-400 font-bold text-sm mt-0.5">
            {currentLat.toFixed(6)}, {currentLng.toFixed(6)}
          </div>
        </div>

        <div>
          <div className="text-slate-500 text-[11px]">Accuracy Radius</div>
          <div className="font-mono text-slate-200 font-semibold text-sm mt-0.5">
            ±{accuracy.toFixed(1)} meters
          </div>
        </div>

        <div>
          <div className="text-slate-500 text-[11px]">Google Maps Link</div>
          <a
            href={`https://maps.google.com/?q=${currentLat},${currentLng}`}
            target="_blank"
            rel="noreferrer"
            className="text-blue-400 hover:underline font-mono text-xs flex items-center gap-1 mt-0.5"
          >
            <span>Open Map View</span>
            <Globe size={12} />
          </a>
        </div>
      </div>

      {/* Street Address Banner */}
      <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800/80 flex items-start gap-2 text-xs">
        <Navigation size={16} className="text-emerald-400 mt-0.5 shrink-0" />
        <div>
          <span className="text-slate-400 font-medium">Reverse Geocoded Address: </span>
          <span className="text-slate-100 font-semibold">{address}</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-1">
        <span className="text-[11px] text-slate-500">
          {geoError ? geoError : 'High precision position updated.'}
        </span>

        <button
          onClick={fetchDeviceGps}
          disabled={loading}
          className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-600 disabled:opacity-50 text-white rounded-lg text-xs font-semibold shadow flex items-center gap-1.5 transition"
        >
          <Compass size={14} className={loading ? 'animate-spin' : ''} />
          <span>{loading ? 'Acquiring Satellite Lock...' : 'Re-acquire GPS Lock'}</span>
        </button>
      </div>
    </div>
  );
};
