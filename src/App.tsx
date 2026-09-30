import React, { useState, useEffect } from 'react';
import {
  Wrench,
  Radio,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Phone,
  MessageSquare,
  Navigation,
  MapPin,
  Calendar,
  AlertTriangle,
  User as UserIcon,
  Download,
  Flame,
  Zap,
  HelpCircle,
  KeyRound,
  Send
} from 'lucide-react';
import {
  ServiceCategory,
  ServiceWorkItem,
  Worker,
  JobRequest,
  JobStatus,
  UserRole,
  ChatMessage,
  User
} from './types/index.ts';
import {
  SERVICE_CATEGORIES,
  ALL_SERVICE_WORKS,
  INITIAL_WORKERS
} from './data/mockData.ts';
import {
  loadStoredUser,
  saveStoredUser,
  clearStoredUser,
  DEFAULT_USER,
  loadStoredJobs,
  saveStoredJobs
} from './utils/storage.ts';

import { Navbar } from './components/Navbar.tsx';
import { BottomTabBar, MobileTab } from './components/BottomTabBar.tsx';
import { MobileDeviceFrame } from './components/MobileDeviceFrame.tsx';
import { ServiceCatalog } from './components/ServiceCatalog.tsx';
import { MapTracker } from './components/MapTracker.tsx';
import { BookingModal } from './components/BookingModal.tsx';
import { ChatModal } from './components/ChatModal.tsx';
import { VoiceCallModal } from './components/VoiceCallModal.tsx';
import { WorkDeliveryFlow } from './components/WorkDeliveryFlow.tsx';
import { WorkerMatchingRadar } from './components/WorkerMatchingRadar.tsx';
import { AuthModal } from './components/AuthModal.tsx';
import { ProfileModal } from './components/ProfileModal.tsx';
import { DownloadAppModal } from './components/DownloadAppModal.tsx';
import { LocationPickerModal } from './components/LocationPickerModal.tsx';
import { AccountView } from './components/AccountView.tsx';
import { SearchWorksModal } from './components/SearchWorksModal.tsx';
import { MahaAISearchModal } from './components/MahaAISearchModal.tsx';
import { MahaChatView } from './components/MahaChatView.tsx';
import { LanguageSelectorModal } from './components/LanguageSelectorModal.tsx';
import { LanguageCode } from './types/index.ts';
import { getStoredLanguage, saveStoredLanguage, t } from './utils/i18n.ts';

