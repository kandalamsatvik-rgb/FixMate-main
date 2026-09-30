import React, { useState } from 'react';
import {
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
  Download,
  Clock,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Shield,
  HelpCircle,
  FileText,
  Globe
} from 'lucide-react';
import { User, JobRequest } from '../types/index.ts';

interface AccountViewProps {
  currentUser: User;
  onSaveProfile: (updated: User) => void;
  onLogout: () => void;
  onOpenDownload: () => void;
  onOpenAuth: () => void;
  onOpenLanguageModal?: () => void;
  currentLanguage?: string;
  jobs: JobRequest[];
  onSelectJob?: (jobId: string) => void;
}

export const AccountView: React.FC<AccountViewProps> = ({
  currentUser,
  onSaveProfile,
  onLogout,
  onOpenDownload,
  onOpenAuth,
  onOpenLanguageModal,
  currentLanguage,
  jobs,
  onSelectJob
}) => {
  const [name, setName] = useState(currentUser.name || '');
  const [phone, setPhone] = useState(currentUser.phone || '');
  const [email, setEmail] = useState(currentUser.email || '');
  const [address, setAddress] = useState(currentUser.address || '');
  const [isLocating, setIsLocating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const hasRealAccount = currentUser.name && currentUser.name !== 'My Account';
  const initials = (currentUser.name || 'ME')
    .split(' ')
    .map((w) => w[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  const handleDetectGPS = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your device.');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const { latitude, longitude } = pos.coords;
        const gpsStr = `GPS (${latitude.toFixed(4)}°N, ${longitude.toFixed(4)}°E)`;
        setAddress((prev) => (prev ? `${prev} [${gpsStr}]` : gpsStr));
      },
      () => {
        setIsLocating(false);
      },
      { timeout: 7000 }
    );
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Please enter your name');
      return;
    }
    const updated: User = {
      ...currentUser,
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      address: address.trim()
    };
    onSaveProfile(updated);
    setSaveSuccess(true);
    setIsEditing(false);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-4 pb-6">
      {/* Responsive Layout Container (Mobile = Stacked, Desktop = 2 Columns) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 items-start">
        {/* Left Column (Desktop 4 or 5 cols): Profile & Settings */}
        <div className="md:col-span-5 lg:col-span-4 space-y-4">
          {/* Account Profile Card */}
          <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-xs">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-indigo-700 flex items-center justify-center text-white font-black text-lg shadow-sm shrink-0">
                  {initials}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-black text-slate-900 text-base truncate">
                      {currentUser.name || 'FixMate Customer'}
                    </h3>
                    {hasRealAccount && (
                      <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-slate-500 truncate">
                    {currentUser.phone || 'Phone number not verified'}
                  </p>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">
                    {currentUser.address || 'Bengaluru, Karnataka'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold shrink-0 transition-colors cursor-pointer"
              >
                {isEditing ? 'Cancel' : 'Edit'}
              </button>
            </div>

            {saveSuccess && (
              <div className="mt-3 p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Profile details saved successfully!</span>
              </div>
            )}

            {/* Edit Form */}
            {isEditing && (
              <form onSubmit={handleSave} className="mt-4 pt-4 border-t border-slate-100 space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full Name"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                      Doorstep Service Address
                    </label>
                    <button
                      type="button"
                      onClick={handleDetectGPS}
                      disabled={isLocating}
                      className="text-[10px] font-bold text-indigo-600 hover:underline flex items-center gap-0.5 cursor-pointer"
                    >
                      <Navigation className="w-3 h-3" />
                      <span>{isLocating ? 'Detecting...' : 'Detect GPS'}</span>
                    </button>
                  </div>
                  <textarea
                    rows={2}
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="House / Flat No, Street, Locality, City"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-xs active:scale-95 transition-transform flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Changes</span>
                </button>
              </form>
            )}
          </div>

          {/* Quick Settings Actions */}
          <div className="grid grid-cols-2 gap-2.5">
            {onOpenLanguageModal && (
              <button
                onClick={onOpenLanguageModal}
                className="p-3.5 bg-white rounded-2xl border border-slate-200/90 text-left hover:border-indigo-300 transition-colors shadow-xs cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                  <Globe className="w-4 h-4" />
                </div>
                <p className="text-xs font-black text-slate-900">App Language</p>
                <p className="text-[11px] text-indigo-600 font-bold uppercase">{currentLanguage || 'English'}</p>
              </button>
            )}

            <button
              onClick={onOpenDownload}
              className="p-3.5 bg-white rounded-2xl border border-slate-200/90 text-left hover:border-indigo-300 transition-colors shadow-xs cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                <Download className="w-4 h-4" />
              </div>
              <p className="text-xs font-black text-slate-900">Install App</p>
              <p className="text-[11px] text-slate-500">PWA Offline</p>
            </button>
          </div>

          {/* Logout Action Button */}
          <button
            onClick={onLogout}
            className="w-full py-3 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-2xl text-xs font-black flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-rose-600" />
            <span>Log Out of FixMate Account</span>
          </button>
        </div>

        {/* Right Column (Desktop 7 or 8 cols): Guarantees & Booking Orders History */}
        <div className="md:col-span-7 lg:col-span-8 space-y-4">
          {/* Policy & Trust Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-4 bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xs flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-black text-slate-900">₹199 Fixed Visiting Policy</h4>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                  Strictly flat ₹199 visiting & diagnostic charge across India. Zero dynamic surge fees.
                </p>
              </div>
            </div>

            <div className="p-4 bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xs flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-black text-slate-900">30-Day Work Warranty</h4>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                  Every completed service comes with guaranteed rework protection & ₹10,000 damage coverage.
                </p>
              </div>
            </div>
          </div>

          {/* Booking Orders History */}
          <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-1 border-b border-slate-100">
              <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 uppercase tracking-wider">
                Recent Service Orders ({jobs.length})
              </h4>
              <span className="text-[11px] text-slate-500 font-semibold">Doorstep Tracking & Receipts</span>
            </div>

            {jobs.length === 0 ? (
              <div className="text-center py-10 space-y-2">
                <Clock className="w-10 h-10 text-slate-300 mx-auto" />
                <p className="text-sm font-bold text-slate-700">No past bookings yet</p>
                <p className="text-xs text-slate-400">Book any service with guaranteed flat ₹199 visiting fee</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {jobs.map((job) => (
                  <div
                    key={job.id}
                    onClick={() => onSelectJob?.(job.id)}
                    className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-indigo-400 flex items-center justify-between transition-all cursor-pointer hover:bg-indigo-50/20"
                  >
                    <div className="min-w-0 pr-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs sm:text-sm font-black text-slate-900">{job.serviceTitle}</span>
                        <span
                          className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase ${
                            job.status === 'completed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : job.status === 'in_progress'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-indigo-100 text-indigo-800'
                          }`}
                        >
                          {job.status.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1 truncate">{job.customerAddress}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">{job.timeSlot}</p>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-xs sm:text-sm font-black text-slate-900">
                        ₹{job.invoice?.total || 285}
                      </div>
                      <span className="text-[10px] text-indigo-600 font-bold flex items-center justify-end gap-0.5 mt-0.5">
                        Track <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
