import React, { useState } from 'react';
import {
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
  Search,
  Clock,
  ShieldCheck,
  ChevronRight,
  Flame,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Star,
  X,
  ListFilter,
  Grid,
  Mic,
  Bot
} from 'lucide-react';
import { ServiceCategory, ServiceWorkItem, ServiceCategoryId, LanguageCode } from '../types/index.ts';
import { ALL_SERVICE_WORKS } from '../data/mockData.ts';
import { t, getCategoryTitle, SPEECH_LANG_CODES } from '../utils/i18n.ts';

interface ServiceCatalogProps {
  categories: ServiceCategory[];
  onSelectCategory: (category: ServiceCategory, prefillIssue?: string) => void;
  onInstantEmergency: (category: ServiceCategory) => void;
  onSelectWork?: (work: ServiceWorkItem) => void;
  onInstantDeliverWork?: (work: ServiceWorkItem) => void;
  onOpenGlobalSearch?: (initialQuery?: string) => void;
  onOpenMaha?: () => void;
  currentLanguage?: LanguageCode;
}

export const ServiceCatalog: React.FC<ServiceCatalogProps> = ({
  categories,
  onSelectCategory,
  onInstantEmergency,
  onSelectWork,
  onInstantDeliverWork,
  onOpenGlobalSearch,
  onOpenMaha,
  currentLanguage = 'en'
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategoryId, setActiveCategoryId] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'categories' | 'works'>('categories');
  const [isListening, setIsListening] = useState(false);

  const getCategoryIcon = (iconName: string, className = 'w-5 h-5') => {
    switch (iconName) {
      case 'Wrench': return <Wrench className={`${className} text-blue-600`} />;
      case 'Zap': return <Zap className={`${className} text-amber-500`} />;
      case 'Snowflake': return <Snowflake className={`${className} text-cyan-500`} />;
      case 'Tv': return <Tv className={`${className} text-indigo-500`} />;
      case 'Droplets': return <Droplets className={`${className} text-blue-500`} />;
      case 'Hammer': return <Hammer className={`${className} text-orange-600`} />;
      case 'Sparkles': return <Sparkles className={`${className} text-pink-600`} />;
      case 'Bug': return <Bug className={`${className} text-rose-500`} />;
      case 'Key': return <Key className={`${className} text-purple-600`} />;
      case 'Paintbrush': return <Paintbrush className={`${className} text-pink-600`} />;
      case 'Home': return <Home className={`${className} text-indigo-600`} />;
      case 'Shield': return <Shield className={`${className} text-blue-700`} />;
      case 'Layers': return <Layers className={`${className} text-slate-700`} />;
      default: return <Sparkles className={`${className} text-indigo-600`} />;
    }
  };

  // Voice Search Handler
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
        if (text) setSearchTerm(text);
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      recognition.start();
    } catch (_) {
      setIsListening(false);
    }
  };

  // Filter Categories
  const filteredCategories = categories.filter((cat) => {
    const q = searchTerm.toLowerCase().trim();
    const titleTrans = getCategoryTitle(cat.id, currentLanguage).toLowerCase();
    const matchesSearch =
      !q ||
      cat.title.toLowerCase().includes(q) ||
      titleTrans.includes(q) ||
      cat.description.toLowerCase().includes(q) ||
      cat.popularIssues.some((issue) => issue.toLowerCase().includes(q));

    if (!matchesSearch) return false;
    if (activeCategoryId !== 'all' && cat.id !== activeCategoryId) return false;
    return true;
  });

  // Filter Individual Works
  const filteredWorks = ALL_SERVICE_WORKS.filter((work) => {
    if (activeCategoryId !== 'all' && work.categoryId !== activeCategoryId) return false;

    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase().trim();
    return (
      work.title.toLowerCase().includes(q) ||
      work.description.toLowerCase().includes(q) ||
      work.categoryTitle.toLowerCase().includes(q) ||
      work.keywords.some((k) => k.toLowerCase().includes(q))
    );
  });

  const isSearching = searchTerm.trim().length > 0;

  return (
    <div className="space-y-4">
      {/* Search Bar with Voice Microphone and Filters */}
      <div className="relative flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder={t('search_placeholder', currentLanguage)}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-16 py-2.5 sm:py-3 rounded-2xl bg-white border border-slate-200/90 text-xs sm:text-sm text-slate-900 placeholder-slate-400 shadow-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium transition-all"
          />

          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {searchTerm ? (
              <button
                onClick={() => setSearchTerm('')}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : null}

            {/* Voice Input Mic */}
            <button
              type="button"
              onClick={handleVoiceSearch}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                isListening
                  ? 'bg-rose-600 text-white animate-pulse'
                  : 'text-slate-400 hover:text-indigo-600 hover:bg-slate-100'
              }`}
              title="Voice Search in your language"
            >
              <Mic className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {onOpenGlobalSearch && (
          <button
            onClick={() => onOpenGlobalSearch(searchTerm)}
            className="px-3.5 py-2.5 sm:py-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-2xl border border-indigo-200/80 text-xs font-bold shrink-0 flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
            title="Open Full Search Dialog"
          >
            <ListFilter className="w-4 h-4" />
            <span className="hidden sm:inline">All Filters</span>
          </button>
        )}
      </div>

      {/* Ask Maha AI Banner (Responsive layout) */}
      {onOpenMaha && (
        <div
          onClick={onOpenMaha}
          className="p-3.5 sm:p-4 bg-gradient-to-r from-purple-950 via-indigo-900 to-slate-900 rounded-2xl sm:rounded-3xl text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md border border-purple-500/30 cursor-pointer active:scale-[0.99] transition-all hover:border-purple-400/50"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 via-rose-500 to-indigo-500 p-0.5 shrink-0 flex items-center justify-center shadow-xs">
              <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
              </div>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-black text-white">Ask Maha AI Assistant</h4>
                <span className="text-[9px] font-black bg-amber-400 text-slate-950 px-1.5 py-0.2 rounded-full uppercase tracking-tight">
                  Gemini AI
                </span>
                <span className="hidden md:inline text-[10px] text-emerald-400 font-bold">
                  • 24/7 Diagnostics
                </span>
              </div>
              <p className="text-xs text-indigo-200 truncate mt-0.5">
                Describe problems in plain words: salon at home, water leak, sparks, or car jumpstart • Flat ₹199 Visit
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
            <span className="text-xs font-black text-amber-300 bg-white/10 px-3 py-1.5 rounded-xl border border-white/20 flex items-center gap-1 hover:bg-white/20 transition-colors">
              Chat & Diagnose <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      )}

      {/* Guaranteed Transparent Flat ₹199 Visiting Charge Strip */}
      <div className="px-3.5 py-2.5 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 rounded-2xl border border-emerald-200 flex flex-wrap items-center justify-between gap-2 text-xs shadow-2xs">
        <div className="flex items-center gap-2 font-bold text-emerald-950">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{t('no_higher_charge_badge', currentLanguage)}</span>
        </div>

        <div className="flex items-center gap-3 text-[11px] text-emerald-800">
          <span className="hidden sm:inline font-semibold">✓ 30-Day Warranty</span>
          <span className="hidden md:inline font-semibold">✓ Verified Pros</span>
          <span className="text-[10px] font-black bg-emerald-600 text-white px-2.5 py-0.5 rounded-full shadow-2xs">
            ₹199 Flat Visit
          </span>
        </div>
      </div>

      {/* Category Filter Carousel / Responsive Pills */}
      <div className="overflow-x-auto md:overflow-visible no-scrollbar -mx-1 px-1 py-1">
        <div className="flex items-center md:flex-wrap gap-2 min-w-max md:min-w-0">
          <button
            onClick={() => setActiveCategoryId('all')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
              activeCategoryId === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <span>All Services ({categories.length})</span>
          </button>

          {categories.map((cat) => {
            const isSelected = activeCategoryId === cat.id;
            const localizedTitle = getCategoryTitle(cat.id, currentLanguage);
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategoryId(isSelected ? 'all' : cat.id)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {getCategoryIcon(cat.iconName, 'w-3.5 h-3.5')}
                <span>{localizedTitle.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* View Mode Toggle: Categories vs All Works */}
      <div className="flex items-center justify-between px-0.5">
        <div className="bg-slate-200/80 p-0.5 rounded-xl flex items-center text-[11px] font-bold">
          <button
            onClick={() => setViewMode('categories')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              viewMode === 'categories' && !isSearching
                ? 'bg-white text-slate-900 shadow-xs font-black'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Categories ({filteredCategories.length})
          </button>
          <button
            onClick={() => setViewMode('works')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              viewMode === 'works' || isSearching
                ? 'bg-white text-slate-900 shadow-xs font-black text-indigo-700'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Works ({filteredWorks.length})
          </button>
        </div>

        <span className="text-[11px] font-extrabold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
          ₹199 Fixed Visiting Fee
        </span>
      </div>

      {/* VIEW 1: INDIVIDUAL WORKS LIST (Responsive 1/2/3 Columns Grid) */}
      {(viewMode === 'works' || isSearching) ? (
        <div>
          {filteredWorks.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 space-y-2">
              <Search className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-sm font-bold text-slate-800">No matching services found</p>
              <p className="text-xs text-slate-500">Try searching for facial, waxing, haircut, tap leak, AC, fan, car wash.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
              {filteredWorks.map((work) => (
                <div
                  key={work.id}
                  className="bg-white rounded-2xl p-4 border border-slate-200/90 hover:border-indigo-400 shadow-xs space-y-3 transition-all hover:shadow-md flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] font-black text-indigo-600 uppercase tracking-tight">
                          {getCategoryTitle(work.categoryId, currentLanguage)}
                        </span>
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
                    </div>

                    <h4 className="text-xs sm:text-sm font-black text-slate-900 leading-snug">
                      {work.title}
                    </h4>
                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                      {work.description}
                    </p>
                  </div>

                  <div className="space-y-2.5 pt-1">
                    {/* Price pill */}
                    <div className="bg-slate-50 rounded-xl p-2.5 flex items-center justify-between text-xs border border-slate-100">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-slate-900">
                          ₹199 <span className="font-normal text-slate-500">Visit</span>
                        </span>
                        <span className="text-slate-300">·</span>
                        <span className="font-bold text-emerald-700">
                          + ₹{work.estimatedLabor} <span className="font-normal text-slate-500">Labor</span>
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-slate-500 text-[11px]">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>~{work.estDurationMinutes}m</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          if (onInstantDeliverWork) {
                            onInstantDeliverWork(work);
                          } else {
                            const matchingCat = categories.find((c) => c.id === work.categoryId) || categories[0];
                            onInstantEmergency(matchingCat);
                          }
                        }}
                        className="px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 font-extrabold text-xs flex items-center gap-1 active:scale-95 transition-transform cursor-pointer"
                      >
                        <Flame className="w-3.5 h-3.5 text-amber-600 fill-amber-600" />
                        <span>⚡ Instant Deliver</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (onSelectWork) {
                            onSelectWork(work);
                          } else {
                            const matchingCat = categories.find((c) => c.id === work.categoryId) || categories[0];
                            onSelectCategory(matchingCat, work.title);
                          }
                        }}
                        className="flex-1 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs flex items-center justify-center gap-1 shadow-xs active:scale-95 transition-transform cursor-pointer"
                      >
                        <span>{t('book_now', currentLanguage)}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* VIEW 2: CATEGORY VIEW (Responsive 1/2/3/4 Columns Grid) */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-4">
          {filteredCategories.map((category) => {
            const localizedTitle = getCategoryTitle(category.id, currentLanguage);
            return (
              <div
                key={category.id}
                onClick={() => onSelectCategory(category)}
                className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-slate-200/90 hover:border-indigo-400 shadow-xs hover:shadow-md active:scale-[0.99] transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 group-hover:bg-indigo-50 group-hover:border-indigo-100 flex items-center justify-center shrink-0 transition-colors">
                        {getCategoryIcon(category.iconName, 'w-6 h-6')}
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors">
                          {localizedTitle}
                        </h4>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-xs font-extrabold text-emerald-700">
                            ₹199 Fixed Visit
                          </span>
                          <span className="text-slate-300">·</span>
                          <span className="text-[11px] text-slate-500 font-medium">
                            ~{category.estDurationMinutes}m
                          </span>
                        </div>
                      </div>
                    </div>

                    {category.badge && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100 shrink-0">
                        {category.badge}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 mt-3 line-clamp-2 leading-relaxed">
                    {category.description}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-1">
                    {category.popularIssues.slice(0, 3).map((issue) => (
                      <span
                        key={issue}
                        className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md truncate max-w-[200px]"
                      >
                        {issue}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3.5 mt-3 border-t border-slate-100 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onInstantEmergency(category);
                    }}
                    className="px-2.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 font-extrabold text-[11px] flex items-center gap-1 active:scale-95 transition-transform cursor-pointer"
                  >
                    <Flame className="w-3 h-3 text-amber-600 fill-amber-600" />
                    <span>Instant Dispatch</span>
                  </button>

                  <span className="text-indigo-600 font-extrabold text-xs flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                    <span>Book Pro</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
