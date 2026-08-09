import React, { useState } from 'react';
import { Shield, Smartphone, KeyRound, Camera, MapPin, Mail, Power, Settings, HelpCircle, CheckCircle2 } from 'lucide-react';
import { SystemStatusCard } from './components/SystemStatusCard';
import { SilentCameraModal } from './components/SilentCameraModal';
import { GpsTrackerView } from './components/GpsTrackerView';
import { EmailDispatcherCard } from './components/EmailDispatcherCard';
import { FakePowerMenuOverlay } from './components/FakePowerMenuOverlay';
import { PermissionsSettingsPanel } from './components/PermissionsSettingsPanel';
import { LockScreenSimulatorModal } from './components/LockScreenSimulatorModal';
import { IntruderLogsHistory } from './components/IntruderLogsHistory';
import { LogDetailModal } from './components/LogDetailModal';
import { DEFAULT_SETTINGS, INITIAL_PERMISSIONS, MOCK_INTRUDER_LOGS } from './mockData';
import { IntruderLog, PermissionStatus, SecuritySettings } from './types';

export default function App() {
  const [settings, setSettings] = useState<SecuritySettings>(DEFAULT_SETTINGS);
  const [permissions, setPermissions] = useState<PermissionStatus>(INITIAL_PERMISSIONS);
  const [logs, setLogs] = useState<IntruderLog[]>(MOCK_INTRUDER_LOGS);

  // Runtime lock state
  const [failedCount, setFailedCount] = useState<number>(1);
  const [currentLat, setCurrentLat] = useState<number>(37.774929);
  const [currentLng, setCurrentLng] = useState<number>(-122.419416);
  const [currentAddress, setCurrentAddress] = useState<string>('742 Market Street, San Francisco, CA 94103');
  const [latestPhoto, setLatestPhoto] = useState<string>(
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'
  );

  // UI Modals & Tab State
  const [activeTab, setActiveTab] = useState<'dashboard' | 'camera' | 'gps' | 'email' | 'settings'>('dashboard');
  const [isSimulatorOpen, setIsSimulatorOpen] = useState<boolean>(false);
  const [isFakePowerOpen, setIsFakePowerOpen] = useState<boolean>(false);
  const [selectedLog, setSelectedLog] = useState<IntruderLog | null>(null);
  const [bannerAlert, setBannerAlert] = useState<string | null>(null);

  const handleArmToggle = () => {
    setSettings((prev) => ({ ...prev, isArmed: !prev.isArmed }));
  };

  const handleFailedUnlockAttempt = () => {
    const nextFailCount = failedCount + 1;
    setFailedCount(nextFailCount);

    if (settings.isArmed && nextFailCount >= settings.attemptThreshold) {
      // Trigger CrookCatcher Security Protocol Sequence
      const newLog: IntruderLog = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString(),
        failedAttempts: nextFailCount,
        photoUrl: latestPhoto,
        latitude: currentLat,
        longitude: currentLng,
        accuracy: 7.2,
        estimatedAddress: currentAddress,
        emailSent: settings.enableEmailAlerts,
        emailRecipient: settings.alertEmail,
        deviceStatus: 'Locked',
        notes: `Automated detection trigger on ${nextFailCount} failed unlock attempts.`,
      };

      setLogs((prev) => [newLog, ...prev]);
      setBannerAlert(
        `🚨 CrookCatcher Security Triggered! Captured intruder snapshot, locked GPS (${currentLat.toFixed(4)}, ${currentLng.toFixed(4)}), and sent emergency alert to ${settings.alertEmail}`
      );

      // Reset fail counter after trigger action
      setFailedCount(0);
    }
  };

  const handleCorrectUnlock = () => {
    setFailedCount(0);
    setIsSimulatorOpen(false);
    setBannerAlert('✅ Correct PIN entered. Lock screen disarmed and failure counter reset.');
    setTimeout(() => setBannerAlert(null), 3500);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-500 selection:text-white pb-16">
      {/* Top Header Bar */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-lg shadow-blue-900/30">
              <Shield size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black tracking-tight text-slate-100">CrookCatcher</h1>
                <span className="text-[10px] bg-slate-800 text-blue-400 font-mono font-bold px-2 py-0.5 rounded-full border border-blue-500/20">
                  ANDROID ANTI-THEFT
                </span>
              </div>
              <p className="text-xs text-slate-400">Intruder Detection & Device Security System</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsFakePowerOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold transition"
            >
              <Power size={14} className="text-rose-400" />
              <span>Fake Power Menu</span>
            </button>

            <button
              onClick={() => setIsSimulatorOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-md transition"
            >
              <KeyRound size={14} />
              <span>Test Lock Screen</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-4 pt-6 space-y-6">
        {/* Banner Alert Notification */}
        {bannerAlert && (
          <div className="bg-gradient-to-r from-rose-950/80 via-slate-900 to-slate-950 border border-rose-500/40 p-4 rounded-2xl text-xs text-rose-200 flex items-start justify-between gap-3 shadow-xl animate-fadeIn">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 size={18} className="text-emerald-400 shrink-0 mt-0.5" />
              <div className="leading-relaxed font-medium">{bannerAlert}</div>
            </div>
            <button
              onClick={() => setBannerAlert(null)}
              className="text-slate-400 hover:text-white font-bold p-1 shrink-0"
            >
              ✕
            </button>
          </div>
        )}

        {/* Core Overview System Card */}
        <SystemStatusCard
          permissions={permissions}
          settings={settings}
          failedCount={failedCount}
          logsCount={logs.length}
          onOpenSimulator={() => setIsSimulatorOpen(true)}
          onOpenFakePowerMenu={() => setIsFakePowerOpen(true)}
          onArmToggle={handleArmToggle}
        />

        {/* Tab Navigation Menu */}
        <div className="flex items-center gap-2 border-b border-slate-800 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'dashboard'
                ? 'bg-blue-600 text-white shadow'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <Shield size={14} />
            <span>Intruder Logs ({logs.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('camera')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'camera'
                ? 'bg-blue-600 text-white shadow'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <Camera size={14} />
            <span>Silent Camera Lens</span>
          </button>

          <button
            onClick={() => setActiveTab('gps')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'gps'
                ? 'bg-blue-600 text-white shadow'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <MapPin size={14} />
            <span>GPS Coordinate Lock</span>
          </button>

          <button
            onClick={() => setActiveTab('email')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'email'
                ? 'bg-blue-600 text-white shadow'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <Mail size={14} />
            <span>Email Alert Dispatcher</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'settings'
                ? 'bg-blue-600 text-white shadow'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <Settings size={14} />
            <span>Permissions & Admin</span>
          </button>
        </div>

        {/* Active Tab View Rendering */}
        {activeTab === 'dashboard' && (
          <IntruderLogsHistory
            logs={logs}
            onSelectLog={(log) => setSelectedLog(log)}
            onClearLogs={() => setLogs([])}
          />
        )}

        {activeTab === 'camera' && (
          <SilentCameraModal
            onCaptureSnapshot={(photoUrl) => setLatestPhoto(photoUrl)}
            isTriggering={false}
          />
        )}

        {activeTab === 'gps' && (
          <GpsTrackerView
            currentLat={currentLat}
            currentLng={currentLng}
            accuracy={8.0}
            address={currentAddress}
            onRefreshLocation={(lat, lng, addr) => {
              setCurrentLat(lat);
              setCurrentLng(lng);
              setCurrentAddress(addr);
            }}
          />
        )}

        {activeTab === 'email' && (
          <EmailDispatcherCard
            settings={settings}
            latestPhotoUrl={latestPhoto}
            latitude={currentLat}
            longitude={currentLng}
            address={currentAddress}
            failedCount={failedCount}
          />
        )}

        {activeTab === 'settings' && (
          <PermissionsSettingsPanel
            permissions={permissions}
            settings={settings}
            onUpdatePermissions={(p) => setPermissions(p)}
            onUpdateSettings={(s) => setSettings(s)}
          />
        )}
      </main>

      {/* Modals & Overlays */}
      <LockScreenSimulatorModal
        isOpen={isSimulatorOpen}
        onClose={() => setIsSimulatorOpen(false)}
        settings={settings}
        failedCount={failedCount}
        onFailedAttempt={handleFailedUnlockAttempt}
        onCorrectUnlock={handleCorrectUnlock}
      />

      <FakePowerMenuOverlay
        isOpen={isFakePowerOpen}
        onClose={() => setIsFakePowerOpen(false)}
        onTriggerFakeOff={() => {
          setBannerAlert('🛡️ Fake Power Shield activated. Device turned off visually to intruder while maintaining background surveillance.');
        }}
      />

      <LogDetailModal
        log={selectedLog}
        onClose={() => setSelectedLog(null)}
      />
    </div>
  );
}
