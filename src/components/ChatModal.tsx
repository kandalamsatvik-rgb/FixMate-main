import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Send,
  Phone,
  Paperclip,
  Check,
  CheckCheck,
  User,
  Wrench,
  ShieldCheck,
  Image,
  Sparkles
} from 'lucide-react';
import { ChatMessage, Worker, JobRequest, UserRole } from '../types/index.ts';

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: JobRequest;
  worker: Worker;
  currentRole: UserRole;
  onTriggerCall: () => void;
  messages: ChatMessage[];
  onSendMessage: (text: string, attachment?: string) => void;
}

export const ChatModal: React.FC<ChatModalProps> = ({
  isOpen,
  onClose,
  job,
  worker,
  currentRole,
  onTriggerCall,
  messages,
  onSendMessage
}) => {
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickChips =
    currentRole === 'customer'
      ? [
          'Buzz code is #402',
          'I am waiting at the door',
          'Please call when at gate',
          'Water shutoff is ready'
        ]
      : [
          'Arrived outside in white van',
          'Navigating your lane, 3 mins',
          'Tools ready, please unlock gate',
          'Examining parts now'
        ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [isOpen, messages, isTyping]);

  if (!isOpen) return null;

  const handleSend = (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim()) return;
    onSendMessage(text);
    setInput('');

    if (currentRole === 'customer') {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        let reply = "Understood! I'm on my way and will notify you as soon as I pull up.";
        const lower = text.toLowerCase();
        if (lower.includes('code') || lower.includes('buzz') || lower.includes('gate')) {
          reply = `Noted the gate info! Accessing now. See you in a minute.`;
        } else if (lower.includes('where') || lower.includes('far') || lower.includes('eta') || lower.includes('time')) {
          reply = `Just turned into your street! (${worker.vehicle.model}, ${worker.vehicle.plateNumber}).`;
        } else if (lower.includes('door') || lower.includes('waiting') || lower.includes('ring')) {
          reply = `Copy that! I will ring the bell upon arrival.`;
        }
        onSendMessage(reply);
      }, 1200);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col h-[90vh] sm:h-[620px] animate-in slide-in-from-bottom duration-200">
        {/* Mobile Grab Handle */}
        <div className="pt-2.5 pb-1 flex justify-center sm:hidden bg-slate-900">
          <div className="w-12 h-1.5 bg-slate-600 rounded-full" />
        </div>

        {/* Header */}
        <div className="px-4 py-3 bg-slate-900 text-white flex items-center justify-between shadow-xs shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <img
                src={worker.avatar}
                alt="Avatar"
                className="w-10 h-10 rounded-xl object-cover ring-2 ring-indigo-500"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-slate-900 rounded-full" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm text-white">
                  {currentRole === 'customer' ? worker.name : job.customerName}
                </span>
                <span className="text-[10px] bg-indigo-500/30 text-indigo-300 px-1.5 py-0.2 rounded font-bold">
                  {worker.rating}★
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                {worker.vehicle.model} • {worker.vehicle.plateNumber}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={onTriggerCall}
              className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-colors shadow-xs active:scale-95"
              title="Voice Call"
            >
              <Phone className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Encrypted Notice */}
        <div className="bg-slate-50 border-b border-slate-200/80 px-3 py-1 flex items-center justify-center gap-1.5 text-[10px] text-slate-500 shrink-0">
          <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
          <span>Encrypted Direct FixMate Pro Dispatch Line</span>
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-3.5 space-y-2.5 bg-slate-50/70">
          {messages.map((msg) => {
            const isMe =
              (currentRole === 'customer' && msg.senderRole === 'customer') ||
              (currentRole === 'worker' && msg.senderRole === 'worker');

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
                <div className="flex items-center gap-1 mt-0.5 text-[9px] text-slate-400 px-1">
                  <span>
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                  {isMe && <CheckCheck className="w-3 h-3 text-indigo-500" />}
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex items-center gap-1 text-xs text-slate-400 italic bg-white px-3 py-1.5 rounded-full border border-slate-200 w-fit">
              <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" />
              <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.4s]" />
              <span className="ml-1 text-[10px] font-medium text-slate-500">
                {worker.name} is typing...
              </span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-3 py-1.5 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
          <Sparkles className="w-3 h-3 text-indigo-500 shrink-0" />
          {quickChips.map((chip, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSend(chip)}
              className="text-[10px] bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 px-2.5 py-1 rounded-full whitespace-nowrap transition-colors border border-slate-200/60 shrink-0"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Mobile Input Bar */}
        <div className="p-2.5 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0 pb-safe">
          <input
            type="text"
            placeholder={`Message ${worker.name.split(' ')[0]}...`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none min-h-[40px]"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim()}
            className="w-10 h-10 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white flex items-center justify-center transition-colors shadow-xs active:scale-95 shrink-0 cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
