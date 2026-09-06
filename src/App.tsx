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
        className="fixed inset-0 z-0 w-full h-full object-cover pointer-events-none select-none"
        style={{ objectPosition: '70% center' }}
        muted
        playsInline
        preload="auto"
        onSeeked={handleSeeked}
      />


      {/* Interactive mouse-scrub hint pill (bottom-left) */}
      <div className="fixed bottom-6 left-6 z-10 hidden sm:flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/[0.06] border border-white/10 backdrop-blur-md text-[11px] font-mono tracking-wider text-white/50 pointer-events-none select-none">
        <span className="w-1.5 h-1.5 rounded-full bg-white/70 animate-ping" />
        <span>drag cursor left / right to scrub reel</span>
      </div>

      {/* Navbar (fixed, z-index: 20) */}
      <header className="fixed top-0 inset-x-0 z-20 w-full px-5 sm:px-8 py-4 sm:py-5 flex justify-between items-center backdrop-blur-[2px]">
        {/* Logo (left) */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveModal(null)}>
          <span
            className="text-[21px] sm:text-[26px] tracking-tight font-medium text-white select-none"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Pranto Sarkar®
          </span>
          <span
            className="text-[25px] sm:text-[30px] text-white select-none leading-none"
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
          className="hidden md:flex items-center text-[21px] lg:text-[23px] text-white tracking-tight font-normal"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {navLinks.map((item, idx) => (
            <React.Fragment key={item.id}>
              <button
                type="button"
                onClick={() => setActiveModal(item.id)}
                className="hover:opacity-60 transition-opacity duration-200 cursor-pointer text-white"
              >
                {item.label}
              </button>
              {idx < navLinks.length - 1 && <span className="text-white/40 select-none">,&nbsp;</span>}
            </React.Fragment>
          ))}
        </nav>

        {/* Desktop CTA (right, hidden below md) */}
        <a
          href="/Pranto_Sarkar_CV.pdf"
          download="Pranto_Sarkar_CV.pdf"
          className="hidden md:inline-flex items-center gap-2 text-[20px] lg:text-[22px] text-white tracking-tight underline underline-offset-4 hover:opacity-75 transition-opacity group"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          <span>download cv</span>
          <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-transform duration-200 group-hover:translate-y-0.5"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
        </a>

        {/* Mobile hamburger (visible below md) */}
        <button
          type="button"
          aria-label="Toggle navigation menu"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          className="flex flex-col justify-center items-center gap-[5px] md:hidden z-30 cursor-pointer p-1"
        >
          <span
            className={`w-6 h-[2px] bg-white transition-all duration-300 origin-center ${
              isMenuOpen ? 'rotate-45 translate-y-[7px]' : ''
            }`}
          />
          <span
            className={`w-6 h-[2px] bg-white transition-all duration-300 ${
              isMenuOpen ? 'opacity-0' : 'opacity-100'
            }`}
          />
          <span
            className={`w-6 h-[2px] bg-white transition-all duration-300 origin-center ${
              isMenuOpen ? '-rotate-45 -translate-y-[7px]' : ''
            }`}
          />
        </button>
      </header>

      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 bg-black/90 backdrop-blur-md z-20 flex flex-col justify-center px-8 gap-8 transition-opacity duration-300 md:hidden ${
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
            className="text-left text-[32px] font-normal text-white hover:opacity-60 transition-opacity tracking-tight"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {item.label}
          </button>
        ))}
        <a
          href="/Pranto_Sarkar_CV.pdf"
          download="Pranto_Sarkar_CV.pdf"
          onClick={() => setIsMenuOpen(false)}
          className="inline-flex items-center gap-3 text-[30px] font-normal text-white underline underline-offset-4 hover:opacity-60 transition-opacity tracking-tight"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          <span>download cv</span>
          <svg
            width="22"
            height="22"
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
      <main className="relative z-[5] w-full h-screen flex flex-col justify-end pb-16 md:justify-center md:pb-0 px-5 sm:px-8 md:px-10 overflow-hidden">
        {/* Content container (Left) */}
        <div className="max-w-xl relative z-10">
          {/* 1. Blurred intro label */}
          <div className="pointer-events-none select-none mb-4 text-[clamp(18px,4vw,26px)] leading-[1.3] font-normal text-white blur-[3px]">
            hey there, i'm pranto sarkar,
            <br />
            motion designer &amp; ai artist
          </div>

          {/* 2. Typewriter text */}
          <p 
            className="text-white mb-5 sm:mb-6 text-[clamp(18px,4vw,26px)] leading-[1.35] font-normal min-h-[54px] tracking-tight"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            {displayed}
            {!done && (
              <span className="inline-block w-[2px] h-[1.1em] bg-white align-middle ml-[2px] animate-blink" />
            )}
          </p>

          {/* 3. Action pill buttons (Pure Clean Original Style) */}
          <div
            className={`flex flex-wrap gap-y-1 transition-all duration-400 ease-out ${
              pillsVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-2'
            }`}
          >
            {heroPills.map((pill) => (
              <button
                key={pill.label}
                type="button"
                onClick={pill.action}
                className="inline-flex items-center justify-center bg-white text-black border border-black/10 rounded-full text-[13px] sm:text-[15px] px-4 sm:px-5 py-[0.3em] mx-[0.2em] mb-[0.4em] whitespace-nowrap cursor-pointer hover:bg-black hover:text-white transition-colors duration-200"
              >
                {pill.label}
              </button>
            ))}

            {/* Email copy button */}
            <button
              type="button"
              onClick={handleCopyEmail}
              className="inline-flex items-center justify-center text-white bg-transparent border border-white rounded-full text-[13px] sm:text-[15px] px-4 sm:px-5 py-[0.3em] mx-[0.2em] mb-[0.4em] whitespace-nowrap cursor-pointer hover:bg-white hover:text-black transition-colors duration-200 gap-2 sm:gap-3 group"
              title="Click to copy email address"
            >
              <span>
                reach me:{' '}
                <span className="underline underline-offset-1">
                  prantosarkar32@gmail.com
                </span>
              </span>
              {copied ? (
                <span className="text-[11px] font-mono text-emerald-400">copied!</span>
              ) : (
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 14 14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  className="inline-block shrink-0"
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
              <div className="space-y-5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-[11px] font-mono uppercase tracking-wider text-cyan-300">
                  <span>about me &amp; creative philosophy</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white" style={{ fontFamily: 'var(--font-heading)' }}>
                  Pranto Sarkar
                </h3>
                <p className="text-white/80 text-sm sm:text-base leading-relaxed">
                  I am a Dhaka-based <strong>Senior Motion Designer &amp; AI Artist</strong> specializing in kinetic visual storytelling, commercial broadcast animation, and high-fidelity generative AI aesthetics. With over 4+ years dedicated to crafting brand experiences, I bridge the gap between classic graphic motion craft and neural AI pipelines.
                </p>

                {/* 3 Pillars of Craft */}
                <div className="grid sm:grid-cols-3 gap-3 pt-1">
                  <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10">
                    <div className="text-xs font-mono text-cyan-400 mb-1">01. MOTION</div>
                    <div className="text-sm font-semibold text-white">Kinetic Rhythm</div>
                    <div className="text-xs text-white/60 mt-1">High-impact transitions, smooth easing, and kinetic typography that command attention.</div>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10">
                    <div className="text-xs font-mono text-amber-400 mb-1">02. ARTISTRY</div>
                    <div className="text-sm font-semibold text-white">Generative AI</div>
                    <div className="text-xs text-white/60 mt-1">Custom neural prompting, synthetic world building, and seamless multi-model composites.</div>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10">
                    <div className="text-xs font-mono text-purple-400 mb-1">03. DIRECTION</div>
                    <div className="text-sm font-semibold text-white">Brand Impact</div>
                    <div className="text-xs text-white/60 mt-1">Commercial campaigns, high-converting product ads, and futuristic social visual identities.</div>
                  </div>
                </div>

                {/* Core Toolkit Highlights */}
                <div className="pt-2 border-t border-white/10">
                  <div className="text-xs font-mono uppercase text-white/50 mb-2">Primary Arsenal:</div>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-white/80">After Effects</span>
                    <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-white/80">Premiere Pro</span>
                    <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-white/80">Illustrator</span>
                    <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-white/80">Photoshop</span>
                    <span className="px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-xs font-mono text-cyan-300">Generative AI (Midjourney, Runway, ComfyUI)</span>
                  </div>
                </div>
              </div>
            )}

            {/* Modal: Projects */}
            {activeModal === 'projects' && (
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-[11px] font-mono uppercase tracking-wider text-amber-300">
                  <span>selected showcase &amp; case studies</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white" style={{ fontFamily: 'var(--font-heading)' }}>
                  Featured Works
                </h3>
                <p className="text-white/70 text-xs sm:text-sm">
                  A curation of kinetic brand identities, commercial video campaigns, and futuristic generative visual assets.
                </p>

                <div className="grid gap-3 pt-1">
                  <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-cyan-400/40 transition-all group">
                    <div className="flex justify-between items-start mb-1.5">
                      <div className="text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors">
                        Kinetic Brand Identity &amp; Broadcast Showreel
                      </div>
                      <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded-full border border-cyan-500/20">Motion Graphics</span>
                    </div>
                    <div className="text-xs text-white/60 mb-2.5">
                      Cursor-scrubbed interactive visual storytelling, title sequence choreography, and high-energy brand animations.
                    </div>
                    <div className="flex items-center gap-2 text-[11px] font-mono text-white/40">
                      <span>After Effects</span>
                      <span>•</span>
                      <span>Illustrator</span>
                      <span>•</span>
                      <span>Sound Design</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-amber-400/40 transition-all group">
                    <div className="flex justify-between items-start mb-1.5">
                      <div className="text-sm font-semibold text-white group-hover:text-amber-300 transition-colors">
                        Neural AI Visual World-Building
                      </div>
                      <span className="text-[10px] font-mono text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-500/20">AI Generation</span>
                    </div>
                    <div className="text-xs text-white/60 mb-2.5">
                      Synthetic environment direction, character styling, and prompt architecture merged with fluid cinematic post-processing.
                    </div>
                    <div className="flex items-center gap-2 text-[11px] font-mono text-white/40">
                      <span>Prompt Engineering</span>
                      <span>•</span>
                      <span>Photoshop</span>
                      <span>•</span>
                      <span>Runway / Midjourney</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-purple-400/40 transition-all group">
                    <div className="flex justify-between items-start mb-1.5">
                      <div className="text-sm font-semibold text-white group-hover:text-purple-300 transition-colors">
                        Commercial Product Launch &amp; High-Retention Reels
                      </div>
                      <span className="text-[10px] font-mono text-purple-400 bg-purple-950/60 px-2 py-0.5 rounded-full border border-purple-500/20">Commercial VFX</span>
                    </div>
                    <div className="text-xs text-white/60 mb-2.5">
                      Speed ramps, dynamic product isolation, kinetic typography hooks, and commercial-grade grading tailored for multi-platform reach.
                    </div>
                    <div className="flex items-center gap-2 text-[11px] font-mono text-white/40">
                      <span>Premiere Pro</span>
                      <span>•</span>
                      <span>After Effects</span>
                      <span>•</span>
                      <span>Color Grade</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Modal: Contact */}
            {activeModal === 'contact' && (
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-[11px] font-mono uppercase tracking-wider text-purple-300">
                  <span>direct collaboration</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white" style={{ fontFamily: 'var(--font-heading)' }}>
                  Let's Create Something Extraordinary
                </h3>
                <p className="text-white/80 text-sm leading-relaxed">
                  Whether you have an upcoming commercial campaign, brand showreel, or need generative AI visuals that captivate audiences, feel free to reach out directly.
                </p>

                {/* Email Box */}
                <div className="p-4 rounded-2xl bg-white/5 border border-white/15 flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
                  <div>
                    <div className="text-[11px] font-mono uppercase text-white/40">Official Inquiries:</div>
                    <span className="font-mono text-sm sm:text-base text-cyan-300 select-all">prantosarkar32@gmail.com</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="self-start sm:self-auto px-4 py-2 rounded-full bg-white text-black text-xs font-semibold hover:bg-cyan-300 transition-colors cursor-pointer"
                  >
                    {copied ? '✓ Copied!' : 'Copy Email'}
                  </button>
                </div>

                {/* Quick Details */}
                <div className="grid grid-cols-2 gap-3 pt-1 text-xs">
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
                    <div className="text-white/40 font-mono">Location</div>
                    <div className="text-white font-medium mt-0.5">Dhaka, Bangladesh (UTC+6)</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
                    <div className="text-white/40 font-mono">Availability</div>
                    <div className="text-emerald-400 font-medium mt-0.5">Freelance &amp; Remote Contracts</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
