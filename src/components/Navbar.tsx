import React from 'react';
import {
  Wrench,
  MapPin,
  ChevronDown,
  Sparkles,
  PhoneCall,
  Download,
  ShieldCheck,
  Flame,
  Radio,
  Search,
  Globe,
  User as UserIcon,
  MessageSquare,
  Smartphone,
  Monitor
} from 'lucide-react';
import { UserRole, Worker, User, LanguageCode } from '../types/index.ts';
import { SUPPORTED_LANGUAGES, t } from '../utils/i18n.ts';

interface NavbarProps {
  currentRole: UserRole;
  onChangeRole: (role: UserRole) => void;
  activeWorker: Worker;
  currentUser?: User;
  activeJobCount: number;
  onOpenNewBooking: () => void;
  onOpenAuth: () => void;
  onOpenProfile: () => void;
  onLogout: () => void;
  onOpenDownload: () => void;
  onOpenLocationPicker?: () => void;
  onOpenSearch?: () => void;
  onOpenMaha?: () => void;
  onOpenLanguageModal?: () => void;
  currentLanguage?: LanguageCode;
  activeTab: string;
  onChangeTab: (tab: any) => void;
  currentAddress?: string;
  isSimulatorMode?: boolean;
  onToggleSimulator?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  activeJobCount,
  onOpenNewBooking,
  onOpenAuth,
  onOpenProfile,
  onLogout,
  onOpenDownload,
  onOpenLocationPicker,
  onOpenSearch,
  onOpenMaha,
  onOpenLanguageModal,
  currentLanguage = 'en',
  activeTab,
  onChangeTab,
  currentAddress = 'Koramangala, Bengaluru',
  isSimulatorMode,
  onToggleSimulator
}) => {
  const hasProfile = currentUser && currentUser.name && currentUser.name !== 'My Account';
  const userInitials = (currentUser?.name || 'ME')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  // Shorten address for mobile top bar
  const shortAddress = currentAddress.split(',')[0] || 'Select Location';
  const currentLangObj = SUPPORTED_LANGUAGES.find((l) => l.code === currentLanguage) || SUPPORTED_LANGUAGES[0];

  const desktopNavItems = [
    { id: 'services', label: t('tab_services', currentLanguage), icon: Wrench },
    { id: 'tracking', label: t('tab_tracking', currentLanguage), icon: Radio, count: activeJobCount },
    { id: 'messages', label: t('tab_messages', currentLanguage), icon: MessageSquare },
    { id: 'account', label: t('tab_account', currentLanguage), icon: UserIcon }
  ];

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs">
      {/* ============================================================== */}
      {/* 1. MOBILE HEADER (< 768px): Preserved exact compact mobile layout */}
      {/* ============================================================== */}
      <div className="md:hidden max-w-md mx-auto px-2 h-14 flex items-center justify-between gap-1">
        {/* Left Slot: Quick Location Picker with MapPin */}
        <button
          onClick={onOpenLocationPicker}
          className="flex items-center gap-1.5 p-1 rounded-xl hover:bg-slate-100 transition-colors text-left max-w-[105px] cursor-pointer"
          title="Change Doorstep Location"
        >
          <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <MapPin className="w-3.5 h-3.5" />
          </div>
          <div className="flex flex-col truncate">
            <span className="text-[8px] text-slate-400 font-bold uppercase tracking-tight flex items-center gap-0.5">
              Doorstep <ChevronDown className="w-2.5 h-2.5 text-slate-400" />
            </span>
            <span className="text-[11px] font-extrabold text-slate-900 truncate">
              {shortAddress}
            </span>
          </div>
        </button>

        {/* Center Slot: Brand Wordmark */}
        <div className="flex items-center justify-center">
          <button
            onClick={() => onChangeTab('services')}
            className="flex items-center gap-1 focus:outline-none"
          >
            <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-xs">
              <Wrench className="w-3.5 h-3.5" />
            </div>
            <span className="font-extrabold text-sm tracking-tight text-slate-900">
              Fix<span className="text-indigo-600">Mate</span>
            </span>
          </button>
        </div>

        {/* Right Slot: Language Switcher + Maha AI + Search + ₹199 Visit or Profile */}
        <div className="flex items-center gap-1">
          {/* Quick Language Switcher Button */}
          {onOpenLanguageModal && (
            <button
              onClick={onOpenLanguageModal}
              className="px-1.5 py-1 rounded-xl bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 text-[10px] font-black flex items-center gap-0.5 transition-colors cursor-pointer border border-slate-200/80"
              title="Change App Language / भाषा बदलें"
            >
              <Globe className="w-3 h-3 text-indigo-600" />
              <span className="uppercase">{currentLangObj.code}</span>
            </button>
          )}

          {/* Maha AI Feature Button */}
          {onOpenMaha && (
            <button
              onClick={onOpenMaha}
              className="px-2 py-1 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-black text-[10px] shadow-xs flex items-center gap-1 active:scale-95 transition-transform cursor-pointer"
              title="Maha AI Search & Diagnostics"
            >
              <Sparkles className="w-3 h-3 text-amber-300 animate-pulse" />
              <span>Maha AI</span>
            </button>
          )}

          {/* Quick Search Works Button */}
          {onOpenSearch && (
            <button
              onClick={onOpenSearch}
              className="w-7 h-7 rounded-xl bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
              title="Search all works & services"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Quick Flat ₹199 Dispatch Button */}
          <button
            onClick={onOpenNewBooking}
            className="px-1.5 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[10px] shadow-xs flex items-center gap-0.5 active:scale-95 transition-transform"
            title="Flat ₹199 Visit - No Higher Charges Guaranteed"
          >
            <ShieldCheck className="w-3 h-3 text-white" />
            <span>₹199</span>
          </button>

          {/* User Profile Avatar or Sign In */}
          {hasProfile ? (
            <button
              onClick={onOpenProfile}
              className="w-7 h-7 rounded-xl bg-slate-900 text-white flex items-center justify-center text-[10px] font-extrabold shadow-xs ring-1 ring-slate-200 cursor-pointer active:scale-95 transition-transform shrink-0"
              title="My Account"
            >
              {userInitials}
            </button>
          ) : (
            <button
              onClick={onOpenAuth}
              className="w-7 h-7 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center text-xs font-bold transition-colors cursor-pointer shrink-0"
              title="Sign In"
            >
              <UserIcon className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. PC / DESKTOP HEADER (>= 768px): Full-Width Responsive Portal */}
      {/* ============================================================== */}
      <div className="hidden md:flex max-w-7xl mx-auto px-6 h-16 items-center justify-between gap-4">
        {/* Brand & Location */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => onChangeTab('services')}
            className="flex items-center gap-2.5 focus:outline-none cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md">
              <Wrench className="w-5 h-5" />
            </div>
            <div className="text-left">
              <span className="font-black text-lg tracking-tight text-slate-900 block leading-tight">
                Fix<span className="text-indigo-600">Mate</span>
              </span>
              <span className="text-[10px] font-bold text-slate-400 block tracking-tight">
                Home, Beauty & Repair Services India
              </span>
            </div>
          </button>

          {/* Location Selector Chip */}
          <button
            onClick={onOpenLocationPicker}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-left transition-colors cursor-pointer"
            title="Change Doorstep Location"
          >
            <MapPin className="w-4 h-4 text-indigo-600 shrink-0" />
            <div className="flex flex-col">
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                Service Address
              </span>
              <span className="text-xs font-black text-slate-900 truncate max-w-[160px] lg:max-w-[220px]">
                {currentAddress}
              </span>
            </div>
            <ChevronDown className="w-3 h-3 text-slate-400 ml-0.5" />
          </button>
        </div>

        {/* Center: Desktop Navigation Tabs */}
        <nav className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-2xl border border-slate-200/60">
          {desktopNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onChangeTab(item.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer relative ${
                  isActive
                    ? 'bg-white text-indigo-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-500'}`} />
                <span>{item.label}</span>
                {item.count && item.count > 0 ? (
                  <span className="px-1.5 py-0.2 bg-indigo-600 text-white rounded-full text-[10px] font-black">
                    {item.count}
                  </span>
                ) : null}
              </button>
            );
          })}
        </nav>

        {/* Right Action Tools: Search + Maha AI + Flat ₹199 + Language + User Profile */}
        <div className="flex items-center gap-2.5">
          {/* Quick Search */}
          {onOpenSearch && (
            <button
              onClick={onOpenSearch}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-200/90 text-slate-600 hover:text-indigo-600 text-xs font-semibold transition-colors cursor-pointer shadow-2xs"
            >
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden lg:inline">Search 70+ works...</span>
              <kbd className="hidden lg:inline text-[9px] bg-white border border-slate-200 px-1.5 py-0.5 rounded text-slate-400 font-mono">
                ⌘K
              </kbd>
            </button>
          )}

          {/* Maha AI Consultant Button */}
          {onOpenMaha && (
            <button
              onClick={onOpenMaha}
              className="px-3 py-2 rounded-xl bg-gradient-to-r from-purple-700 via-indigo-600 to-purple-800 hover:from-purple-800 hover:to-indigo-700 text-white font-extrabold text-xs shadow-xs flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer"
              title="Maha AI Diagnostic Assistant"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span>Ask Maha AI</span>
            </button>
          )}

          {/* Guaranteed Flat ₹199 Booking CTA */}
          <button
            onClick={onOpenNewBooking}
            className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-xs flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer"
            title="Book doorstep service with guaranteed flat ₹199 visiting fee"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Flat ₹199 Visit</span>
          </button>

          {/* Language Selector */}
          {onOpenLanguageModal && (
            <button
              onClick={onOpenLanguageModal}
              className="flex items-center gap-1.5 px-2.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
              title="Change Language"
            >
              <Globe className="w-3.5 h-3.5 text-indigo-600" />
              <span>{currentLangObj.nativeName}</span>
            </button>
          )}

          {/* User Profile Avatar or Sign In */}
          {hasProfile ? (
            <button
              onClick={onOpenProfile}
              className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs cursor-pointer active:scale-95 transition-all"
              title="My Account"
            >
              <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center text-[10px] font-black">
                {userInitials}
              </div>
              <span className="truncate max-w-[100px]">{currentUser?.name?.split(' ')[0]}</span>
            </button>
          ) : (
            <button
              onClick={onOpenAuth}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold transition-colors cursor-pointer shadow-xs"
              title="Sign In"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
