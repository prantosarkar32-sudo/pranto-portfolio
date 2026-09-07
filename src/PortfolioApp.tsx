import React, { useState, useEffect, useRef } from 'react';
import { useTypewriter } from './useTypewriter';
import { sound } from './audio';

export default function PortfolioApp() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [briefCopied, setBriefCopied] = useState(false);
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [inspectedTool, setInspectedTool] = useState<string | null>(null);
  const [reelPlaying, setReelPlaying] = useState(true);
  const [reelMuted, setReelMuted] = useState(true);
  const [dhakaTime, setDhakaTime] = useState('');
  const [scrolled, setScrolled] = useState(false);

  // Avatar Video mouse-scrubbing refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const prevXRef = useRef<number | null>(null);
  const targetTimeRef = useRef<number>(0);
  const isSeekingRef = useRef<boolean>(false);

  // Avatar subtle parallax offset
  const [avatarOffset, setAvatarOffset] = useState({ x: 0, y: 0 });

  // Briefing / Job Inquiry Form State
  const [briefName, setBriefName] = useState('');
  const [briefEmail, setBriefEmail] = useState('');
  const [briefType, setBriefType] = useState('Senior Motion Designer (Full-Time / Contract)');
  const [briefTimeline, setBriefTimeline] = useState('Immediate (Next 1-2 Weeks)');
  const [briefMsg, setBriefMsg] = useState('');

  // Horizontal Reel Scrub Ref
  const reelTrackRef = useRef<HTMLDivElement>(null);
  const isDraggingReelRef = useRef<boolean>(false);
  const startXRef = useRef<number>(0);
  const scrollLeftRef = useRef<number>(0);

  // Typewriter hook for hero message
  const { displayed, done } = useTypewriter(
    "glad you stopped in. as a senior motion designer & generative ai artist, i craft high-impact kinetic visual stories, commercial video direction, and brand systems. now, what are we building together?",
    28,
    300
  );

  // Creative Software Arsenal
  const creativeTools = [
    {
      name: 'After Effects',
      short: 'Ae',
      color: '#9999FF',
      border: 'rgba(153, 153, 255, 0.4)',
      bg: '#08081a',
      glow: 'rgba(153, 153, 255, 0.4)',
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
      glow: 'rgba(255, 154, 0, 0.4)',
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
      glow: 'rgba(49, 168, 255, 0.4)',
      experience: '4+ Years · Advanced',
      description:
        'Generative matte painting, high-end color grading, visual asset compositing, texture synthesis, and key visual boards.',
    },
    {
      name: 'Premiere Pro',
      short: 'Pr',
      color: '#EA77FF',
      border: 'rgba(234, 119, 255, 0.4)',
      bg: '#1a0022',
      glow: 'rgba(234, 119, 255, 0.4)',
      experience: '4+ Years · Expert',
      description:
        'Cinematic rhythm, dynamic speed ramps, sound design synchronization, multi-cam editing, commercial post-production.',
    },
  ];

  // Reel Video Ref
  const reelVideoRef = useRef<HTMLVideoElement>(null);


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

  // Scroll detection for sticky nav
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
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

  // Mouse & touch move handler for parallax & avatar video scrubbing
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Subtle avatar parallax
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const moveX = ((e.clientX - centerX) / centerX) * 4;
      const moveY = ((e.clientY - centerY) / centerY) * 4;
      setAvatarOffset({ x: moveX, y: moveY });

      // Video scrubbing with mouse movement
      const video = videoRef.current;
      if (!video) return;
      const duration = video.duration || 4.04;

      if (prevXRef.current === null) {
        prevXRef.current = e.clientX;
        return;
      }

      const delta = e.clientX - prevXRef.current;
      prevXRef.current = e.clientX;

      const SENSITIVITY = 0.9;
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

    // Touch scrubbing for mobile devices
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 0) return;
      const touch = e.touches[0];
      const video = videoRef.current;
      if (!video) return;

      const duration = video.duration || 4.04;
      if (prevXRef.current === null) {
        prevXRef.current = touch.clientX;
        return;
      }

      const delta = touch.clientX - prevXRef.current;
      prevXRef.current = touch.clientX;

      const SENSITIVITY = 1.1;
      const timeOffset = (delta / window.innerWidth) * SENSITIVITY * duration;
      let nextTarget = targetTimeRef.current + timeOffset;
      nextTarget = Math.max(0, Math.min(duration, nextTarget));
      targetTimeRef.current = nextTarget;

      if (!isSeekingRef.current) {
        isSeekingRef.current = true;
        video.currentTime = nextTarget;
      }
    };

    const handleTouchEnd = () => {
      prevXRef.current = null;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  // onSeeked handler to ensure video stays synchronized
  const handleSeeked = () => {
    const video = videoRef.current;
    if (!video) return;

    if (Math.abs(video.currentTime - targetTimeRef.current) > 0.02) {
      video.currentTime = targetTimeRef.current;
    } else {
      isSeekingRef.current = false;
    }
  };

  const handleLoadedMetadata = () => {
    const video = videoRef.current;
    if (!video) return;
    const dur = video.duration || 4.04;
    // Set initial frame to warm forward-facing smile
    const initialTime = dur * 0.45;
    targetTimeRef.current = initialTime;
    video.currentTime = initialTime;
  };

  // Horizontal Reel Drag Scrubbing
  const handleReelMouseDown = (e: React.MouseEvent) => {
    const track = reelTrackRef.current;
    if (!track) return;
    isDraggingReelRef.current = true;
    startXRef.current = e.pageX - track.offsetLeft;
    scrollLeftRef.current = track.scrollLeft;
  };

  const handleReelMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingReelRef.current) return;
    e.preventDefault();
    const track = reelTrackRef.current;
    if (!track) return;
    const x = e.pageX - track.offsetLeft;
    const walk = (x - startXRef.current) * 1.5;
    track.scrollLeft = scrollLeftRef.current - walk;
  };

  const handleReelMouseUp = () => {
    isDraggingReelRef.current = false;
  };

  // Wheel horizontal scrub on project reel
  const handleReelWheel = (e: React.WheelEvent) => {
    const track = reelTrackRef.current;
    if (!track) return;
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      track.scrollLeft += e.deltaY;
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
    const subject = encodeURIComponent(`Job / Project Inquiry: ${briefType} — from ${briefName || 'Hiring Team'}`);
    const body = encodeURIComponent(
      `Hello Pranto,\n\nName: ${briefName}\nEmail: ${briefEmail}\nScope: ${briefType}\nTimeline: ${briefTimeline}\n\nProject / Role Details:\n${briefMsg}\n\nLooking forward to collaborating!`
    );
    window.open(`mailto:prantosarkar32@gmail.com?subject=${subject}&body=${body}`, '_blank');
  };

  const handleCopyBrief = () => {
    sound.playClick();
    const text = `Inquiry: ${briefType}\nFrom: ${briefName || 'N/A'} (${briefEmail || 'N/A'})\nTimeline: ${briefTimeline}\nDetails: ${briefMsg || 'N/A'}`;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text);
      setBriefCopied(true);
      setTimeout(() => setBriefCopied(false), 2500);
    }
  };

  const capabilities = [
    'VISUAL STORYTELLING',
    'GRAPHIC DESIGN',
    'VIDEO EDITING',
    'MOTION GRAPHICS',
    'AI VIDEO GENERATION',
    'BRAND VISUAL SYSTEMS',
    'COMMERCIAL VIDEO CREATION',
    'AI CONTENT CREATION',
    'KINETIC TYPOGRAPHY',
    'STORYBOARDING',
    'PROMPT ENGINEERING',
  ];

  // Case Studies (Curated high-end portfolio works)
  const projects = [
    {
      id: 1,
      num: '01',
      title: 'KINETIC SPECTRUM®',
      subtitle: 'Global Brand Identity & Kinetic Motion System',
      category: 'motion',
      categoryLabel: 'Motion Direction',
      year: '2026',
      client: 'Apex Creative / Global FinTech',
      role: 'Lead Motion Direction & Art Choreography',
      tools: ['After Effects', 'Illustrator', 'Cinema 4D'],
      metrics: '3.2M+ Impressions · Featured on Behance Motion',
      image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
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
      num: '02',
      title: 'SYNTHETIC REALMS™',
      subtitle: 'Neural Generative Worldbuilding & Latent Motion',
      category: 'ai',
      categoryLabel: 'AI Visual Production',
      year: '2025',
      client: 'HyperFuture AI & Studio X',
      role: 'Generative Director & AI Artist',
      tools: ['Midjourney v6', 'Runway Gen-3', 'ComfyUI', 'Photoshop'],
      metrics: '1.8M+ Organic Reach · 99.4% Client Approval',
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
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
      num: '03',
      title: 'LUMEN VELOCITY®',
      subtitle: 'Next-Gen Audio Hardware Commercial Launch',
      category: 'commercial',
      categoryLabel: 'Commercial Direction',
      year: '2025',
      client: 'Sonic Labs Inc.',
      role: 'Commercial Video Creator & Editor',
      tools: ['Premiere Pro', 'After Effects', 'DaVinci Resolve'],
      metrics: '2.4M+ Video Views · 4.8x Conversion Rate Lift',
      image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80',
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
      num: '04',
      title: 'CHRONO HYPERDRIVE',
      subtitle: 'Sci-Fi Broadcast Title Sequence & HUD Animations',
      category: 'motion',
      categoryLabel: 'Title Sequence / VFX',
      year: '2024',
      client: 'Nebula Stream Network',
      role: 'Title Sequence Animator & Compositor',
      tools: ['After Effects', 'Illustrator', 'Audition'],
      metrics: 'Official Title Sequence · 4K Master',
      image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80',
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
      num: '05',
      title: 'NEURAL METAMORPHOSIS',
      subtitle: 'Generative AI Short Film & Character Continuity',
      category: 'ai',
      categoryLabel: 'AI Film & Narrative',
      year: '2024',
      client: 'Metavision Experimental',
      role: 'AI Prompt Architect & Director',
      tools: ['ComfyUI', 'Runway Gen-3', 'Photoshop', 'After Effects'],
      metrics: 'Selected for Generative Cinema Showcase',
      image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=80',
      overview:
        'Solving one of AI art’s hardest problems: persistent character keyframe continuity and fluid kinetic camera motion across sequential scenes with zero hallucination artifacts.',
      deliverables: [
        'Consistent character face and anatomy LoRA models',
        'Kinetic camera pans and speed-ramped transitions',
        'Final composite and cinematic color grade',
      ],
    },
    {
      id: 6,
      num: '06',
      title: 'VELOCITY APPAREL',
      subtitle: 'Dynamic Paid Social Ads & Viral Retention Reels',
      category: 'commercial',
      categoryLabel: 'Paid Social Commercial',
      year: '2024',
      client: 'Velocity Global Wear',
      role: 'Commercial Video Editor & Motion Artist',
      tools: ['Premiere Pro', 'After Effects', 'Photoshop'],
      metrics: '5.6M+ Paid Impressions · 3.2x ROAS',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80',
      overview:
        'A series of dynamic short-form social advertisements built on rhythm-matched beat drops, seamless zoom-in transitions, and kinetic price-tag graphics.',
      deliverables: [
        'Set of 8 modular high-converting social video ads',
        'Dynamic text animations and motion graphics overlay',
        'Multi-aspect ratio deliverables (9:16, 1:1, 16:9)',
      ],
    },
  ];

  const workExperience = [
    {
      year: '2026',
      role: 'Senior Motion Designer & AI Artist',
      company: 'Apex Creative Lab & Global Studios',
      spec: 'Commercial / Brand / Generative Production',
      highlights: [
        'Orchestrating end-to-end motion systems and commercial broadcast assets for high-growth global brands.',
        'Engineered custom Generative AI video pipelines using ComfyUI and Runway Gen-3, cutting pre-viz turnaround by 45%.',
      ],
    },
    {
      year: '2024',
      role: 'Motion Designer & Video Editor',
      company: 'Kinetic Digital Media',
      spec: 'Advertising & Visual Communication',
      highlights: [
        'Designed high-retention commercial reels, 3D styleframes, and kinetic typography packs generating over 15M+ combined views.',
        'Collaborated with international creative directors across the US, UK, and Europe on multi-platform campaigns.',
      ],
    },
    {
      year: '2022',
      role: 'Visual Designer & Motion Specialist',
      company: 'Freelance & Boutique Agencies',
      spec: 'Brand Systems & Vector Animation',
      highlights: [
        'Delivered 30+ brand idents, vector animations, explainer sequences, and social media commercial packages.',
        'Specialized in After Effects keyframing, Illustrator vector assets, and Premiere Pro sound-synced editing.',
      ],
    },
  ];

  const servicesList = [
    { num: '01', title: 'Motion Graphics', desc: 'Kinetic typography, broadcast idents, title sequence choreography, and seamless easing.' },
    { num: '02', title: 'Commercial Direction', desc: 'High-converting video commercials, dynamic product launches, and multi-camera post-production.' },
    { num: '03', title: 'Video Editing', desc: 'Cinematic pacing, audio-reactive synchronization, speed ramps, and seamless transitions.' },
    { num: '04', title: 'Graphic Design', desc: 'Vector asset preparation, styleframing, storyboard creation, and visual brand architecture.' },
    { num: '05', title: 'AI Video Generation', desc: 'Multi-model neural video diffusion (Runway Gen-3, ComfyUI), latent motion choreography, and post-upscaling.' },
    { num: '06', title: 'AI Image Generation', desc: 'High-fidelity neural concept art, custom LoRA prompt architecture, and generative matte painting.' },
    { num: '07', title: 'Brand Visual Systems', desc: 'Living design guidelines, kinetic brand systems, modular social packages, and UI choreography.' },
    { num: '08', title: 'Creative Direction', desc: 'End-to-end campaign vision, visual storytelling, pitch deck styleframes, and executive creative oversight.' },
  ];

  const navLinks = [
    { id: 'about-me', label: 'about me' },
    { id: 'experience', label: 'experience' },
    { id: 'projects', label: 'projects' },
    { id: 'services', label: 'services' },
    { id: 'contact', label: 'contact' },
  ];

  return (
    <div className="relative min-h-screen w-full bg-[#990520] text-white selection:bg-white selection:text-[#b80828] font-body overflow-x-hidden">
      {/* Background Avatar Video (mouse-scrub controlled - face moves with cursor) */}
      <video
        ref={videoRef}
        src="/avatar.mp4"
        poster="/avatar.png"
        className={`fixed inset-0 z-0 w-full h-full object-cover pointer-events-none select-none transition-opacity duration-700 ${
          scrolled ? 'opacity-25' : 'opacity-100'
        }`}
        style={{ objectPosition: '70% center' }}
        muted
        playsInline
        preload="auto"
        onSeeked={handleSeeked}
        onLoadedMetadata={handleLoadedMetadata}
      >
        <source src="/avatar.mp4" type="video/mp4" />
        <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260826_041744_63efcd78-bf7d-4039-99e2-2461e8a61903.mp4" type="video/mp4" />
      </video>

      {/* ========================================================================= */}
      {/* SMOOTH HORIZONTAL GRADIENT: Dark Crimson on Left to Light Bright Red on Right */}
      {/* ========================================================================= */}
      <div
        className={`fixed inset-0 z-[1] pointer-events-none transition-opacity duration-700 ${
          scrolled ? 'opacity-30' : 'opacity-100'
        }`}
        style={{
          background:
            'linear-gradient(90deg, rgba(24, 1, 5, 0.94) 0%, rgba(38, 2, 8, 0.86) 22%, rgba(62, 3, 13, 0.68) 42%, rgba(96, 5, 20, 0.44) 56%, rgba(145, 8, 28, 0.18) 72%, rgba(190, 10, 36, 0.05) 86%, transparent 100%)',
        }}
      />


      {/* ========================================================================= */}
      {/* 03 — TOP NAVIGATION (Thin, Premium, Sticky on Scroll) */}
      {/* ========================================================================= */}
      <header
        className={`fixed top-0 inset-x-0 z-40 w-full px-5 sm:px-8 py-4 sm:py-5 flex justify-between items-center transition-all duration-300 ${
          scrolled
            ? 'bg-[#7a0418]/85 backdrop-blur-md border-b border-white/10 shadow-lg py-3 sm:py-3.5'
            : 'bg-transparent'
        }`}
      >
        <div />

        {/* CENTER ON SCROLL: Brand Title & Subtitle Badge */}
        <div
          onClick={() => {
            sound.playClick();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`absolute left-1/2 -translate-x-1/2 flex flex-col items-center justify-center text-center cursor-pointer select-none transition-all duration-300 max-w-[50vw] sm:max-w-none px-2 group ${
            scrolled
              ? 'opacity-100 translate-y-0 pointer-events-auto'
              : 'opacity-0 -translate-y-2 pointer-events-none'
          }`}
          title="Click to scroll to top"
        >
          <span className="font-display font-black text-xs sm:text-base md:text-[17px] tracking-wider uppercase text-white leading-tight drop-shadow-[0_1px_4px_rgba(0,0,0,0.4)] group-hover:text-white/85 transition-colors">
            PRANTO SARKAR
          </span>
          <span className="font-heading font-normal text-[9.5px] sm:text-[11px] md:text-[12px] tracking-widest text-white/80 lowercase leading-tight group-hover:text-white/95 transition-colors">
            motion designer &amp; ai artist
          </span>
        </div>

        {/* FAR RIGHT: Liquid Glass UI CV Download Capsule + Mobile Hamburger */}
        <div className="flex items-center gap-3">
          <a
            href="/Pranto_Sarkar_CV.pdf"
            download="Pranto_Sarkar_CV.pdf"
            onMouseEnter={() => sound.playHover()}
            onClick={() => sound.playClick()}
            className="liquid-glass-capsule inline-flex items-center gap-2.5 px-4 sm:px-5 py-1.5 sm:py-2 rounded-full text-white font-heading font-bold text-xs sm:text-sm tracking-wider cursor-pointer select-none group"
            title="Touch or click to download CV"
          >
            {/* Liquid Glass Icon Token with Inner Shimmer */}
            <div className="relative w-6 h-6 rounded-full bg-white/25 border border-white/50 shadow-[inset_0_1px_2px_rgba(255,255,255,0.7)] flex items-center justify-center overflow-hidden transition-transform duration-300 group-hover:scale-110">
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-white/60 pointer-events-none" />
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="relative z-10 transition-transform duration-300 group-hover:translate-y-0.5 text-white"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
            </div>
            <span className="font-display font-extrabold tracking-wider text-xs sm:text-sm text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.4)]">
              CV
            </span>
          </a>

          {/* Mobile Hamburger */}
          <button
            type="button"
            aria-label="Toggle navigation menu"
            onClick={() => {
              sound.playClick();
              setIsMenuOpen((prev) => !prev);
            }}
            className="flex flex-col justify-center items-center gap-[5px] md:hidden z-50 cursor-pointer p-1"
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
        </div>
      </header>

      {/* Mobile Fullscreen Navigation Overlay */}
      <div
        className={`fixed inset-0 bg-[#6b0213]/95 backdrop-blur-xl z-30 flex flex-col justify-center px-8 gap-5 transition-opacity duration-300 md:hidden ${
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
              if (item.id === 'projects') {
                document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
              } else if (item.id === 'about-me') {
                document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
              } else {
                openModal(item.id);
              }
            }}
            className="text-left text-[28px] font-heading font-bold text-white hover:opacity-70 transition-opacity tracking-tight"
          >
            {item.label}
          </button>
        ))}

        <div className="pt-4 flex flex-col gap-4 border-t border-white/15">
          <a
            href="/Pranto_Sarkar_CV.pdf"
            download="Pranto_Sarkar_CV.pdf"
            onClick={() => setIsMenuOpen(false)}
            className="inline-flex items-center gap-3 text-[22px] font-heading font-medium text-white underline underline-offset-4 hover:opacity-70 transition-opacity tracking-tight"
          >
            <span>download cv (pdf)</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          </a>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 02 — HERO SECTION (Full-Screen 100vh with Master Reference Composition) */}
      {/* ========================================================================= */}
      <section className="relative w-full min-h-screen flex flex-col justify-between pt-24 sm:pt-28 pb-6 px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 overflow-hidden select-none">
        {/* Ambient Subtle Radial Glow in Red Canvas */}
        <div className="absolute top-1/4 right-10 w-[550px] h-[550px] rounded-full bg-[#ff1a40]/20 blur-[130px] pointer-events-none" />

        {/* HERO MAIN CONTENT GRID (Expanded Widescreen Layout Shifted Further to Side) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center my-auto relative z-10 w-full max-w-[1760px] mx-auto">
          {/* LEFT SIDE: Typography & Editorial Intro (Anchored Further to the Left Edge) */}
          <div className="lg:col-span-8 flex flex-col items-start text-left z-20 max-w-3xl">
            {/* Intro Greeting */}
            <p className="text-[clamp(22px,3.4vw,38px)] font-display font-bold tracking-wider text-white/95 uppercase mb-2.5 sm:mb-3">
              HEY THERE, I’M
            </p>

            {/* Main Name Heading (Monumental Scale & Ultra-Tight Leading, Truly Eye-Catching) */}
            <h1 className="text-[clamp(74px,14vw,172px)] leading-[0.82] font-display font-black uppercase tracking-[-0.045em] text-white drop-shadow-[0_8px_40px_rgba(0,0,0,0.6)] mb-5 sm:mb-7">
              PRANTO<br />
              SARKAR.
            </h1>

            {/* Secondary Title (Matching lowercase & proportional scale) */}
            <h2 className="text-[clamp(22px,3.4vw,36px)] font-heading font-medium tracking-wide text-white/90 mb-6 sm:mb-8 lowercase">
              motion designer &amp; ai artist
            </h2>

            {/* Editorial Body Copy (Clean proportional readability) */}
            <p className="text-white/85 text-[clamp(15px,1.8vw,19px)] leading-[1.65] font-light tracking-normal max-w-[580px] min-h-[50px]">
              {displayed}
              {!done && (
                <span className="inline-block w-[2px] h-[1.1em] bg-white align-middle ml-[2px] animate-pulse" />
              )}
            </p>
          </div>

          {/* RIGHT SIDE: Interactive 3D Avatar Stage (Video Avatar with Mouse Face Movement) */}
          <div className="lg:col-span-4 relative flex items-center justify-center lg:justify-end z-10 min-h-[360px] sm:min-h-[460px] lg:min-h-[580px] pointer-events-none">
            {/* The transparent frame preserves the exact desktop layout & composition */}
            <div
              className="relative w-[320px] sm:w-[420px] lg:w-[480px] max-w-full aspect-[404/597] pointer-events-none transition-transform duration-300"
              style={{
                transform: `translate3d(${avatarOffset.x}px, ${avatarOffset.y}px, 0)`,
              }}
            />
          </div>
        </div>

        {/* 12 — SOFTWARE / ARSENAL BAR (Floating Pill on Left Side in One Single Horizontal Line) */}
        <aside
          className="glass-panel-red absolute bottom-14 sm:bottom-16 left-4 sm:left-6 md:left-8 lg:left-10 xl:left-12 z-20 flex items-center gap-2.5 sm:gap-3 p-2 sm:px-4 sm:py-2.5 rounded-full select-none pointer-events-auto whitespace-nowrap flex-nowrap max-w-[95vw] overflow-x-auto shadow-2xl transition-transform duration-300 hover:scale-[1.02]"
        >
          <div className="flex items-center gap-1.5 text-[11px] font-mono-tech uppercase tracking-wider text-white/70 pl-1 pr-0.5 whitespace-nowrap shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_#ffffff] animate-pulse" />
            <span className="font-bold text-white">TOOLKIT:</span>
          </div>

          <div className="h-4 w-[1px] bg-white/25 shrink-0" />

          <div className="flex items-center gap-1.5 sm:gap-2 flex-nowrap shrink-0">
            {creativeTools.map((tool) => (
              <div
                key={tool.name}
                onClick={() => {
                  sound.playClick();
                  setInspectedTool(inspectedTool === tool.name ? null : tool.name);
                }}
                onMouseEnter={() => sound.playHover()}
                className="inline-flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 transition-all cursor-pointer group select-none shrink-0"
                title={`Click to inspect ${tool.name} capabilities`}
              >
                <div
                  className="w-5 h-5 rounded-[4px] flex items-center justify-center text-[10px] font-black border transition-transform group-hover:scale-110 shrink-0 font-display"
                  style={{
                    backgroundColor: tool.bg,
                    color: tool.color,
                    borderColor: tool.border,
                    boxShadow: `0 0 10px ${tool.glow}`,
                  }}
                >
                  {tool.short}
                </div>
                <span className="text-xs text-white/95 font-medium tracking-wide whitespace-nowrap group-hover:text-white">
                  {tool.name}
                </span>
              </div>
            ))}
          </div>
        </aside>

        {/* Arsenal Capability Popover */}
        {inspectedTool && (
          <div className="fixed bottom-28 left-4 sm:left-6 md:left-8 lg:left-10 xl:left-12 z-30 max-w-sm glass-panel-red rounded-2xl p-4 border border-white/25 shadow-2xl animate-fadeIn text-left">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-display font-bold text-white uppercase tracking-wider">
                  {inspectedTool}
                </span>
                <span className="text-[10px] font-mono-tech text-white bg-white/15 px-2 py-0.5 rounded-full border border-white/20">
                  {creativeTools.find((t) => t.name === inspectedTool)?.experience}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setInspectedTool(null)}
                className="text-white/70 hover:text-white text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>
            <p className="text-xs font-light text-white/90 leading-relaxed">
              {creativeTools.find((t) => t.name === inspectedTool)?.description}
            </p>
          </div>
        )}

        {/* 13 — SKILLS TICKER (Continuous Slow Marquee at Bottom of Hero) */}
        <div
          onClick={() => openModal('services')}
          className="absolute bottom-2 inset-x-0 overflow-hidden py-2 cursor-pointer select-none group pointer-events-auto"
          title="Click to view all capabilities & services"
        >
          <div className="flex whitespace-nowrap animate-marquee opacity-60 hover:opacity-100 transition-opacity duration-300">
            {[...capabilities, ...capabilities].map((cap, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-3 text-[11px] font-mono-tech tracking-[0.22em] uppercase text-white/90 mx-5 font-light"
              >
                <span>{cap}</span>
                <span className="text-white/40 text-[9px]">✦</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 07 & 08 — SELECTED WORK / PROJECTS (Horizontal Project Scrub Reel) */}
      {/* ========================================================================= */}
      <section id="projects" className="relative py-24 sm:py-32 px-5 sm:px-8 md:px-12 border-t border-white/15 bg-gradient-to-b from-[#8f041d] to-[#690214]">
        <div className="max-w-7xl mx-auto mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[10px] font-mono-tech uppercase tracking-widest text-white/80 mb-3">
              <span>01 / FEATURED PORTFOLIO WORKS</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-display font-extrabold uppercase tracking-tight text-white">
              Selected Projects
            </h2>
            <p className="text-white/70 text-xs sm:text-sm font-light mt-1 max-w-xl">
              Cinematic brand systems, neural AI generative worldbuilding, and high-velocity commercial video direction.
            </p>
          </div>

          {/* Interactive Scrub Instruction Hint */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-[11px] font-mono-tech tracking-wider text-white/80">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
            <span>drag cursor left / right to scrub reel</span>
          </div>
        </div>

        {/* Horizontal Project Scrub Track */}
        <div
          ref={reelTrackRef}
          onMouseDown={handleReelMouseDown}
          onMouseMove={handleReelMouseMove}
          onMouseUp={handleReelMouseUp}
          onMouseLeave={handleReelMouseUp}
          onWheel={handleReelWheel}
          className="flex gap-6 overflow-x-auto no-scrollbar py-4 cursor-grab active:cursor-grabbing select-none scroll-smooth"
        >
          {projects.map((p) => (
            <div
              key={p.id}
              onClick={() => {
                sound.playClick();
                setSelectedProject(p.id);
                openModal('project-detail');
              }}
              className="flex-shrink-0 w-[300px] sm:w-[380px] lg:w-[440px] rounded-3xl p-5 glass-panel-red border border-white/20 group hover:border-white/50 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Project Image Thumbnail */}
                <div className="w-full aspect-video rounded-2xl overflow-hidden mb-4 bg-black/40 border border-white/15 relative">
                  <img
                    src={p.image}
                    alt={p.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[10px] font-mono-tech text-white/90 border border-white/20">
                    {p.num} · {p.year}
                  </div>
                  <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[10px] font-mono-tech text-white/90 border border-white/20">
                    {p.categoryLabel}
                  </div>
                </div>

                <h3 className="text-xl font-heading font-bold text-white group-hover:text-amber-200 transition-colors">
                  {p.title}
                </h3>
                <p className="text-xs text-white/70 font-light mt-1 line-clamp-2">
                  {p.subtitle}
                </p>
              </div>

              <div className="pt-4 border-t border-white/15 flex items-center justify-between text-[11px] font-mono-tech text-white/60">
                <span>{p.client}</span>
                <span className="text-white font-medium group-hover:translate-x-1 transition-transform">
                  View Case Study →
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 09 — ABOUT ME SECTION (Bold Editorial Layout) */}
      {/* ========================================================================= */}
      <section id="about" className="relative py-24 sm:py-32 px-5 sm:px-8 md:px-12 border-t border-white/15 bg-gradient-to-b from-[#690214] to-[#7d0319]">
        <div className="max-w-7xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[10px] font-mono-tech uppercase tracking-widest text-white/80 mb-6">
            <span>02 / CREATIVE PHILOSOPHY</span>
          </div>

          {/* Large Editorial Headline */}
          <h2 className="text-[clamp(28px,4.8vw,56px)] font-display font-extrabold uppercase tracking-tight text-white leading-[1.12] mb-12 max-w-4xl">
            “I CREATE MOTION THAT MAKES BRANDS IMPOSSIBLE TO IGNORE.”
          </h2>

          {/* Two-Column Supporting Content */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 text-white/85 text-sm sm:text-base font-light leading-relaxed">
            <div className="md:col-span-7 space-y-4">
              <p>
                Based in Dhaka and collaborating worldwide, I am a <strong>Senior Motion Designer &amp; Generative AI Artist</strong> with over 4+ years of dedicated craft. I bridge classic keyframe animation principles with neural diffusion pipelines, creating living visual systems for broadcast, social platforms, and digital products.
              </p>
              <p className="text-white/70">
                Every project begins with rhythm, storyboarding, and styleframe clarity. Whether choreographing dynamic speed ramps for product launch campaigns or fine-tuning multi-model AI video continuity, my focus remains firmly on brand impact and viewer retention.
              </p>
            </div>

            <div className="md:col-span-5 flex flex-col justify-between p-6 rounded-3xl glass-panel-red border border-white/20">
              <div>
                <div className="text-xs font-mono-tech uppercase tracking-widest text-white/60 mb-3">
                  Core Specializations:
                </div>
                <div className="flex flex-wrap gap-2">
                  {[
                    'Motion Design',
                    'Commercial Visual Direction',
                    'AI Artistry',
                    'Generative Video',
                    'Graphic Design',
                    'Video Editing',
                    'Brand Visual Systems',
                  ].map((s) => (
                    <span key={s} className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-mono-tech text-white">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-white/15 mt-6 flex justify-between items-center text-xs font-mono-tech text-white/70">
                <span>Location: Dhaka, Bangladesh (UTC+6)</span>
                <span className="text-emerald-300">● Remote Ready</span>
              </div>
            </div>
          </div>

          {/* 4 Key Metrics Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-12 text-center">
            <div className="p-4 rounded-2xl glass-panel-red border border-white/20">
              <div className="text-3xl font-display font-black text-white">4+</div>
              <div className="text-[10px] font-mono-tech text-white/60 uppercase tracking-widest mt-1">Years Craft</div>
            </div>
            <div className="p-4 rounded-2xl glass-panel-red border border-white/20">
              <div className="text-3xl font-display font-black text-white">50+</div>
              <div className="text-[10px] font-mono-tech text-white/60 uppercase tracking-widest mt-1">Completed Works</div>
            </div>
            <div className="p-4 rounded-2xl glass-panel-red border border-white/20">
              <div className="text-3xl font-display font-black text-white">15M+</div>
              <div className="text-[10px] font-mono-tech text-white/60 uppercase tracking-widest mt-1">Campaign Reach</div>
            </div>
            <div className="p-4 rounded-2xl glass-panel-red border border-white/20">
              <div className="text-3xl font-display font-black text-emerald-300">100%</div>
              <div className="text-[10px] font-mono-tech text-white/60 uppercase tracking-widest mt-1">On-Time Delivery</div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 10 — EXPERIENCE SECTION (Premium Timeline with Large Typography) */}
      {/* ========================================================================= */}
      <section id="experience" className="relative py-24 sm:py-32 px-5 sm:px-8 md:px-12 border-t border-white/15 bg-gradient-to-b from-[#7d0319] to-[#8c041d]">
        <div className="max-w-7xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[10px] font-mono-tech uppercase tracking-widest text-white/80 mb-6">
            <span>03 / CAREER TIMELINE</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-display font-extrabold uppercase tracking-tight text-white mb-12">
            Work Experience
          </h2>

          <div className="space-y-6">
            {workExperience.map((exp) => (
              <div
                key={exp.year}
                className="p-6 sm:p-8 rounded-3xl glass-panel-red border border-white/20 hover:border-white/50 transition-all duration-300 space-y-3 group"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/15 pb-4">
                  <div className="flex items-center gap-4">
                    <span className="text-3xl sm:text-4xl font-display font-black text-white group-hover:text-amber-200 transition-colors">
                      {exp.year}
                    </span>
                    <div>
                      <h3 className="text-lg sm:text-xl font-heading font-bold text-white">
                        {exp.role}
                      </h3>
                      <div className="text-xs font-mono-tech text-white/70">
                        {exp.company}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs font-mono-tech text-white/60 bg-white/10 px-3 py-1 rounded-full self-start sm:self-auto">
                    {exp.spec}
                  </div>
                </div>

                <ul className="space-y-1.5 text-xs sm:text-sm text-white/80 font-light pt-2">
                  {exp.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-white/60 mt-0.5">▸</span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Endorsement Quote */}
          <div className="p-6 rounded-3xl glass-panel-red border border-white/20 mt-8">
            <div className="text-[10px] font-mono-tech uppercase text-amber-300 mb-2">
              ★ CREATIVE DIRECTOR ENDORSEMENT:
            </div>
            <blockquote className="text-xs sm:text-sm italic text-white/90 font-light">
              "Pranto combines razor-sharp kinetic pacing with an extraordinary grasp of generative AI workflows. He repeatedly delivered commercial cuts ahead of schedule with immaculate attention to detail."
            </blockquote>
            <div className="text-[10px] font-mono-tech text-white/50 mt-2">
              — Senior Creative Producer, Global Digital Agency
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 11 — CAPABILITIES / SERVICES (Large Horizontal Service Rows) */}
      {/* ========================================================================= */}
      <section id="services" className="relative py-24 sm:py-32 px-5 sm:px-8 md:px-12 border-t border-white/15 bg-gradient-to-b from-[#8c041d] to-[#600112]">
        <div className="max-w-7xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[10px] font-mono-tech uppercase tracking-widest text-white/80 mb-6">
            <span>04 / CAPABILITIES &amp; DIRECTION</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-display font-extrabold uppercase tracking-tight text-white mb-12">
            Creative Services
          </h2>

          <div className="border-t border-white/20">
            {servicesList.map((s) => (
              <div
                key={s.num}
                className="py-5 sm:py-6 border-b border-white/15 flex flex-col md:flex-row md:items-center justify-between gap-4 group cursor-pointer hover:bg-white/[0.04] px-4 -mx-4 transition-all duration-300 rounded-xl"
                onClick={() => openModal('contact')}
              >
                <div className="flex items-baseline gap-4 sm:gap-6">
                  <span className="text-xs sm:text-sm font-mono-tech text-white/40 group-hover:text-white transition-colors group-hover:translate-x-1 transform duration-300">
                    {s.num}
                  </span>
                  <h3 className="text-xl sm:text-3xl font-heading font-bold text-white group-hover:translate-x-2 transition-transform duration-300">
                    {s.title}
                  </h3>
                </div>

                <div className="flex items-center gap-6 md:max-w-md">
                  <p className="text-xs sm:text-sm text-white/70 font-light group-hover:text-white/95 transition-colors">
                    {s.desc}
                  </p>
                  <span className="text-white/40 group-hover:text-white group-hover:translate-x-1 transition-all text-sm hidden sm:inline">
                    →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 16 — CONTACT SECTION (Grand Final Ending) */}
      {/* ========================================================================= */}
      <footer id="contact" className="relative py-24 sm:py-32 px-5 sm:px-8 md:px-12 border-t border-white/20 bg-[#50020d] select-none">
        <div className="max-w-7xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[10px] font-mono-tech uppercase tracking-widest text-white/80 mb-6">
            <span>05 / COLLABORATION</span>
          </div>

          <h2 className="text-[clamp(32px,6vw,72px)] font-display font-extrabold uppercase tracking-tight text-white leading-[1.05] mb-6 max-w-4xl">
            “LET’S BUILD SOMETHING PEOPLE REMEMBER.”
          </h2>

          <p className="text-white/80 text-sm sm:text-lg font-light max-w-2xl mb-10 leading-relaxed">
            Available for selected motion design, commercial direction, AI visual production, and brand identity projects worldwide.
          </p>

          <div className="flex flex-wrap items-center gap-4 mb-16">
            <button
              type="button"
              onClick={() => openModal('contact')}
              className="px-8 py-4 rounded-full bg-white text-[#990520] font-heading font-bold text-sm uppercase tracking-wide hover:bg-black hover:text-white transition-all shadow-xl hover:scale-105 active:scale-95 cursor-pointer"
            >
              HIRE PRANTO
            </button>

            <button
              type="button"
              onClick={handleCopyEmail}
              className="px-6 py-4 rounded-full bg-white/10 hover:bg-white/20 border border-white/30 text-white font-mono-tech text-xs sm:text-sm tracking-wider transition-all cursor-pointer"
            >
              {copied ? '✓ prantosarkar32@gmail.com copied' : 'prantosarkar32@gmail.com'}
            </button>
          </div>

          {/* Social Networks & Footer Meta */}
          <div className="pt-8 border-t border-white/15 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono-tech text-white/60">
            <div>
              PRANTO SARKAR® · ALL RIGHTS RESERVED © {new Date().getFullYear()}
            </div>

            <div className="flex items-center gap-5">
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                LinkedIn
              </a>
              <span>•</span>
              <a href="https://behance.net" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                Behance
              </a>
              <span>•</span>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                Instagram
              </a>
              <span>•</span>
              <a href="https://vimeo.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                Vimeo
              </a>
            </div>

            <div className="text-white/40">
              DHAKA TIME: {dhakaTime || 'UTC+6'}
            </div>
          </div>
        </div>
      </footer>

      {/* ========================================================================= */}
      {/* 15 — SHOWREEL CINEMA LIGHTBOX */}
      {/* ========================================================================= */}
      {activeModal === 'reel' && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#3d010a]/90 backdrop-blur-2xl animate-fadeIn"
          onClick={closeModal}
        >
          <div
            className="glass-panel-red w-full max-w-4xl rounded-3xl p-6 sm:p-8 relative border border-white/25 shadow-2xl text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={closeModal}
              className="sticky top-0 float-right w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white transition-colors cursor-pointer z-10"
            >
              ✕
            </button>

            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 border border-white/25 text-[10px] font-mono-tech uppercase tracking-widest text-white">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                  <span>Official Motion Showreel</span>
                </span>
                <span className="text-[10px] font-mono-tech text-white/60 border border-white/15 px-2.5 py-0.5 rounded-full">
                  4K Master · 60 FPS
                </span>
                <span className="text-[10px] font-mono-tech text-white/60 border border-white/15 px-2.5 py-0.5 rounded-full">
                  ProRes 422HQ
                </span>
              </div>

              <h3 className="text-2xl sm:text-4xl font-display font-extrabold uppercase tracking-tight text-white">
                Kinetic Showreel &amp; Visual Symphony
              </h3>

              <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-white/20 bg-black/80 shadow-2xl">
                <video
                  ref={reelVideoRef}
                  src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260826_041744_63efcd78-bf7d-4039-99e2-2461e8a61903.mp4"
                  className="w-full h-full object-cover"
                  autoPlay
                  loop
                  muted={reelMuted}
                  playsInline
                />

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
                      className="px-3 py-1.5 rounded-full bg-white text-[#990520] font-semibold hover:bg-white/90 transition-colors cursor-pointer"
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
                      className="px-3 py-1.5 rounded-full bg-white/15 border border-white/25 text-white hover:bg-white/25 transition-colors cursor-pointer"
                    >
                      {reelMuted ? 'Unmute 🔇' : 'Mute 🔊'}
                    </button>
                  </div>

                  <div className="text-white/60 text-[11px] hidden sm:block">
                    4K ProRes Master Cut
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      reelVideoRef.current?.requestFullscreen?.();
                    }}
                    className="px-2.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-white hover:text-white transition-colors cursor-pointer"
                  >
                    ⛶ Fullscreen
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 14 — PROJECT DETAIL INTERACTION MODAL */}
      {/* ========================================================================= */}
      {activeModal === 'project-detail' && selectedProject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#3d010a]/90 backdrop-blur-2xl animate-fadeIn"
          onClick={closeModal}
        >
          <div
            className="glass-panel-red w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-3xl p-6 sm:p-8 relative border border-white/25 shadow-2xl text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={closeModal}
              className="sticky top-0 float-right w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white transition-colors cursor-pointer z-10"
            >
              ✕
            </button>

            {(() => {
              const p = projects.find((item) => item.id === selectedProject);
              if (!p) return null;
              return (
                <div className="space-y-5">
                  <div className="w-full aspect-video rounded-2xl overflow-hidden bg-black/60 border border-white/15">
                    <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                  </div>

                  <div>
                    <span className="text-[10px] font-mono-tech text-white/60 uppercase tracking-widest">
                      {p.num} · {p.categoryLabel} · {p.year}
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-display font-bold uppercase text-white mt-1">
                      {p.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-white/70 font-light mt-0.5">{p.subtitle}</p>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <div className="font-mono-tech text-white/50 mb-1">CLIENT &amp; ROLE:</div>
                      <p className="text-white/90">{p.client}</p>
                      <p className="text-white/70 mt-0.5">{p.role}</p>
                    </div>

                    <div>
                      <div className="font-mono-tech text-white/50 mb-1">TOOLS USED:</div>
                      <div className="flex flex-wrap gap-1.5">
                        {p.tools.map((t) => (
                          <span key={t} className="px-2.5 py-0.5 rounded-full bg-white/10 border border-white/15 text-[11px] font-mono-tech text-white">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="font-mono-tech text-white/50 mb-1 text-xs">PROJECT OBJECTIVE &amp; APPROACH:</div>
                    <p className="text-xs sm:text-sm text-white/80 font-light leading-relaxed">{p.overview}</p>
                  </div>

                  <div>
                    <div className="font-mono-tech text-white/50 mb-1 text-xs">KEY DELIVERABLES:</div>
                    <ul className="space-y-1 text-xs text-white/75 font-light">
                      {p.deliverables.map((d) => (
                        <li key={d} className="flex items-center gap-1.5">
                          <span className="text-white">✓</span>
                          <span>{d}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-3 border-t border-white/15 flex flex-wrap justify-between items-center gap-3 text-xs font-mono-tech">
                    <span className="text-amber-200">★ Impact: {p.metrics}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setBriefType(p.categoryLabel);
                        openModal('contact');
                      }}
                      className="px-4 py-2 rounded-full bg-white text-[#990520] font-semibold hover:bg-white/90 transition-colors cursor-pointer font-heading"
                    >
                      Inquire for Similar Project →
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* OTHER INTERACTIVE MODALS (Experience / Services / Contact) */}
      {/* ========================================================================= */}
      {activeModal === 'experience' && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#3d010a]/90 backdrop-blur-2xl animate-fadeIn"
          onClick={closeModal}
        >
          <div
            className="glass-panel-red w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-3xl p-6 sm:p-8 relative border border-white/25 shadow-2xl text-left space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={closeModal}
              className="sticky top-0 float-right w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white transition-colors cursor-pointer z-10"
            >
              ✕
            </button>

            <div className="space-y-1">
              <span className="text-[10px] font-mono-tech uppercase tracking-widest text-emerald-300">
                ● Available for Full-Time &amp; Contracts
              </span>
              <h3 className="text-2xl sm:text-4xl font-display font-extrabold uppercase text-white">
                Career Track Record
              </h3>
            </div>

            <div className="space-y-4">
              {workExperience.map((exp) => (
                <div key={exp.year} className="p-4 rounded-2xl bg-white/5 border border-white/15 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-heading font-bold text-base text-white">{exp.role}</h4>
                      <p className="text-xs font-mono-tech text-white/70">{exp.company} · {exp.spec}</p>
                    </div>
                    <span className="text-xs font-mono-tech bg-white/10 px-2 py-0.5 rounded-full text-white">{exp.year}</span>
                  </div>
                  <ul className="text-xs text-white/80 space-y-1 font-light">
                    {exp.highlights.map((h, i) => (
                      <li key={i}>▸ {h}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-between items-center border-t border-white/15">
              <a
                href="/Pranto_Sarkar_CV.pdf"
                download="Pranto_Sarkar_CV.pdf"
                className="px-5 py-2.5 rounded-full bg-white text-[#990520] text-xs font-bold font-heading hover:bg-white/90 transition-colors"
              >
                Download Resume (PDF)
              </a>
              <button
                type="button"
                onClick={() => openModal('contact')}
                className="text-xs font-mono-tech text-white underline hover:opacity-80"
              >
                Schedule Interview →
              </button>
            </div>
          </div>
        </div>
      )}

      {activeModal === 'services' && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#3d010a]/90 backdrop-blur-2xl animate-fadeIn"
          onClick={closeModal}
        >
          <div
            className="glass-panel-red w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-3xl p-6 sm:p-8 relative border border-white/25 shadow-2xl text-left space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={closeModal}
              className="sticky top-0 float-right w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white transition-colors cursor-pointer z-10"
            >
              ✕
            </button>

            <div className="space-y-1">
              <span className="text-[10px] font-mono-tech uppercase tracking-widest text-white/60">
                Full-Spectrum Creative Direction
              </span>
              <h3 className="text-2xl sm:text-4xl font-display font-extrabold uppercase text-white">
                Capabilities &amp; Workflow
              </h3>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              {servicesList.map((s) => (
                <div key={s.num} className="p-3.5 rounded-2xl bg-white/5 border border-white/15">
                  <div className="flex items-center gap-2 font-heading font-semibold text-sm text-white mb-1">
                    <span className="text-xs font-mono-tech text-white/50">{s.num}</span>
                    <span>{s.title}</span>
                  </div>
                  <p className="text-xs text-white/70 font-light leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeModal === 'contact' && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#3d010a]/90 backdrop-blur-2xl animate-fadeIn"
          onClick={closeModal}
        >
          <div
            className="glass-panel-red w-full max-w-xl max-h-[85vh] overflow-y-auto rounded-3xl p-6 sm:p-8 relative border border-white/25 shadow-2xl text-left space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={closeModal}
              className="sticky top-0 float-right w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white transition-colors cursor-pointer z-10"
            >
              ✕
            </button>

            <div className="space-y-1">
              <span className="text-[10px] font-mono-tech uppercase tracking-widest text-emerald-300">
                ● Direct Inquiry &amp; Collaboration
              </span>
              <h3 className="text-2xl sm:text-3xl font-display font-extrabold uppercase text-white">
                Let's Work Together
              </h3>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/10 border border-white/20 flex justify-between items-center">
              <div>
                <div className="text-[10px] font-mono-tech uppercase text-white/60">Email:</div>
                <div className="font-mono-tech text-xs sm:text-sm text-white select-all">prantosarkar32@gmail.com</div>
              </div>
              <button
                type="button"
                onClick={handleCopyEmail}
                className="px-3.5 py-1.5 rounded-full bg-white text-[#990520] font-semibold text-xs hover:bg-white/90"
              >
                {copied ? '✓ Copied' : 'Copy'}
              </button>
            </div>

            <form onSubmit={handleSendBrief} className="space-y-3 text-xs">
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono-tech text-white/70 mb-1">Your Name</label>
                  <input
                    type="text"
                    value={briefName}
                    onChange={(e) => setBriefName(e.target.value)}
                    placeholder="e.g. Alex"
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/20 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-mono-tech text-white/70 mb-1">Work Email</label>
                  <input
                    type="email"
                    value={briefEmail}
                    onChange={(e) => setBriefEmail(e.target.value)}
                    placeholder="e.g. alex@studio.com"
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/20 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono-tech text-white/70 mb-1">Inquiry Scope</label>
                <select
                  value={briefType}
                  onChange={(e) => setBriefType(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#5c0110] border border-white/20 text-white focus:outline-none"
                >
                  <option value="Senior Motion Designer (Full-Time / Contract)">Senior Motion Designer (Full-Time / Contract)</option>
                  <option value="Commercial Video Direction">Commercial Video Direction</option>
                  <option value="AI Visual Production & Worldbuilding">AI Visual Production &amp; Worldbuilding</option>
                  <option value="Brand Identity Motion System">Brand Identity Motion System</option>
                </select>
              </div>

              <div>
                <label className="block font-mono-tech text-white/70 mb-1">Estimated Timeline</label>
                <select
                  value={briefTimeline}
                  onChange={(e) => setBriefTimeline(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#5c0110] border border-white/20 text-white focus:outline-none"
                >
                  <option value="Immediate (Next 1-2 Weeks)">Immediate (Next 1-2 Weeks)</option>
                  <option value="This Month">This Month</option>
                  <option value="Next Quarter">Next Quarter</option>
                  <option value="Open Discussions">Open Discussions</option>
                </select>
              </div>

              <div>
                <label className="block font-mono-tech text-white/70 mb-1">Message / Brief</label>
                <textarea
                  rows={3}
                  value={briefMsg}
                  onChange={(e) => setBriefMsg(e.target.value)}
                  placeholder="Share details or interview inquiries..."
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/20 text-white focus:outline-none resize-none"
                />
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-full bg-white text-[#990520] font-heading font-bold text-xs uppercase hover:bg-white/90"
                >
                  Send Inquiry via Email →
                </button>
                <button
                  type="button"
                  onClick={handleCopyBrief}
                  className="px-3.5 py-2 rounded-full bg-white/10 border border-white/20 text-white text-xs font-mono-tech"
                >
                  {briefCopied ? '✓ Copied' : 'Copy Brief'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
