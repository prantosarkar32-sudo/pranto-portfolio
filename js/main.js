/**
 * Main Portfolio Interactivity & Micro-Animations
 * Engineered for sub-100ms response & 60/120fps smooth animations
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // 1.1 Ultra-Smooth Dangling Light "Hi" Intro Controller
  const introCurtain = document.getElementById('intro-curtain');
  const lightRig = document.getElementById('light-rig');
  const bulbCore = document.getElementById('bulb-core');
  const bulbOuterGlow = document.getElementById('bulb-outer-glow');
  const lightCone = document.getElementById('light-cone');
  const hiTextWrap = document.getElementById('hi-text-wrap');
  const hiTextLit = document.getElementById('hi-text-lit');
  const skipHint = document.getElementById('intro-skip-hint');

  let introActive = false;
  let animFrameId = null;
  let exitTimeout = null;

  // Damped harmonic oscillator constants for heavy, silky-smooth pendulum
  const THETA_0 = 0.36;   // Initial angle in radians (~20.6 degrees)
  const OMEGA = 4.65;     // Angular frequency (Period T ≈ 1.35s - heavy studio lamp)
  const LAMBDA = 0.26;    // Exponential damping rate (gracefully decays over ~4s)

  const dismissIntro = () => {
    if (!introActive) return;
    introActive = false;
    if (animFrameId) cancelAnimationFrame(animFrameId);
    if (exitTimeout) clearTimeout(exitTimeout);

    // Cinematic smooth exit dissolve
    introCurtain.style.transition = 'opacity 0.85s cubic-bezier(0.16, 1, 0.3, 1), transform 0.85s cubic-bezier(0.16, 1, 0.3, 1), filter 0.85s ease';
    introCurtain.style.opacity = '0';
    introCurtain.style.transform = 'scale(1.05)';
    introCurtain.style.filter = 'blur(10px)';

    setTimeout(() => {
      introCurtain.style.display = 'none';
    }, 850);
  };

  const playLightIntro = () => {
    if (!introCurtain || !lightRig) return;
    if (animFrameId) cancelAnimationFrame(animFrameId);
    if (exitTimeout) clearTimeout(exitTimeout);

    introActive = true;

    // Reset initial state: 100% PITCH BLACK, text completely invisible
    introCurtain.style.display = 'flex';
    introCurtain.style.opacity = '1';
    introCurtain.style.transform = 'scale(1)';
    introCurtain.style.filter = 'none';
    introCurtain.style.transition = 'none';

    // Rig starts high above screen
    lightRig.style.transform = 'translate3d(-50%, -420px, 0) rotate(0deg)';

    // Bulb and text OFF
    if (bulbCore) {
      bulbCore.style.background = '#18181b';
      bulbCore.style.boxShadow = 'none';
      bulbCore.style.borderColor = 'rgba(255,255,255,0.15)';
    }
    if (bulbOuterGlow) bulbOuterGlow.style.opacity = '0';
    if (lightCone) lightCone.style.opacity = '0';
    if (hiTextWrap) hiTextWrap.style.opacity = '0';
    if (skipHint) skipHint.style.opacity = '0';

    // Phase 1: Brief cinematic dark pause (120ms), then rapid heavy drop ("dham kore porbe")
    const DROP_DURATION = 500; // ms
    let dropStartTime = null;
    let hasImpacted = false;

    const runDrop = (now) => {
      if (!introActive) return;
      if (!dropStartTime) dropStartTime = now;

      const elapsed = now - dropStartTime;
      const t = Math.min(elapsed / DROP_DURATION, 1.0);

      let currentY;
      if (t < 0.72) {
        // Accelerating downward fall
        const p = t / 0.72;
        currentY = -420 * (1 - p * p);
      } else {
        // Elastic impact rebound at bottom (dham!)
        const p = (t - 0.72) / 0.28;
        currentY = Math.sin(p * Math.PI) * 20 * (1 - p);
      }

      // Check impact moment (at t >= 0.72)
      if (t >= 0.72 && !hasImpacted) {
        hasImpacted = true;
        igniteLight();
      }

      lightRig.style.transform = `translate3d(-50%, ${currentY.toFixed(2)}px, 0) rotate(0deg)`;

      if (t < 1.0) {
        animFrameId = requestAnimationFrame(runDrop);
      } else {
        // Start ultra-smooth pendulum swing
        startPendulumSwing();
      }
    };

    // Begin drop after 120ms
    setTimeout(() => {
      if (introActive) animFrameId = requestAnimationFrame(runDrop);
    }, 120);

    // Show skip hint after 1.8s
    setTimeout(() => {
      if (introActive && skipHint) skipHint.style.opacity = '1';
    }, 1800);
  };

  // Ignition at moment of impact
  const igniteLight = () => {
    if (!introActive) return;

    // Bulb illuminates with white-hot core & rich green halo
    if (bulbCore) {
      bulbCore.style.background = '#ffffff';
      bulbCore.style.boxShadow = '0 0 16px #ffffff, 0 0 32px #22c55e, 0 0 60px #16a34a';
      bulbCore.style.borderColor = 'rgba(255,255,255,0.9)';
    }
    if (bulbOuterGlow) {
      bulbOuterGlow.style.opacity = '1';
    }
    if (lightCone) {
      lightCone.style.opacity = '1';
    }

    // Reveal "Hi" text instantly bathed in emerald light
    if (hiTextWrap) {
      hiTextWrap.style.opacity = '1';
    }
  };

  // Phase 2: Closed-form, buttery-smooth pendulum swing
  const startPendulumSwing = () => {
    const swingStartTime = performance.now();

    const swing = (now) => {
      if (!introActive) return;

      const elapsedSec = (now - swingStartTime) / 1000;

      // Analytical damped harmonic oscillation: θ(t) = θ₀ * e^(-λt) * cos(ωt)
      // 100% mathematically continuous, ZERO numerical integration jitter
      const angle = THETA_0 * Math.exp(-LAMBDA * elapsedSec) * Math.cos(OMEGA * elapsedSec);
      const angleDeg = angle * (180 / Math.PI);

      // Apply sub-pixel GPU hardware-accelerated rotation
      lightRig.style.transform = `translate3d(-50%, 0, 0) rotate(${angleDeg.toFixed(3)}deg)`;

      // Dynamically track spotlight on "Hi" text
      // Cord length is 250px. Lateral offset = 250 * sin(angle)
      const bulbX = 250 * Math.sin(angle);
      const lightPercentX = 50 + (bulbX / 2.0);

      if (hiTextLit) {
        hiTextLit.style.setProperty('--light-x', `${lightPercentX.toFixed(2)}%`);
        const centerProximity = Math.cos(angle);
        hiTextLit.style.filter = `drop-shadow(0 0 ${(45 * Math.max(0.6, centerProximity)).toFixed(1)}px rgba(34,197,94,0.65))`;
      }

      // Schedule graceful exit after ~3.8 seconds
      if (elapsedSec > 3.8 && !exitTimeout) {
        exitTimeout = setTimeout(dismissIntro, 100);
        return;
      }

      animFrameId = requestAnimationFrame(swing);
    };

    animFrameId = requestAnimationFrame(swing);
  };

  // Run on page load
  playLightIntro();

  // Click/tap anywhere to skip immediately
  if (introCurtain) {
    introCurtain.addEventListener('click', dismissIntro);
  }

  // Replay intro when user clicks brand logo
  const replayIntroTrigger = document.getElementById('replay-intro-trigger');
  if (replayIntroTrigger) {
    replayIntroTrigger.addEventListener('click', (e) => {
      e.preventDefault();
      playLightIntro();
    });
  }

  // 2. High-Performance Throttled Mouse Spotlight Tracker (rAF)
  const cards = document.querySelectorAll('.spotlight-card');
  let mouseMoveTicking = false;
  let latestMouseX = 0;
  let latestMouseY = 0;

  const updateCardSpotlights = () => {
    cards.forEach((card) => {
      const rect = card.getBoundingClientRect();
      // Only calculate if card is in visible viewport
      if (
        rect.top < window.innerHeight &&
        rect.bottom > 0 &&
        rect.left < window.innerWidth &&
        rect.right > 0
      ) {
        const x = latestMouseX - rect.left;
        const y = latestMouseY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
      }
    });
    mouseMoveTicking = false;
  };

  window.addEventListener('mousemove', (e) => {
    latestMouseX = e.clientX;
    latestMouseY = e.clientY;
    if (!mouseMoveTicking) {
      window.requestAnimationFrame(updateCardSpotlights);
      mouseMoveTicking = true;
    }
  }, { passive: true });

  // 2.1 Interactive Parallax on Hero Floating Badges
  const heroZone = document.getElementById('hero-interactive-zone');
  if (heroZone) {
    heroZone.addEventListener('mousemove', (e) => {
      const rect = heroZone.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      const badges = heroZone.querySelectorAll('[class*="animate-float-"]');
      badges.forEach((badge, idx) => {
        const factor = (idx + 1) * 6;
        badge.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
      });
    });

    heroZone.addEventListener('mouseleave', () => {
      const badges = heroZone.querySelectorAll('[class*="animate-float-"]');
      badges.forEach((badge) => {
        badge.style.transform = '';
      });
    });
  }

  // 3. Dynamic Morphing Title Effect (Motion Design)
  const dynamicRoleElement = document.getElementById('dynamic-role');
  if (dynamicRoleElement) {
    const roles = [
      'Visual Direction',
      '3D Motion Design',
      'Cinema 4D & Octane',
      'Kinetic Typography',
      'Fluid Simulations',
      'Brand Storytelling'
    ];
    let roleIndex = 0;
    let charIndex = roles[0].length;
    let isDeleting = false;
    let typingSpeed = 100;

    const typeRole = () => {
      const currentRole = roles[roleIndex];

      if (isDeleting) {
        dynamicRoleElement.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 50;
      } else {
        dynamicRoleElement.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 90;
      }

      if (!isDeleting && charIndex === currentRole.length) {
        typingSpeed = 2200; // Pause at full word
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typingSpeed = 400; // Pause before typing new word
      }

      setTimeout(typeRole, typingSpeed);
    };

    setTimeout(typeRole, 1500);
  }

  // 4. Live Local Time Indicator (GMT+6 Dhaka)
  const timeTicker = document.getElementById('live-time-ticker');
  const updateLocalClock = () => {
    if (!timeTicker) return;
    try {
      const now = new Date();
      const options = {
        timeZone: 'Asia/Dhaka',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      };
      const timeString = new Intl.DateTimeFormat('en-US', options).format(now);
      timeTicker.textContent = `${timeString} (Dhaka, GMT+6)`;
    } catch (e) {
      timeTicker.textContent = 'GMT+6 (Dhaka)';
    }
  };
  updateLocalClock();
  setInterval(updateLocalClock, 1000);

  // 5. Engineering Methodology Accordion
  const accordionItems = document.querySelectorAll('.accordion-item');
  accordionItems.forEach((item) => {
    item.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');
      accordionItems.forEach((other) => other.classList.remove('is-open'));
      if (!isOpen) {
        item.classList.add('is-open');
      }
    });
  });

  // 6. Mobile Navigation Overlay Toggle
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.contains('opacity-100');
      if (isOpen) {
        mobileMenu.classList.remove('opacity-100', 'pointer-events-auto');
        mobileMenu.classList.add('opacity-0', 'pointer-events-none');
        document.body.style.overflow = '';
      } else {
        mobileMenu.classList.remove('opacity-0', 'pointer-events-none');
        mobileMenu.classList.add('opacity-100', 'pointer-events-auto');
        document.body.style.overflow = 'hidden';
      }
    });

    mobileLinks.forEach((link) => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('opacity-100', 'pointer-events-auto');
        mobileMenu.classList.add('opacity-0', 'pointer-events-none');
        document.body.style.overflow = '';
      });
    });
  }

  // 7. Project Category Filtering with Smooth Transition
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const category = btn.getAttribute('data-filter');

      // Update button active state
      filterBtns.forEach((b) => {
        b.classList.remove('bg-indigo-600', 'text-white', 'shadow-indigo-500/30', 'shadow-lg');
        b.classList.add('bg-white/5', 'text-slate-400', 'hover:text-white', 'hover:bg-white/10');
      });
      btn.classList.remove('bg-white/5', 'text-slate-400', 'hover:text-white', 'hover:bg-white/10');
      btn.classList.add('bg-indigo-600', 'text-white', 'shadow-indigo-500/30', 'shadow-lg');

      // Filter cards
      projectCards.forEach((card) => {
        const cardCategory = card.getAttribute('data-category');
        if (category === 'all' || cardCategory === category) {
          card.classList.remove('is-hidden');
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1) translateY(0)';
          }, 40);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95) translateY(10px)';
          setTimeout(() => {
            card.classList.add('is-hidden');
          }, 240);
        }
      });
    });
  });

  // 8. Contact Form Submission with Modern Feedback Toast
  const contactForm = document.getElementById('contact-form');
  const toast = document.getElementById('toast');

  if (contactForm && toast) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalContent = submitBtn.innerHTML;

      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <span class="inline-flex items-center gap-2">
          <svg class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
          </svg>
          Transmitting Message...
        </span>
      `;

      setTimeout(() => {
        contactForm.reset();
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalContent;

        // Display Toast
        toast.classList.remove('translate-y-24', 'opacity-0', 'pointer-events-none');
        toast.classList.add('translate-y-0', 'opacity-100');

        setTimeout(() => {
          toast.classList.add('translate-y-24', 'opacity-0', 'pointer-events-none');
          toast.classList.remove('translate-y-0', 'opacity-100');
        }, 5000);
      }, 900);
    });
  }

  // 9. Current Year in Footer
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // 10. High-Performance Active Navigation Spy via IntersectionObserver
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.desktop-nav-link');

  if ('IntersectionObserver' in window && sections.length > 0) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navLinks.forEach((link) => {
              if (link.getAttribute('href') === `#${id}`) {
                link.classList.add('text-indigo-400', 'font-semibold');
                link.classList.remove('text-slate-300');
              } else {
                link.classList.remove('text-indigo-400', 'font-semibold');
                link.classList.add('text-slate-300');
              }
            });
          }
        });
      },
      {
        root: null,
        rootMargin: '-20% 0px -65% 0px',
        threshold: 0
      }
    );

    sections.forEach((section) => observer.observe(section));
  }
});

