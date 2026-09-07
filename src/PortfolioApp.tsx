import React, { useState, useEffect, useRef } from 'react';
import { useTypewriter } from './useTypewriter';
import { sound } from './audio';

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [pillsVisible, setPillsVisible] = useState(false);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [briefCopied, setBriefCopied] = useState(false);
  const [soundActive, setSoundActive] = useState(false);
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [inspectedTool, setInspectedTool] = useState<string | null>(null);
  const [reelPlaying, setReelPlaying] = useState(true);
  const [reelMuted, setReelMuted] = useState(true);
  const [dhakaTime, setDhakaTime] = useState('');

  // Intro Splash Screen State ("hi" text on enter)
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const enterTimer = setTimeout(() => {
      setEntered(true);
      document.body.classList.add('entered');
    }, 1200);

    return () => {
      clearTimeout(enterTimer);
      document.body.classList.remove('entered');
    };
  }, []);

  // Avatar Greeting State (User's avatar intro, wave, and go-home scroll logic)
  const [avatarClass, setAvatarClass] = useState<string>('opacity-0 translate-y-3');
  const greetedRef = useRef<boolean>(false);
  const returnedHomeRef = useRef<boolean>(false);

  // Avatar lifecycle: Enter -> Wave after 700ms -> Scroll >80px Go-Home
  useEffect(() => {
    const introTimer = setTimeout(() => {
      setAvatarClass('avatar-intro');
    }, 200);

    const waveTimer = setTimeout(() => {
      setAvatarClass('avatar-intro avatar-wave');
      greetedRef.current = true;
    }, 900);

    const handleScroll = () => {
      if (greetedRef.current && window.scrollY > 80 && !returnedHomeRef.current) {
        setAvatarClass('avatar-go-home');
        returnedHomeRef.current = true;
      } else if (returnedHomeRef.current && window.scrollY <= 20) {
        setAvatarClass('avatar-intro avatar-wave');
        returnedHomeRef.current = false;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      clearTimeout(introTimer);
      clearTimeout(waveTimer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Briefing / Job Inquiry Form State
  const [briefName, setBriefName] = useState('');
  const [briefEmail, setBriefEmail] = useState('');
  const [briefType, setBriefType] = useState('Senior Motion Designer (Full-Time / Contract)');
  const [briefTimeline, setBriefTimeline] = useState('Immediate (Next 1-2 Weeks)');
  const [briefMsg, setBriefMsg] = useState('');

  // Typewriter hook for hero message
  const { displayed, done } = useTypewriter(
    "glad you stopped in. as a senior motion designer & generative ai artist, i craft high-impact kinetic visual stories, commercial video direction, and brand systems. now, what are we building together?",
    30,
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
      experience: '4+ Years · Expert',
      description:
        'Keyframe choreography, kinetic typography, 3D camera tracking, expressions & scripting, seamless loop animations, and broadcast idents.',
    },
    {
      name: 'Illustrator',
      short: 'Ai',
      color: '#FF9A00',
      border: 'rgba(255, 154, 0, 0.4)',
      bg: '#180d00',
      glow: 'rgba(255, 154, 0, 0.35)',
      experience: '4+ Years · Advanced',
      description:
        'Vector asset design, storyboard framing, custom kinetic lettering, geometric precision layouts for motion and brand identities.',
    },
    {
      name: 'Photoshop',
      short: 'Ps',
      color: '#31A8FF',
      border: 'rgba(49, 168, 255, 0.4)',
      bg: '#001426',
      glow: 'rgba(49, 168, 255, 0.35)',
      experience: '4+ Years · Advanced',
      description:
        'Generative matte painting, high-end color grading, visual asset compositing, texture synthesis, and key visuals.',
    },
    {
      name: 'Premiere Pro',
      short: 'Pr',
      color: '#EA77FF',
      border: 'rgba(234, 119, 255, 0.4)',
      bg: '#1a0022',
      glow: 'rgba(234, 119, 255, 0.35)',
      experience: '4+ Years · Expert',
      description:
        'Cinematic rhythm, dynamic speed ramps, sound design synchronization, multi-cam editing, commercial post-production.',
    },
  ];

  // Video mouse-scrubbing refs and state
  const videoRef = useRef<HTMLVideoElement>(null);
  const reelVideoRef = useRef<HTMLVideoElement>(null);
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

  // Update Dhaka local time (UTC+6) every second
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

  // Keyboard navigation & modal dismissal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveModal(null);
        setSelectedProject(null);
        setInspectedTool(null);
        setIsMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
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
    sound.playClick();
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText('prantosarkar32@gmail.com');
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const toggleSound = () => {
    const active = sound.toggle();
    setSoundActive(active);
  };

  const openModal = (id: string) => {
    sound.playModalOpen();
    setActiveModal(id);
    setSelectedProject(null);
    setInspectedTool(null);
  };

  const closeModal = () => {
    sound.playClick();
    setActiveModal(null);
    setSelectedProject(null);
    setInspectedTool(null);
  };

  const handleSendBrief = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playClick();
    const subject = encodeURIComponent(`Job / Project Inquiry: ${briefType} — from ${briefName || 'Hiring Manager'}`);
    const body = encodeURIComponent(
      `Hello Pranto,\n\nName: ${briefName}\nEmail: ${briefEmail}\nInquiry Type: ${briefType}\nEstimated Timeline: ${briefTimeline}\n\nProject / Role Details:\n${briefMsg}\n\nLooking forward to speaking with you!`
    );
    window.open(`mailto:prantosarkar32@gmail.com?subject=${subject}&body=${body}`, '_blank');
  };

  const handleCopyBrief = () => {
    sound.playClick();
    const text = `Job / Project Inquiry: ${briefType}\nFrom: ${briefName || 'N/A'} (${briefEmail || 'N/A'})\nTimeline: ${briefTimeline}\nDetails: ${briefMsg || 'N/A'}`;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text);
      setBriefCopied(true);
      setTimeout(() => setBriefCopied(false), 2500);
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
        'Motion Graphics & Title Design',
        'Commercial Video Creation',
        'Video Editing & Rhythm Pacing',
        'Short-form Video / Reels Editing',
        'Storyboarding & Styleframes',
        'Kinetic Typography Choreography',
      ],
    },
    {
      title: 'AI Artistry & Generative Media',
      icon: '✦',
      items: [
        'AI Content Creation & Workflows',
        'AI Video Generation (Runway/ComfyUI)',
        'High-Fidelity AI Image Generation',
        'Prompt Engineering & Architecture',
        'Visual Storytelling & Keyframes',
        'Neural Matte Painting & Texturing',
      ],
    },
    {
      title: 'Brand & Graphic Design',
      icon: '❖',
      items: [
        'Brand Visual Design & Guidelines',
        'Product Advertisement Design',
        'Creative Concept Development',
        'Graphic Design & Vector Art',
        '3D Mockup Styling & Finishing',
      ],
    },
  ];

  const workflowSteps = [
    {
      step: '01',
      title: 'Creative Brief & Discovery',
      desc: 'Defining tone, brand narrative, visual references, kinetic rhythm, and technical delivery targets.',
    },
    {
      step: '02',
      title: 'Styleframes & Storyboarding',
      desc: 'Crafting static key visual frames, generative AI prompt exploration, and timing blueprints.',
    },
    {
      step: '03',
      title: 'Kinetic Animation & Synthesis',
      desc: 'Bringing visual assets to life through seamless easing, physics, neural motion diffusion, and speed curves.',
    },
    {
      step: '04',
      title: 'Sound Design & 4K Mastering',
      desc: 'Syncing sound fx, dynamic audio-reactive layers, precision color grading, and final delivery.',
    },
  ];

  // Case Studies (Top-tier motion designer showcase)
  const projects = [
    {
      id: 1,
      title: 'KINETIC SPECTRUM®',
      subtitle: 'Global Brand Identity & Motion Design System',
      category: 'motion',
      categoryLabel: 'Motion Graphics',
      year: '2025',
      client: 'Apex Creative / Global FinTech',
      tools: ['After Effects', 'Illustrator', 'Cinema 4D'],
      metrics: '3.2M+ Impressions · Featured on Behance Motion',
      overview:
        'A comprehensive kinetic identity system featuring parametric typography, cursor-reactive motion physics, and fluid brand idents designed to elevate the brand across digital interfaces and broadcast commercials.',
      deliverables: [
        'Complete brand motion system & rules',
        '4K 60FPS broadcast idents & stingers',
        'Modular kinetic typography presets for social campaigns',
        'Lottie / JSON UI micro-interaction animation suite',
      ],
    },
    {
      id: 2,
      title: 'SYNTHETIC REALMS™',
      subtitle: 'Neural Generative Worldbuilding & Latent Motion',
      category: 'ai',
      categoryLabel: 'AI Generation',
      year: '2025',
      client: 'HyperFuture AI & Studio X',
      tools: ['Midjourney v6', 'Runway Gen-3', 'ComfyUI', 'Photoshop'],
      metrics: '1.8M+ Organic Reach · 99.4% Client Approval',
      overview:
        'An experimental neural worldbuilding campaign uniting multi-model latent space exploration with post-production cinematic polish. Created surreal architectural spaces and kinetic lifeforms for a futuristic fashion film.',
      deliverables: [
        'Custom multi-lora prompt pipeline & style guides',
        '4K neural video generation sequence',
        'High-resolution keyframe matte paintings',
        'Post-processed motion tracking & color grading',
      ],
    },
    {
      id: 3,
      title: 'LUMEN VELOCITY®',
      subtitle: 'Next-Gen Audio Hardware Commercial Launch',
      category: 'commercial',
      categoryLabel: 'Commercial VFX',
      year: '2025',
      client: 'Sonic Labs Inc.',
      tools: ['Premiere Pro', 'After Effects', 'DaVinci Resolve'],
      metrics: '2.4M+ Video Views · 4.8x Conversion Rate Lift',
      overview:
        'A high-retention commercial video campaign engineered for maximum hook rate and visual punch. Leveraged dynamic speed ramps, sound-reactive typography, and explosive kinetic transitions.',
      deliverables: [
        '15s & 30s broadcast commercial cuts',
        '9:16 vertical high-retention reel edits for Instagram/TikTok',
        'Custom sound design & bass drops synchronization',
        'Product 3D isolation and kinetic UI callouts',
      ],
    },
    {
      id: 4,
      title: 'CHRONO HYPERDRIVE',
      subtitle: 'Sci-Fi Broadcast Title Sequence & HUD Animations',
      category: 'motion',
      categoryLabel: 'Motion Graphics',
      year: '2024',
      client: 'Nebula Stream Network',
      tools: ['After Effects', 'Illustrator', 'Audition'],
      metrics: 'Official Title Sequence · 4K Master',
      overview:
        'A retro-futuristic title sequence featuring complex kinetic telemetry, vector HUD systems, and analog CRT distortion shaders choreographing an intense hyperspace sequence.',
      deliverables: [
        '90-second animated title sequence master',
        'Procedural HUD vector graphic pack',
        'Custom chromatic aberration & glitch transitions',
      ],
    },
    {
      id: 5,
      title: 'NEURAL METAMORPHOSIS',
      subtitle: 'Generative AI Short Film & Character Continuity',
      category: 'ai',
      categoryLabel: 'AI Generation',
      year: '2024',
      client: 'Metavision Experimental',
      tools: ['ComfyUI', 'Runway Gen-3', 'Photoshop', 'After Effects'],
      metrics: 'Selected for Generative Cinema Showcase',
      overview:
        'Solving one of AI art’s hardest problems: persistent character keyframe continuity and fluid kinetic camera motion across 18 sequential scenes with zero hallucination artifacts.',
      deliverables: [
        'Consistent character face and anatomy LoRA models',
        'Kinetic camera pans and speed-ramped transitions',
        'Final composite and cinematic color grade',
      ],
    },
    {
      id: 6,
      title: 'VELOCITY APPAREL',
      subtitle: 'Dynamic Paid Social Ads & Viral Retention Reels',
      category: 'commercial',
      categoryLabel: 'Commercial VFX',
      year: '2024',
      client: 'Velocity Global Wear',
      tools: ['Premiere Pro', 'After Effects', 'Photoshop'],
      metrics: '5.6M+ Paid Impressions · 3.2x ROAS',
      overview:
        'A series of dynamic short-form social advertisements built on rhythm-matched beat drops, seamless zoom-in transitions, and kinetic price-tag graphics.',
      deliverables: [
        'Set of 8 modular high-converting social video ads',
        'Dynamic text animations and motion graphics overlay',
        'Multi-aspect ratio deliverables (9:16, 1:1, 16:9)',
      ],
    },
  ];

  // Career History / Work Experience (For recruiters & hiring managers)
  const workExperience = [
    {
      role: 'Lead Motion Designer & AI Art Director',
      company: 'Apex Creative Lab & Global Studios',
      period: '2024 — Present',
      location: 'Dhaka & Worldwide Remote',
      type: 'Full-Time & Lead Contracts',
      highlights: [
        'Orchestrated end-to-end motion systems and commercial broadcast assets for high-growth tech, fintech, and lifestyle brands.',
        'Engineered custom Generative AI video pipelines using ComfyUI, Midjourney v6, and Runway Gen-3, cutting pre-visualization turnaround by 45%.',
        'Mentored junior motion animators and set quality benchmarks for 4K 60FPS commercial delivery.',
      ],
    },
    {
      role: 'Senior Motion Graphics Artist & Video Editor',
      company: 'Kinetic Digital Media',
      period: '2022 — 2024',
      location: 'Dhaka, Bangladesh',
      type: 'Studio Role',
      highlights: [
        'Designed high-retention commercial reels, 3D styleframes, and kinetic typography packs generating over 15M+ combined views.',
        'Collaborated directly with international Creative Directors across the US, UK, and Singapore on multi-platform campaigns.',
        'Maintained 100% on-time milestone delivery across 40+ concurrent video production sprints.',
      ],
    },
    {
      role: 'Motion Designer & Visual Specialist',
      company: 'Freelance & Boutique Agencies',
      period: '2021 — 2022',
      location: 'Remote Contracts',
      type: 'Independent Contractor',
      highlights: [
        'Delivered 30+ brand idents, vector animations, explainer sequences, and social media commercial packages.',
        'Specialized in After Effects keyframing, Illustrator vector assets, and Premiere Pro sound-synced editing.',
      ],
    },
  ];

  const filteredProjects =
    activeCategory === 'all'
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  const navLinks = [
    { id: 'about-me', label: 'about me' },
    { id: 'experience', label: 'experience' },
    { id: 'projects', label: 'projects' },
    { id: 'services', label: 'services' },
    { id: 'contact', label: 'contact' },
  ];

  const heroPills = [
    { label: 'view reel', action: () => openModal('reel') },
    { label: 'experience & cv', action: () => openModal('experience') },
    { label: 'featured works', action: () => openModal('projects') },
    { label: 'capabilities', action: () => openModal('services') },
    { label: 'hire pranto', action: () => openModal('contact') },
  ];

  return (
    <div className="relative min-h-screen w-full bg-black text-white selection:bg-white selection:text-black overflow-hidden font-body">
      {/* =========================
         INTRO SPLASH SCREEN
      ========================= */}
      <div
        className={`intro-screen ${entered ? 'entered' : ''}`}
        onClick={() => {
          setEntered(true);
          document.body.classList.add('entered');
        }}
        title="Click to enter"
      >
        <h1 className="hi-text select-none">hi</h1>
      </div>

      {/* Background Video (mouse-scrub controlled - crisp & untouched) */}
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
      <div className="fixed bottom-6 left-6 z-10 hidden sm:flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/[0.06] border border-white/10 backdrop-blur-md text-[11px] font-mono-tech tracking-wider text-white/50 pointer-events-none select-none">
        <span className="w-1.5 h-1.5 rounded-full bg-white/70 animate-ping" />
        <span className="font-light">drag cursor left / right to scrub reel</span>
      </div>

      {/* Navbar (fixed, z-index: 20) */}
      <header className="fixed top-0 inset-x-0 z-20 w-full px-5 sm:px-8 py-4 sm:py-5 flex justify-between items-center backdrop-blur-[2px]">
        {/* Logo (left) - Bold & Thin Contrast */}
        <div
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => {
            sound.playClick();
            setActiveModal(null);
          }}
        >
          <span
            className="text-[22px] sm:text-[27px] font-display font-black tracking-tight text-white select-none group-hover:opacity-85 transition-opacity uppercase"
          >
            Pranto Sarkar®
          </span>
          <span
            className="text-[25px] sm:text-[30px] text-white select-none leading-none group-hover:rotate-45 transition-transform duration-300"
            style={{ letterSpacing: '-0.02em' }}
          >
            ✳︎
          </span>
          <div className="hidden lg:flex items-center gap-2.5 border-l border-white/20 pl-3">
            <span className="text-[10px] font-mono-tech uppercase tracking-[0.2em] font-light text-white/60">
              motion designer &amp; ai artist
            </span>
            <span className="inline-flex items-center gap-1.5 text-[9px] font-mono-tech uppercase tracking-wider text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/20">
              <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
              <span>Available for Hire</span>
            </span>
          </div>
        </div>

        {/* Desktop nav links (center, hidden below md) */}
        <nav
          className="hidden md:flex items-center text-[19px] lg:text-[21px] font-heading font-medium tracking-tight text-white"
        >
          {navLinks.map((item, idx) => (
            <React.Fragment key={item.id}>
              <button
                type="button"
                onClick={() => openModal(item.id)}
                onMouseEnter={() => sound.playHover()}
                className="hover:opacity-60 transition-opacity duration-200 cursor-pointer text-white"
              >
                {item.label}
              </button>
              {idx < navLinks.length - 1 && (
                <span className="text-white/40 select-none">,&nbsp;</span>
              )}
            </React.Fragment>
          ))}
        </nav>

        {/* Desktop CTA & Sound Toggle (right, hidden below md) */}
        <div className="hidden md:flex items-center gap-5">
          {/* Subtle Web Audio Toggle */}
          <button
            type="button"
            onClick={toggleSound}
            title={soundActive ? 'Audio Feedback ON' : 'Audio Feedback OFF (Click to enable)'}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono-tech tracking-wider border transition-all cursor-pointer ${
              soundActive
                ? 'bg-white/10 border-white/40 text-white'
                : 'bg-transparent border-white/15 text-white/40 hover:text-white hover:border-white/30'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${soundActive ? 'bg-emerald-400 animate-pulse' : 'bg-white/30'}`} />
            <span>SOUND {soundActive ? 'ON' : 'OFF'}</span>
          </button>

          {/* Download CV link */}
          <a
            href="/Pranto_Sarkar_CV.pdf"
            download="Pranto_Sarkar_CV.pdf"
            onMouseEnter={() => sound.playHover()}
            className="inline-flex items-center gap-2 text-[19px] lg:text-[21px] font-heading font-semibold text-white tracking-tight underline underline-offset-4 hover:opacity-75 transition-opacity group"
          >
            <span>download cv</span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-transform duration-200 group-hover:translate-y-0.5"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          </a>
        </div>

        {/* Mobile hamburger (visible below md) */}
        <button
          type="button"
          aria-label="Toggle navigation menu"
          onClick={() => {
            sound.playClick();
            setIsMenuOpen((prev) => !prev);
          }}
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
        className={`fixed inset-0 bg-black/95 backdrop-blur-md z-20 flex flex-col justify-center px-8 gap-5 transition-opacity duration-300 md:hidden ${
          isMenuOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="mb-2">
          <span className="text-[10px] font-mono-tech uppercase tracking-widest text-emerald-400">
            ● Available for Full-Time &amp; Contracts
          </span>
        </div>

        {navLinks.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              setIsMenuOpen(false);
              openModal(item.id);
            }}
            className="text-left text-[28px] font-heading font-semibold text-white hover:opacity-60 transition-opacity tracking-tight"
          >
            {item.label}
          </button>
        ))}

        <div className="pt-4 flex flex-col gap-4 border-t border-white/10">
          <a
            href="/Pranto_Sarkar_CV.pdf"
            download="Pranto_Sarkar_CV.pdf"
            onClick={() => setIsMenuOpen(false)}
            className="inline-flex items-center gap-3 text-[22px] font-heading font-medium text-white underline underline-offset-4 hover:opacity-60 transition-opacity tracking-tight"
          >
            <span>download cv (pdf)</span>
            <svg
              width="18"
              height="18"
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

          <button
            type="button"
            onClick={toggleSound}
            className="self-start text-[11px] font-mono-tech text-white/60 hover:text-white uppercase"
          >
            AUDIO FEEDBACK: {soundActive ? 'ON' : 'OFF'}
          </button>
        </div>
      </div>

      {/* Hero Section (z-index: 5) */}
      <main className="relative z-[5] w-full h-screen flex flex-col justify-end pb-16 md:justify-center md:pb-0 px-5 sm:px-8 md:px-10 overflow-hidden">
        {/* Content container (Left) */}
        <div className="max-w-xl relative z-10">
          {/* Animated Greeting Avatar Badge (Load enters -> Waves hand -> Scroll goes home) */}
          <div
            className={`inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/[0.08] border border-white/20 backdrop-blur-md text-xs font-mono-tech mb-3.5 select-none transition-all duration-300 ${avatarClass}`}
          >
            <span className="waving-hand text-base inline-block">👋</span>
            <span className="font-heading font-medium text-white/90 text-[12px] sm:text-[13px]">
              hey there! welcome to my portfolio
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>

          {/* 1. Blurred intro label - Premium Bold & Thin Contrast */}
          <div className="pointer-events-none select-none mb-3 sm:mb-4 text-[clamp(19px,4.2vw,27px)] leading-[1.25] text-white blur-[3px]">
            <span className="font-display font-extrabold uppercase">hey there, i'm pranto sarkar,</span>
            <br />
            <span className="font-light tracking-wide text-white/80">senior motion designer &amp; ai artist</span>
          </div>

          {/* 2. Typewriter text */}
          <p
            className="text-white mb-5 sm:mb-6 text-[clamp(17px,3.8vw,24px)] leading-[1.38] font-light tracking-tight min-h-[58px]"
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
                onClick={() => {
                  sound.playClick();
                  pill.action();
                }}
                onMouseEnter={() => sound.playHover()}
                className="inline-flex items-center justify-center bg-white text-black font-semibold border border-black/10 rounded-full text-[13px] sm:text-[14px] px-4 sm:px-5 py-[0.34em] mx-[0.2em] mb-[0.4em] whitespace-nowrap cursor-pointer hover:bg-black hover:text-white transition-colors duration-200"
              >
                {pill.label}
              </button>
            ))}

            {/* Email copy button */}
            <button
              type="button"
              onClick={handleCopyEmail}
              onMouseEnter={() => sound.playHover()}
              className="inline-flex items-center justify-center text-white bg-transparent border border-white/90 rounded-full text-[13px] sm:text-[14px] px-4 sm:px-5 py-[0.34em] mx-[0.2em] mb-[0.4em] whitespace-nowrap cursor-pointer hover:bg-white hover:text-black transition-colors duration-200 gap-2 sm:gap-3 group"
              title="Click to copy email address"
            >
              <span>
                reach me:{' '}
                <span className="underline underline-offset-1 font-mono-tech text-[12px] sm:text-[13px]">
                  prantosarkar32@gmail.com
                </span>
              </span>
              {copied ? (
                <span className="text-[11px] font-mono-tech text-emerald-400 font-medium">
                  copied!
                </span>
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
          onClick={() => openModal('services')}
          className="absolute bottom-4 inset-x-0 overflow-hidden py-2 cursor-pointer group select-none pointer-events-auto"
          title="Click to view full services & capabilities"
        >
          <div className="flex whitespace-nowrap animate-marquee opacity-40 hover:opacity-100 transition-opacity duration-300">
            {[...capabilities, ...capabilities].map((cap, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-3 text-[11px] font-mono-tech tracking-[0.2em] uppercase text-white/70 mx-4"
              >
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
          boxShadow:
            '0 30px 60px -12px rgba(0,0,0,0.85), 0 18px 36px -18px rgba(0,0,0,0.7), inset 0 1.5px 1px 0 rgba(255,255,255,0.35), inset 0 -1.5px 2px 0 rgba(0,0,0,0.5)',
        }}
      >
        {/* Subtle Specular Top Reflection / Light Sheen */}
        <div className="absolute inset-x-4 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />

        <div className="flex items-center gap-1.5 text-[11px] font-mono-tech uppercase tracking-wider text-white/60 pl-1 pr-0.5 whitespace-nowrap drop-shadow">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee] animate-pulse" />
          <span className="font-bold text-white/80">Arsenal</span>
        </div>

        <div className="h-4 w-[1px] bg-white/20" />

        <div className="flex items-center gap-1.5 sm:gap-2">
          {creativeTools.map((tool) => (
            <div
              key={tool.name}
              onClick={() => {
                sound.playClick();
                setInspectedTool(inspectedTool === tool.name ? null : tool.name);
              }}
              onMouseEnter={() => sound.playHover()}
              className="glass-item-3d inline-flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-full group cursor-pointer select-none"
              title={`Click to inspect ${tool.name} capabilities`}
            >
              <div
                className="glass-badge-3d w-5 h-5 rounded-[5px] flex items-center justify-center text-[10px] font-black border transition-all duration-300 group-hover:scale-110 shrink-0 font-display"
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

      {/* Arsenal Tooltip Inspector Popover */}
      {inspectedTool && (
        <div className="fixed bottom-20 sm:bottom-24 right-5 sm:right-8 z-30 max-w-sm glass-panel-3d rounded-2xl p-4 border border-white/20 shadow-2xl animate-fadeIn text-left">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-display font-bold text-white uppercase tracking-wider">
                {inspectedTool}
              </span>
              <span className="text-[10px] font-mono-tech text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded-full border border-cyan-500/20">
                {creativeTools.find((t) => t.name === inspectedTool)?.experience}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setInspectedTool(null)}
              className="text-white/60 hover:text-white text-xs cursor-pointer"
            >
              ✕
            </button>
          </div>
          <p className="text-xs font-light text-white/80 leading-relaxed">
            {creativeTools.find((t) => t.name === inspectedTool)?.description}
          </p>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODALS (Strictly preserves pure black background & transparent 3D glass) */}
      {/* ========================================================================= */}
      {activeModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-xl animate-fadeIn"
          onClick={closeModal}
        >
          <div
            className="glass-panel-3d w-full max-w-3xl max-h-[88vh] overflow-y-auto rounded-3xl p-6 sm:p-8 relative border border-white/20 shadow-2xl text-left"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              type="button"
              onClick={closeModal}
              className="sticky top-0 float-right w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition-colors cursor-pointer z-10"
              title="Close (Esc)"
            >
              ✕
            </button>

            {/* ================================================================= */}
            {/* MODAL 1: SHOWREEL CINEMA LIGHTBOX */}
            {/* ================================================================= */}
            {activeModal === 'reel' && (
              <div className="space-y-5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-[10px] font-mono-tech uppercase tracking-widest text-cyan-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                    <span>Official Motion Showreel</span>
                  </span>
                  <span className="text-[10px] font-mono-tech text-white/50 border border-white/10 px-2.5 py-0.5 rounded-full">
                    4K Master · 60 FPS
                  </span>
                  <span className="text-[10px] font-mono-tech text-white/50 border border-white/10 px-2.5 py-0.5 rounded-full">
                    ProRes 422HQ
                  </span>
                </div>

                <div>
                  <h3 className="text-2xl sm:text-4xl font-display font-extrabold tracking-tight text-white uppercase">
                    Kinetic Showreel &amp; Visual Symphony
                  </h3>
                  <p className="text-white/60 text-xs sm:text-sm font-light tracking-wide mt-1">
                    Choreographing commercial kinetic typography, dynamic speed ramps, and neural AI video generation.
                  </p>
                </div>

                {/* Showreel Cinema Player */}
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-white/15 bg-black/60 shadow-2xl group">
                  <video
                    ref={reelVideoRef}
                    src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260826_041744_63efcd78-bf7d-4039-99e2-2461e8a61903.mp4"
                    className="w-full h-full object-cover"
                    autoPlay
                    loop
                    muted={reelMuted}
                    playsInline
                  />

                  {/* Player Overlay Controls */}
                  <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex items-center justify-between gap-3 text-xs font-mono-tech">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          sound.playClick();
                          const v = reelVideoRef.current;
                          if (v) {
                            if (v.paused) {
                              v.play();
                              setReelPlaying(true);
                            } else {
                              v.pause();
                              setReelPlaying(false);
                            }
                          }
                        }}
                        className="px-3 py-1.5 rounded-full bg-white text-black font-semibold hover:bg-white/90 transition-colors cursor-pointer"
                      >
                        {reelPlaying ? 'Pause ❚❚' : 'Play ▶'}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          sound.playClick();
                          const v = reelVideoRef.current;
                          if (v) {
                            v.muted = !reelMuted;
                            setReelMuted(!reelMuted);
                          }
                        }}
                        className="px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-colors cursor-pointer"
                      >
                        {reelMuted ? 'Unmute 🔇' : 'Mute 🔊'}
                      </button>
                    </div>

                    <div className="text-white/60 text-[11px] hidden sm:block">
                      <span>4K 60FPS Direct Master</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        sound.playClick();
                        reelVideoRef.current?.requestFullscreen?.();
                      }}
                      className="px-2.5 py-1.5 rounded-full bg-white/5 border border-white/15 text-white/70 hover:text-white transition-colors cursor-pointer"
                      title="Fullscreen"
                    >
                      ⛶ Fullscreen
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/10">
                  <div className="text-xs font-mono-tech text-white/50">
                    Looking to review candidate credentials &amp; career history?
                  </div>
                  <button
                    type="button"
                    onClick={() => openModal('experience')}
                    className="px-4 py-2 rounded-full bg-white text-black text-xs font-semibold hover:bg-white/90 transition-colors cursor-pointer font-heading"
                  >
                    View Career Experience &amp; CV →
                  </button>
                </div>
              </div>
            )}

            {/* ================================================================= */}
            {/* MODAL 2: WORK EXPERIENCE & CAREER RESUME (Crucial for getting jobs) */}
            {/* ================================================================= */}
            {activeModal === 'experience' && (
              <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-mono-tech uppercase tracking-widest text-emerald-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Career Track Record &amp; Resume</span>
                  </div>
                  <span className="text-[11px] font-mono-tech text-emerald-400 font-medium">
                    ● Available for Full-Time &amp; Global Contracts
                  </span>
                </div>

                <div>
                  <h3 className="text-2xl sm:text-4xl font-display font-black tracking-tight text-white uppercase">
                    Work Experience &amp; Impact
                  </h3>
                  <p className="text-white/60 text-xs sm:text-sm font-light tracking-wide mt-1">
                    4+ years delivering commercial kinetic visual systems, broadcast animation, and neural generative media.
                  </p>
                </div>

                {/* Key Metrics Banner */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
                  <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10">
                    <div className="text-2xl font-display font-black text-white">4+</div>
                    <div className="text-[10px] font-mono-tech text-white/50 uppercase tracking-widest mt-0.5">
                      Years Craft
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10">
                    <div className="text-2xl font-display font-black text-cyan-300">50+</div>
                    <div className="text-[10px] font-mono-tech text-white/50 uppercase tracking-widest mt-0.5">
                      Completed Projects
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10">
                    <div className="text-2xl font-display font-black text-amber-300">15M+</div>
                    <div className="text-[10px] font-mono-tech text-white/50 uppercase tracking-widest mt-0.5">
                      Campaign Reach
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10">
                    <div className="text-2xl font-display font-black text-emerald-400">100%</div>
                    <div className="text-[10px] font-mono-tech text-white/50 uppercase tracking-widest mt-0.5">
                      On-Time Delivery
                    </div>
                  </div>
                </div>

                {/* Experience Timeline */}
                <div className="space-y-4 pt-1">
                  {workExperience.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-4 sm:p-5 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-white/30 transition-all space-y-2.5"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <div>
                          <h4 className="text-base sm:text-lg font-heading font-bold text-white">
                            {item.role}
                          </h4>
                          <div className="text-xs font-mono-tech text-cyan-300">
                            {item.company} · {item.location}
                          </div>
                        </div>
                        <div className="text-right sm:text-right">
                          <span className="text-[10px] font-mono-tech text-white/50 border border-white/15 px-2 py-0.5 rounded-full">
                            {item.period}
                          </span>
                        </div>
                      </div>

                      <ul className="space-y-1 text-xs text-white/70 font-light leading-relaxed">
                        {item.highlights.map((h, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-cyan-400 text-sm leading-none mt-0.5">▸</span>
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                {/* Client & Endorsement Quote */}
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
                  <div className="text-[10px] font-mono-tech uppercase text-amber-300 mb-1">
                    ★ Creative Director Endorsement:
                  </div>
                  <blockquote className="text-xs italic text-white/80 font-light">
                    "Pranto combines razor-sharp kinetic pacing with an extraordinary grasp of generative AI workflows. He repeatedly delivered commercial cuts ahead of schedule with immaculate attention to detail."
                  </blockquote>
                  <div className="text-[10px] font-mono-tech text-white/40 mt-1.5">
                    — Senior Creative Producer, Global Digital Agency
                  </div>
                </div>

                {/* Actions: Download Resume & Contact */}
                <div className="pt-2 flex flex-wrap justify-between items-center gap-3 border-t border-white/10">
                  <a
                    href="/Pranto_Sarkar_CV.pdf"
                    download="Pranto_Sarkar_CV.pdf"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-black text-xs font-semibold hover:bg-white/90 transition-colors font-heading"
                  >
                    <span>Download Official Resume (PDF)</span>
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                  </a>

                  <button
                    type="button"
                    onClick={() => openModal('contact')}
                    className="px-4 py-2.5 rounded-full bg-white/10 border border-white/20 text-white text-xs font-heading font-medium hover:bg-white hover:text-black transition-colors cursor-pointer"
                  >
                    Schedule Interview / Hire →
                  </button>
                </div>
              </div>
            )}

            {/* ================================================================= */}
            {/* MODAL 3: SELECTED WORKS & CASE STUDIES */}
            {/* ================================================================= */}
            {activeModal === 'projects' && (
              <div className="space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-[10px] font-mono-tech uppercase tracking-widest text-amber-300">
                    <span>selected works &amp; case studies</span>
                  </div>

                  {/* Filter tabs */}
                  <div className="flex items-center gap-1.5 bg-white/5 p-1 rounded-full border border-white/10 text-xs font-mono-tech">
                    {[
                      { id: 'all', label: 'All (6)' },
                      { id: 'motion', label: 'Motion' },
                      { id: 'ai', label: 'AI' },
                      { id: 'commercial', label: 'Commercial' },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => {
                          sound.playClick();
                          setActiveCategory(tab.id);
                        }}
                        className={`px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                          activeCategory === tab.id
                            ? 'bg-white text-black font-semibold shadow'
                            : 'text-white/60 hover:text-white font-light'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl sm:text-4xl font-display font-black tracking-tight text-white uppercase">
                    Featured Portfolio Works
                  </h3>
                  <p className="text-white/60 text-xs sm:text-sm font-light tracking-wide mt-1">
                    Click any project below to inspect the full case study, creative brief, deliverables, and performance metrics.
                  </p>
                </div>

                {/* Project Cards Grid */}
                <div className="grid sm:grid-cols-2 gap-3.5 pt-1">
                  {filteredProjects.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => {
                        sound.playClick();
                        setSelectedProject(selectedProject === p.id ? null : p.id);
                      }}
                      className={`p-4 rounded-2xl bg-white/[0.04] border transition-all cursor-pointer flex flex-col justify-between gap-3 group ${
                        selectedProject === p.id
                          ? 'border-white/60 bg-white/[0.08]'
                          : 'border-white/10 hover:border-white/30'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <span className="text-[10px] font-mono-tech uppercase text-white/50">
                            {p.year} · {p.client}
                          </span>
                          <span className="text-[10px] font-mono-tech text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded-full border border-cyan-500/20">
                            {p.categoryLabel}
                          </span>
                        </div>
                        <h4 className="text-base font-heading font-bold text-white group-hover:text-cyan-300 transition-colors">
                          {p.title}
                        </h4>
                        <p className="text-xs text-white/60 mt-1 line-clamp-2 font-light">
                          {p.subtitle}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] font-mono-tech text-white/40">
                        <div className="flex gap-2">
                          {p.tools.slice(0, 2).map((t) => (
                            <span key={t}>{t}</span>
                          ))}
                        </div>
                        <span className="text-white/80 group-hover:translate-x-0.5 transition-transform font-medium">
                          {selectedProject === p.id ? 'Close Details ✕' : 'Inspect Case Study →'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Expanded Project Case Study Inspector */}
                {selectedProject && (
                  <div className="p-5 rounded-2xl bg-white/[0.06] border border-white/20 space-y-4 animate-fadeIn">
                    {(() => {
                      const p = projects.find((item) => item.id === selectedProject);
                      if (!p) return null;
                      return (
                        <>
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="text-[10px] font-mono-tech text-cyan-400 uppercase tracking-widest">
                                Case Study Breakdown
                              </span>
                              <h4 className="text-xl font-display font-bold text-white mt-0.5 uppercase">
                                {p.title}
                              </h4>
                              <p className="text-xs text-white/60 font-light">{p.subtitle}</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => setSelectedProject(null)}
                              className="text-white/60 hover:text-white text-xs font-mono-tech cursor-pointer"
                            >
                              ✕ Close
                            </button>
                          </div>

                          <div className="grid sm:grid-cols-2 gap-4 text-xs">
                            <div>
                              <div className="font-mono-tech text-white/40 mb-1">PROJECT OVERVIEW:</div>
                              <p className="text-white/80 leading-relaxed font-light">{p.overview}</p>
                            </div>
                            <div>
                              <div className="font-mono-tech text-white/40 mb-1">KEY DELIVERABLES:</div>
                              <ul className="space-y-1 text-white/70 font-light">
                                {p.deliverables.map((d) => (
                                  <li key={d} className="flex items-center gap-1.5">
                                    <span className="text-cyan-400">✓</span>
                                    <span>{d}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/10 text-xs font-mono-tech">
                            <div className="text-emerald-400">
                              ★ Impact: {p.metrics}
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setBriefType(p.categoryLabel);
                                openModal('contact');
                              }}
                              className="px-3.5 py-1.5 rounded-full bg-white text-black font-semibold hover:bg-white/90 transition-colors cursor-pointer font-heading"
                            >
                              Hire for Similar Scope →
                            </button>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                )}
              </div>
            )}

            {/* ================================================================= */}
            {/* MODAL 4: SERVICES & PRODUCTION PIPELINE */}
            {/* ================================================================= */}
            {activeModal === 'services' && (
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-[10px] font-mono-tech uppercase tracking-widest text-cyan-300">
                  <span>services &amp; capabilities</span>
                </div>
                <div>
                  <h3 className="text-2xl sm:text-4xl font-display font-black tracking-tight text-white uppercase">
                    Full-Spectrum Creative Direction
                  </h3>
                  <p className="text-white/60 text-xs sm:text-sm font-light tracking-wide mt-1">
                    Combining premier motion craft, cinematic video editing, and modern neural AI pipelines to deliver standout creative work for world-class brands.
                  </p>
                </div>

                {/* 3 Main Service Pillars */}
                <div className="grid sm:grid-cols-3 gap-3.5 pt-1">
                  {serviceCategories.map((cat) => (
                    <div
                      key={cat.title}
                      className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 flex flex-col gap-2.5 hover:border-white/25 transition-colors"
                    >
                      <div className="flex items-center gap-2 text-white font-heading font-semibold text-sm">
                        <span className="text-base text-cyan-300">{cat.icon}</span>
                        <span>{cat.title}</span>
                      </div>
                      <ul className="space-y-1.5 text-xs text-white/60 font-light">
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

                {/* Production Workflow Process */}
                <div className="pt-2">
                  <h4 className="text-xs font-mono-tech uppercase tracking-widest text-white/50 mb-3">
                    Creative Production Workflow:
                  </h4>
                  <div className="grid sm:grid-cols-4 gap-2.5">
                    {workflowSteps.map((step) => (
                      <div
                        key={step.step}
                        className="p-3 rounded-xl bg-white/[0.03] border border-white/10"
                      >
                        <div className="text-[11px] font-mono-tech text-cyan-400 mb-1 font-bold">
                          {step.step}
                        </div>
                        <div className="text-xs font-heading font-semibold text-white mb-1">
                          {step.title}
                        </div>
                        <div className="text-[11px] text-white/50 font-light leading-relaxed">
                          {step.desc}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap justify-between items-center gap-3 border-t border-white/10">
                  <span className="text-xs font-mono-tech text-white/50">
                    Need a customized commercial contract?
                  </span>
                  <button
                    type="button"
                    onClick={() => openModal('contact')}
                    className="px-4 py-2 rounded-full bg-white text-black text-xs font-semibold hover:bg-white/90 transition-colors cursor-pointer font-heading"
                  >
                    Start a Project →
                  </button>
                </div>
              </div>
            )}

            {/* ================================================================= */}
            {/* MODAL 5: ABOUT ME & PHILOSOPHY */}
            {/* ================================================================= */}
            {activeModal === 'about-me' && (
              <div className="space-y-5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-[10px] font-mono-tech uppercase tracking-widest text-cyan-300">
                  <span>biography &amp; creative philosophy</span>
                </div>
                <div>
                  <h3 className="text-2xl sm:text-4xl font-display font-black tracking-tight text-white uppercase">
                    Pranto Sarkar
                  </h3>
                  <p className="text-white/60 text-xs sm:text-sm font-light tracking-wide mt-1">
                    Senior Motion Designer &amp; Generative AI Artist based in Dhaka, collaborating with international teams.
                  </p>
                </div>

                <p className="text-white/80 text-sm sm:text-base leading-relaxed font-light">
                  I specialize in kinetic visual storytelling, commercial broadcast animation, and high-fidelity generative AI aesthetics. With over 4+ years dedicated to crafting brand experiences, I bridge the gap between classic graphic motion craft and neural AI pipelines.
                </p>

                {/* 3 Pillars of Craft */}
                <div className="grid sm:grid-cols-3 gap-3 pt-1">
                  <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10">
                    <div className="text-xs font-mono-tech text-cyan-400 mb-1">01. MOTION</div>
                    <div className="text-sm font-heading font-semibold text-white">Kinetic Rhythm</div>
                    <div className="text-xs text-white/60 mt-1 font-light">
                      High-impact transitions, smooth easing curves, and kinetic typography that command attention.
                    </div>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10">
                    <div className="text-xs font-mono-tech text-amber-400 mb-1">02. ARTISTRY</div>
                    <div className="text-sm font-heading font-semibold text-white">Generative AI</div>
                    <div className="text-xs text-white/60 mt-1 font-light">
                      Custom neural prompting, synthetic world building, and seamless multi-model composites.
                    </div>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10">
                    <div className="text-xs font-mono-tech text-purple-400 mb-1">03. DIRECTION</div>
                    <div className="text-sm font-heading font-semibold text-white">Brand Impact</div>
                    <div className="text-xs text-white/60 mt-1 font-light">
                      Commercial campaigns, high-converting product ads, and futuristic social visual identities.
                    </div>
                  </div>
                </div>

                {/* Core Toolkit Highlights */}
                <div className="pt-2 border-t border-white/10">
                  <div className="text-xs font-mono-tech uppercase text-white/50 mb-2">
                    Primary Arsenal &amp; Software Stack:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono-tech text-white/80">
                      After Effects
                    </span>
                    <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono-tech text-white/80">
                      Premiere Pro
                    </span>
                    <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono-tech text-white/80">
                      Illustrator
                    </span>
                    <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono-tech text-white/80">
                      Photoshop
                    </span>
                    <span className="px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-xs font-mono-tech text-cyan-300">
                      Generative AI (Midjourney, Runway Gen-3, ComfyUI)
                    </span>
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap justify-between items-center gap-3 border-t border-white/10">
                  <a
                    href="/Pranto_Sarkar_CV.pdf"
                    download="Pranto_Sarkar_CV.pdf"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white text-xs font-mono-tech hover:bg-white hover:text-black transition-colors"
                  >
                    <span>Download Official CV (PDF)</span>
                    <span>↓</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => openModal('contact')}
                    className="px-4 py-2 rounded-full bg-white text-black text-xs font-semibold hover:bg-white/90 transition-colors cursor-pointer font-heading"
                  >
                    Contact Pranto →
                  </button>
                </div>
              </div>
            )}

            {/* ================================================================= */}
            {/* MODAL 6: CONTACT & HIRING INQUIRY */}
            {/* ================================================================= */}
            {activeModal === 'contact' && (
              <div className="space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-[10px] font-mono-tech uppercase tracking-widest text-purple-300">
                    <span>direct hiring &amp; collaboration</span>
                  </div>
                  <div className="text-[11px] font-mono-tech text-emerald-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Open to Full-Time &amp; Contracts</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl sm:text-4xl font-display font-black tracking-tight text-white uppercase">
                    Let's Build Something Exceptional
                  </h3>
                  <p className="text-white/60 text-xs sm:text-sm font-light tracking-wide mt-1">
                    Have an open role, an upcoming commercial campaign, or need generative AI visual direction? Reach out below.
                  </p>
                </div>

                {/* Email Box */}
                <div className="p-4 rounded-2xl bg-white/5 border border-white/15 flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
                  <div>
                    <div className="text-[10px] font-mono-tech uppercase text-white/40">
                      Official Candidate Email:
                    </div>
                    <span className="font-mono-tech text-sm sm:text-base text-cyan-300 select-all font-medium">
                      prantosarkar32@gmail.com
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="self-start sm:self-auto px-4 py-2 rounded-full bg-white text-black text-xs font-semibold hover:bg-white/90 transition-colors cursor-pointer font-heading"
                  >
                    {copied ? '✓ Copied!' : 'Copy Email'}
                  </button>
                </div>

                {/* Quick Interactive Project / Role Brief Form */}
                <form onSubmit={handleSendBrief} className="space-y-3 pt-1">
                  <div className="text-xs font-mono-tech uppercase text-white/50">
                    Job / Project Inquiry Form:
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-mono-tech text-white/60 mb-1">
                        Your Name / Studio
                      </label>
                      <input
                        type="text"
                        value={briefName}
                        onChange={(e) => setBriefName(e.target.value)}
                        placeholder="e.g. Alex Morgan (Art Director)"
                        className="w-full px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/15 text-xs text-white placeholder-white/30 focus:outline-none focus:border-white/50"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono-tech text-white/60 mb-1">
                        Work Email
                      </label>
                      <input
                        type="email"
                        value={briefEmail}
                        onChange={(e) => setBriefEmail(e.target.value)}
                        placeholder="e.g. alex@studio.com"
                        className="w-full px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/15 text-xs text-white placeholder-white/30 focus:outline-none focus:border-white/50"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-mono-tech text-white/60 mb-1">
                        Inquiry Scope
                      </label>
                      <select
                        value={briefType}
                        onChange={(e) => setBriefType(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl bg-[#0a0a0a] border border-white/15 text-xs text-white focus:outline-none focus:border-white/50"
                      >
                        <option value="Senior Motion Designer (Full-Time / Contract)">Senior Motion Designer (Full-Time / Contract)</option>
                        <option value="Commercial Video / Reel Direction">Commercial Video / Reel Direction</option>
                        <option value="Generative AI Artistry & Visuals">Generative AI Artistry &amp; Visuals</option>
                        <option value="Brand Identity Motion System">Brand Identity Motion System</option>
                        <option value="Freelance Sprint">Freelance Sprint</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono-tech text-white/60 mb-1">
                        Timeline / Start Date
                      </label>
                      <select
                        value={briefTimeline}
                        onChange={(e) => setBriefTimeline(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl bg-[#0a0a0a] border border-white/15 text-xs text-white focus:outline-none focus:border-white/50"
                      >
                        <option value="Immediate (Next 1-2 Weeks)">Immediate (Next 1-2 Weeks)</option>
                        <option value="This Month">This Month</option>
                        <option value="Next Quarter">Next Quarter</option>
                        <option value="Open Discussions">Open Discussions</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono-tech text-white/60 mb-1">
                      Role / Project Details
                    </label>
                    <textarea
                      rows={3}
                      value={briefMsg}
                      onChange={(e) => setBriefMsg(e.target.value)}
                      placeholder="Share role responsibilities, project brief, budget parameters, or interview requests..."
                      className="w-full px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/15 text-xs text-white placeholder-white/30 focus:outline-none focus:border-white/50 resize-none font-light"
                    />
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1">
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-full bg-white text-black text-xs font-semibold hover:bg-white/90 transition-colors cursor-pointer font-heading"
                    >
                      Send Message to Pranto →
                    </button>

                    <button
                      type="button"
                      onClick={handleCopyBrief}
                      className="px-3.5 py-2 rounded-full bg-white/5 border border-white/15 text-white/70 hover:text-white text-xs font-mono-tech transition-colors cursor-pointer"
                    >
                      {briefCopied ? '✓ Inquiry Copied!' : 'Copy Inquiry Text'}
                    </button>
                  </div>
                </form>

                {/* Quick Location & Details */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2 text-xs border-t border-white/10">
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
                    <div className="text-white/40 font-mono-tech text-[10px]">Location</div>
                    <div className="text-white font-medium mt-0.5">
                      Dhaka, Bangladesh
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
                    <div className="text-white/40 font-mono-tech text-[10px]">Local Time (UTC+6)</div>
                    <div className="text-cyan-300 font-mono-tech font-medium mt-0.5">
                      {dhakaTime || '06:00 PM'}
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 col-span-2 sm:col-span-1">
                    <div className="text-white/40 font-mono-tech text-[10px]">Portfolios</div>
                    <div className="text-white font-mono-tech mt-0.5 flex gap-2">
                      <a
                        href="https://linkedin.com"
                        target="_blank"
                        rel="noreferrer"
                        className="hover:underline text-cyan-300"
                      >
                        LinkedIn
                      </a>
                      <span>•</span>
                      <a
                        href="https://behance.net"
                        target="_blank"
                        rel="noreferrer"
                        className="hover:underline text-amber-300"
                      >
                        Behance
                      </a>
                    </div>
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
