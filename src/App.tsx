import React, { useState, useEffect, useRef } from 'react';
import { useTypewriter } from './useTypewriter';

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [pillsVisible, setPillsVisible] = useState(false);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Typewriter hook for hero message
  const { displayed, done } = useTypewriter(
    "glad you stopped in. as a motion designer & ai artist, i craft high-impact kinetic visual stories and brand experiences. now, what are we building together?",
    32,
    500
  );

  // Creative Software Arsenal
  const creativeTools = [
    {
      name: 'After Effects',
      short: 'Ae',
      color: '#9999FF',
      border: 'rgba(153, 153, 255, 0.4)',
      bg: '#08081a',
      glow: 'rgba(153, 153, 255, 0.35)',
    },
    {
      name: 'Illustrator',
      short: 'Ai',
      color: '#FF9A00',
      border: 'rgba(255, 154, 0, 0.4)',
      bg: '#180d00',
      glow: 'rgba(255, 154, 0, 0.35)',
    },
    {
      name: 'Photoshop',
      short: 'Ps',
      color: '#31A8FF',
      border: 'rgba(49, 168, 255, 0.4)',
      bg: '#001426',
      glow: 'rgba(49, 168, 255, 0.35)',
    },
    {
      name: 'Premiere Pro',
      short: 'Pr',
      color: '#EA77FF',
      border: 'rgba(234, 119, 255, 0.4)',
      bg: '#1a0022',
      glow: 'rgba(234, 119, 255, 0.35)',
    },
  ];

  // Video mouse-scrubbing refs and state
  const videoRef = useRef<HTMLVideoElement>(null);
  const prevXRef = useRef<number | null>(null);
  const targetTimeRef = useRef<number>(0);
  const isSeekingRef = useRef<boolean>(false);

  // Show action pill buttons 400ms after page load
  useEffect(() => {
    const timer = setTimeout(() => {
      setPillsVisible(true);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  // Video scrub mousemove handler on window
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const video = videoRef.current;
      if (!video) return;

      const duration = video.duration;
      if (!duration || isNaN(duration)) {
        prevXRef.current = e.clientX;
        return;
      }

      if (prevXRef.current === null) {
        prevXRef.current = e.clientX;
        return;
      }

      const delta = e.clientX - prevXRef.current;
      prevXRef.current = e.clientX;

      const SENSITIVITY = 0.8;
      const timeOffset = (delta / window.innerWidth) * SENSITIVITY * duration;

      let nextTarget = targetTimeRef.current + timeOffset;
      nextTarget = Math.max(0, Math.min(duration, nextTarget));
      targetTimeRef.current = nextTarget;

      if (!isSeekingRef.current) {
        isSeekingRef.current = true;
        video.currentTime = nextTarget;
      }
    };

    const handleMouseLeave = () => {
      prevXRef.current = null;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // onSeeked handler to queue next seek if targetTime moved
  const handleSeeked = () => {
    const video = videoRef.current;
    if (!video) return;

    if (Math.abs(video.currentTime - targetTimeRef.current) > 0.01) {
      video.currentTime = targetTimeRef.current;
    } else {
      isSeekingRef.current = false;
    }
  };

  const handleCopyEmail = () => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText('prantosarkar32@gmail.com');
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const capabilities = [
    'motion graphics',
    'ai video generation',
    'brand visual design',
    'storyboarding',
    'commercial video creation',
    'ai content creation',
    'kinetic typography',
    'creative concept development',
    'short-form video / reels editing',
    'product advertisement design',
    'ai image generation',
    'prompt engineering',
    'visual storytelling',
    'graphic design',
    'video editing',
  ];

  const serviceCategories = [
    {
      title: 'Motion & Video Direction',
      icon: '⚡',
      items: [
        'Motion Graphics',
        'Commercial Video Creation',
        'Video Editing',
        'Short-form Video / Reels Editing',
        'Storyboarding',
      ],
    },
    {
      title: 'AI Artistry & Generative Media',
      icon: '✦',
      items: [
        'AI Content Creation',
        'AI Video Generation',
        'AI Image Generation',
        'Prompt Engineering',
        'Visual Storytelling',
      ],
    },
    {
      title: 'Brand & Graphic Design',
      icon: '❖',
      items: [
        'Graphic Design',
        'Brand Visual Design',
        'Product Advertisement Design',
        'Creative Concept Development',
      ],
    },
  ];

  const navLinks = [
    { id: 'about-me', label: 'about me' },
    { id: 'services', label: 'services' },
    { id: 'projects', label: 'projects' },
    { id: 'contact', label: 'contact' },
  ];

  const heroPills = [
    { label: 'view reel', action: () => setActiveModal('projects') },
    { label: 'capabilities', action: () => setActiveModal('services') },
    { label: 'about journey', action: () => setActiveModal('about-me') },
    { label: 'start a project', action: () => setActiveModal('contact') },
  ];

  return (
    <div className="relative min-h-screen w-full bg-black text-white selection:bg-white selection:text-black overflow-hidden font-sans">
      {/* Background Video (mouse-scrub controlled) */}
      <video
        ref={videoRef}
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260826_041744_63efcd78-bf7d-4039-99e2-2461e8a61903.mp4"
        className="fixed inset-0 z-0 w-full h-full object-cover pointer-events-none select-none scale-105 transition-transform duration-700 ease-out"
        style={{ objectPosition: '70% center' }}
        muted
        playsInline
        preload="auto"
        onSeeked={handleSeeked}
      />

      {/* Cinematic Vignette Overlay for Ultra Contrast */}
      <div className="fixed inset-0 z-[1] video-vignette pointer-events-none" />

      {/* Interactive mouse-scrub hint pill (bottom-left) */}
      <div className="fixed bottom-6 left-6 z-10 hidden sm:flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/[0.06] border border-white/10 backdrop-blur-md text-[11px] font-mono tracking-wider text-white/50 pointer-events-none select-none">
        <span className="w-1.5 h-1.5 rounded-full bg-white/70 animate-ping" />
        <span>drag cursor left / right to scrub reel</span>
      </div>

      {/* Navbar (fixed, z-index: 20) */}
      <header className="fixed top-0 inset-x-0 z-20 w-full px-5 sm:px-10 py-5 sm:py-6 flex justify-between items-center backdrop-blur-sm bg-gradient-to-b from-black/60 to-transparent">
        {/* Logo (left) */}
        <div className="flex items-center gap-3.5 group cursor-pointer" onClick={() => setActiveModal(null)}>
          <span
            className="text-[22px] sm:text-[27px] tracking-tight font-medium text-white select-none transition-colors duration-200 group-hover:text-cyan-300"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Pranto Sarkar®
          </span>
          <span
            className="text-[24px] sm:text-[28px] text-cyan-400 select-none leading-none animate-pulse-subtle"
            style={{ letterSpacing: '-0.02em' }}
          >
            ✳︎
          </span>
          <span className="hidden lg:inline-block text-[11px] font-mono tracking-[0.16em] text-white/60 border-l border-white/20 pl-3">
            motion designer &amp; ai artist
          </span>
        </div>

        {/* Desktop nav links (center, hidden below md) */}
        <nav 
          className="hidden md:flex items-center text-[20px] lg:text-[22px] text-white tracking-tight font-normal"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {navLinks.map((item, idx) => (
            <React.Fragment key={item.id}>
              <button
                type="button"
                onClick={() => setActiveModal(item.id)}
                className="hover:text-cyan-300 transition-colors duration-200 cursor-pointer"
              >
                {item.label}
              </button>
              {idx < navLinks.length - 1 && <span className="text-white/30 select-none">,&nbsp;</span>}
            </React.Fragment>
          ))}
        </nav>

        {/* Desktop CTA (right, hidden below md) */}
        <a
          href="/Pranto_Sarkar_CV.pdf"
          download="Pranto_Sarkar_CV.pdf"
          className="hidden md:inline-flex items-center gap-2 text-[19px] lg:text-[21px] text-white tracking-tight underline underline-offset-4 hover:text-cyan-300 transition-colors group"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          <span>download cv</span>
          <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center transition-transform duration-200 group-hover:translate-y-0.5 group-hover:bg-cyan-400 group-hover:text-black">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          </div>
        </a>

        {/* Mobile hamburger (visible below md) */}
        <button
          type="button"
          aria-label="Toggle navigation menu"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          className="flex flex-col justify-center items-center gap-[5px] md:hidden z-30 cursor-pointer p-2 rounded-full bg-white/10 backdrop-blur-md"
        >
          <span
            className={`w-5 h-[2px] bg-white transition-all duration-300 origin-center ${
              isMenuOpen ? 'rotate-45 translate-y-[7px]' : ''
            }`}
          />
          <span
            className={`w-5 h-[2px] bg-white transition-all duration-300 ${
              isMenuOpen ? 'opacity-0' : 'opacity-100'
            }`}
          />
          <span
            className={`w-5 h-[2px] bg-white transition-all duration-300 origin-center ${
              isMenuOpen ? '-rotate-45 -translate-y-[7px]' : ''
            }`}
          />
        </button>
      </header>

      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 bg-black/95 backdrop-blur-2xl z-20 flex flex-col justify-center px-8 gap-8 transition-opacity duration-300 md:hidden ${
          isMenuOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
      >
        {navLinks.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              setIsMenuOpen(false);
              setActiveModal(item.id);
            }}
            className="text-left text-[32px] font-normal text-white hover:text-cyan-300 transition-colors tracking-tight"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {item.label}
          </button>
        ))}
        <a
          href="/Pranto_Sarkar_CV.pdf"
          download="Pranto_Sarkar_CV.pdf"
          onClick={() => setIsMenuOpen(false)}
          className="inline-flex items-center gap-3 text-[28px] font-normal text-white underline underline-offset-4 hover:text-cyan-300 transition-colors tracking-tight"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          <span>download cv</span>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
        </a>
      </div>

      {/* Hero Section (z-index: 5) */}
      <main className="relative z-[5] w-full h-screen flex flex-col justify-end pb-24 md:justify-center md:pb-0 px-6 sm:px-12 md:px-16">
        {/* Content container (Left) */}
        <div className="max-w-2xl relative">
          {/* Status badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-5 rounded-full bg-emerald-500/10 border border-emerald-500/30 backdrop-blur-md select-none">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-[11px] font-mono tracking-wider text-emerald-300 uppercase">Available for freelance &amp; contracts</span>
          </div>

          {/* 1. Blurred intro label */}
          <div className="pointer-events-none select-none mb-4 text-[clamp(19px,3.8vw,28px)] leading-[1.3] font-normal text-white/50 blur-[3px]">
            hey there, i'm pranto sarkar,
            <br />
            motion designer &amp; ai artist
          </div>

          {/* 2. Typewriter text */}
          <p 
            className="text-white mb-6 text-[clamp(19px,4vw,27px)] leading-[1.38] font-normal min-h-[64px] tracking-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            {displayed}
            {!done && (
              <span className="inline-block w-[2px] h-[1.15em] bg-cyan-400 align-middle ml-[3px] animate-blink shadow-[0_0_8px_#22d3ee]" />
            )}
          </p>

          {/* 3. Action pill buttons */}
          <div
            className={`flex flex-wrap items-center gap-2 sm:gap-2.5 transition-all duration-500 ease-out ${
              pillsVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-3'
            }`}
          >
            {heroPills.map((pill) => (
              <button
                key={pill.label}
                type="button"
                onClick={pill.action}
                className="glass-pill text-white text-[13px] sm:text-[14px] font-medium px-4 sm:px-5 py-2 rounded-full cursor-pointer tracking-tight"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {pill.label}
              </button>
            ))}

            {/* Email copy button with instant feedback */}
            <button
              type="button"
              onClick={handleCopyEmail}
              className="inline-flex items-center text-white bg-white/5 border border-white/20 backdrop-blur-md rounded-full text-[13px] sm:text-[14px] px-4 sm:px-5 py-2 hover:bg-white hover:text-black transition-all duration-200 gap-2 cursor-pointer group shadow-lg"
              title="Click to copy email address"
            >
              <span>
                reach me:{' '}
                <span className="underline underline-offset-2 font-mono text-[12px] sm:text-[13px]">
                  prantosarkar32@gmail.com
                </span>
              </span>
              {copied ? (
                <span className="text-[11px] font-mono font-bold text-emerald-400 bg-emerald-950/80 px-1.5 py-0.5 rounded">
                  copied!
                </span>
              ) : (
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 14 14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  className="inline-block shrink-0 transition-transform group-hover:scale-110"
                  aria-hidden="true"
                >
                  <rect x="4.5" y="1.5" width="8" height="8" rx="1" />
                  <rect x="1.5" y="4.5" width="8" height="8" rx="1" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Ambient Creative Capabilities Marquee (subtle bottom strip) */}
        <div 
          onClick={() => setActiveModal('services')}
          className="absolute bottom-4 inset-x-0 overflow-hidden py-2 cursor-pointer group select-none pointer-events-auto"
          title="Click to view full services & capabilities"
        >
          <div className="flex whitespace-nowrap animate-marquee opacity-40 hover:opacity-100 transition-opacity duration-300">
            {[...capabilities, ...capabilities].map((cap, i) => (
              <span key={i} className="inline-flex items-center gap-3 text-[12px] font-mono tracking-widest uppercase text-white/70 mx-4">
                <span>{cap}</span>
                <span className="text-cyan-400 text-[9px]">✦</span>
              </span>
            ))}
          </div>
        </div>
      </main>

      {/* Software Toolkit 3D Glass Panel (Fixed Bottom-Right) */}
      <aside 
        className="glass-panel-3d fixed bottom-5 sm:bottom-8 right-5 sm:right-8 z-20 flex items-center gap-2.5 sm:gap-3 p-2 sm:px-4 sm:py-2.5 rounded-2xl sm:rounded-full select-none pointer-events-auto max-w-[95vw] overflow-x-auto transition-transform duration-300 hover:rotate-[-0.5deg] hover:-translate-y-1"
        style={{
          boxShadow: '0 30px 60px -12px rgba(0,0,0,0.85), 0 18px 36px -18px rgba(0,0,0,0.7), inset 0 1.5px 1px 0 rgba(255,255,255,0.35), inset 0 -1.5px 2px 0 rgba(0,0,0,0.5)',
        }}
      >
        {/* Subtle Specular Top Reflection / Light Sheen */}
        <div className="absolute inset-x-4 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />

        <div className="flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-white/60 pl-1 pr-0.5 whitespace-nowrap drop-shadow">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee] animate-pulse" />
          <span className="font-semibold text-white/80">Arsenal</span>
        </div>

        <div className="h-4 w-[1px] bg-white/20" />

        <div className="flex items-center gap-1.5 sm:gap-2">
          {creativeTools.map((tool) => (
            <div
              key={tool.name}
              className="glass-item-3d inline-flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-full group cursor-pointer select-none"
            >
              <div
                className="glass-badge-3d w-5 h-5 rounded-[5px] flex items-center justify-center text-[10px] font-black border transition-all duration-300 group-hover:scale-110 shrink-0"
                style={{
                  backgroundColor: tool.bg,
                  color: tool.color,
                  borderColor: tool.border,
                  boxShadow: `0 0 12px ${tool.glow}`,
                }}
              >
                {tool.short}
              </div>
              <span className="text-xs text-white/90 font-medium tracking-wide whitespace-nowrap drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] group-hover:text-white transition-colors duration-200">
                {tool.name}
              </span>
            </div>
          ))}
        </div>
      </aside>

      {/* Interactive 3D Glass Modals for about me / services / projects / contact */}
      {activeModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-xl animate-fadeIn"
          onClick={() => setActiveModal(null)}
        >
          <div 
            className="glass-panel-3d w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-3xl p-6 sm:p-8 relative border border-white/20 shadow-2xl text-left"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="sticky top-0 float-right w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition-colors cursor-pointer z-10"
            >
              ✕
            </button>

            {/* Modal: Services & Capabilities */}
            {activeModal === 'services' && (
              <div className="space-y-5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-[11px] font-mono uppercase tracking-wider text-cyan-300">
                  <span>services &amp; capabilities</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white" style={{ fontFamily: 'var(--font-heading)' }}>
                  What I Bring to the Table
                </h3>
                <p className="text-white/70 text-sm sm:text-base leading-relaxed">
                  Combining premier motion craft, cinematic video editing, and modern neural AI pipelines to deliver standout creative work.
                </p>

                <div className="grid sm:grid-cols-3 gap-3.5 pt-2">
                  {serviceCategories.map((cat) => (
                    <div key={cat.title} className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 flex flex-col gap-2.5">
                      <div className="flex items-center gap-2 text-white font-medium text-sm">
                        <span className="text-base text-cyan-300">{cat.icon}</span>
                        <span>{cat.title}</span>
                      </div>
                      <ul className="space-y-1.5 text-xs text-white/60">
                        {cat.items.map((item) => (
                          <li key={item} className="flex items-center gap-1.5">
                            <span className="w-1 h-1 rounded-full bg-cyan-400/60" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                <div className="pt-2 flex justify-between items-center border-t border-white/10">
                  <span className="text-xs font-mono text-white/50">Need a custom scope?</span>
                  <button
                    type="button"
                    onClick={() => setActiveModal('contact')}
                    className="px-4 py-2 rounded-full bg-white text-black text-xs font-semibold hover:bg-cyan-300 transition-colors cursor-pointer"
                  >
                    Discuss your project →
                  </button>
                </div>
              </div>
            )}

            {/* Modal: About Me */}
            {activeModal === 'about-me' && (
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-[11px] font-mono uppercase tracking-wider text-cyan-300">
                  <span>about me</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white" style={{ fontFamily: 'var(--font-heading)' }}>
                  Pranto Sarkar
                </h3>
                <p className="text-white/80 text-sm sm:text-base leading-relaxed">
                  I am a passionate <strong>Motion Designer &amp; AI Artist</strong> dedicated to crafting kinetic visuals, 3D brand experiences, and futuristic motion assets. With deep mastery in <strong>After Effects, Illustrator, Photoshop, and Premiere Pro</strong>, I combine cutting-edge generative AI workflows with precise artistic craft.
                </p>
                <div className="pt-2 flex flex-wrap gap-2">
                  <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-white/70">kinetic typography</span>
                  <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-white/70">brand identity in motion</span>
                  <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-white/70">generative ai artistry</span>
                </div>
              </div>
            )}

            {/* Modal: Projects */}
            {activeModal === 'projects' && (
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-[11px] font-mono uppercase tracking-wider text-amber-300">
                  <span>selected showcase</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white" style={{ fontFamily: 'var(--font-heading)' }}>
                  Motion &amp; Visual Projects
                </h3>
                <div className="grid gap-3 pt-2">
                  <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-white/20 transition-all">
                    <div className="text-sm font-semibold text-white">Interactive Brand Showreel</div>
                    <div className="text-xs text-white/60">Dynamic cursor-scrubbed kinetic visual experiences and broadcast sequences.</div>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-white/20 transition-all">
                    <div className="text-sm font-semibold text-white">Generative 3D Asset Direction</div>
                    <div className="text-xs text-white/60">Blended motion graphic styles with advanced neural generative pipelines.</div>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-white/20 transition-all">
                    <div className="text-sm font-semibold text-white">Commercial Video Titles &amp; VFX</div>
                    <div className="text-xs text-white/60">Post-production, precision compositing, color grade, and kinetic timing.</div>
                  </div>
                </div>
              </div>
            )}

            {/* Modal: Contact */}
            {activeModal === 'contact' && (
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-[11px] font-mono uppercase tracking-wider text-purple-300">
                  <span>get in touch</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white" style={{ fontFamily: 'var(--font-heading)' }}>
                  Let's collaborate
                </h3>
                <p className="text-white/80 text-sm leading-relaxed">
                  Have a motion project, commercial campaign, or brand vision in mind? Feel free to reach out directly via email.
                </p>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/15 flex items-center justify-between">
                  <span className="font-mono text-sm text-cyan-300 select-all">prantosarkar32@gmail.com</span>
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="px-3 py-1.5 rounded-full bg-white text-black text-xs font-semibold hover:bg-cyan-300 transition-colors cursor-pointer"
                  >
                    {copied ? 'Copied!' : 'Copy Email'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
