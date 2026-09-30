import React, { useState } from 'react';
import {
  MapPin,
  Crosshair,
  Check,
  X,
  Search,
  Building2,
  Navigation
} from 'lucide-react';

interface LocationPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentAddress: string;
  onSelectAddress: (address: string, coords: { lat: number; lng: number }) => void;
}

const POPULAR_CITIES = [
  { name: 'Koramangala, Bengaluru', lat: 12.9352, lng: 77.6245, state: 'Karnataka' },
  { name: 'Indiranagar, Bengaluru', lat: 12.9784, lng: 77.6408, state: 'Karnataka' },
  { name: 'Bandra West, Mumbai', lat: 19.0596, lng: 72.8295, state: 'Maharashtra' },
  { name: 'Connaught Place, New Delhi', lat: 28.6315, lng: 77.2167, state: 'Delhi NCR' },
  { name: 'Hitec City, Hyderabad', lat: 17.4474, lng: 78.3762, state: 'Telangana' },
  { name: 'Koregaon Park, Pune', lat: 18.5362, lng: 73.8940, state: 'Maharashtra' },
  { name: 'T. Nagar, Chennai', lat: 13.0418, lng: 80.2341, state: 'Tamil Nadu' }
];

export const LocationPickerModal: React.FC<LocationPickerModalProps> = ({
  isOpen,
  onClose,
  currentAddress,
  onSelectAddress
}) => {
  const [search, setSearch] = useState('');
  const [isLocating, setIsLocating] = useState(false);

  if (!isOpen) return null;

  const filtered = POPULAR_CITIES.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.state.toLowerCase().includes(search.toLowerCase())
  );

  const handleUseCurrentGPS = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your device.');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const { latitude, longitude } = pos.coords;
        onSelectAddress(
          `GPS Location (${latitude.toFixed(4)}°N, ${longitude.toFixed(4)}°E)`,
          { lat: latitude, lng: longitude }
        );
        onClose();
      },
      () => {
        setIsLocating(false);
        // Fallback to Koramangala
        onSelectAddress('Koramangala 4th Block, Bengaluru', { lat: 12.9352, lng: 77.6245 });
        onClose();
      },
      { timeout: 7000 }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-100 max-h-[85vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-200">
        {/* Mobile Grab Handle */}
        <div className="pt-3 pb-1 flex justify-center sm:hidden">
          <div className="w-12 h-1.5 bg-slate-300 rounded-full" />
        </div>

        {/* Header */}
        <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-indigo-600" />
            <h3 className="font-extrabold text-slate-900 text-base">Select Service Location</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3 overflow-y-auto">
          {/* GPS Button */}
          <button
            onClick={handleUseCurrentGPS}
            disabled={isLocating}
            className="w-full p-3.5 rounded-2xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200/80 text-indigo-950 font-bold text-xs flex items-center justify-between transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                <Crosshair className={`w-4 h-4 ${isLocating ? 'animate-spin' : ''}`} />
              </div>
              <div className="text-left">
                <p className="text-xs font-extrabold text-indigo-950">Use Current GPS Location</p>
                <p className="text-[11px] text-indigo-700 font-normal">Detect automatically for fast arrival</p>
              </div>
            </div>
            <span className="text-[11px] text-indigo-600 font-extrabold">Detect</span>
          </button>

          {/* Search box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search area, landmark or city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          {/* City list */}
          <div className="space-y-1 pt-1">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">
              Popular Service Hubs
            </p>
            {filtered.map((city) => {
              const isSelected = currentAddress.toLowerCase().includes(city.name.toLowerCase().split(',')[0]);
              return (
                <button
                  key={city.name}
                  onClick={() => {
                    onSelectAddress(city.name, { lat: city.lat, lng: city.lng });
                    onClose();
                  }}
                  className={`w-full p-3 rounded-xl text-left flex items-center justify-between transition-colors ${
                    isSelected ? 'bg-slate-100 font-bold' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-slate-900">{city.name}</p>
                      <p className="text-[10px] text-slate-500">{city.state} • ₹99 Visiting Hub</p>
                    </div>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-emerald-600 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
