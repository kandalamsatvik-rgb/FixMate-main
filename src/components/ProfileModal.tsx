import React, { useState, useEffect } from 'react';
import {
  X,
  User as UserIcon,
  Phone,
  Mail,
  MapPin,
  Save,
  CheckCircle2,
  Navigation,
  LogOut,
  ShieldCheck,
  Building,
  FileText
} from 'lucide-react';
import { User } from '../types/index.ts';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onSaveProfile: (updatedUser: User) => void;
  onLogout: () => void;
}

const INDIAN_CITIES = [
  'Bengaluru',
  'Mumbai',
  'Delhi NCR',
  'Hyderabad',
  'Chennai',
  'Pune',
  'Kolkata',
  'Ahmedabad'
];

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSaveProfile,
  onLogout
}) => {
  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [address, setAddress] = useState(currentUser?.address || '');
  const [unitNotes, setUnitNotes] = useState('');
  const [city, setCity] = useState(INDIAN_CITIES[0]);
  const [pincode, setPincode] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [locationCoords, setLocationCoords] = useState<{ lat: number; lng: number }>(
    currentUser?.location || { lat: 12.9716, lng: 77.5946 }
  );
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    setName(currentUser?.name || '');
    setPhone(currentUser?.phone || '');
    setEmail(currentUser?.email || '');
    setAddress(currentUser?.address || '');
    if (currentUser?.location) {
      setLocationCoords(currentUser.location);
    }
  }, [currentUser]);

  if (!isOpen) return null;

  const handleDetectGPS = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setLocationCoords({ lat, lng });
        const gpsStr = `GPS: ${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E (Real Device Location)`;
        setAddress((prev) => (prev ? `${prev} [${gpsStr}]` : gpsStr));
        setIsLocating(false);
      },
      (err) => {
        console.warn('Geolocation error:', err);
        setIsLocating(false);
      },
      { timeout: 9000, enableHighAccuracy: true }
    );
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Please enter your full name');
      return;
    }
    const updated: User = {
      ...currentUser,
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      address: address.trim(),
      location: locationCoords
    };

    onSaveProfile(updated);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 900);
  };

  // Get user initials
  const initials = name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .substring(0, 2)
    .toUpperCase() || 'ME';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center text-white font-black text-base shadow-md">
              {initials}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-extrabold text-base text-white">My Customer Profile</h3>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-1.5 py-0.5 rounded border border-emerald-500/30">
                  Verified Real Profile
                </span>
              </div>
              <p className="text-xs text-slate-400">Manage your real personal contact & service address</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-5 sm:p-6 space-y-4 overflow-y-auto">
          {savedSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Your real profile has been updated and saved to your device!
            </div>
          )}

          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Your Full Name <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Rahul Sharma"
                className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-600 focus:outline-none"
              />
            </div>
          </div>

          {/* Mobile Number & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Mobile Number <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +91 98765 43210"
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. rahul@example.com"
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Service Delivery Address */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Doorstep Service Address <span className="text-rose-500">*</span>
              </label>
              <button
                type="button"
                onClick={handleDetectGPS}
                disabled={isLocating}
                className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 hover:underline"
              >
                <Navigation className={`w-3 h-3 ${isLocating ? 'animate-spin' : ''}`} />
                {isLocating ? 'Detecting GPS...' : '📍 Use Live GPS'}
              </button>
            </div>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <textarea
                rows={3}
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter Flat / House No., Apartment or Society Name, Street / Cross Road, Area / Locality"
                className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-600 focus:outline-none"
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Workers dispatched to your location will navigate directly to this address.
            </p>
          </div>

          {/* Unit / Gate Directions */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Landmark / Gate & Bell Directions (Optional)
            </label>
            <div className="relative">
              <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={unitNotes}
                onChange={(e) => setUnitNotes(e.target.value)}
                placeholder="e.g. 3rd floor, door on the right, near ICICI ATM"
                className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-600 focus:outline-none"
              />
            </div>
          </div>

          {/* GPS Coordinates readout */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs text-slate-600">
            <span className="font-semibold">GPS Coordinates:</span>
            <span className="font-mono text-slate-900 font-bold">
              {locationCoords.lat.toFixed(4)}°N, {locationCoords.lng.toFixed(4)}°E
            </span>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center gap-3">
            <button
              type="submit"
              className="flex-1 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-md shadow-indigo-200 transition-all flex items-center justify-center gap-2 hover:scale-[1.01]"
            >
              <Save className="w-4 h-4" />
              Save My Real Details
            </button>
            <button
              type="button"
              onClick={() => {
                onLogout();
                onClose();
              }}
              className="py-3 px-3.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl border border-rose-200 transition-colors flex items-center gap-1.5 cursor-pointer hover:scale-[1.02] active:scale-95"
              title="Sign Out / Switch Account"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-600" />
              <span>Log Out</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
