import React, { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  Navigation,
  Wrench,
  Star,
  ShieldCheck,
  FileCheck,
  Sparkles,
  Phone,
  MessageSquare,
  KeyRound,
  ChevronRight,
  Shield
} from 'lucide-react';
import { JobRequest, Worker, JobStatus, UserRole } from '../types/index.ts';

interface WorkDeliveryFlowProps {
  job: JobRequest;
  worker: Worker;
  currentRole: UserRole;
  onUpdateJobStatus: (newStatus: JobStatus) => void;
  onOpenChat: () => void;
  onOpenCall: () => void;
  onSubmitReview: (rating: number, comment: string, tip: number) => void;
}

export const WorkDeliveryFlow: React.FC<WorkDeliveryFlowProps> = ({
  job,
  worker,
  currentRole,
  onUpdateJobStatus,
  onOpenChat,
  onOpenCall,
  onSubmitReview
}) => {
  const [selectedTip, setSelectedTip] = useState<number>(50);
  const [rating, setRating] = useState<number>(5);
  const [reviewText, setReviewText] = useState<string>('Great service! Arrived quickly and solved the repair with complete transparency.');
  const [isSubmittingReview, setIsSubmittingReview] = useState<boolean>(false);
  const [checklist, setChecklist] = useState<{ [key: string]: boolean }>({
    'Initial safety inspection': true,
    'Main supply shutoff check': true,
    'Component repair / replacement': true,
    'Pressure / operation test': true
  });

  const toggleChecklistItem = (item: string) => {
    setChecklist((prev) => ({ ...prev, [item]: !prev[item] }));
  };

  const steps: { status: JobStatus; label: string; desc: string }[] = [
    { status: 'assigned', label: 'Accepted', desc: 'Confirmed' },
    { status: 'en_route', label: 'En Route', desc: 'On way' },
    { status: 'arrived', label: 'Arrived', desc: 'At door' },
    { status: 'in_progress', label: 'Work', desc: 'In progress' },
    { status: 'completed', label: 'Done', desc: 'Verified' }
  ];

  const getStepIndex = (status: JobStatus) => {
    switch (status) {
      case 'searching': return -1;
      case 'assigned': return 0;
      case 'en_route': return 1;
      case 'arrived': return 2;
      case 'in_progress': return 3;
      case 'completed': return 4;
      default: return 0;
    }
  };

  const currentStepIdx = getStepIndex(job.status);
  // Generate deterministic OTP based on job ID
  const startOtp = (Math.abs(job.id.split('').reduce((acc, char) => acc * 31 + char.charCodeAt(0), 7)) % 9000 + 1000).toString();

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/90 space-y-4">
      {/* Worker Card with Quick Call & Chat Actions */}
      <div className="flex items-center justify-between gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200/80">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="relative shrink-0">
            <img
              src={worker.avatar}
              alt={worker.name}
              className="w-12 h-12 rounded-xl object-cover ring-2 ring-indigo-500 shadow-xs"
            />
            <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h4 className="font-extrabold text-sm text-slate-900 truncate">
                {worker.name}
              </h4>
              <span className="text-[10px] bg-indigo-50 text-indigo-700 px-1.5 py-0.2 rounded font-black shrink-0">
                {worker.rating}★
              </span>
            </div>
            <p className="text-[11px] text-slate-500 truncate">
              {worker.vehicle.model} • {worker.vehicle.plateNumber}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={onOpenCall}
            className="w-9 h-9 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center shadow-xs active:scale-95 transition-transform"
            title="Call Pro"
          >
            <Phone className="w-4 h-4" />
          </button>
          <button
            onClick={onOpenChat}
            className="w-9 h-9 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center shadow-xs active:scale-95 transition-transform"
            title="Chat Pro"
          >
            <MessageSquare className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Doorstep Verification OTP Card */}
      {job.status !== 'completed' && (
        <div className="p-3 bg-indigo-50/70 border border-indigo-200/80 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-indigo-600 shrink-0" />
            <div>
              <p className="text-[10px] font-bold text-indigo-900 uppercase tracking-tight">
                Doorstep Security Code
              </p>
              <p className="text-[11px] text-indigo-700">
                Share OTP with {worker.name.split(' ')[0]} at your door:
              </p>
            </div>
          </div>
          <div className="px-2.5 py-1 bg-white rounded-lg border border-indigo-200 shadow-xs font-mono font-black text-sm tracking-widest text-indigo-950">
            {startOtp}
          </div>
        </div>
      )}

      {/* Mobile Horizontal Stepper */}
      <div className="flex items-center justify-between gap-1 overflow-x-auto no-scrollbar py-1">
        {steps.map((s, idx) => {
          const isCompleted = idx < currentStepIdx;
          const isCurrent = idx === currentStepIdx;
          return (
            <div
              key={s.status}
              className={`flex-1 flex flex-col items-center text-center p-1.5 rounded-lg transition-all min-w-[58px] ${
                isCurrent ? 'bg-indigo-50 ring-1 ring-indigo-200' : ''
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-extrabold mb-1 transition-all ${
                  isCompleted
                    ? 'bg-emerald-600 text-white'
                    : isCurrent
                    ? 'bg-indigo-600 text-white ring-2 ring-indigo-200 animate-pulse'
                    : 'bg-slate-100 text-slate-400'
                }`}
              >
                {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
              </div>
              <span
                className={`text-[10px] whitespace-nowrap ${
                  isCurrent ? 'font-black text-indigo-900' : isCompleted ? 'font-bold text-slate-800' : 'text-slate-400'
                }`}
              >
                {s.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Dynamic Status Action */}
      {job.status === 'assigned' && (
        <div className="p-3.5 bg-indigo-50 rounded-xl border border-indigo-100 space-y-2.5">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-600" />
            <span className="text-xs font-bold text-indigo-950">
              Pro Confirmed & Prepping Van
            </span>
          </div>
          <p className="text-xs text-indigo-800">
            {worker.name} is gathering standard toolkit for {job.serviceTitle}.
          </p>
          <button
            onClick={() => onUpdateJobStatus('en_route')}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold rounded-xl shadow-xs active:scale-95 transition-transform"
          >
            Simulate "Worker En Route"
          </button>
        </div>
      )}

      {job.status === 'en_route' && (
        <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-100 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
              <Navigation className="w-4 h-4 text-emerald-600 animate-spin" style={{ animationDuration: '4s' }} />
              Worker Dispatched & En Route
            </span>
            <span className="text-xs font-mono font-black text-emerald-700 bg-white px-2 py-0.5 rounded-full border border-emerald-200">
              ~{job.etaMinutes || 10} Mins
            </span>
          </div>
          <p className="text-xs text-emerald-800">
            {worker.name} is driving towards {job.customerAddress.split(',')[0]}.
          </p>
          <button
            onClick={() => onUpdateJobStatus('arrived')}
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold rounded-xl shadow-xs active:scale-95 transition-transform"
          >
            Simulate "Worker Arrived at Doorstep"
          </button>
        </div>
      )}

      {job.status === 'arrived' && (
        <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 space-y-2.5">
          <div className="flex items-center gap-2">
            <Wrench className="w-4 h-4 text-amber-700" />
            <span className="text-xs font-bold text-amber-950">
              Worker At Your Doorstep
            </span>
          </div>
          <p className="text-xs text-amber-800">
            Verify identity and provide OTP {startOtp} to commence repairs.
          </p>
          <button
            onClick={() => onUpdateJobStatus('in_progress')}
            className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-extrabold rounded-xl shadow-xs active:scale-95 transition-transform"
          >
            Start Work On-Site
          </button>
        </div>
      )}

      {job.status === 'in_progress' && (
        <div className="space-y-3">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <h5 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <FileCheck className="w-4 h-4 text-indigo-600" />
                Service Execution Checklist
              </h5>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                In Progress
              </span>
            </div>
            <div className="space-y-1.5">
              {Object.keys(checklist).map((item) => (
                <button
                  key={item}
                  onClick={() => toggleChecklistItem(item)}
                  className={`w-full p-2 rounded-lg border text-xs text-left font-medium flex items-center justify-between ${
                    checklist[item]
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                      : 'bg-white border-slate-200 text-slate-600'
                  }`}
                >
                  <span className="truncate pr-1">{item}</span>
                  <CheckCircle2
                    className={`w-4 h-4 shrink-0 ${
                      checklist[item] ? 'text-emerald-600' : 'text-slate-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => onUpdateJobStatus('completed')}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold rounded-xl shadow-xs active:scale-95 transition-transform flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-4 h-4" />
            <span>Finish Work & Generate Invoice</span>
          </button>
        </div>
      )}

      {/* Completed & Rate Pro Screen */}
      {job.status === 'completed' && (
        <div className="p-4 bg-gradient-to-br from-indigo-50/50 via-white to-emerald-50/50 rounded-2xl border border-indigo-100 space-y-3.5">
          <div className="text-center space-y-1">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-base font-black text-slate-900">Job Complete & Guaranteed</h4>
            <p className="text-xs text-slate-500">
              Completed by {worker.name} • 30-Day FixMate Warranty
            </p>
          </div>

          {/* Itemized Invoice */}
          <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1.5 text-xs">
            <div className="flex items-center justify-between pb-1 border-b border-slate-100">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Fixed Fare Breakdown</span>
              <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Flat ₹199 • No Higher Charges
              </span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Base Visit Fee:</span>
              <span className="font-semibold text-slate-900">₹{(job.invoice.visitingCharge || 199).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Work & Labor:</span>
              <span className="font-semibold text-slate-900">₹{(job.invoice.workLaborCharge || 180).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Worker Travel ({job.invoice.distanceKm || 2.4} km @ ₹15/km):</span>
              <span className="font-semibold text-slate-900">₹{(job.invoice.distanceCharge || 36).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>GST (5%):</span>
              <span className="font-semibold text-slate-900">₹{job.invoice.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-600 font-medium">
              <span>Pro Tip:</span>
              <span className="text-emerald-600">+₹{selectedTip.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-extrabold text-sm text-slate-900 border-t pt-1.5">
              <span>Total Paid:</span>
              <span className="text-emerald-700 font-black">
                ₹{(job.invoice.total + selectedTip).toFixed(2)}
              </span>
            </div>
          </div>

          {/* Tip Selector */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
              Add Tip for {worker.name.split(' ')[0]}
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {[30, 50, 100, 150].map((tipAmt) => (
                <button
                  key={tipAmt}
                  type="button"
                  onClick={() => setSelectedTip(tipAmt)}
                  className={`py-1.5 rounded-lg text-xs font-bold transition-all ${
                    selectedTip === tipAmt
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-700'
                  }`}
                >
                  ₹{tipAmt}
                </button>
              ))}
            </div>
          </div>

          {/* Star Rating */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
              Rate Service Delivery
            </label>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="p-1 text-amber-400 active:scale-125 transition-transform"
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                    }`}
                  />
                </button>
              ))}
              <span className="text-xs font-black text-slate-700 ml-1.5">{rating}.0 / 5.0</span>
            </div>
          </div>

          <textarea
            rows={2}
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Feedback for pro..."
            className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />

          <button
            onClick={() => {
              setIsSubmittingReview(true);
              setTimeout(() => {
                setIsSubmittingReview(false);
                onSubmitReview(rating, reviewText, selectedTip);
              }, 500);
            }}
            disabled={isSubmittingReview}
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold rounded-xl shadow-xs active:scale-95 transition-transform flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isSubmittingReview ? 'Submitting...' : 'Submit Rating & Save Receipt'}</span>
          </button>
        </div>
      )}
    </div>
  );
};
