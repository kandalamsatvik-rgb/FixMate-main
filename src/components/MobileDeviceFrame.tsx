import React, { useState, useEffect } from 'react';
import { Wifi, Battery, Smartphone, Maximize2, Monitor } from 'lucide-react';

interface MobileDeviceFrameProps {
  children: React.ReactNode;
  isSimulatorMode: boolean;
  onToggleSimulator: () => void;
}

export const MobileDeviceFrame: React.FC<MobileDeviceFrameProps> = ({
  children,
  isSimulatorMode,
  onToggleSimulator
}) => {
  const [time, setTime] = useState('9:41');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  // When in explicit Phone Simulator Mode on desktop screens
  if (isSimulatorMode) {
    return (
      <div className="min-h-screen bg-slate-900/95 flex flex-col items-center justify-start p-2 sm:p-4 selection:bg-indigo-500 selection:text-white">
        {/* Device Switcher Toolbar */}
        <div className="flex items-center justify-between w-full max-w-[430px] mb-2 px-2 text-xs text-slate-300">
          <div className="flex items-center gap-1.5 font-bold">
            <Smartphone className="w-4 h-4 text-indigo-400" />
            <span>Mobile Phone Preview (412px)</span>
          </div>
          <button
            onClick={onToggleSimulator}
            className="flex items-center gap-1.5 px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold transition-all shadow-xs cursor-pointer text-xs active:scale-95"
            title="Switch to full responsive desktop web application view"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Switch to PC / Desktop View</span>
          </button>
        </div>

        {/* Framed Phone Container */}
        <div className="w-full max-w-[430px] bg-slate-50 transition-all duration-300 flex flex-col relative overflow-hidden rounded-[44px] shadow-[0_25px_70px_rgba(0,0,0,0.6)] border-[8px] border-slate-800 ring-1 ring-slate-700/60 min-h-[860px]">
          {/* Simulated Mobile Device Top Notch & Status Bar */}
          <div className="bg-white/95 backdrop-blur-md pt-2 px-5 pb-1 flex items-center justify-between border-b border-slate-100/60 select-none z-30 shrink-0">
            <span className="text-[12px] font-black tracking-tight text-slate-900">{time}</span>

            {/* Dynamic Island */}
            <div className="w-20 h-4 bg-slate-900 rounded-full flex items-center justify-center">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse mr-1" />
              <span className="text-[8px] font-mono text-slate-300 font-bold">FixMate</span>
            </div>

            <div className="flex items-center gap-1.5 text-slate-900">
              <span className="text-[10px] font-extrabold tracking-tighter">5G</span>
              <Wifi className="w-3.5 h-3.5" />
              <Battery className="w-4 h-4 fill-slate-900" />
            </div>
          </div>

          {/* Child App Body */}
          <div className="flex-1 flex flex-col overflow-y-auto relative pb-16">
            {children}
          </div>

          {/* Simulated Bottom Home Indicator Bar */}
          <div className="absolute bottom-1 left-0 right-0 z-50 pointer-events-none flex justify-center pb-1">
            <div className="w-28 h-1 bg-slate-900/30 rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  // Standard Responsive Layout (Full-width desktop web application on desktop, seamless native mobile on phones)
  return (
    <div className="min-h-screen w-full bg-slate-50 text-slate-900 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Responsive Viewport Switcher Banner (Discreetly available on large screens) */}
      <div className="hidden lg:flex items-center justify-between px-6 py-1.5 bg-slate-900 text-slate-300 text-xs border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold text-slate-200">
            FixMate India • Fully Responsive Web Platform (Mobile + Tablet + PC)
          </span>
          <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono">
            Desktop 100% Fluid Width
          </span>
        </div>

        <button
          onClick={onToggleSimulator}
          className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-indigo-300 hover:text-indigo-200 rounded-lg border border-slate-700 font-semibold transition-colors cursor-pointer text-[11px]"
          title="Inspect mobile phone framing"
        >
          <Smartphone className="w-3.5 h-3.5 text-indigo-400" />
          <span>Preview Mobile Phone Frame (412px)</span>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col w-full">
        {children}
      </div>
    </div>
  );
};
