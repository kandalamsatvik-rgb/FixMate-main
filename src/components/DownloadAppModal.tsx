import React, { useState } from 'react';
import {
  X,
  Download,
  Smartphone,
  QrCode,
  Share2,
  CheckCircle2,
  Copy,
  ExternalLink,
  Laptop,
  Apple,
  Sparkles,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { usePWAInstall } from '../hooks/usePWAInstall.ts';

interface DownloadAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DownloadAppModal: React.FC<DownloadAppModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'qr' | 'android' | 'ios' | 'desktop'>('qr');

  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://fixmate.in';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleNativeInstall = async () => {
    const success = await install();
    if (success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white p-2 shadow-lg flex items-center justify-center">
                <img src="/icon.svg" alt="FixMate Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-black text-lg text-white">Download FixMate</h3>
                  <span className="text-[10px] bg-emerald-500/30 text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-400/30">
                    Official App
                  </span>
                </div>
                <p className="text-xs text-indigo-200">Doorstep Home Services & Repair India</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Direct Install Action Button if browser supports it */}
          {isInstallable && (
            <div className="mt-4 pt-4 border-t border-indigo-700/60 flex items-center justify-between gap-3">
              <div className="text-xs text-indigo-100">
                <strong className="text-white">Direct Installation Ready:</strong> Tap below to install directly onto your home screen.
              </div>
              <button
                onClick={handleNativeInstall}
                className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs shadow-lg shadow-emerald-500/30 transition-all flex items-center gap-1.5 shrink-0"
              >
                <Download className="w-4 h-4" />
                <span>Install Now</span>
              </button>
            </div>
          )}

          {isInstalled && (
            <div className="mt-3 py-1.5 px-3 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>FixMate is already installed and running as a standalone app!</span>
            </div>
          )}
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('qr')}
            className={`flex-1 py-3 text-center transition-all flex items-center justify-center gap-1.5 border-b-2 ${
              activeTab === 'qr'
                ? 'border-indigo-600 text-indigo-600 bg-white shadow-sm'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Scan QR (Mobile)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('android')}
            className={`flex-1 py-3 text-center transition-all flex items-center justify-center gap-1.5 border-b-2 ${
              activeTab === 'android'
                ? 'border-indigo-600 text-indigo-600 bg-white shadow-sm'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Android</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('ios')}
            className={`flex-1 py-3 text-center transition-all flex items-center justify-center gap-1.5 border-b-2 ${
              activeTab === 'ios'
                ? 'border-indigo-600 text-indigo-600 bg-white shadow-sm'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Apple className="w-3.5 h-3.5" />
            <span>iPhone / iOS</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('desktop')}
            className={`flex-1 py-3 text-center transition-all flex items-center justify-center gap-1.5 border-b-2 ${
              activeTab === 'desktop'
                ? 'border-indigo-600 text-indigo-600 bg-white shadow-sm'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Laptop className="w-3.5 h-3.5" />
            <span>Desktop</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* TAB 1: SCAN QR CODE */}
          {activeTab === 'qr' && (
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-3.5 bg-white rounded-2xl border-2 border-indigo-100 shadow-xl inline-block relative group">
                <QRCodeSVG
                  value={currentUrl}
                  size={180}
                  level="H"
                  includeMargin={true}
                  imageSettings={{
                    src: '/icon.svg',
                    x: undefined,
                    y: undefined,
                    height: 38,
                    width: 38,
                    excavate: true,
                  }}
                />
              </div>

              <div>
                <h4 className="font-extrabold text-slate-900 text-base">
                  Scan to Open & Install on Mobile
                </h4>
                <p className="text-xs text-slate-500 mt-1 max-w-sm">
                  Point your phone's camera (Google Lens, iPhone Camera, or QR Scanner) at the code to launch FixMate directly on your mobile device.
                </p>
              </div>

              {/* Direct App Link Copy */}
              <div className="w-full flex items-center gap-2 p-2 bg-slate-50 rounded-2xl border border-slate-200">
                <input
                  type="text"
                  readOnly
                  value={currentUrl}
                  className="bg-transparent text-xs text-slate-600 px-2 flex-1 focus:outline-none font-mono truncate"
                />
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-1 shrink-0"
                >
                  {copied ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Link</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: ANDROID GUIDE */}
          {activeTab === 'android' && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-950">
                <Smartphone className="w-8 h-8 text-emerald-600 shrink-0" />
                <div>
                  <h5 className="font-bold text-xs text-emerald-900">
                    Android Installation (Chrome / Samsung Internet)
                  </h5>
                  <p className="text-[11px] text-emerald-700">
                    FixMate installs as a lightweight, lightning-fast native app with zero Play Store storage footprint!
                  </p>
                </div>
              </div>

              <ol className="space-y-3 text-xs text-slate-700 pl-2">
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                    1
                  </span>
                  <span>
                    Open this app in <strong>Google Chrome</strong> on your Android phone.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                    2
                  </span>
                  <span>
                    Look for the <strong>"Install FixMate"</strong> banner at the bottom, or tap the <strong>⋮ (three dots)</strong> menu icon at top-right.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                    3
                  </span>
                  <span>
                    Tap <strong>"Install App"</strong> or <strong>"Add to Home screen"</strong>.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                    4
                  </span>
                  <span>
                    Confirm <strong>Install</strong>. FixMate will now appear in your app drawer alongside your other apps with offline cache support.
                  </span>
                </li>
              </ol>

              {isInstallable && (
                <button
                  onClick={handleNativeInstall}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Tap Here to Trigger Install</span>
                </button>
              )}
            </div>
          )}

          {/* TAB 3: IPHONE / IOS GUIDE */}
          {activeTab === 'ios' && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-indigo-50 rounded-2xl border border-indigo-200 text-indigo-950">
                <Apple className="w-8 h-8 text-indigo-600 shrink-0" />
                <div>
                  <h5 className="font-bold text-xs text-indigo-900">
                    Apple iPhone / iPad Installation (Safari)
                  </h5>
                  <p className="text-[11px] text-indigo-700">
                    Runs in full-screen standalone mode with no browser URL address bars.
                  </p>
                </div>
              </div>

              <ol className="space-y-3 text-xs text-slate-700 pl-2">
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                    1
                  </span>
                  <span>
                    Open this app link in <strong>Safari</strong> on your iPhone or iPad.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                    2
                  </span>
                  <span>
                    Tap the <strong>Share</strong> button (the square icon with an arrow pointing upward) at the bottom toolbar.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                    3
                  </span>
                  <span>
                    Scroll down and tap <strong>"Add to Home Screen"</strong> (with the plus sign icon).
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                    4
                  </span>
                  <span>
                    Tap <strong>"Add"</strong> in the top-right corner. FixMate will be added to your home screen!
                  </span>
                </li>
              </ol>
            </div>
          )}

          {/* TAB 4: DESKTOP GUIDE */}
          {activeTab === 'desktop' && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-slate-100 rounded-2xl border border-slate-200 text-slate-900">
                <Laptop className="w-8 h-8 text-slate-700 shrink-0" />
                <div>
                  <h5 className="font-bold text-xs text-slate-900">
                    Desktop App (Windows / macOS / Linux)
                  </h5>
                  <p className="text-[11px] text-slate-500">
                    Install as a dedicated desktop window without browser tabs.
                  </p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-700 space-y-2">
                <p>
                  Look at the right side of your browser URL bar for the <strong>Install Icon</strong> (a computer monitor with an arrow, or a plus icon).
                </p>
                <p>
                  Click it and choose <strong>"Install FixMate"</strong> to launch in its own desktop window.
                </p>
              </div>

              {isInstallable && (
                <button
                  onClick={handleNativeInstall}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Install FixMate on this Computer</span>
                </button>
              )}
            </div>
          )}

          {/* Benefits Footer */}
          <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-3 gap-2 text-center">
            <div className="p-2 rounded-xl bg-slate-50">
              <Zap className="w-4 h-4 text-amber-500 mx-auto mb-1" />
              <div className="text-[10px] font-bold text-slate-800">Instant Launch</div>
              <div className="text-[9px] text-slate-400">&lt;1 sec startup</div>
            </div>
            <div className="p-2 rounded-xl bg-slate-50">
              <ShieldCheck className="w-4 h-4 text-emerald-500 mx-auto mb-1" />
              <div className="text-[10px] font-bold text-slate-800">Verified Pros</div>
              <div className="text-[9px] text-slate-400">100% Background Check</div>
            </div>
            <div className="p-2 rounded-xl bg-slate-50">
              <Sparkles className="w-4 h-4 text-indigo-500 mx-auto mb-1" />
              <div className="text-[10px] font-bold text-slate-800">₹99 Visiting</div>
              <div className="text-[9px] text-slate-400">Fair transparent rate</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
