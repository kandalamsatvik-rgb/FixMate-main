import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Search,
  X,
  Send,
  Wrench,
  Zap,
  ShieldCheck,
  Flame,
  AlertTriangle,
  Clock,
  ArrowRight,
  CheckCircle2,
  Bot,
  HelpCircle,
  Lightbulb,
  ShieldAlert,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Languages,
  MessageSquare
} from 'lucide-react';
import { ServiceWorkItem, ServiceCategory, ServiceCategoryId, LanguageCode } from '../types/index.ts';
import { SERVICE_CATEGORIES, ALL_SERVICE_WORKS } from '../data/mockData.ts';
import { t, SPEECH_LANG_CODES } from '../utils/i18n.ts';
import { MahaChatView } from './MahaChatView.tsx';

interface MahaDiagnosis {
  summary: string;
  recommendedCategory: ServiceCategoryId;
  categoryTitle: string;
  recommendedWorkTitle: string;
  estimatedLaborCost: number;
  visitingFee: number;
  urgency: 'emergency_30min' | 'standard' | 'scheduled';
  urgencyReason: string;
  safetyWarning: string;
  toolsNeeded: string[];
  estimatedMinutes: number;
  mahaTip: string;
}

interface MahaAISearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookWork: (category: ServiceCategory, workTitle: string) => void;
  onInstantDeliver: (category: ServiceCategory, workTitle: string, labor: number) => void;
  currentLanguage?: LanguageCode;
  onOpenLanguageModal?: () => void;
}

