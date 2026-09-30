import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Send,
  Mic,
  Volume2,
  VolumeX,
  Bot,
  Flame,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  Clock,
  CheckCircle2,
  Wrench,
  Zap,
  HelpCircle,
  Lightbulb,
  Languages
} from 'lucide-react';
import { ServiceCategory, ServiceWorkItem, ServiceCategoryId, LanguageCode } from '../types/index.ts';
import { SERVICE_CATEGORIES, ALL_SERVICE_WORKS } from '../data/mockData.ts';
import { t, SPEECH_LANG_CODES } from '../utils/i18n.ts';

export interface MahaChatMessage {
  id: string;
  sender: 'user' | 'maha';
  text: string;
  timestamp: number;
  action?: {
    category: ServiceCategoryId;
    title: string;
    labor: number;
    visitingFee: number;
    urgency?: 'emergency_30min' | 'standard' | 'scheduled';
  } | null;
}

interface MahaChatViewProps {
  onBookWork: (category: ServiceCategory, workTitle: string) => void;
  onInstantDeliver: (category: ServiceCategory, workTitle: string, labor: number) => void;
  currentLanguage?: LanguageCode;
  onOpenLanguageModal?: () => void;
  className?: string;
}

export const MahaChatView: React.FC<MahaChatViewProps> = ({
  onBookWork,
  onInstantDeliver,
  currentLanguage = 'en',
  onOpenLanguageModal,
  className = ''
}) => {
  const [messages, setMessages] = useState<MahaChatMessage[]>(() => [
    {
      id: 'welcome-1',
      sender: 'maha',
      text: `Namaste! I am Maha, your FixMate AI assistant. I can diagnose home issues (plumbing, electrical, AC), recommend doorstep salon & beauty packages, or explain our guaranteed flat ₹199 visiting fee. How can I help you today?`,
      timestamp: Date.now() - 1000
    }
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const quickPrompts = [
    '🌸 Recommend a facial & waxing at home',
    '⚡ Switchboard spark & burning smell',
    '🚰 Kitchen tap leaking under cabinet',
    '🚗 Car battery dead need jumpstart',
    '💰 Explain the ₹199 visiting fee',
    '❄️ AC blowing warm air',
    '💇 Doorstep haircut & beard trim'
  ];

  // Voice speech input
  const handleToggleVoiceInput = () => {
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
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          handleSendMessage(transcript);
        }
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      recognition.start();
    } catch (_) {
      setIsListening(false);
    }
  };

  // Text-To-Speech for individual Maha response
  const handleToggleSpeak = (msg: MahaChatMessage) => {
    if (!('speechSynthesis' in window)) return;

    if (speakingMsgId === msg.id) {
      window.speechSynthesis.cancel();
      setSpeakingMsgId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(msg.text);
    utterance.lang = SPEECH_LANG_CODES[currentLanguage] || 'en-IN';
    utterance.rate = 0.95;

    utterance.onend = () => setSpeakingMsgId(null);
    utterance.onerror = () => setSpeakingMsgId(null);

    setSpeakingMsgId(msg.id);
    window.speechSynthesis.speak(utterance);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const queryText = (textToSend || input).trim();
    if (!queryText || loading) return;

    const userMsg: MahaChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: queryText,
      timestamp: Date.now()
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInput('');
    setLoading(true);

    try {
      // Send conversation to /api/maha/chat
      const chatPayload = newHistory.map((m) => ({
        role: m.sender === 'maha' ? 'model' : 'user',
        text: m.text
      }));

      const res = await fetch('/api/maha/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: chatPayload,
          language: currentLanguage
        })
      });

      if (!res.ok) {
        throw new Error('Maha chat server error');
      }

      const json = await res.json();
      if (json.success) {
        const mahaMsg: MahaChatMessage = {
          id: `maha-${Date.now()}`,
          sender: 'maha',
          text: json.reply,
          timestamp: Date.now(),
          action: json.action
        };
        setMessages((prev) => [...prev, mahaMsg]);
      } else {
        throw new Error(json.error || 'Failed to chat');
      }
    } catch (err: any) {
      console.warn('Maha Chat fallback:', err.message);
      // Smart Client Fallback
      const lower = queryText.toLowerCase();
      let reply = `I understand! FixMate certified professionals are available right now. Our visiting charge is flat ₹199 with zero surge pricing. What location would you like the pro dispatched to?`;
      let action: any = null;

      if (lower.includes('facial') || lower.includes('wax') || lower.includes('beauty') || lower.includes('parlour')) {
        reply = `For Salon at Home, our expert beauticians arrive with 100% disposable hygiene kits, wax warmers, and branded cosmetics (O3+, Rica, L'Oreal). The visiting fee is strictly flat ₹199.`;
        action = {
          category: 'beauty_women',
          title: lower.includes('wax') ? 'Rica / Honey Full Arms & Full Legs Waxing' : 'O3+ Shine & Glow Facial with Cleanup',
          labor: 449,
          visitingFee: 199,
          urgency: 'standard'
        };
      } else if (lower.includes('spark') || lower.includes('wire') || lower.includes('mcb') || lower.includes('shock')) {
        reply = `⚠️ Safety Alert: Please turn off the main MCB breaker immediately to prevent an electrical fire hazard! Do not touch the switchboard with bare hands. I can dispatch an emergency electrician in 30 minutes.`;
        action = {
          category: 'electrical',
          title: 'Main MCB Tripping & Short Circuit Diagnostic',
          labor: 180,
          visitingFee: 199,
          urgency: 'emergency_30min'
        };
      } else if (lower.includes('leak') || lower.includes('tap') || lower.includes('pipe') || lower.includes('water')) {
        reply = `For water leakage, please turn off the overhead tank inlet stopcock valve to stop further flooding. Our plumber will inspect the spindle washer and pipe threads for flat ₹199 visit.`;
        action = {
          category: 'plumbing',
          title: 'Tap Replacement & Leak Repair',
          labor: 140,
          visitingFee: 199,
          urgency: 'standard'
        };
      }

      const mahaMsg: MahaChatMessage = {
        id: `maha-${Date.now()}`,
        sender: 'maha',
        text: reply,
        timestamp: Date.now(),
        action
      };
      setMessages((prev) => [...prev, mahaMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleActionDeliver = (action: NonNullable<MahaChatMessage['action']>) => {
    const cat = SERVICE_CATEGORIES.find((c) => c.id === action.category) || SERVICE_CATEGORIES[0];
    onInstantDeliver(cat, action.title, action.labor);
  };

  const handleActionBook = (action: NonNullable<MahaChatMessage['action']>) => {
    const cat = SERVICE_CATEGORIES.find((c) => c.id === action.category) || SERVICE_CATEGORIES[0];
    onBookWork(cat, action.title);
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'maha',
        text: `Chat restarted! Namaste! How can I assist you with your home services, salon needs, or repairs today?`,
        timestamp: Date.now()
      }
    ]);
  };

  return (
    <div className={`flex flex-col h-full bg-white rounded-2xl overflow-hidden border border-slate-200/90 shadow-xs ${className}`}>
      {/* Maha Chat Header */}
      <div className="p-3 bg-gradient-to-r from-purple-950 via-indigo-900 to-slate-900 text-white flex items-center justify-between shadow-xs shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="relative shrink-0">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 via-rose-500 to-indigo-500 p-0.5 shadow-md flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
              </div>
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-slate-950 rounded-full" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h4 className="font-black text-sm text-white">Maha AI Assistant</h4>
              <span className="text-[9px] font-black bg-amber-400 text-slate-950 px-1 rounded uppercase">Gemini</span>
            </div>
            <p className="text-[11px] text-indigo-200 truncate">
              Online 24/7 • Flat ₹199 Visit Policy
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
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
            onClick={handleResetChat}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
            title="Clear & restart conversation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Transparent Rate Guarantee Tag */}
      <div className="px-3 py-1.5 bg-emerald-50 border-b border-emerald-100 flex items-center justify-between text-[11px] shrink-0">
        <span className="text-emerald-900 font-bold flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          Flat ₹199 Visiting Fee • No Higher Charges Guarantee
        </span>
        <span className="text-[9px] bg-emerald-600 text-white px-2 py-0.2 rounded-full font-black">
          Fixed
        </span>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-3 bg-slate-50/60">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          const isSpeaking = speakingMsgId === msg.id;

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} animate-in fade-in duration-200`}
            >
              <div className="flex items-end gap-1.5 max-w-[88%]">
                {!isUser && (
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center shrink-0 mb-1 shadow-2xs">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  </div>
                )}

                <div
                  className={`rounded-2xl px-3.5 py-2.5 text-xs shadow-xs leading-relaxed ${
                    isUser
                      ? 'bg-indigo-600 text-white rounded-br-xs'
                      : 'bg-white text-slate-800 border border-slate-200/90 rounded-bl-xs space-y-2'
                  }`}
                >
                  <p className="whitespace-pre-wrap font-medium">{msg.text}</p>

                  {/* Interactive Action Card generated by Maha */}
                  {msg.action && (
                    <div className="pt-2 border-t border-slate-100 space-y-2">
                      <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase tracking-tight text-indigo-600">
                            Recommended Work
                          </span>
                          <span className="text-[9px] font-black bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded">
                            ₹199 Fixed Visit
                          </span>
                        </div>
                        <h5 className="font-extrabold text-xs text-slate-900 leading-tight">
                          {msg.action.title}
                        </h5>
                        <div className="flex items-center justify-between text-[11px] text-slate-600 pt-0.5">
                          <span>Est. Labor: ₹{msg.action.labor}</span>
                          <span className="font-black text-slate-900">
                            Total: ₹{msg.action.visitingFee + msg.action.labor}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleActionDeliver(msg.action!)}
                          className="flex-1 py-1.5 px-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-[11px] rounded-xl flex items-center justify-center gap-1 shadow-2xs active:scale-95 transition-transform cursor-pointer"
                        >
                          <Flame className="w-3 h-3 fill-slate-950" />
                          <span>⚡ Instant Deliver</span>
                        </button>

                        <button
                          onClick={() => handleActionBook(msg.action!)}
                          className="flex-1 py-1.5 px-2 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-[11px] rounded-xl flex items-center justify-center gap-1 shadow-2xs active:scale-95 transition-transform cursor-pointer"
                        >
                          <span>Book Pro</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {!isUser && (
                  <button
                    onClick={() => handleToggleSpeak(msg)}
                    className="p-1 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-200/60 transition-colors mb-1"
                    title={isSpeaking ? 'Stop speaking' : 'Listen to message'}
                  >
                    {isSpeaking ? (
                      <VolumeX className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
                    ) : (
                      <Volume2 className="w-3.5 h-3.5" />
                    )}
                  </button>
                )}
              </div>

              <span className="text-[9px] text-slate-400 mt-1 px-1">
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-center gap-2 text-slate-400 text-xs py-2">
            <div className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center animate-spin">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <span className="font-semibold text-slate-500">Maha is analyzing your request...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompt Suggestions */}
      <div className="px-3 py-1.5 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
        {quickPrompts.map((prompt, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSendMessage(prompt.replace(/^[^\w\s]+\s*/, ''))}
            className="text-[10px] bg-slate-50 hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 px-2.5 py-1 rounded-full whitespace-nowrap transition-colors border border-slate-200/80 shrink-0 font-medium cursor-pointer"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Chat Input Bar */}
      <div className="p-2.5 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder={isListening ? 'Listening... speak now' : 'Ask Maha anything in any language...'}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none min-h-[42px] font-medium"
          />

          {/* Voice Input Mic */}
          <button
            type="button"
            onClick={handleToggleVoiceInput}
            className={`absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-colors ${
              isListening
                ? 'bg-rose-600 text-white animate-pulse'
                : 'text-slate-400 hover:text-indigo-600 hover:bg-slate-100'
            }`}
            title="Speak your question in your language"
          >
            <Mic className="w-3.5 h-3.5" />
          </button>
        </div>

        <button
          onClick={() => handleSendMessage()}
          disabled={loading || !input.trim()}
          className="w-10 h-10 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white flex items-center justify-center shadow-xs active:scale-95 transition-transform shrink-0 cursor-pointer"
          title="Send Message"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
