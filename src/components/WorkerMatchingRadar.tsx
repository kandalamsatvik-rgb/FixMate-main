import React, { useState, useEffect } from 'react';
import { Radio, Wrench, ShieldCheck, CheckCircle2, Clock, MapPin, UserCheck, ArrowRight } from 'lucide-react';
import { Worker, JobRequest } from '../types/index.ts';

interface WorkerMatchingRadarProps {
  job: JobRequest;
  availableWorkers: Worker[];
  onWorkerAccepted: (worker: Worker) => void;
  onSwitchToWorkerMode: () => void;
}

export const WorkerMatchingRadar: React.FC<WorkerMatchingRadarProps> = ({
  job,
  availableWorkers,
  onWorkerAccepted,
  onSwitchToWorkerMode
}) => {
  const [countdown, setCountdown] = useState<number>(4);
  const [targetedWorker, setTargetedWorker] = useState<Worker | null>(null);

  useEffect(() => {
    // Filter matching workers by category or fall back to any available
    const matching = availableWorkers.filter((w) =>
      w.categories.includes(job.categoryId)
    );
    const candidatePool = matching.length > 0 ? matching : availableWorkers;
    // Pick randomly as requested: "after that randomly place the request to worker"
    const randomPick = candidatePool[Math.floor(Math.random() * candidatePool.length)] || availableWorkers[0];
    setTargetedWorker(randomPick);
  }, [job, availableWorkers]);

  useEffect(() => {
    if (countdown <= 0 && targetedWorker) {
      // Audio chime using Web Audio API
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
        osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.1); // A5
        gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.4);
      } catch (e) {
        // ignore audio failure in silent environments
      }

      onWorkerAccepted(targetedWorker);
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown, targetedWorker, onWorkerAccepted]);

  if (!targetedWorker) return null;

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 text-center space-y-4 max-w-md mx-auto">
      {/* Radar Animation */}
      <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20 animate-ping" />
        <div className="absolute w-20 h-20 rounded-full border-2 border-indigo-500/40 animate-pulse" />
        <div className="w-14 h-14 rounded-full bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-300">
          <Radio className="w-7 h-7 animate-spin" style={{ animationDuration: '4s' }} />
        </div>
      </div>

      <div className="space-y-1.5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200">
          <Clock className="w-3.5 h-3.5 animate-spin" />
          <span>Dispatching Nearest Active Pro...</span>
        </div>
        <h3 className="text-base font-black text-slate-900">
          Broadcasting Job: {job.serviceTitle}
        </h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          FixMate smart dispatcher pinged qualified pro in your zone. Auto-accepting in {countdown}s.
        </p>
      </div>

      {/* Targeted Worker Card */}
      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-left flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <img
            src={targetedWorker.avatar}
            alt={targetedWorker.name}
            className="w-11 h-11 rounded-xl object-cover ring-2 ring-indigo-500/30 shrink-0"
          />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-900 text-xs truncate">{targetedWorker.name}</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded shrink-0">
                {targetedWorker.rating} ★
              </span>
            </div>
            <p className="text-[11px] text-slate-500 truncate">{targetedWorker.vehicle.model}</p>
            <p className="text-[10px] text-indigo-600 font-bold">~2.4 km away • ETA 10-15m</p>
          </div>
        </div>

        <button
          onClick={() => onWorkerAccepted(targetedWorker)}
          className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs flex items-center gap-1 shrink-0 active:scale-95 transition-transform"
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Accept</span>
        </button>
      </div>

      {/* Manual role simulation switch */}
      <div className="pt-2 border-t border-slate-100">
        <button
          onClick={onSwitchToWorkerMode}
          className="text-xs text-slate-500 hover:text-indigo-600 font-semibold underline"
        >
          Simulate being the Pro: Switch to Worker screen to accept manually
        </button>
      </div>
    </div>
  );
};
