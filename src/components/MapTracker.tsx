import React, { useState, useEffect } from 'react';
import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';
import { MapPin, Navigation, Compass, User, Wrench, Shield, AlertCircle } from 'lucide-react';
import { JobRequest, Worker } from '../types/index.ts';

interface MapTrackerProps {
  activeJob: JobRequest | null;
  workers: Worker[];
  apiKey: string;
  onSelectWorker?: (worker: Worker) => void;
  selectedWorkerId?: string;
  isSimulatingMove?: boolean;
}

export const MapTracker: React.FC<MapTrackerProps> = ({
  activeJob,
  workers,
  apiKey,
  onSelectWorker,
  selectedWorkerId,
  isSimulatingMove = true
}) => {
  const [mapError, setMapError] = useState<boolean>(false);
  const [isClientLoaded, setIsClientLoaded] = useState<boolean>(false);

  // Default coordinates: Bengaluru center (Silicon Valley of India)
  const defaultCenter = { lat: 12.9716, lng: 77.5946 };
  const customerLoc = activeJob?.customerLocation || defaultCenter;
  const workerLoc = activeJob?.workerLocation || (workers[0]?.location ? { lat: workers[0].location.lat, lng: workers[0].location.lng } : defaultCenter);

  useEffect(() => {
    setIsClientLoaded(true);
    const handleQuota = () => {
      setMapError(true);
    };
    window.addEventListener('gmp-quota-exceeded', handleQuota);
    return () => {
      window.removeEventListener('gmp-quota-exceeded', handleQuota);
    };
  }, []);

  return (
    <div className="relative w-full h-full min-h-[380px] bg-slate-900 rounded-2xl overflow-hidden border border-slate-200/80 shadow-inner flex flex-col">
      {/* Map Header Status Overlay */}
      <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-md border border-slate-200/80 pointer-events-auto">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-bold text-slate-800 tracking-tight">
            {activeJob ? (
              activeJob.status === 'en_route' ? (
                <>Pro Dispatched: ETA ~{activeJob.etaMinutes || 12} mins</>
              ) : activeJob.status === 'arrived' ? (
                <>Pro Has Arrived at Doorstep</>
              ) : activeJob.status === 'in_progress' ? (
                <>Work in Progress On-Site</>
              ) : activeJob.status === 'searching' ? (
                <>Broadcasting Request to Nearest Pros...</>
              ) : (
                <>Job Confirmed</>
              )
            ) : (
              <>Live FixMate Pro GPS Radar ({workers.filter(w => w.status === 'available').length} Available)</>
            )}
          </span>
        </div>

        {/* Live coordinate indicator */}
        <div className="hidden sm:flex items-center gap-1.5 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-[11px] font-mono text-slate-300 pointer-events-auto border border-slate-700/60">
          <Compass className="w-3 h-3 text-indigo-400 animate-spin" style={{ animationDuration: '8s' }} />
          <span>12.97° N, 77.59° E (Bengaluru GPS)</span>
        </div>
      </div>

      {/* Main Map Rendering with Google Maps API */}
      {!mapError && apiKey ? (
        <APIProvider apiKey={apiKey}>
          <div className="w-full h-full min-h-[380px]" style={{ minHeight: '380px', height: '100%' }}>
            <Map
              defaultCenter={customerLoc}
              defaultZoom={13}
              mapId="DEMO_MAP_ID"
              internalUsageAttributionIds={["gmp_mcp_codeassist_v1_aistudio"]}
              gestureHandling="greedy"
              disableDefaultUI={false}
              className="w-full h-full"
              style={{ width: '100%', height: '100%' }}
            >
              {/* Customer Pin */}
              {activeJob && (
                <AdvancedMarker position={customerLoc} title="Service Address (You)">
                  <div className="relative flex flex-col items-center group cursor-pointer">
                    <div className="px-2 py-0.5 rounded bg-slate-900 text-white text-[10px] font-bold shadow mb-1 whitespace-nowrap border border-slate-700">
                      Your Location 📍
                    </div>
                    <div className="w-9 h-9 rounded-full bg-indigo-600 border-2 border-white shadow-xl flex items-center justify-center text-white">
                      <User className="w-4 h-4" />
                    </div>
                    <div className="w-2.5 h-2.5 bg-indigo-600 rotate-45 -mt-1 shadow" />
                  </div>
                </AdvancedMarker>
              )}

              {/* Active Assigned Worker Pin */}
              {activeJob?.assignedWorkerId && (
                <AdvancedMarker position={workerLoc} title="Assigned FixMate Pro">
                  <div className="relative flex flex-col items-center cursor-pointer">
                    <div className="px-2 py-0.5 rounded bg-emerald-700 text-white text-[10px] font-bold shadow mb-1 whitespace-nowrap border border-emerald-500 animate-bounce">
                      Pro en Route (ETA {activeJob.etaMinutes || 10}m) 🔧
                    </div>
                    <div className="relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <div className="relative w-10 h-10 rounded-full bg-emerald-600 border-2 border-white shadow-xl flex items-center justify-center text-white">
                        <Wrench className="w-5 h-5" />
                      </div>
                    </div>
                    <div className="w-2.5 h-2.5 bg-emerald-600 rotate-45 -mt-1" />
                  </div>
                </AdvancedMarker>
              )}

              {/* Other Available Workers Markers */}
              {workers.map((worker) => {
                // Don't duplicate if already rendered as active assigned
                if (activeJob?.assignedWorkerId === worker.id) return null;
                const isSelected = selectedWorkerId === worker.id;

                return (
                  <AdvancedMarker
                    key={worker.id}
                    position={{ lat: worker.location.lat, lng: worker.location.lng }}
                    onClick={() => onSelectWorker?.(worker)}
                    title={worker.name}
                  >
                    <div className="flex flex-col items-center cursor-pointer group">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity px-2 py-0.5 rounded bg-slate-800 text-white text-[10px] font-medium shadow mb-1 whitespace-nowrap">
                        {worker.name} ({worker.rating}★)
                      </div>
                      <div
                        className={`w-8 h-8 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white transition-transform group-hover:scale-110 ${
                          isSelected ? 'bg-amber-500 ring-4 ring-amber-300' : 'bg-slate-700'
                        }`}
                      >
                        <Wrench className="w-4 h-4" />
                      </div>
                    </div>
                  </AdvancedMarker>
                );
              })}
            </Map>
          </div>
        </APIProvider>
      ) : (
        /* High-Definition Interactive Vector Radar Fallback */
        <div className="relative w-full h-full min-h-[380px] bg-gradient-to-b from-slate-900 via-slate-800 to-slate-950 flex items-center justify-center overflow-hidden">
          {/* Street Grid pattern */}
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:24px_24px]" />
          
          {/* Radar Circles */}
          <div className="absolute w-[460px] h-[460px] rounded-full border border-indigo-500/20 animate-ping" style={{ animationDuration: '4s' }} />
          <div className="absolute w-80 h-80 rounded-full border border-slate-700/60" />
          <div className="absolute w-52 h-52 rounded-full border border-slate-700/80" />
          <div className="absolute w-24 h-24 rounded-full border border-indigo-500/40" />

          {/* Fallback Notice Badge */}
          <div className="absolute bottom-4 left-4 bg-slate-800/90 backdrop-blur border border-slate-700 px-3 py-1.5 rounded-lg text-xs text-slate-300 flex items-center gap-2">
            <Navigation className="w-3.5 h-3.5 text-indigo-400" />
            <span>Interactive GPS Simulation Grid Active</span>
          </div>

          {/* Customer marker in radar center */}
          <div className="relative z-10 flex flex-col items-center">
            <div className="px-2 py-0.5 rounded bg-indigo-600 text-white text-[10px] font-bold shadow mb-1">
              Your House (Koramangala, Bengaluru)
            </div>
            <div className="w-9 h-9 rounded-full bg-indigo-500 border-2 border-white shadow-xl flex items-center justify-center text-white animate-pulse">
              <User className="w-4 h-4" />
            </div>
          </div>

          {/* Worker moving marker */}
          <div
            className="absolute z-10 flex flex-col items-center transition-all duration-1000"
            style={{
              top: activeJob ? '38%' : '30%',
              left: activeJob ? '58%' : '65%'
            }}
          >
            <div className="px-2 py-0.5 rounded bg-emerald-600 text-white text-[10px] font-bold shadow mb-1 flex items-center gap-1">
              <span>Ramesh K. (Eeco Van)</span>
              <span className="text-emerald-200">1.2 km</span>
            </div>
            <div className="w-9 h-9 rounded-full bg-emerald-500 border-2 border-white shadow-xl flex items-center justify-center text-white">
              <Wrench className="w-4 h-4" />
            </div>
          </div>

          {/* Other workers nearby */}
          {workers.slice(1).map((w, idx) => (
            <div
              key={w.id}
              onClick={() => onSelectWorker?.(w)}
              className="absolute z-10 flex flex-col items-center cursor-pointer group"
              style={{
                top: `${25 + idx * 24}%`,
                left: `${20 + idx * 30}%`
              }}
            >
              <div className="opacity-0 group-hover:opacity-100 transition-opacity px-2 py-0.5 rounded bg-slate-900 text-white text-[10px] shadow mb-1">
                {w.name} ({w.vehicle.type})
              </div>
              <div className="w-7 h-7 rounded-full bg-slate-700 hover:bg-indigo-600 border border-white text-white flex items-center justify-center text-xs shadow transition-transform hover:scale-110">
                <Wrench className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Map Control Info Drawer */}
      <div className="absolute bottom-3 right-3 z-20 flex items-center gap-2">
        <div className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200/80 shadow-md text-xs font-medium text-slate-700 flex items-center gap-2">
          <Shield className="w-3.5 h-3.5 text-indigo-600" />
          <span>Real-time GPS Encrypted</span>
        </div>
      </div>
    </div>
  );
};
