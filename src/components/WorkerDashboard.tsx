import React, { useState } from 'react';
import {
  Wrench,
  Navigation,
  CheckCircle2,
  Clock,
  Phone,
  MessageSquare,
  DollarSign,
  ShieldCheck,
  Power,
  Flame,
  User,
  MapPin,
  ChevronRight,
  TrendingUp,
  Award
} from 'lucide-react';
import { Worker, JobRequest, JobStatus } from '../types/index.ts';

interface WorkerDashboardProps {
  worker: Worker;
  activeJob: JobRequest | null;
  onAcceptJob: () => void;
  onDeclineJob: () => void;
  onUpdateJobStatus: (status: JobStatus) => void;
  onOpenChat: () => void;
  onOpenCall: () => void;
  onToggleOnline: () => void;
}

export const WorkerDashboard: React.FC<WorkerDashboardProps> = ({
  worker,
  activeJob,
  onAcceptJob,
  onDeclineJob,
  onUpdateJobStatus,
  onOpenChat,
  onOpenCall,
  onToggleOnline
}) => {
  const isOnline = worker.status !== 'offline';
  const hasIncoming = activeJob && activeJob.status === 'searching';
  const isAssigned = activeJob && activeJob.status !== 'searching' && activeJob.status !== 'completed';

  return (
    <div className="space-y-6">
      {/* Worker Profile & Status Card */}
      <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={worker.avatar}
              alt={worker.name}
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-emerald-500 shadow-md"
            />
            <span
              className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-slate-900 ${
                isOnline ? 'bg-emerald-500' : 'bg-slate-500'
              }`}
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-white">{worker.name}</h2>
              <span className="text-xs bg-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                FixMate Pro
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {worker.vehicle.type}: {worker.vehicle.model} • License {worker.vehicle.plateNumber}
            </p>
            <div className="flex items-center gap-3 mt-2 text-xs text-slate-300">
              <span className="flex items-center gap-1 text-amber-400 font-bold">
                ★ {worker.rating} ({worker.reviewCount} reviews)
              </span>
              <span>•</span>
              <span className="text-emerald-400 font-bold">{worker.completedJobs} Jobs Delivered</span>
            </div>
          </div>
        </div>

        {/* Online / Offline Toggle & Quick Stats */}
        <div className="flex items-center gap-3">
          <div className="bg-slate-800/80 px-4 py-2 rounded-2xl border border-slate-700/80 text-right">
            <div className="text-[11px] text-slate-400">Today's Earnings</div>
            <div className="text-lg font-black text-emerald-400">₹2,450.00</div>
          </div>

          <button
            onClick={onToggleOnline}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-xs transition-all ${
              isOnline
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/30'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
          >
            <Power className="w-4 h-4" />
            <span>{isOnline ? 'Active Online' : 'Go Online'}</span>
          </button>
        </div>
      </div>

      {/* Incoming Job Broadcast Alert (when matching) */}
      {hasIncoming && (
        <div className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-3xl p-6 text-white shadow-xl animate-pulse space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              <Clock className="w-3.5 h-3.5" />
              Incoming Job Request Alert
            </div>
            <span className="text-xs font-mono font-bold bg-white text-orange-700 px-2.5 py-1 rounded-lg">
              Est: ₹{activeJob.estimatedTotal}
            </span>
          </div>

          <div>
            <h3 className="text-xl font-black">{activeJob.serviceTitle}</h3>
            <p className="text-sm text-orange-100 mt-1">{activeJob.description}</p>
            <div className="flex items-center gap-2 mt-2 text-xs text-orange-50 font-medium">
              <MapPin className="w-3.5 h-3.5" />
              <span>{activeJob.customerAddress} (~1.4 miles away)</span>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={onAcceptJob}
              className="flex-1 py-3 bg-white hover:bg-orange-50 text-orange-700 font-extrabold text-xs rounded-xl shadow-lg transition-transform hover:scale-[1.02] flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              Accept This Job
            </button>
            <button
              onClick={onDeclineJob}
              className="px-4 py-3 bg-black/20 hover:bg-black/30 text-white text-xs font-bold rounded-xl transition-colors"
            >
              Decline
            </button>
          </div>
        </div>
      )}

      {/* Assigned Active Job Controller for Worker */}
      {isAssigned && (
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-200 space-y-5">
          <div className="flex items-center justify-between border-b pb-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                Active Assigned Delivery
              </span>
              <h3 className="text-lg font-black text-slate-900 mt-1">
                {activeJob.customerName} • {activeJob.serviceTitle}
              </h3>
              <p className="text-xs text-slate-500">{activeJob.customerAddress}</p>
            </div>

            {/* In-App Direct Communications */}
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenChat}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-200"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                Message Customer
              </button>
              <button
                onClick={onOpenCall}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-200"
              >
                <Phone className="w-3.5 h-3.5" />
                Call Customer
              </button>
            </div>
          </div>

          {/* Turn-by-Turn Navigation & Action buttons */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700">Delivery Status Controls:</span>
              <span className="font-mono text-indigo-600 font-bold uppercase">
                Current: {activeJob.status.replace('_', ' ')}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
              <button
                onClick={() => onUpdateJobStatus('en_route')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                  activeJob.status === 'en_route'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                1. Start Driving (En Route)
              </button>
              <button
                onClick={() => onUpdateJobStatus('arrived')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                  activeJob.status === 'arrived'
                    ? 'bg-amber-600 text-white shadow'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                2. Mark Arrived
              </button>
              <button
                onClick={() => onUpdateJobStatus('in_progress')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                  activeJob.status === 'in_progress'
                    ? 'bg-blue-600 text-white shadow'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                3. Start Work Checklist
              </button>
              <button
                onClick={() => onUpdateJobStatus('completed')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                  activeJob.status === 'completed'
                    ? 'bg-emerald-600 text-white shadow'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                4. Finish Job & Bill
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pro Metrics Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm flex items-center gap-3">
          <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Weekly Payout</div>
            <div className="text-xl font-extrabold text-slate-900">₹14,500.00</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm flex items-center gap-3">
          <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">On-Time Arrival</div>
            <div className="text-xl font-extrabold text-slate-900">99.4%</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm flex items-center gap-3">
          <div className="p-3 bg-amber-50 rounded-xl text-amber-600">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">FixMate Guarantee Tier</div>
            <div className="text-xl font-extrabold text-slate-900">Master Level 4</div>
          </div>
        </div>
      </div>
    </div>
  );
};
