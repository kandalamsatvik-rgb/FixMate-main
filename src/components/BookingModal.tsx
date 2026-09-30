import React, { useState, useEffect } from 'react';
import {
  X,
  MapPin,
  Clock,
  Sparkles,
  AlertCircle,
  CheckCircle,
  Camera,
  Navigation,
  ChevronRight,
  ChevronLeft,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  Info,
  User as UserIcon,
  Phone,
  Crosshair
} from 'lucide-react';
import { ServiceCategory, JobRequest, User } from '../types/index.ts';
import { TIME_SLOTS } from '../data/mockData.ts';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: ServiceCategory | null;
  currentUser: User;
  prefillIssue?: string;
  onSubmitBooking: (booking: Omit<JobRequest, 'id' | 'status' | 'createdAt' | 'invoice'>) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  category,
  currentUser,
  prefillIssue,
  onSubmitBooking
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [description, setDescription] = useState(
    prefillIssue
      ? `Issue: ${prefillIssue}. Please inspect and fix as soon as possible.`
      : ''
  );
  const [selectedIssues, setSelectedIssues] = useState<string[]>(
    prefillIssue ? [prefillIssue] : []
  );
  const [urgency, setUrgency] = useState<'standard' | 'emergency_30min' | 'scheduled'>('standard');

  // Date & Slot State
  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrowDate = new Date(Date.now() + 86400000);
  const tomorrowStr = tomorrowDate.toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [selectedSlot, setSelectedSlot] = useState<string>(TIME_SLOTS[0]?.label || 'Morning (9 AM - 12 PM)');

  // Customer Contact & Real Address
  const [customerName, setCustomerName] = useState<string>(currentUser?.name || '');
  const [customerPhone, setCustomerPhone] = useState<string>(currentUser?.phone || '');
  const [address, setAddress] = useState<string>(currentUser?.address || '');
  const [unitNotes, setUnitNotes] = useState<string>('');
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number }>(
    currentUser?.location || {
      lat: 12.9716,
      lng: 77.5946
    }
  );
  const [isLocating, setIsLocating] = useState<boolean>(false);

  useEffect(() => {
    if (currentUser?.address && !address) {
      setAddress(currentUser.address);
    }
    if (currentUser?.name && !customerName) {
      setCustomerName(currentUser.name);
    }
    if (currentUser?.phone && !customerPhone) {
      setCustomerPhone(currentUser.phone);
    }
  }, [currentUser]);

  if (!isOpen || !category) return null;

  // Reasonable rate model:
  // Base visiting service charge + extra for work + distance came by worker
  const visitingCharge = 199; // Base nominal visit/inspection charge
  const workLaborCharge = 150 + selectedIssues.length * 30 + (urgency === 'emergency_30min' ? 60 : 0);
  const workerDistanceKm = 2.4; // Nearby pro travel distance
  const distanceRatePerKm = 15; // ₹15 per km travel allowance
  const distanceCharge = Math.round(workerDistanceKm * distanceRatePerKm); // ₹36
  const tax = Math.round((visitingCharge + workLaborCharge + distanceCharge) * 0.05);
  const estimatedTotal = visitingCharge + workLaborCharge + distanceCharge + tax;

  const handleToggleIssue = (issue: string) => {
    setSelectedIssues((prev) =>
      prev.includes(issue) ? prev.filter((i) => i !== issue) : [...prev, issue]
    );
  };

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your device.');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setCoordinates({ lat, lng });
        const gpsLabel = `Live GPS (${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E)`;
        setAddress((prev) => (prev ? `${prev}` : gpsLabel));
        setIsLocating(false);
      },
      () => {
        setIsLocating(false);
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim()) {
      alert('Please enter your service address in Step 3');
      setStep(3);
      return;
    }

    onSubmitBooking({
      customerId: currentUser.id || 'cust-user',
      customerName: customerName.trim() || currentUser.name || 'Customer',
      customerPhone: customerPhone.trim() || currentUser.phone || '',
      customerAddress: address.trim(),
      customerLocation: coordinates,
      unitNotes,
      categoryId: category.id,
      serviceTitle: category.title,
      description: description || `Doorstep fix for ${category.title}`,
      selectedIssues,
      urgency,
      scheduledDate: selectedDate,
      timeSlot: urgency === 'emergency_30min' ? 'Immediate 30-Min Dispatch' : `${selectedDate} (${selectedSlot})`,
      photos: [],
      estimatedTotal,
      etaMinutes: urgency === 'emergency_30min' ? 15 : 28
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-100 max-h-[92vh] sm:max-h-[85vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-200">
        {/* Mobile Grab Handle */}
        <div className="pt-3 pb-1 flex justify-center sm:hidden">
          <div className="w-12 h-1.5 bg-slate-300 rounded-full" />
        </div>

        {/* Sheet Top Header */}
        <div className="px-4 py-3 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-xl bg-indigo-600 text-white font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-white">Book {category.title}</h3>
              <p className="text-[11px] text-slate-300">Step {step} of 4 • ₹199 Base Visit</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="flex bg-slate-100 h-1.5 w-full shrink-0">
          <div
            className="bg-indigo-600 h-full transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* STEP 1: Select Issue & Urgency */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Select Specific Issues / Repairs:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {category.popularIssues.map((issue) => {
                    const isChecked = selectedIssues.includes(issue);
                    return (
                      <button
                        key={issue}
                        type="button"
                        onClick={() => handleToggleIssue(issue)}
                        className={`p-3 rounded-xl border text-xs font-semibold text-left flex items-center justify-between transition-all min-h-[44px] ${
                          isChecked
                            ? 'bg-indigo-50 border-indigo-600 text-indigo-950 font-bold shadow-xs'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span className="truncate pr-2">{issue}</span>
                        <div
                          className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 ${
                            isChecked
                              ? 'bg-indigo-600 border-indigo-600 text-white'
                              : 'border-slate-300'
                          }`}
                        >
                          {isChecked && <CheckCircle2 className="w-3 h-3" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Choose Dispatch Urgency:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setUrgency('standard')}
                    className={`p-3 rounded-xl border text-left transition-all min-h-[50px] ${
                      urgency === 'standard'
                        ? 'border-indigo-600 bg-indigo-50/70 shadow-xs'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-indigo-600" />
                      <span className="text-xs font-bold text-slate-900">Standard</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">Within 30–45 mins</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setUrgency('emergency_30min')}
                    className={`p-3 rounded-xl border text-left transition-all min-h-[50px] ${
                      urgency === 'emergency_30min'
                        ? 'border-rose-600 bg-rose-50/70 shadow-xs'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-rose-600" />
                      <span className="text-xs font-bold text-rose-900">Urgent SOS</span>
                    </div>
                    <p className="text-[11px] text-rose-700 mt-0.5">Priority under 20 mins</p>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Describe what needs fixing (Optional):
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Kitchen tap is leaking heavily, please bring replacement washer and wrench..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* STEP 2: Date & Time Slot Selection */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Select Service Date:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedDate(todayStr)}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      selectedDate === todayStr
                        ? 'border-indigo-600 bg-indigo-50 font-bold text-indigo-900 shadow-xs'
                        : 'border-slate-200 bg-white text-slate-700'
                    }`}
                  >
                    <p className="text-xs font-extrabold">Today</p>
                    <p className="text-[11px] text-slate-500">{todayStr}</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedDate(tomorrowStr)}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      selectedDate === tomorrowStr
                        ? 'border-indigo-600 bg-indigo-50 font-bold text-indigo-900 shadow-xs'
                        : 'border-slate-200 bg-white text-slate-700'
                    }`}
                  >
                    <p className="text-xs font-extrabold">Tomorrow</p>
                    <p className="text-[11px] text-slate-500">{tomorrowStr}</p>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Select Time Slot:
                </label>
                <div className="space-y-2">
                  {TIME_SLOTS.map((slot) => {
                    const isSelected = selectedSlot === slot.label;
                    return (
                      <button
                        key={slot.id}
                        type="button"
                        onClick={() => setSelectedSlot(slot.label)}
                        className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all min-h-[44px] ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-50 text-indigo-950 font-bold shadow-xs'
                            : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-indigo-600" />
                          <span className="text-xs font-bold">{slot.label}</span>
                        </div>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Doorstep Address & GPS */}
          {step === 3 && (
            <div className="space-y-3">
              <div className="p-3 bg-indigo-50/70 border border-indigo-200 rounded-xl flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-indigo-950">Fast GPS Positioning</p>
                  <p className="text-[11px] text-indigo-700">Detect your exact home location</p>
                </div>
                <button
                  type="button"
                  onClick={handleDetectLocation}
                  disabled={isLocating}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-xs active:scale-95 transition-transform"
                >
                  <Crosshair className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
                  <span>{isLocating ? 'Locating...' : 'Detect GPS'}</span>
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Customer Name:
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Phone Number (for Worker arrival call):
                </label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="e.g. +91 98765 43210"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Complete Doorstep Address:
                </label>
                <textarea
                  rows={2}
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Flat No, Building Name, Street / Cross, Area, City"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Apartment / Gate Code / Landmark (Optional):
                </label>
                <input
                  type="text"
                  value={unitNotes}
                  onChange={(e) => setUnitNotes(e.target.value)}
                  placeholder="e.g. 3rd Floor, Flat 302, Near Nilgiris Supermarket"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* STEP 4: Transparent Invoice Review */}
          {step === 4 && (
            <div className="space-y-3">
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <h4 className="font-extrabold text-slate-900 text-xs">
                    Transparent Estimate Summary
                  </h4>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                    No Surge Guarantee
                  </span>
                </div>

                <div className="flex justify-between text-xs text-slate-600">
                  <span>Customer:</span>
                  <span className="font-bold text-slate-900">{customerName || 'Customer'}</span>
                </div>

                <div className="flex justify-between text-xs text-slate-600">
                  <span>Address:</span>
                  <span className="font-medium text-slate-900 truncate max-w-[200px]">{address}</span>
                </div>

                <div className="flex justify-between text-xs text-slate-600">
                  <span>Service:</span>
                  <span className="font-bold text-slate-900">{category.title}</span>
                </div>

                <div className="pt-2 border-t border-slate-200/80 space-y-1.5">
                  <div className="flex justify-between text-xs text-slate-600">
                    <span>Base Visiting / Inspection Fee:</span>
                    <span className="font-semibold text-slate-900">₹{visitingCharge.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between text-xs text-slate-600">
                    <span>Estimated Work Labor:</span>
                    <span className="font-semibold text-slate-900">₹{workLaborCharge.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between text-xs text-slate-600">
                    <span>Worker Travel ({workerDistanceKm} km @ ₹{distanceRatePerKm}/km):</span>
                    <span className="font-semibold text-slate-900">₹{distanceCharge.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between text-xs text-slate-600">
                    <span>GST (5%):</span>
                    <span className="font-semibold text-slate-900">₹{tax.toFixed(2)}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-sm font-black text-slate-900">
                  <span>Estimated Total:</span>
                  <span className="text-emerald-700 text-base font-black">
                    ₹{estimatedTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>30-Day Workmanship Warranty & ₹10,000 Damage Cover Included.</span>
              </div>
            </div>
          )}

          {/* Sticky Bottom Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((s) => (s - 1) as any)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-1 min-h-[44px]"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 min-h-[44px]"
              >
                Cancel
              </button>
            )}

            {step < 4 ? (
              <button
                type="button"
                onClick={() => {
                  if (step === 3 && !address.trim()) {
                    alert('Please enter your service address before proceeding.');
                    return;
                  }
                  setStep((s) => (s + 1) as any);
                }}
                className="flex-1 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-xs active:scale-95 transition-transform min-h-[44px]"
              >
                <span>Continue</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-xs active:scale-95 transition-transform min-h-[44px]"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Book Now (₹{estimatedTotal})</span>
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
