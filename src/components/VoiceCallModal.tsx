import React, { useState, useEffect } from 'react';
import { PhoneOff, Mic, MicOff, Volume2, VolumeX, Shield, Radio } from 'lucide-react';
import { Worker, JobRequest, UserRole } from '../types/index.ts';

interface VoiceCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  worker: Worker;
  job: JobRequest;
  currentRole: UserRole;
}

export const VoiceCallModal: React.FC<VoiceCallModalProps> = ({
  isOpen,
  onClose,
  worker,
  job,
  currentRole
}) => {
  const [callState, setCallState] = useState<'connecting' | 'connected'>('connecting');
  const [seconds, setSeconds] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(true);

  useEffect(() => {
    if (!isOpen) return;
    const connectTimer = setTimeout(() => {
      setCallState('connected');
    }, 1800);

    return () => clearTimeout(connectTimer);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || callState !== 'connected') return;
    const interval = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen, callState]);

  if (!isOpen) return null;

  const formatDuration = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const displayName = currentRole === 'customer' ? worker.name : job.customerName;
  const avatarUrl =
    currentRole === 'customer'
      ? worker.avatar
      : 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="relative w-full max-w-sm bg-gradient-to-b from-slate-900 to-slate-950 rounded-3xl p-6 text-white text-center shadow-2xl border border-slate-800 space-y-6">
        {/* Top security tag */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-[11px] text-slate-300">
          <Shield className="w-3 h-3 text-emerald-400" />
          <span>In-App FixMate Secure VoIP</span>
        </div>

        {/* Avatar with pulsing wave */}
        <div className="relative w-28 h-28 mx-auto">
          {callState === 'connected' && (
            <div className="absolute inset-0 rounded-full border-4 border-emerald-500/40 animate-ping" />
          )}
          <img
            src={avatarUrl}
            alt={displayName}
            className="w-full h-full rounded-full object-cover ring-4 ring-slate-800 shadow-2xl"
          />
        </div>

        {/* Identity & Status */}
        <div className="space-y-1">
          <h3 className="text-xl font-black text-white">{displayName}</h3>
          <p className="text-xs text-slate-400">
            {currentRole === 'customer'
              ? `FixMate Certified Pro • ${worker.vehicle.model}`
              : `Customer • ${job.serviceTitle}`}
          </p>
          <div className="pt-2 text-xs font-mono font-bold tracking-wider text-emerald-400">
            {callState === 'connecting' ? (
              <span className="flex items-center justify-center gap-1 text-amber-400 animate-pulse">
                <Radio className="w-3.5 h-3.5" /> Establishing VoIP Line...
              </span>
            ) : (
              <span>Connected • {formatDuration(seconds)}</span>
            )}
          </div>
        </div>

        {/* Audio Wave Visualizer Simulation */}
        <div className="flex items-center justify-center gap-1.5 h-8">
          {[40, 80, 55, 95, 70, 30, 85, 60, 45, 90].map((h, i) => (
            <div
              key={i}
              className={`w-1 rounded-full bg-emerald-500/80 transition-all ${
                callState === 'connected' ? 'animate-pulse' : 'opacity-30'
              }`}
              style={{
                height: callState === 'connected' ? `${Math.max(10, (h * (seconds % 5 + 1)) / 4)}px` : '8px',
                animationDelay: `${i * 0.1}s`
              }}
            />
          ))}
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-center gap-4 pt-2">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`p-3.5 rounded-full transition-colors ${
              isMuted ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* End Call Button */}
          <button
            onClick={onClose}
            className="p-4 rounded-full bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-600/40 transition-transform hover:scale-105"
            title="End Call"
          >
            <PhoneOff className="w-6 h-6" />
          </button>

          <button
            onClick={() => setIsSpeaker(!isSpeaker)}
            className={`p-3.5 rounded-full transition-colors ${
              isSpeaker ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
            title={isSpeaker ? 'Speaker On' : 'Speaker Off'}
          >
            {isSpeaker ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  );
};
