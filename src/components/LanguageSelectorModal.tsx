import React from 'react';
import { X, Check, Globe } from 'lucide-react';
import { LanguageCode } from '../types/index.ts';
import { SUPPORTED_LANGUAGES, t } from '../utils/i18n.ts';

interface LanguageSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLanguage: LanguageCode;
  onSelectLanguage: (lang: LanguageCode) => void;
}

export const LanguageSelectorModal: React.FC<LanguageSelectorModalProps> = ({
  isOpen,
  onClose,
  currentLanguage,
  onSelectLanguage
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-100 max-h-[85vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-200">
        {/* Mobile Grab Handle */}
        <div className="pt-3 pb-1 flex justify-center sm:hidden shrink-0">
          <div className="w-12 h-1.5 bg-slate-300 rounded-full" />
        </div>

        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Globe className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900">
                {t('switch_language', currentLanguage)}
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                Choose your preferred language / अपनी पसंदीदा भाषा चुनें
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Languages Grid */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {SUPPORTED_LANGUAGES.map((lang) => {
            const isSelected = currentLanguage === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => {
                  onSelectLanguage(lang.code);
                  onClose();
                }}
                className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-50/80 border-indigo-500 ring-2 ring-indigo-500/20 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-indigo-300 hover:bg-slate-50/80'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{lang.flag}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm text-slate-900">
                        {lang.nativeName}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">
                        ({lang.label})
                      </span>
                    </div>
                    <span className="text-[10px] text-indigo-600 font-bold">
                      {lang.code === 'hi' ? 'भारतीय भाषा' : lang.code === 'en' ? 'Default' : 'Regional'}
                    </span>
                  </div>
                </div>

                {isSelected ? (
                  <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                ) : (
                  <div className="w-6 h-6 rounded-full border border-slate-300 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom Banner */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 text-center text-[11px] text-slate-500">
          <span className="font-bold text-slate-700">FixMate India:</span> Voice & AI Search available in all languages.
        </div>
      </div>
    </div>
  );
};
