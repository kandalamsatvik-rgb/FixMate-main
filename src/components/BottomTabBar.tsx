import React from 'react';
import {
  Wrench,
  Radio,
  MessageSquare,
  User as UserIcon,
  ShieldCheck
} from 'lucide-react';
import { LanguageCode } from '../types/index.ts';
import { t } from '../utils/i18n.ts';

export type MobileTab = 'services' | 'tracking' | 'messages' | 'account';

interface BottomTabBarProps {
  activeTab: MobileTab;
  onChangeTab: (tab: MobileTab) => void;
  activeJobCount: number;
  unreadCount: number;
  hasActiveJob: boolean;
  currentLanguage?: LanguageCode;
}

export const BottomTabBar: React.FC<BottomTabBarProps> = ({
  activeTab,
  onChangeTab,
  activeJobCount,
  unreadCount,
  hasActiveJob,
  currentLanguage = 'en'
}) => {
  const tabs = [
    {
      id: 'services' as MobileTab,
      label: t('tab_services', currentLanguage),
      icon: Wrench,
      badge: null
    },
    {
      id: 'tracking' as MobileTab,
      label: t('tab_tracking', currentLanguage),
      icon: Radio,
      badge: hasActiveJob ? (
        <span className="absolute top-1.5 right-4 w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
      ) : activeJobCount > 0 ? (
        <span className="absolute top-1 right-3 px-1.5 py-0.2 rounded-full bg-indigo-600 text-white text-[9px] font-black">
          {activeJobCount}
        </span>
      ) : null
    },
    {
      id: 'messages' as MobileTab,
      label: t('tab_messages', currentLanguage),
      icon: MessageSquare,
      badge: unreadCount > 0 ? (
        <span className="absolute top-1 right-3 px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[9px] font-black">
          {unreadCount}
        </span>
      ) : null
    },
    {
      id: 'account' as MobileTab,
      label: t('tab_account', currentLanguage),
      icon: UserIcon,
      badge: null
    }
  ];

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] pb-safe transition-all"
      aria-label="Mobile Navigation Bar"
    >
      <div className="max-w-md mx-auto grid grid-cols-4 items-center h-16 px-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                if (navigator.vibrate) {
                  try { navigator.vibrate(10); } catch (_) {}
                }
                onChangeTab(tab.id);
              }}
              className={`relative flex flex-col items-center justify-center h-full min-h-[48px] py-1 transition-all group ${
                isActive ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div
                className={`relative flex items-center justify-center w-10 h-7 rounded-xl transition-all ${
                  isActive ? 'bg-indigo-50 text-indigo-600 font-bold' : 'group-active:scale-95'
                }`}
              >
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    isActive ? 'scale-110 text-indigo-600' : 'text-slate-500'
                  } ${tab.id === 'tracking' && hasActiveJob ? 'animate-pulse text-emerald-600' : ''}`}
                />
                {tab.badge}
              </div>
              <span
                className={`text-[11px] tracking-tight mt-0.5 whitespace-nowrap ${
                  isActive ? 'font-bold text-indigo-600' : 'font-medium text-slate-500'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
