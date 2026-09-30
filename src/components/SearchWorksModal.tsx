import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  X,
  Wrench,
  Zap,
  Snowflake,
  Tv,
  Droplets,
  Hammer,
  Sparkles,
  Bug,
  Key,
  Paintbrush,
  Home,
  Shield,
  Layers,
  ChevronRight,
  Clock,
  CheckCircle2,
  Flame,
  ArrowRight,
  ShieldCheck,
  Tag,
  Mic,
  Languages
} from 'lucide-react';
import { ServiceCategory, ServiceWorkItem, ServiceCategoryId, LanguageCode } from '../types/index.ts';
import { SERVICE_CATEGORIES, ALL_SERVICE_WORKS } from '../data/mockData.ts';
import { t, getCategoryTitle, SPEECH_LANG_CODES } from '../utils/i18n.ts';

interface SearchWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectWork: (work: ServiceWorkItem) => void;
  onInstantDeliverWork: (work: ServiceWorkItem) => void;
  onOpenMaha?: () => void;
  onOpenLanguageModal?: () => void;
  currentLanguage?: LanguageCode;
  initialQuery?: string;
}

export const SearchWorksModal: React.FC<SearchWorksModalProps> = ({
  isOpen,
  onClose,
  onSelectWork,
  onInstantDeliverWork,
  onOpenMaha,
  onOpenLanguageModal,
  currentLanguage = 'en',
  initialQuery = ''
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [isListening, setIsListening] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleVoiceSearch = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = SPEECH_LANG_CODES[currentLanguage] || 'en-IN';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        if (text) setQuery(text);
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      recognition.start();
    } catch (_) {
      setIsListening(false);
    }
  };

  const getCategoryIcon = (catId: ServiceCategoryId, className = 'w-4 h-4') => {
    switch (catId) {
      case 'beauty_women': return <Sparkles className={`${className} text-pink-500`} />;
      case 'grooming_men': return <Sparkles className={`${className} text-amber-600`} />;
      case 'plumbing': return <Wrench className={`${className} text-blue-600`} />;
      case 'electrical': return <Zap className={`${className} text-amber-500`} />;
      case 'ac_cooling': return <Snowflake className={`${className} text-cyan-500`} />;
      case 'appliances': return <Tv className={`${className} text-indigo-500`} />;
      case 'ro_purifier': return <Droplets className={`${className} text-blue-500`} />;
      case 'carpentry': return <Hammer className={`${className} text-orange-500`} />;
      case 'cleaning': return <Sparkles className={`${className} text-emerald-500`} />;
      case 'pest_control': return <Bug className={`${className} text-rose-500`} />;
      case 'locksmith': return <Key className={`${className} text-purple-500`} />;
      case 'painting': return <Paintbrush className={`${className} text-pink-500`} />;
      case 'roofing': return <Home className={`${className} text-indigo-600`} />;
      case 'cctv_smart_home': return <Shield className={`${className} text-blue-700`} />;
      case 'masonry_tiling': return <Layers className={`${className} text-slate-700`} />;
      case 'vehicle_care': return <Zap className={`${className} text-blue-600`} />;
      case 'home_health': return <Shield className={`${className} text-rose-600`} />;
      case 'gadget_repair': return <Tv className={`${className} text-indigo-600`} />;
      default: return <Wrench className={`${className} text-slate-600`} />;
    }
  };

  const trendingQueries = [
    'O3+ Facial',
    'Full Body Waxing',
    "Men's Haircut",
    'Car Foam Wash',
    'Battery Jumpstart',
    'Tap Leak',
    'AC Power Jet',
    'MCB Tripping',
    'Godrej Lock',
    'Drain Unclog'
  ];

  // Filter works by search and category
  const filteredWorks = ALL_SERVICE_WORKS.filter((work) => {
    if (selectedCategoryFilter !== 'all') {
      if (selectedCategoryFilter === 'emergency') {
        if (!work.emergencyAvailable) return false;
      } else if (work.categoryId !== selectedCategoryFilter) {
        return false;
      }
    }

    if (!query.trim()) return true;
    const q = query.toLowerCase().trim();
    const titleLocalized = getCategoryTitle(work.categoryId, currentLanguage).toLowerCase();
    return (
      work.title.toLowerCase().includes(q) ||
      work.description.toLowerCase().includes(q) ||
      work.categoryTitle.toLowerCase().includes(q) ||
      titleLocalized.includes(q) ||
      work.keywords.some((k) => k.toLowerCase().includes(q))
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-xs">
      <div className="w-full max-w-lg md:max-w-4xl bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-100 h-[92vh] sm:h-[720px] md:h-[780px] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-200">
        {/* Mobile Grab Handle */}
        <div className="pt-3 pb-1 flex justify-center sm:hidden shrink-0">
          <div className="w-12 h-1.5 bg-slate-300 rounded-full" />
        </div>

        {/* Modal Header */}
        <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">
                All Works & Services Directory
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                {ALL_SERVICE_WORKS.length}+ Home, Beauty & Repair Services • Flat ₹199 Visit
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {onOpenLanguageModal && (
              <button
                onClick={onOpenLanguageModal}
                className="px-2 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold flex items-center gap-1"
                title="Change Language"
              >
                <Languages className="w-3.5 h-3.5 text-indigo-600" />
                <span className="uppercase">{currentLanguage}</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search Input with Voice Mic */}
        <div className="p-3 border-b border-slate-100 bg-slate-50/50 shrink-0">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              ref={inputRef}
              type="text"
              placeholder={t('search_placeholder', currentLanguage)}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-10 pr-20 py-2.5 rounded-2xl bg-white border border-slate-200 text-xs text-slate-900 placeholder-slate-400 shadow-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
            />
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="text-slate-400 hover:text-slate-600 p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}

              <button
                type="button"
                onClick={handleVoiceSearch}
                className={`p-1.5 rounded-lg transition-colors ${
                  isListening
                    ? 'bg-rose-600 text-white animate-pulse'
                    : 'text-slate-400 hover:text-indigo-600 hover:bg-slate-100'
                }`}
                title="Voice Search"
              >
                <Mic className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Filter Pills Carousel */}
        <div className="px-3 py-2 border-b border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0 bg-white">
          <button
            onClick={() => setSelectedCategoryFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
              selectedCategoryFilter === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All Works ({ALL_SERVICE_WORKS.length})
          </button>

          <button
            onClick={() => setSelectedCategoryFilter('emergency')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1 ${
              selectedCategoryFilter === 'emergency'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100'
            }`}
          >
            <Flame className="w-3 h-3 text-amber-300 fill-amber-300" />
            <span>Emergency ⚡</span>
          </button>

          {SERVICE_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategoryFilter(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                selectedCategoryFilter === cat.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {getCategoryIcon(cat.id, 'w-3 h-3')}
              <span>{getCategoryTitle(cat.id, currentLanguage).split(' ')[0]}</span>
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-3.5 space-y-3.5 bg-slate-50/40">
          {/* Ask Maha AI Feature Banner */}
          {onOpenMaha && (
            <div
              onClick={() => {
                onOpenMaha();
                onClose();
              }}
              className="p-3 bg-gradient-to-r from-purple-950 via-indigo-900 to-slate-900 rounded-2xl text-white flex items-center justify-between gap-3 shadow-sm border border-purple-500/30 cursor-pointer active:scale-[0.99] transition-all"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-400 to-rose-500 p-0.5 shrink-0 flex items-center justify-center">
                  <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                  </div>
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs font-black text-white">Ask Maha AI Assistant</h4>
                    <span className="text-[9px] font-black bg-amber-400 text-slate-950 px-1 rounded uppercase">Gemini</span>
                  </div>
                  <p className="text-[11px] text-indigo-200 truncate">
                    Describe any problem in natural words for AI root-cause diagnosis.
                  </p>
                </div>
              </div>
              <span className="text-xs font-black text-amber-300 shrink-0 flex items-center gap-0.5">
                Diagnose <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
          )}

          {/* Trending Searches Suggestions if query is empty */}
          {!query && selectedCategoryFilter === 'all' && (
            <div className="space-y-2">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Tag className="w-3 h-3 text-indigo-500" />
                Popular Quick Searches
              </p>
              <div className="flex flex-wrap gap-1.5">
                {trendingQueries.map((item) => (
                  <button
                    key={item}
                    onClick={() => setQuery(item)}
                    className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:border-indigo-400 hover:text-indigo-600 shadow-2xs transition-colors cursor-pointer"
                  >
                    🔍 {item}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* List of Works */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs px-1">
              <span className="font-extrabold text-slate-800">
                {filteredWorks.length} Available Services
              </span>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Flat ₹199 Visit
              </span>
            </div>

            {filteredWorks.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                  <Search className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900">
                    No exact works found for "{query}"
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                    Try searching for facial, waxing, haircut, tap, ac, or ask Maha AI.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setQuery('');
                    setSelectedCategoryFilter('all');
                  }}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
                >
                  View All Works
                </button>
              </div>
            ) : (
              filteredWorks.map((work) => (
                <div
                  key={work.id}
                  className="bg-white rounded-2xl p-3.5 border border-slate-200/90 hover:border-indigo-400 transition-all shadow-xs space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2.5 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                        {getCategoryIcon(work.categoryId, 'w-5 h-5')}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h4 className="text-xs font-extrabold text-slate-900 leading-tight">
                            {work.title}
                          </h4>
                          {work.badge && (
                            <span className="text-[9px] font-black px-1.5 py-0.2 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100">
                              {work.badge}
                            </span>
                          )}
                          {work.emergencyAvailable && (
                            <span className="text-[9px] font-black px-1.5 py-0.2 rounded-md bg-rose-50 text-rose-700 border border-rose-100 flex items-center gap-0.5">
                              <Flame className="w-2.5 h-2.5 text-rose-500 fill-rose-500" />
                              SOS 30m
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1 leading-snug line-clamp-2">
                          {work.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Price & Timing breakdown pill */}
                  <div className="bg-slate-50 rounded-xl p-2 flex items-center justify-between text-[11px] border border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-slate-900">
                        ₹{work.visitingFee} <span className="font-normal text-slate-500">Fixed Visit</span>
                      </span>
                      <span className="text-slate-300">·</span>
                      <span className="font-bold text-emerald-700">
                        + ₹{work.estimatedLabor} <span className="font-normal text-slate-500">Labor</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-slate-500">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>~{work.estDurationMinutes} mins</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between gap-2 pt-0.5">
                    <button
                      onClick={() => {
                        onInstantDeliverWork(work);
                        onClose();
                      }}
                      className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 font-extrabold text-[11px] flex items-center gap-1 active:scale-95 transition-transform cursor-pointer"
                    >
                      <Flame className="w-3 h-3 text-amber-600 fill-amber-600" />
                      <span>⚡ Instant Deliver</span>
                    </button>

                    <button
                      onClick={() => {
                        onSelectWork(work);
                        onClose();
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs flex items-center gap-1 shadow-xs active:scale-95 transition-transform cursor-pointer"
                    >
                      <span>Book Work</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