export const MahaAISearchModal: React.FC<MahaAISearchModalProps> = ({
  isOpen,
  onClose,
  onBookWork,
  onInstantDeliver,
  currentLanguage = 'en',
  onOpenLanguageModal
}) => {
  const [activeMode, setActiveMode] = useState<'chat' | 'diagnostic'>('chat');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [diagnosis, setDiagnosis] = useState<MahaDiagnosis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const samplePrompts = [
    'Book full waxing and O3+ glow facial at home',
    "Men's haircut, beard styling & head massage champi",
    'Kitchen tap leaking heavily and pipe under sink loose',
    'AC is on but blowing warm air and humming',
    'Car won’t start, dead battery jumpstart needed urgently',
    'Main MCB trips whenever geyser or AC is switched on',
    'Senior citizen health checkup: BP, sugar and pulse test'
  ];

  // Stop speech when modal closes
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  if (!isOpen) return null;

  // Web Speech Recognition for voice search
  const handleToggleVoiceInput = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please type your query.');
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

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setQuery(transcript);
          handleAskMaha(transcript);
        }
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (_) {
      setIsListening(false);
    }
  };

  // Text-To-Speech to read out diagnosis aloud
  const handleToggleSpeakDiagnosis = () => {
    if (!('speechSynthesis' in window) || !diagnosis) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const textToSpeak = `${diagnosis.summary}. Recommended work: ${diagnosis.recommendedWorkTitle}. Flat visiting fee is rupees 199. Safety tip: ${diagnosis.safetyWarning}`;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = SPEECH_LANG_CODES[currentLanguage] || 'en-IN';
    utterance.rate = 0.95;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleAskMaha = async (textToAsk?: string) => {
    const q = textToAsk || query;
    if (!q.trim()) return;
    setLoading(true);
    setError(null);
    setDiagnosis(null);

    try {
      const res = await fetch('/api/maha/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q.trim(), language: currentLanguage })
      });

      if (!res.ok) {
        throw new Error('Maha diagnostic service unavailable');
      }

      const json = await res.json();
      if (json.success && json.data) {
        const diag = json.data;
        diag.visitingFee = 199; // Strictly guaranteed 199
        setDiagnosis(diag);
      } else {
        throw new Error(json.error || 'Failed to analyze');
      }
    } catch (err: any) {
      console.warn('Falling back to local Maha intelligence:', err.message);
      // Smart Client-side fallback
      const lower = q.toLowerCase();
      let cat: ServiceCategoryId = 'plumbing';
      let title = 'Doorstep Repair & Diagnostic Inspection';
      let labor = 180;
      let isEmergency = false;

      if (lower.includes('facial') || lower.includes('wax') || lower.includes('pedicure') || lower.includes('beauty') || lower.includes('parlour') || lower.includes('skin')) {
        cat = 'beauty_women';
        title = lower.includes('wax') ? 'Rica / Honey Full Arms & Full Legs Waxing' : lower.includes('pedicure') ? 'Deluxe Rose & Crystal Spa Pedicure + Manicure' : 'O3+ Shine & Glow Facial with Cleanup';
        labor = lower.includes('wax') ? 449 : 599;
      } else if (lower.includes('haircut') || lower.includes('beard') || lower.includes('barber') || lower.includes('champi')) {
        cat = 'grooming_men';
        title = lower.includes('beard') ? 'Beard Trim, Sharp Line Razor Edge & Conditioning' : "Men's Haircut, Style & Refreshing Wash";
        labor = lower.includes('beard') ? 140 : 180;
      } else if (lower.includes('car') || lower.includes('bike') || lower.includes('battery') || lower.includes('jumpstart')) {
        cat = 'vehicle_care';
        title = lower.includes('battery') || lower.includes('jumpstart') ? 'Emergency 12V Car Battery Jumpstart (30-Min Arrival)' : 'Eco High-Pressure Foam Car Wash & Vacuum';
        labor = lower.includes('battery') ? 250 : 350;
        isEmergency = lower.includes('battery');
      } else if (lower.includes('spark') || lower.includes('mcb') || lower.includes('shock') || lower.includes('wire') || lower.includes('switch')) {
        cat = 'electrical';
        title = lower.includes('mcb') ? 'Main MCB Tripping & Short Circuit Diagnostic' : 'Switchboard Repair & 16A/6A Socket Replacement';
        labor = 180;
        isEmergency = true;
      } else if (lower.includes('ac') || lower.includes('cool') || lower.includes('gas')) {
        cat = 'ac_cooling';
        title = lower.includes('gas') ? 'AC Gas Leak Testing & Full Gas Charging' : 'Split AC Power Jet Deep Servicing';
        labor = 449;
      } else if (lower.includes('lock') || lower.includes('key')) {
        cat = 'locksmith';
        title = lower.includes('lockout') || lower.includes('locked') ? 'Emergency House Lockout Door Opening' : 'Godrej / Yale Main Door Lock Replacement';
        labor = 260;
        isEmergency = lower.includes('locked');
      }

      setDiagnosis({
        summary: `Maha AI identified the right service for "${q}".`,
        recommendedCategory: cat,
        categoryTitle: cat.toUpperCase(),
        recommendedWorkTitle: title,
        estimatedLaborCost: labor,
        visitingFee: 199,
        urgency: isEmergency ? 'emergency_30min' : 'standard',
        urgencyReason: isEmergency ? 'Safety hazard or emergency requiring priority dispatch.' : 'Doorstep certified pro visit.',
        safetyWarning: isEmergency ? 'Turn off main switch/valve and avoid touching wire contacts.' : 'Ensure clear access to work area for pro.',
        toolsNeeded: ['Standard certified FixMate toolkit', 'Safety kit'],
        estimatedMinutes: 40,
        mahaTip: 'Maha guarantees flat ₹199 visiting charges with 30 days warranty on completed repair.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleActionBook = () => {
    if (!diagnosis) return;
    const cat = SERVICE_CATEGORIES.find((c) => c.id === diagnosis.recommendedCategory) || SERVICE_CATEGORIES[0];
    onBookWork(cat, diagnosis.recommendedWorkTitle);
    onClose();
  };

  const handleActionInstantDeliver = () => {
    if (!diagnosis) return;
    const cat = SERVICE_CATEGORIES.find((c) => c.id === diagnosis.recommendedCategory) || SERVICE_CATEGORIES[0];
    onInstantDeliver(cat, diagnosis.recommendedWorkTitle, diagnosis.estimatedLaborCost);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-100 h-[92vh] sm:h-[690px] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-200">
        {/* Mobile Grab Handle */}
        <div className="pt-3 pb-1 flex justify-center sm:hidden shrink-0">
          <div className="w-12 h-1.5 bg-slate-300 rounded-full" />
        </div>

        {/* Maha Header */}
        <div className="px-4 py-3 bg-gradient-to-r from-indigo-950 via-purple-900 to-slate-900 text-white flex items-center justify-between shadow-xs shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 via-rose-500 to-indigo-500 p-0.5 shadow-md flex items-center justify-center">
              <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-black text-sm text-white">Maha AI Search & Diagnostics</h3>
                <span className="text-[9px] font-black bg-amber-400 text-slate-950 px-1.5 py-0.2 rounded-full uppercase tracking-tight">
                  Gemini AI
                </span>
              </div>
              <p className="text-[11px] text-indigo-200">
                Natural Diagnosis & Flat ₹199 Visiting Guarantee
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {onOpenLanguageModal && (
              <button
                onClick={onOpenLanguageModal}
                className="px-2 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-indigo-200 hover:text-white text-[11px] font-bold flex items-center gap-1 transition-colors"
                title="Change Language"
              >
                <Languages className="w-3.5 h-3.5" />
                <span className="uppercase">{currentLanguage}</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mode Selector: Live Chat with Maha vs Quick Diagnosis */}
        <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="bg-white/10 p-0.5 rounded-xl flex items-center gap-1 text-[11px] font-bold w-full">
            <button
              onClick={() => setActiveMode('chat')}
              className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeMode === 'chat'
                  ? 'bg-indigo-600 text-white shadow-xs font-black'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Live Chat with Maha</span>
            </button>
            <button
              onClick={() => setActiveMode('diagnostic')}
              className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeMode === 'diagnostic'
                  ? 'bg-indigo-600 text-white shadow-xs font-black'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Instant Diagnostic</span>
            </button>
          </div>
        </div>

        {/* Mode 1: Live Chat with Maha AI */}
        {activeMode === 'chat' ? (
          <div className="flex-1 overflow-hidden flex flex-col">
            <MahaChatView
              onBookWork={onBookWork}
              onInstantDeliver={onInstantDeliver}
              currentLanguage={currentLanguage}
              onOpenLanguageModal={onOpenLanguageModal}
              className="flex-1 rounded-none border-0 shadow-none"
            />
          </div>
        ) : (
          /* Mode 2: Quick Diagnostic Search */
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/60">
            {/* Transparent Rate Guarantee Banner */}
            <div className="p-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl text-white text-xs font-bold flex items-center justify-between shadow-xs">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-100" />
                <span>Flat ₹199 Service Fee • No Higher Charges Required</span>
              </span>
              <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-black">
                100% Fixed
              </span>
            </div>

          {/* Natural Language Search Input with Voice Microphone */}
          <div className="space-y-2">
            <div className="relative">
              <textarea
                rows={2}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleAskMaha();
                  }
                }}
                placeholder="Describe in any language: 'face facial at home', 'paani leak ho raha hai', 'car battery dead', 'switch spark'..."
                className="w-full pl-3 pr-24 py-3 rounded-2xl border border-slate-200 bg-white text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-xs resize-none font-medium"
              />

              <div className="absolute right-2.5 bottom-2.5 flex items-center gap-1.5">
                {/* Voice Input Mic */}
                <button
                  type="button"
                  onClick={handleToggleVoiceInput}
                  className={`p-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center ${
                    isListening
                      ? 'bg-rose-600 text-white animate-pulse'
                      : 'bg-slate-100 text-slate-700 hover:bg-indigo-50 hover:text-indigo-600'
                  }`}
                  title={isListening ? 'Listening... click to stop' : 'Tap to speak your problem'}
                >
                  {isListening ? <Mic className="w-4 h-4 animate-bounce" /> : <Mic className="w-4 h-4" />}
                </button>

                {/* Ask Maha Button */}
                <button
                  onClick={() => handleAskMaha()}
                  disabled={loading || !query.trim()}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-xl text-xs font-bold shadow-xs active:scale-95 transition-transform flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Ask Maha</span>
                </button>
              </div>
            </div>

            {/* Prompt Suggestion Chips */}
            {!diagnosis && !loading && (
              <div className="space-y-1.5">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                  Try asking Maha:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {samplePrompts.map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => {
                        setQuery(prompt);
                        handleAskMaha(prompt);
                      }}
                      className="text-[11px] bg-white hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 px-3 py-1.5 rounded-xl border border-slate-200/90 shadow-2xs transition-colors text-left"
                    >
                      💡 {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Loading Animation */}
          {loading && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs text-center space-y-3 animate-pulse">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
                <Bot className="w-6 h-6 animate-spin" />
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-slate-900">
                  Maha AI is diagnosing your problem...
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Checking root causes, tools needed, safety precautions & ₹199 pricing.
                </p>
              </div>
            </div>
          )}

          {/* Diagnosis Card */}
          {diagnosis && (
            <div className="bg-white rounded-2xl border border-indigo-100 shadow-sm overflow-hidden space-y-3 p-4 animate-in fade-in slide-in-from-bottom-2 duration-200">
              {/* Top Diagnosis Header */}
              <div className="flex items-start justify-between gap-2 pb-2.5 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-indigo-600 uppercase tracking-tight">
                      Maha AI Diagnosis
                    </span>
                    <h4 className="text-xs font-extrabold text-slate-900">
                      {diagnosis.recommendedWorkTitle}
                    </h4>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  {/* Read aloud button */}
                  <button
                    onClick={handleToggleSpeakDiagnosis}
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 transition-colors"
                    title={isSpeaking ? 'Stop speaking' : 'Listen to Maha diagnosis aloud'}
                  >
                    {isSpeaking ? <VolumeX className="w-4 h-4 text-rose-600" /> : <Volume2 className="w-4 h-4 text-indigo-600" />}
                  </button>

                  <span
                    className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase ${
                      diagnosis.urgency === 'emergency_30min'
                        ? 'bg-rose-100 text-rose-800 border border-rose-200'
                        : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    }`}
                  >
                    {diagnosis.urgency === 'emergency_30min' ? '🚨 SOS 30-Min' : 'Standard'}
                  </span>
                </div>
              </div>

              {/* Diagnosis Summary */}
              <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100/80">
                <p className="text-xs font-semibold text-slate-800 leading-relaxed">
                  {diagnosis.summary}
                </p>
                {diagnosis.urgencyReason && (
                  <p className="text-[11px] text-indigo-700 mt-1">
                    {diagnosis.urgencyReason}
                  </p>
                )}
              </div>

              {/* Safety Alert Warning */}
              {diagnosis.safetyWarning && (
                <div className="p-3 bg-amber-50 border border-amber-200/90 rounded-xl flex items-start gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[10px] font-black text-amber-950 uppercase tracking-tight">
                      Maha Safety & Hygiene Precaution:
                    </p>
                    <p className="text-[11px] text-amber-800 leading-snug">
                      {diagnosis.safetyWarning}
                    </p>
                  </div>
                </div>
              )}

              {/* Transparent Pricing Breakdown with No Higher Charges Guarantee */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 text-xs">
                <div className="flex justify-between items-center pb-1 border-b border-slate-200/80">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Transparent Pricing Guarantee
                  </span>
                  <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    No Higher Charges
                  </span>
                </div>

                <div className="flex justify-between text-slate-600">
                  <span>FixMate Visiting Fee:</span>
                  <span className="font-extrabold text-slate-900">₹{diagnosis.visitingFee} (Flat & Fixed)</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Estimated Work & Labor:</span>
                  <span className="font-semibold text-slate-900">₹{diagnosis.estimatedLaborCost}</span>
                </div>
                <div className="flex justify-between font-extrabold text-sm text-slate-900 border-t pt-1.5">
                  <span>Estimated Total:</span>
                  <span className="text-emerald-700 font-black">
                    ₹{diagnosis.visitingFee + diagnosis.estimatedLaborCost}
                  </span>
                </div>
              </div>

              {/* Tools & Duration */}
              <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  Est. Duration: ~{diagnosis.estimatedMinutes} mins
                </span>
                <span className="flex items-center gap-1 text-emerald-700 font-bold">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  30-Day FixMate Warranty
                </span>
              </div>

              {/* Maha Tip */}
              {diagnosis.mahaTip && (
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-2 text-[11px] text-slate-600">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                  <span><strong>Maha Tip:</strong> {diagnosis.mahaTip}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 flex items-center gap-2">
                <button
                  onClick={handleActionInstantDeliver}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs flex items-center justify-center gap-1 shadow-xs active:scale-95 transition-transform cursor-pointer"
                >
                  <Flame className="w-3.5 h-3.5 text-slate-950 fill-slate-950" />
                  <span>⚡ Instant Deliver</span>
                </button>

                <button
                  onClick={handleActionBook}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs flex items-center justify-center gap-1 shadow-xs active:scale-95 transition-transform cursor-pointer"
                >
                  <span>Book via Maha</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
      </div>
    </div>
  );
};