export default function App() {
  const [apiKey] = useState<string>(
    import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyAH8Zr1lxHUfuZ7kg5uSO6ib04v8Gh8bOA'
  );
  const [quotaExceeded, setQuotaExceeded] = useState<boolean>(false);

  // Desktop simulator frame vs full-screen toggle (default false for fluid responsive desktop experience)
  const [isSimulatorMode, setIsSimulatorMode] = useState<boolean>(false);

  // Real Persistent User State (Loaded from localStorage)
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = loadStoredUser();
    return saved || DEFAULT_USER;
  });

  const [currentRole, setCurrentRole] = useState<UserRole>('customer');
  const [activeTab, setActiveTab] = useState<MobileTab>('services');
  const [workers, setWorkers] = useState<Worker[]>(INITIAL_WORKERS);

  // Jobs state (Loaded from localStorage or empty until user books)
  const [jobs, setJobs] = useState<JobRequest[]>(() => {
    const saved = loadStoredJobs();
    if (saved && saved.length > 0) return saved;
    return [];
  });

  const [activeJobId, setActiveJobId] = useState<string>(() => {
    const saved = loadStoredJobs();
    return saved && saved[0] ? saved[0].id : '';
  });

  // Selected Service Location
  const [selectedLocation, setSelectedLocation] = useState<string>(
    currentUser.address || 'Koramangala, Bengaluru'
  );
  const [isLocationPickerOpen, setIsLocationPickerOpen] = useState<boolean>(false);

  // Modals
  const [isBookingOpen, setIsBookingOpen] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | null>(null);
  const [prefillIssue, setPrefillIssue] = useState<string | undefined>(undefined);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [isCallOpen, setIsCallOpen] = useState<boolean>(false);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [isDownloadOpen, setIsDownloadOpen] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [searchInitialQuery, setSearchInitialQuery] = useState<string>('');
  const [isMahaOpen, setIsMahaOpen] = useState<boolean>(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState<boolean>(false);
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>(() => getStoredLanguage());
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleSelectLanguage = (lang: LanguageCode) => {
    setCurrentLanguage(lang);
    saveStoredLanguage(lang);
    setToastMessage(`Language updated to ${lang.toUpperCase()}`);
  };

  // In-tab messages state
  const [chatChannel, setChatChannel] = useState<'maha' | 'worker'>('maha');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [standaloneChatInput, setStandaloneChatInput] = useState<string>('');

  // Quota Listener
  useEffect(() => {
    const handleQuota = () => setQuotaExceeded(true);
    window.addEventListener('gmp-quota-exceeded', handleQuota);
    return () => window.removeEventListener('gmp-quota-exceeded', handleQuota);
  }, []);

  const activeJob = jobs.find((j) => j.id === activeJobId) || jobs[0] || null;
  const assignedWorker = workers.find((w) => w.id === activeJob?.assignedWorkerId) || workers[0];

  // Toast auto-clear
  useEffect(() => {
    if (!toastMessage) return;
    const t = setTimeout(() => setToastMessage(null), 4000);
    return () => clearTimeout(t);
  }, [toastMessage]);

  // Real-time animated movement simulation for en_route workers
  useEffect(() => {
    if (!activeJob || activeJob.status !== 'en_route') return;

    const interval = setInterval(() => {
      setJobs((prevJobs) =>
        prevJobs.map((j) => {
          if (j.id !== activeJob.id || !j.workerLocation) return j;
          const target = j.customerLocation;
          const current = j.workerLocation;

          const nextLat = current.lat + (target.lat - current.lat) * 0.2;
          const nextLng = current.lng + (target.lng - current.lng) * 0.2;
          const remainingEta = Math.max(1, (j.etaMinutes || 10) - 1);

          return {
            ...j,
            workerLocation: { lat: nextLat, lng: nextLng },
            etaMinutes: remainingEta
          };
        })
      );
    }, 3500);

    return () => clearInterval(interval);
  }, [activeJob?.id, activeJob?.status]);

  // Handler: Open Global Search
  const handleOpenSearch = (initialQuery = '') => {
    setSearchInitialQuery(initialQuery);
    setIsSearchOpen(true);
  };

  // Handler: Select a specific work from search or catalog
  const handleSelectWork = (work: ServiceWorkItem) => {
    const cat = SERVICE_CATEGORIES.find((c) => c.id === work.categoryId) || SERVICE_CATEGORIES[0];
    handleOpenBooking(cat, work.title);
  };

  // Handler: Open booking
  const handleOpenBooking = (category: ServiceCategory, issue?: string) => {
    if (!currentUser.name || currentUser.name === 'My Account') {
      setIsAuthOpen(true);
      setToastMessage('Please enter your details to place a service booking');
      return;
    }
    setSelectedCategory(category);
    setPrefillIssue(issue);
    setIsBookingOpen(true);
  };

  // Handler: Save Real Profile
  const handleSaveProfile = (updatedUser: User) => {
    setCurrentUser(updatedUser);
    saveStoredUser(updatedUser);
    if (updatedUser.address) {
      setSelectedLocation(updatedUser.address);
    }
    setToastMessage(`Profile saved! Welcome ${updatedUser.name}.`);

    setJobs((prev) => {
      const updated = prev.map((j) => {
        if (j.customerId === updatedUser.id || !j.customerId) {
          return {
            ...j,
            customerName: updatedUser.name,
            customerPhone: updatedUser.phone,
            customerAddress: updatedUser.address || j.customerAddress,
            customerLocation: updatedUser.location || j.customerLocation
          };
        }
        return j;
      });
      saveStoredJobs(updated);
      return updated;
    });
  };

  // Handler: Logout
  const handleLogout = () => {
    clearStoredUser();
    setCurrentUser(DEFAULT_USER);
    setIsProfileOpen(false);
    setIsAuthOpen(true);
    setToastMessage('Logged out. You can now sign in with your details.');
  };

  // Handler: Instant delivery directly for a specific work item
  const handleInstantDeliverWork = (work: ServiceWorkItem) => {
    const cat = SERVICE_CATEGORIES.find((c) => c.id === work.categoryId) || SERVICE_CATEGORIES[0];
    handleInstantWorkerCameToDeliver(cat, work.title, work.estimatedLabor);
  };

  // Handler: INSTANT WORKER CAME TO DELIVER THE WORK
  const handleInstantWorkerCameToDeliver = (
    category?: ServiceCategory,
    customWorkTitle?: string,
    customWorkLabor?: number
  ) => {
    const chosenCategory = category || selectedCategory || SERVICE_CATEGORIES[0];
    const chosenWorker = workers[0]; // Ramesh Kumar / Certified FixMate Pro
    const newJobId = `job-${Math.floor(1000 + Math.random() * 9000)}`;

    const visitingCharge = 199;
    const workLaborCharge = customWorkLabor || 180;
    const workerDistanceKm = 1.6;
    const distanceCharge = Math.round(workerDistanceKm * 15);
    const tax = Math.round((visitingCharge + workLaborCharge + distanceCharge) * 0.05);
    const total = visitingCharge + workLaborCharge + distanceCharge + tax;

    const chosenIssue = customWorkTitle || chosenCategory.popularIssues[0] || 'Urgent repair diagnostic & fix';

    const instantJob: JobRequest = {
      id: newJobId,
      customerId: currentUser.id || 'cust-user',
      customerName: currentUser.name && currentUser.name !== 'My Account' ? currentUser.name : 'Doorstep Customer',
      customerPhone: currentUser.phone || '+91 98765 43210',
      customerAddress: selectedLocation || currentUser.address || 'Koramangala 4th Block, Bengaluru',
      customerLocation: currentUser.location || { lat: 12.9352, lng: 77.6245 },
      categoryId: chosenCategory.id,
      serviceTitle: customWorkTitle || chosenCategory.title,
      description: `Instant Doorstep Work Delivery: ${chosenIssue}`,
      selectedIssues: [chosenIssue],
      urgency: 'emergency_30min',
      scheduledDate: new Date().toISOString().split('T')[0],
      timeSlot: '⚡ Instant Doorstep Delivery',
      status: 'arrived', // INSTANTLY ARRIVED AT DOORSTEP TO DELIVER WORK!
      assignedWorkerId: chosenWorker.id,
      workerLocation: currentUser.location || { lat: 12.9352, lng: 77.6245 },
      etaMinutes: 0,
      createdAt: Date.now(),
      acceptedAt: Date.now(),
      invoice: {
        visitingCharge,
        workLaborCharge,
        distanceCharge,
        distanceKm: workerDistanceKm,
        tax,
        tip: 0,
        total,
        serviceFee: visitingCharge
      }
    };

    const initialMsgs: ChatMessage[] = [
      {
        id: `msg-${Date.now()}-1`,
        jobId: newJobId,
        senderId: chosenWorker.id,
        senderName: chosenWorker.name,
        senderRole: 'worker',
        text: `Namaste! I have arrived outside your doorstep in my ${chosenWorker.vehicle.model} (${chosenWorker.vehicle.plateNumber}) with the diagnostic kit to deliver the repair work.`,
        timestamp: Date.now() - 25000
      },
      {
        id: `msg-${Date.now()}-2`,
        jobId: newJobId,
        senderId: chosenWorker.id,
        senderName: chosenWorker.name,
        senderRole: 'worker',
        text: `Please share your 4-digit doorstep code so we can begin the work!`,
        timestamp: Date.now() - 5000
      }
    ];

    const updated = [instantJob, ...jobs.filter((j) => j.id !== newJobId)];
    setJobs(updated);
    saveStoredJobs(updated);
    setActiveJobId(newJobId);
    setMessages(initialMsgs);
    setActiveTab('tracking');
    setToastMessage(`⚡ ${chosenWorker.name} has arrived at your doorstep to deliver the work!`);

    // Audio chime notification
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, audioCtx.currentTime);
      osc.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.1);
      osc.frequency.setValueAtTime(783.99, audioCtx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.5);
    } catch (_) {}
  };

  // Handler: Fast-Forward ongoing job to "Worker Arrived"
  const handleFastForwardToArrived = () => {
    if (!activeJob) {
      handleInstantWorkerCameToDeliver();
      return;
    }
    const chosenWorker = assignedWorker || workers[0];
    const updated = jobs.map((j) =>
      j.id === activeJob.id
        ? {
            ...j,
            status: 'arrived' as JobStatus,
            assignedWorkerId: chosenWorker.id,
            etaMinutes: 0,
            workerLocation: j.customerLocation
          }
        : j
    );
    setJobs(updated);
    saveStoredJobs(updated);
    setToastMessage(`⚡ ${chosenWorker.name} has arrived at your doorstep to deliver work!`);
    setActiveTab('tracking');
  };

  // Handler: Customer submits a standard booking
  const handleSubmitBooking = (
    bookingData: Omit<JobRequest, 'id' | 'status' | 'createdAt' | 'invoice'>
  ) => {
    const newJobId = `job-${Math.floor(1000 + Math.random() * 9000)}`;

    const visitingCharge = 199;
    const workLaborCharge = 150 + bookingData.selectedIssues.length * 30 + (bookingData.urgency === 'emergency_30min' ? 60 : 0);
    const workerDistanceKm = 2.4;
    const distanceCharge = Math.round(workerDistanceKm * 15);
    const tax = Math.round((visitingCharge + workLaborCharge + distanceCharge) * 0.05);
    const total = visitingCharge + workLaborCharge + distanceCharge + tax;

    const newJob: JobRequest = {
      ...bookingData,
      id: newJobId,
      customerId: currentUser.id,
      customerName: bookingData.customerName || currentUser.name,
      customerPhone: bookingData.customerPhone || currentUser.phone,
      customerAddress: bookingData.customerAddress || currentUser.address,
      status: 'searching',
      createdAt: Date.now(),
      invoice: {
        visitingCharge,
        workLaborCharge,
        distanceCharge,
        distanceKm: workerDistanceKm,
        tax,
        tip: 0,
        total,
        serviceFee: visitingCharge
      }
    };

    const updatedJobs = [newJob, ...jobs];
    setJobs(updatedJobs);
    saveStoredJobs(updatedJobs);
    setActiveJobId(newJobId);
    setIsBookingOpen(false);
    setActiveTab('tracking');
    setToastMessage(`Request placed! Finding nearest pro near ${bookingData.customerAddress.split(',')[0]}...`);
    setMessages([]);
  };

  // Handler: Worker Accepts Job
  const handleWorkerAccepted = (worker: Worker) => {
    const updatedJobs = jobs.map((j) =>
      j.id === activeJobId
        ? {
            ...j,
            status: 'en_route' as JobStatus,
            assignedWorkerId: worker.id,
            workerLocation: {
              lat: worker.location.lat,
              lng: worker.location.lng
            },
            acceptedAt: Date.now()
          }
        : j
    );

    setJobs(updatedJobs);
    saveStoredJobs(updatedJobs);

    const clientName = activeJob?.customerName || currentUser.name || 'there';
    const welcomeMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      jobId: activeJobId,
      senderId: worker.id,
      senderRole: 'worker',
      senderName: worker.name,
      text: `Namaste ${clientName}! I've accepted your ${activeJob?.serviceTitle || 'repair'} request. Dispatched from ${worker.location.address} in my ${worker.vehicle.model}. See you shortly!`,
      timestamp: Date.now()
    };
    setMessages([welcomeMsg]);
    setToastMessage(`🎉 ${worker.name} accepted your request! Live GPS & Chat enabled.`);
  };

  // Handler: Status change
  const handleUpdateJobStatus = (newStatus: JobStatus) => {
    const updated = jobs.map((j) => (j.id === activeJobId ? { ...j, status: newStatus } : j));
    setJobs(updated);
    saveStoredJobs(updated);
    setToastMessage(`Delivery Status updated to: ${newStatus.replace('_', ' ').toUpperCase()}`);
  };

  // Handler: Send Chat message
  const handleSendMessage = (text: string, attachment?: string) => {
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random()}`,
      jobId: activeJobId,
      senderId: currentUser.id,
      senderRole: 'customer',
      senderName: currentUser.name || 'Customer',
      text,
      attachment,
      timestamp: Date.now()
    };
    setMessages((prev) => [...prev, newMsg]);
  };

  // Handler: Review & Tip
  const handleSubmitReview = (rating: number, comment: string, tip: number) => {
    const updated = jobs.map((j) =>
      j.id === activeJobId
        ? {
            ...j,
            rating,
            reviewComment: comment,
            invoice: {
              ...j.invoice,
              tip,
              total: j.invoice.total + tip
            }
          }
        : j
    );
    setJobs(updated);
    saveStoredJobs(updated);
    setToastMessage(`⭐ Thank you for rating ${assignedWorker.name}! Receipt confirmed.`);
  };

  // Calculate unread count or active state
  const hasActiveJob = !!activeJob && activeJob.status !== 'completed' && activeJob.status !== 'cancelled';
  const activeJobCount = jobs.filter((j) => j.status !== 'completed' && j.status !== 'cancelled').length;

  return (
    <MobileDeviceFrame
      isSimulatorMode={isSimulatorMode}
      onToggleSimulator={() => setIsSimulatorMode(!isSimulatorMode)}
    >
      {/* Google Maps Quota Banner */}
      {quotaExceeded && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-3 py-1.5 text-xs text-center sticky top-0 z-50">
          <span>
            Google Maps Platform quota reached. If you are the app owner, visit{' '}
            <a
              href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-bold"
            >
              maps developer site
            </a>.
          </span>
        </div>
      )}

      {/* Global Notification Toast */}
      {toastMessage && (
        <div className="fixed top-16 left-4 right-4 z-50 bg-slate-900 text-white px-3.5 py-2.5 rounded-2xl shadow-xl border border-slate-700 text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200 max-w-sm mx-auto">
          <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
          <span className="truncate">{toastMessage}</span>
        </div>
      )}

      {/* Mobile Top Header */}
      <Navbar
        currentRole={currentRole}
        onChangeRole={(role) => setCurrentRole(role)}
        activeWorker={assignedWorker}
        currentUser={currentUser}
        activeJobCount={activeJobCount}
        onOpenNewBooking={() => handleOpenBooking(SERVICE_CATEGORIES[0])}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        onLogout={handleLogout}
        onOpenDownload={() => setIsDownloadOpen(true)}
        onOpenLocationPicker={() => setIsLocationPickerOpen(true)}
        onOpenSearch={() => handleOpenSearch('')}
        onOpenMaha={() => setIsMahaOpen(true)}
        onOpenLanguageModal={() => setIsLanguageOpen(true)}
        currentLanguage={currentLanguage}
        activeTab={activeTab}
        onChangeTab={(tab) => setActiveTab(tab)}
        currentAddress={selectedLocation}
        isSimulatorMode={isSimulatorMode}
        onToggleSimulator={() => setIsSimulatorMode(!isSimulatorMode)}
      />

      {/* Main Tab Screen Content */}
      <main className="flex-1 p-3.5 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-4 sm:space-y-6">
        {/* TAB 1: SERVICES (Mobile Catalog & Instant Dispatch) */}
        {activeTab === 'services' && (
          <div className="space-y-4">
            {/* INSTANT WORKER CAME TO DELIVER THE WORK BUTTON / CARD */}
            <div className="rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 p-4 text-white shadow-md relative overflow-hidden">
              <div className="relative z-10 flex items-start justify-between gap-3">
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full border border-white/30">
                      ⚡ 1-Tap Delivery
                    </span>
                    <span className="text-[11px] font-extrabold text-amber-100 bg-black/20 px-2 py-0.5 rounded-full">
                      Flat ₹199 Visit • No Higher Charges
                    </span>
                  </div>
                  <h3 className="text-base font-black text-white leading-tight">
                    Instant Worker Came to Deliver Work
                  </h3>
                  <p className="text-xs text-white/90 leading-snug">
                    Immediate doorstep arrival of verified technician or beautician with complete professional toolkit.
                  </p>
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-white/20 flex items-center justify-between gap-2">
                <div className="text-[11px] font-semibold text-white/90 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Immediate Doorstep OTP</span>
                </div>
                <button
                  onClick={() => handleInstantWorkerCameToDeliver(SERVICE_CATEGORIES[0])}
                  className="px-4 py-2 bg-white text-slate-950 hover:bg-amber-50 font-black text-xs rounded-xl shadow-md active:scale-95 transition-transform flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-600 fill-amber-600" />
                  <span>Deliver Work Now</span>
                </button>
              </div>
            </div>

            {/* If there is already an active job, show floating mini-tracker */}
            {activeJob && activeJob.status !== 'completed' && (
              <div className="bg-slate-900 text-white p-3.5 rounded-2xl shadow-md border border-slate-800 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shrink-0">
                    <Radio className="w-4 h-4 animate-pulse text-emerald-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-black text-white truncate">
                      {activeJob.serviceTitle} • {assignedWorker.name}
                    </p>
                    <p className="text-[11px] text-emerald-400 font-semibold truncate">
                      Status: {activeJob.status === 'arrived' ? '⚡ Worker Outside at Doorstep' : activeJob.status.replace('_', ' ')}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab('tracking')}
                  className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shrink-0 transition-colors flex items-center gap-1"
                >
                  <span>Track</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            )}

            {/* Mobile Service Catalog */}
            <ServiceCatalog
              categories={SERVICE_CATEGORIES}
              onSelectCategory={(cat, issue) => handleOpenBooking(cat, issue)}
              onInstantEmergency={(cat) => handleInstantWorkerCameToDeliver(cat)}
              onSelectWork={handleSelectWork}
              onInstantDeliverWork={handleInstantDeliverWork}
              onOpenGlobalSearch={(q) => handleOpenSearch(q)}
              onOpenMaha={() => setIsMahaOpen(true)}
              currentLanguage={currentLanguage}
            />
          </div>
        )}

        {/* TAB 2: LIVE TRACK (Mobile Dispatch Radar & Work Delivery Flow) */}
        {activeTab === 'tracking' && (
          <div className="space-y-4">
            {/* Action Bar for Instant Arrival */}
            {activeJob && activeJob.status !== 'completed' && activeJob.status !== 'arrived' && (
              <div className="p-3.5 sm:p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between gap-3 shadow-xs">
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-black text-amber-950 truncate">Need work delivered immediately?</p>
                  <p className="text-[11px] sm:text-xs text-amber-800 truncate">Skip wait time & bring pro directly to your door.</p>
                </div>
                <button
                  onClick={handleFastForwardToArrived}
                  className="px-3.5 sm:px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs sm:text-sm rounded-xl sm:rounded-2xl shadow-xs shrink-0 active:scale-95 transition-transform cursor-pointer"
                >
                  ⚡ Worker Arrived
                </button>
              </div>
            )}

            {/* Responsive 2-Column Desktop Dispatch Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
              {/* Left Column: Interactive Google Map / Canvas Simulation */}
              <div className="md:col-span-7 lg:col-span-7 h-[280px] sm:h-[360px] md:h-[580px] rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200 shadow-xs relative md:sticky md:top-20">
                <MapTracker
                  activeJob={activeJob}
                  workers={workers}
                  apiKey={apiKey}
                  selectedWorkerId={assignedWorker?.id}
                />
              </div>

              {/* Right Column: Dynamic Status / Execution Flow */}
              <div className="md:col-span-5 lg:col-span-5 space-y-4">
                {activeJob?.status === 'searching' ? (
                  <WorkerMatchingRadar
                    job={activeJob}
                    availableWorkers={workers.filter((w) => w.status === 'available')}
                    onWorkerAccepted={handleWorkerAccepted}
                    onSwitchToWorkerMode={() => {
                      if (workers[0]) handleWorkerAccepted(workers[0]);
                    }}
                  />
                ) : activeJob ? (
                  <WorkDeliveryFlow
                    job={activeJob}
                    worker={assignedWorker}
                    currentRole={currentRole}
                    onUpdateJobStatus={handleUpdateJobStatus}
                    onOpenChat={() => setActiveTab('messages')}
                    onOpenCall={() => setIsCallOpen(true)}
                    onSubmitReview={handleSubmitReview}
                  />
                ) : (
                  <div className="bg-white rounded-2xl sm:rounded-3xl p-8 text-center border border-slate-200 shadow-xs space-y-3">
                    <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
                      <Wrench className="w-7 h-7" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-sm sm:text-base">No Active Repair Scheduled</h4>
                      <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                        Book any repair or beauty service with guaranteed flat ₹199 visiting charge.
                      </p>
                    </div>
                    <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
                      <button
                        onClick={() => handleInstantWorkerCameToDeliver(SERVICE_CATEGORIES[0])}
                        className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-xs active:scale-95 transition-transform flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Zap className="w-4 h-4 text-slate-950 fill-slate-950" />
                        <span>⚡ Instant Worker Delivery</span>
                      </button>
                      <button
                        onClick={() => handleOpenBooking(SERVICE_CATEGORIES[0])}
                        className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-xs active:scale-95 transition-transform cursor-pointer"
                      >
                        Book Service (₹199)
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: MESSAGES (Maha AI 24/7 Chat & Technician Chat) */}
        {activeTab === 'messages' && (
          <div className="space-y-4">
            {/* Desktop 2-Column Responsive Messages Hub */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
              {/* Channel Selector Sidebar (Horizontal on Mobile, Vertical Cards on Desktop) */}
              <div className="md:col-span-4 lg:col-span-4 space-y-3">
                {/* Mobile Channel Switcher */}
                <div className="md:hidden bg-slate-200/80 p-1 rounded-2xl flex items-center gap-1 text-xs font-bold shrink-0">
                  <button
                    onClick={() => setChatChannel('maha')}
                    className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      chatChannel === 'maha'
                        ? 'bg-gradient-to-r from-purple-700 via-indigo-700 to-purple-800 text-white shadow-xs font-black'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                    <span>Chat with Maha AI</span>
                  </button>

                  <button
                    onClick={() => setChatChannel('worker')}
                    className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      chatChannel === 'worker'
                        ? 'bg-slate-900 text-white shadow-xs font-black'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Wrench className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Pro Technician</span>
                  </button>
                </div>

                {/* Desktop Channel Selection Cards */}
                <div className="hidden md:flex flex-col gap-2.5">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
                    Conversations
                  </h4>

                  {/* Channel 1 Card: Maha AI */}
                  <div
                    onClick={() => setChatChannel('maha')}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
                      chatChannel === 'maha'
                        ? 'bg-gradient-to-r from-purple-950 via-indigo-900 to-slate-900 text-white border-purple-500 shadow-md ring-2 ring-indigo-500/30'
                        : 'bg-white hover:bg-slate-50 text-slate-900 border-slate-200/90 shadow-2xs'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 via-rose-500 to-indigo-500 p-0.5 shrink-0 flex items-center justify-center">
                      <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <p className={`font-black text-xs ${chatChannel === 'maha' ? 'text-white' : 'text-slate-900'}`}>
                          Maha AI Assistant
                        </p>
                        <span className="text-[9px] font-black bg-amber-400 text-slate-950 px-1.5 py-0.2 rounded uppercase">
                          Gemini
                        </span>
                      </div>
                      <p className={`text-[11px] truncate mt-0.5 ${chatChannel === 'maha' ? 'text-indigo-200' : 'text-slate-500'}`}>
                        24/7 Diagnostics • Flat ₹199
                      </p>
                    </div>
                  </div>

                  {/* Channel 2 Card: Assigned Technician */}
                  <div
                    onClick={() => setChatChannel('worker')}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
                      chatChannel === 'worker'
                        ? 'bg-slate-900 text-white border-indigo-500 shadow-md ring-2 ring-indigo-500/30'
                        : 'bg-white hover:bg-slate-50 text-slate-900 border-slate-200/90 shadow-2xs'
                    }`}
                  >
                    <div className="relative shrink-0">
                      <img
                        src={assignedWorker.avatar}
                        alt={assignedWorker.name}
                        className="w-10 h-10 rounded-2xl object-cover ring-2 ring-indigo-500"
                      />
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-slate-900 rounded-full" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <p className={`font-black text-xs ${chatChannel === 'worker' ? 'text-white' : 'text-slate-900'}`}>
                          {assignedWorker.name}
                        </p>
                        <span className="text-[10px] text-amber-400 font-black">
                          {assignedWorker.rating}★
                        </span>
                      </div>
                      <p className={`text-[11px] truncate mt-0.5 ${chatChannel === 'worker' ? 'text-slate-300' : 'text-slate-500'}`}>
                        {assignedWorker.vehicle.model} • Certified Pro
                      </p>
                    </div>
                  </div>

                  {/* Quick Active Order Direct Call Card */}
                  {activeJob && (
                    <div className="p-4 bg-indigo-50/70 border border-indigo-100 rounded-2xl space-y-2 mt-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase text-indigo-700 tracking-wider">
                          Active Service
                        </span>
                        <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded-full">
                          ₹199 Fixed Visit
                        </span>
                      </div>
                      <p className="text-xs font-black text-slate-900 leading-snug">
                        {activeJob.serviceTitle}
                      </p>
                      <button
                        onClick={() => setIsCallOpen(true)}
                        className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs active:scale-95"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Direct Voice Call with Pro</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Chat View Panel */}
              <div className="md:col-span-8 lg:col-span-8">
                {/* CHANNEL 1: LIVE CHAT WITH MAHA AI */}
                {chatChannel === 'maha' ? (
                  <MahaChatView
                    onBookWork={(cat, workTitle) => handleOpenBooking(cat, workTitle)}
                    onInstantDeliver={(cat, workTitle, labor) => handleInstantWorkerCameToDeliver(cat, workTitle, labor)}
                    currentLanguage={currentLanguage}
                    onOpenLanguageModal={() => setIsLanguageOpen(true)}
                    className="h-[520px] md:h-[620px] sm:rounded-3xl"
                  />
                ) : (
                  /* CHANNEL 2: DIRECT TECHNICIAN PRO CHAT */
                  <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xs flex flex-col h-[520px] md:h-[620px] overflow-hidden">
                    {/* Chat Header */}
                    <div className="p-3.5 bg-slate-900 text-white flex items-center justify-between shrink-0">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="relative shrink-0">
                          <img
                            src={assignedWorker.avatar}
                            alt={assignedWorker.name}
                            className="w-10 h-10 rounded-xl object-cover ring-2 ring-indigo-500"
                          />
                          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-slate-900 rounded-full" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <p className="font-extrabold text-sm text-white truncate">{assignedWorker.name}</p>
                            <span className="text-[10px] bg-indigo-500/30 text-indigo-300 px-1.5 py-0.2 rounded font-bold shrink-0">
                              {assignedWorker.rating}★
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 truncate">
                            {assignedWorker.vehicle.model} • {assignedWorker.vehicle.plateNumber}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => setIsCallOpen(true)}
                        className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-colors shadow-xs active:scale-95 shrink-0 cursor-pointer"
                        title="Voice Call"
                      >
                        <Phone className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Messages Feed */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/70">
                      {messages.length === 0 ? (
                        <div className="text-center py-12 space-y-2">
                          <MessageSquare className="w-10 h-10 text-slate-300 mx-auto" />
                          <p className="text-xs font-bold text-slate-600">Direct Chat with {assignedWorker.name}</p>
                          <p className="text-[11px] text-slate-400">Ask about tool requirements, buzzer code, or directions.</p>
                        </div>
                      ) : (
                        messages.map((msg) => {
                          const isMe = msg.senderRole === 'customer';
                          return (
                            <div
                              key={msg.id}
                              className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                            >
                              <div
                                className={`max-w-[84%] rounded-2xl px-3.5 py-2 text-xs shadow-xs ${
                                  isMe
                                    ? 'bg-indigo-600 text-white rounded-br-xs'
                                    : 'bg-white text-slate-800 border border-slate-200/90 rounded-bl-xs'
                                }`}
                              >
                                <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                              </div>
                              <span className="text-[9px] text-slate-400 mt-0.5 px-1">
                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          );
                        })
                      )}
                    </div>

                    {/* Quick Canned Suggestions */}
                    <div className="px-3.5 py-2 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
                      {['Waiting at front door', 'Buzzer code is #402', 'Please call when outside', 'Tools are ready'].map(
                        (chip, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              handleSendMessage(chip);
                              setTimeout(() => {
                                const reply: ChatMessage = {
                                  id: `msg-${Date.now()}-auto`,
                                  jobId: activeJobId,
                                  senderId: assignedWorker.id,
                                  senderName: assignedWorker.name,
                                  senderRole: 'worker',
                                  text: `Received: "${chip}". I'm on it!`,
                                  timestamp: Date.now()
                                };
                                setMessages((prev) => [...prev, reply]);
                              }, 1000);
                            }}
                            className="text-[10px] bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 px-2.5 py-1 rounded-full whitespace-nowrap transition-colors border border-slate-200/60 shrink-0 font-medium cursor-pointer"
                          >
                            {chip}
                          </button>
                        )
                      )}
                    </div>

                    {/* Chat Input Bar */}
                    <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0">
                      <input
                        type="text"
                        placeholder={`Message ${assignedWorker.name.split(' ')[0]}...`}
                        value={standaloneChatInput}
                        onChange={(e) => setStandaloneChatInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && standaloneChatInput.trim()) {
                            handleSendMessage(standaloneChatInput.trim());
                            setStandaloneChatInput('');
                          }
                        }}
                        className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none min-h-[42px]"
                      />
                      <button
                        onClick={() => {
                          if (!standaloneChatInput.trim()) return;
                          handleSendMessage(standaloneChatInput.trim());
                          setStandaloneChatInput('');
                        }}
                        className="w-10 h-10 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center shadow-xs active:scale-95 transition-transform shrink-0 cursor-pointer"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: ACCOUNT (User Details, Address, Orders History, PWA Install) */}
        {activeTab === 'account' && (
          <AccountView
            currentUser={currentUser}
            onSaveProfile={handleSaveProfile}
            onLogout={handleLogout}
            onOpenDownload={() => setIsDownloadOpen(true)}
            onOpenAuth={() => setIsAuthOpen(true)}
            onOpenLanguageModal={() => setIsLanguageOpen(true)}
            currentLanguage={currentLanguage}
            jobs={jobs}
            onSelectJob={(id) => {
              setActiveJobId(id);
              setActiveTab('tracking');
            }}
          />
        )}
      </main>

      {/* Floating Chat with Maha AI Button (When not on messages tab) */}
      {activeTab !== 'messages' && (
        <button
          onClick={() => {
            setChatChannel('maha');
            setActiveTab('messages');
          }}
          className="fixed bottom-20 md:bottom-6 right-3.5 md:right-6 z-30 px-3.5 md:px-5 py-2 md:py-2.5 rounded-full bg-gradient-to-r from-purple-700 via-indigo-600 to-slate-900 text-white font-extrabold text-xs md:text-sm shadow-xl border border-white/20 flex items-center gap-2 active:scale-95 transition-all hover:shadow-2xl cursor-pointer animate-in fade-in slide-in-from-bottom-2"
          title="Chat directly with Maha AI"
        >
          <div className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shrink-0">
            <Sparkles className="w-3 h-3 text-slate-950 fill-slate-950" />
          </div>
          <span>Chat with Maha AI</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        </button>
      )}

      {/* Fixed Mobile Bottom Tab Bar */}
      <BottomTabBar
        activeTab={activeTab}
        onChangeTab={(tab) => setActiveTab(tab)}
        activeJobCount={activeJobCount}
        unreadCount={messages.length > 0 ? 1 : 0}
        hasActiveJob={hasActiveJob}
        currentLanguage={currentLanguage}
      />

      {/* MODALS & BOTTOM SHEETS */}
      {isBookingOpen && (
        <BookingModal
          isOpen={isBookingOpen}
          onClose={() => setIsBookingOpen(false)}
          category={selectedCategory}
          currentUser={currentUser}
          prefillIssue={prefillIssue}
          onSubmitBooking={handleSubmitBooking}
        />
      )}

      {isLocationPickerOpen && (
        <LocationPickerModal
          isOpen={isLocationPickerOpen}
          onClose={() => setIsLocationPickerOpen(false)}
          currentAddress={selectedLocation}
          onSelectAddress={(addr, coords) => {
            setSelectedLocation(addr);
            handleSaveProfile({
              ...currentUser,
              address: addr,
              location: coords
            });
          }}
        />
      )}

      {isChatOpen && activeJob && (
        <ChatModal
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
          job={activeJob}
          worker={assignedWorker}
          currentRole={currentRole}
          onTriggerCall={() => {
            setIsChatOpen(false);
            setIsCallOpen(true);
          }}
          messages={messages}
          onSendMessage={handleSendMessage}
        />
      )}

      {isCallOpen && activeJob && (
        <VoiceCallModal
          isOpen={isCallOpen}
          onClose={() => setIsCallOpen(false)}
          worker={assignedWorker}
          job={activeJob}
          currentRole={currentRole}
        />
      )}

      {/* Auth Modal for mobile login / signup */}
      {isAuthOpen && (
        <AuthModal
          isOpen={isAuthOpen}
          onClose={() => setIsAuthOpen(false)}
          onLoginSuccess={(userData) => {
            const updated: User = {
              id: 'usr-' + Math.random().toString(36).substring(2, 9),
              name: userData.name,
              email: userData.emailOrPhone.includes('@') ? userData.emailOrPhone : currentUser.email,
              phone: !userData.emailOrPhone.includes('@') ? userData.emailOrPhone : currentUser.phone,
              role: 'customer',
              avatar: userData.avatar || currentUser.avatar,
              address: userData.address || currentUser.address,
              location: currentUser.location,
              authProvider: userData.provider
            };
            handleSaveProfile(updated);
          }}
        />
      )}

      {/* Profile Modal */}
      {isProfileOpen && (
        <ProfileModal
          isOpen={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
          currentUser={currentUser}
          onSaveProfile={handleSaveProfile}
          onLogout={handleLogout}
        />
      )}

      {/* Download FixMate App Modal */}
      {isDownloadOpen && (
        <DownloadAppModal
          isOpen={isDownloadOpen}
          onClose={() => setIsDownloadOpen(false)}
        />
      )}

      {/* Search Works Modal */}
      {isSearchOpen && (
        <SearchWorksModal
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
          initialQuery={searchInitialQuery}
          currentLanguage={currentLanguage}
          onOpenLanguageModal={() => setIsLanguageOpen(true)}
          onOpenMaha={() => setIsMahaOpen(true)}
          onSelectWork={handleSelectWork}
          onInstantDeliverWork={handleInstantDeliverWork}
        />
      )}

      {/* Maha AI Repair & Diagnostics Search Modal */}
      {isMahaOpen && (
        <MahaAISearchModal
          isOpen={isMahaOpen}
          onClose={() => setIsMahaOpen(false)}
          currentLanguage={currentLanguage}
          onOpenLanguageModal={() => setIsLanguageOpen(true)}
          onBookWork={(category, workTitle) => handleOpenBooking(category, workTitle)}
          onInstantDeliver={(category, workTitle, labor) => handleInstantWorkerCameToDeliver(category, workTitle, labor)}
        />
      )}

      {/* Multi-Language Selector Modal */}
      {isLanguageOpen && (
        <LanguageSelectorModal
          isOpen={isLanguageOpen}
          onClose={() => setIsLanguageOpen(false)}
          currentLanguage={currentLanguage}
          onSelectLanguage={handleSelectLanguage}
        />
      )}
    </MobileDeviceFrame>
  );
}
