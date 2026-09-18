import React, { useEffect, useRef } from 'react';

interface LiveWallpaperProps {
  scrolled?: boolean;
}

export const LiveWallpaper: React.FC<LiveWallpaperProps> = ({ scrolled = false }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000, targetX: -1000, targetY: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = e.clientX;
      mouseRef.current.targetY = e.clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouseRef.current.targetX = e.touches[0].clientX;
        mouseRef.current.targetY = e.touches[0].clientY;
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    // Cinematic particle setup
    const isMobile = window.innerWidth < 768;
    const PARTICLE_COUNT = isMobile ? 32 : 55;

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      baseAlpha: number;
      color: string;
      pulseOffset: number;
      pulseSpeed: number;
    }

    const palette = [
      '255, 125, 150', // warm ruby pink
      '255, 55, 85',   // bright carmine
      '255, 195, 150', // warm golden ember dust
      '230, 15, 55',   // deep crimson
    ];

    const particles: Particle[] = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const baseAlpha = Math.random() * 0.42 + 0.16;
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: -Math.random() * 0.45 - 0.15, // gentle upward drift
        size: Math.random() * 2.8 + 1.2,
        baseAlpha,
        color: palette[Math.floor(Math.random() * palette.length)],
        pulseOffset: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.02 + 0.01,
      });
    }

    let time = 0;

    const render = () => {
      time += 0.016;

      // Smooth mouse tracking interpolation
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.06;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.06;

      ctx.clearRect(0, 0, width, height);

      // 1. Dynamic Breathing Ambient Glow (Cinematic Studio Lighting behind avatar)
      const breath = Math.sin(time * 0.7) * 0.06;
      const glowX = mouseRef.current.x > 0
        ? width * 0.7 + (mouseRef.current.x - width * 0.5) * 0.18
        : width * 0.72 + Math.cos(time * 0.4) * 35;
      const glowY = mouseRef.current.y > 0
        ? height * 0.38 + (mouseRef.current.y - height * 0.5) * 0.18
        : height * 0.35 + Math.sin(time * 0.5) * 30;

      const glowRadius = Math.max(width, height) * (0.45 + breath);
      const radGrad = ctx.createRadialGradient(glowX, glowY, 0, glowX, glowY, glowRadius);
      radGrad.addColorStop(0, 'rgba(255, 30, 75, 0.18)');
      radGrad.addColorStop(0.35, 'rgba(220, 10, 50, 0.10)');
      radGrad.addColorStop(0.7, 'rgba(153, 5, 32, 0.04)');
      radGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = radGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Secondary soft atmosphere in bottom left
      const orb2X = width * 0.2 + Math.sin(time * 0.3) * 50;
      const orb2Y = height * 0.8 + Math.cos(time * 0.35) * 45;
      const orb2Radius = Math.max(width, height) * 0.35;
      const orb2Grad = ctx.createRadialGradient(orb2X, orb2Y, 0, orb2X, orb2Y, orb2Radius);
      orb2Grad.addColorStop(0, 'rgba(230, 20, 60, 0.11)');
      orb2Grad.addColorStop(0.6, 'rgba(120, 4, 25, 0.04)');
      orb2Grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = orb2Grad;
      ctx.fillRect(0, 0, width, height);

      // 3. Render Floating Cinematic Embers / Dust
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Wave turbulence & natural drift
        p.x += p.vx + Math.sin(time * 1.2 + p.pulseOffset) * 0.32;
        p.y += p.vy;

        // Wrap around boundaries
        if (p.y < -15) {
          p.y = height + 15;
          p.x = Math.random() * width;
        }
        if (p.x < -15) p.x = width + 15;
        if (p.x > width + 15) p.x = -15;

        // Mouse interaction (soft repelling drift)
        if (mx > 0 && my > 0) {
          const dx = p.x - mx;
          const dy = p.y - my;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            const force = (150 - dist) / 150;
            p.x += (dx / dist) * force * 2.4;
            p.y += (dy / dist) * force * 2.4;
          }
        }

        // Breathing particle brightness
        const currentAlpha = p.baseAlpha * (0.7 + Math.sin(time * 2.5 + p.pulseOffset) * 0.3);

        // Radial glowing bokeh particle
        ctx.beginPath();
        const pGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 2.4);
        pGrad.addColorStop(0, `rgba(${p.color}, ${currentAlpha})`);
        pGrad.addColorStop(0.45, `rgba(${p.color}, ${currentAlpha * 0.45})`);
        pGrad.addColorStop(1, `rgba(${p.color}, 0)`);
        ctx.fillStyle = pGrad;
        ctx.arc(p.x, p.y, p.size * 2.4, 0, Math.PI * 2);
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  return (
    <div
      className={`fixed inset-0 pointer-events-none z-[1] transition-opacity duration-700 transform-gpu will-change-transform ${
        scrolled ? 'opacity-30' : 'opacity-100'
      }`}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
};
