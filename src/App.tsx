import { useState, useEffect } from 'react';
import PortfolioApp from './PortfolioApp';

// =========================================================================
// OFFLINE / LIVE TOGGLE
// Set to false to bring the entire portfolio website back live!
// =========================================================================
const IS_OFFLINE = true;

export default function App() {
  const [copied, setCopied] = useState(false);
  const [dhakaTime, setDhakaTime] = useState('');

  // Live Dhaka local time
  useEffect(() => {
    const updateTime = () => {
      try {
        const now = new Date();
        const formatted = new Intl.DateTimeFormat('en-US', {
          timeZone: 'Asia/Dhaka',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        }).format(now);
        setDhakaTime(formatted);
      } catch {
        setDhakaTime('06:00 PM (UTC+6)');
      }
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleCopyEmail = () => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText('prantosarkar32@gmail.com');
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // If offline mode is disabled, render the full portfolio website
  if (!IS_OFFLINE) {
    return <PortfolioApp />;
  }

  // Minimalist, high-end Offline / Maintenance screen
  return (
    <div className="relative min-h-screen w-full bg-black text-white selection:bg-white selection:text-black overflow-hidden flex items-center justify-center p-5 sm:p-8 font-body">
      {/* Background ambient subtle blur rings */}
      <div className="absolute w-[350px] h-[350px] rounded-full bg-white/[0.02] blur-[100px] pointer-events-none" />

      {/* Main Glass Maintenance Card */}
      <div
        className="glass-panel-3d relative z-10 max-w-lg w-full rounded-3xl p-7 sm:p-10 border border-white/20 shadow-2xl text-center space-y-6"
        style={{
          boxShadow:
            '0 30px 60px -12px rgba(0,0,0,0.9), 0 18px 36px -18px rgba(0,0,0,0.8), inset 0 1.5px 1px 0 rgba(255,255,255,0.35), inset 0 -1.5px 2px 0 rgba(0,0,0,0.5)',
        }}
      >
        {/* Subtle Specular Sheen */}
        <div className="absolute inset-x-8 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />

        {/* Brand Header */}
        <div className="space-y-1.5">
          <div className="inline-flex items-center justify-center gap-2.5">
            <span className="text-2xl sm:text-3xl font-display font-black tracking-tight uppercase text-white">
              Pranto Sarkar®
            </span>
            <span className="text-2xl sm:text-3xl text-white leading-none">
              ✳︎
            </span>
          </div>
          <div className="text-[10px] font-mono-tech uppercase tracking-[0.25em] text-white/50 font-light">
            motion designer &amp; ai artist
          </div>
        </div>

        {/* Status Indicator Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-[11px] font-mono-tech tracking-wider text-amber-300">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span className="font-semibold uppercase">Currently Offline · Scheduled Maintenance</span>
        </div>

        {/* Offline Notice Message */}
        <div className="space-y-2 text-white/70 text-xs sm:text-sm font-light leading-relaxed">
          <p>
            The portfolio website is temporarily offline for scheduled updates, infrastructure optimization, and new project integration.
          </p>
          <p className="text-white/50 text-xs">
            We will be back online shortly. Thank you for your patience.
          </p>
        </div>

        {/* Direct Email Contact Box */}
        <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
          <div>
            <div className="text-[10px] font-mono-tech uppercase text-white/40">
              Direct Contact &amp; Urgent Inquiries:
            </div>
            <a
              href="mailto:prantosarkar32@gmail.com"
              className="text-xs sm:text-sm font-mono-tech text-cyan-300 hover:underline select-all"
            >
              prantosarkar32@gmail.com
            </a>
          </div>
          <button
            type="button"
            onClick={handleCopyEmail}
            className="self-stretch sm:self-auto px-4 py-2 rounded-full bg-white text-black text-xs font-semibold hover:bg-white/90 transition-colors cursor-pointer font-heading whitespace-nowrap"
          >
            {copied ? '✓ Copied!' : 'Copy Email'}
          </button>
        </div>

        {/* Footer Meta: Location & Time */}
        <div className="pt-2 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono-tech text-white/40">
          <div>Dhaka, Bangladesh</div>
          <div className="text-cyan-300/80">{dhakaTime || 'UTC+6'}</div>
        </div>
      </div>
    </div>
  );
}
