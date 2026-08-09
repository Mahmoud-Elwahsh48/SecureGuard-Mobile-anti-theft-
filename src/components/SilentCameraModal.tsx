import React, { useState, useRef, useEffect } from 'react';
import { Camera, RefreshCw, CheckCircle2, AlertCircle, Video, Lock, ShieldAlert } from 'lucide-react';

interface SilentCameraProps {
  onCaptureSnapshot: (photoDataUrl: string) => void;
  isTriggering: boolean;
}

export const SilentCameraModal: React.FC<SilentCameraProps> = ({ onCaptureSnapshot, isTriggering }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [streamActive, setStreamActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      setCameraError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setStreamActive(true);
      }
    } catch (err: any) {
      console.warn('Live camera access warning (falling back to generated intruder portrait):', err);
      setCameraError('Browser live camera unavailable or blocked. Using silent fallback photo generator.');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
    }
  };

  const capturePhoto = () => {
    if (streamActive && videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        // Add subtle watermarking timestamp simulation like real security camera
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.fillRect(10, canvas.height - 35, 280, 25);
        ctx.fillStyle = '#10B981';
        ctx.font = '12px monospace';
        ctx.fillText(`CROOKCATCHER SILENT CAM | ${new Date().toLocaleTimeString()}`, 15, canvas.height - 18);

        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setCapturedPhoto(dataUrl);
        onCaptureSnapshot(dataUrl);
        return;
      }
    }

    // Fallback image if web camera is disabled or blocked in iframe
    const fallbackImages = [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80'
    ];
    const chosenFallback = fallbackImages[Math.floor(Math.random() * fallbackImages.length)];
    setCapturedPhoto(chosenFallback);
    onCaptureSnapshot(chosenFallback);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-slate-100 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Camera className="text-purple-400" size={20} />
          <h3 className="font-bold text-slate-100 text-sm tracking-wide">Silent Front Camera (`captureIntruderPhoto`)</h3>
        </div>
        <span className="text-[11px] bg-purple-500/10 text-purple-300 border border-purple-500/20 px-2 py-0.5 rounded-full font-mono">
          BACKGROUND SNAPSHOT
        </span>
      </div>

      <p className="text-xs text-slate-400">
        Captures a silent, no-flash photo from the front sensor as soon as lock failures breach the specified threshold.
      </p>

      {/* Camera Live View / Video feed hidden element */}
      <div className="relative overflow-hidden bg-slate-950 rounded-xl border border-slate-800 aspect-video flex items-center justify-center">
        <video
          ref={videoRef}
          playsInline
          muted
          className={`w-full h-full object-cover ${streamActive ? 'block' : 'hidden'}`}
        />

        {!streamActive && !capturedPhoto && (
          <div className="p-6 text-center space-y-2">
            <Lock size={32} className="mx-auto text-slate-600 animate-pulse" />
            <p className="text-xs text-slate-400">
              {cameraError || 'Front Camera ready for silent background trigger.'}
            </p>
          </div>
        )}

        {capturedPhoto && (
          <div className="relative w-full h-full">
            <img src={capturedPhoto} alt="Intruder Snapshot" className="w-full h-full object-cover" />
            <div className="absolute top-2 left-2 bg-rose-600/90 text-white text-[10px] font-bold px-2 py-1 rounded shadow flex items-center gap-1">
              <ShieldAlert size={12} /> INTRUDER CAPTURED SILENTLY
            </div>
          </div>
        )}

        <canvas ref={canvasRef} className="hidden" />
      </div>

      <div className="flex items-center justify-between pt-1">
        <button
          onClick={startCamera}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition"
        >
          <RefreshCw size={12} />
          <span>Reset Camera Lens</span>
        </button>

        <button
          onClick={capturePhoto}
          className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-semibold shadow flex items-center gap-1.5 transition"
        >
          <Camera size={14} />
          <span>Manual Test Snapshot</span>
        </button>
      </div>
    </div>
  );
};
