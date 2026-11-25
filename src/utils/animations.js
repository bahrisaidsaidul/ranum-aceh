import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { animate, inView } from 'motion';
import { escapeHtml } from './helpers.js';

gsap.registerPlugin(ScrollTrigger);

let lenisInstance = null;

export function initLenis() {
  if (lenisInstance) return lenisInstance;

  lenisInstance = new Lenis({
    duration: 1.15,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    touchMultiplier: 1.4
  });

  lenisInstance.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenisInstance.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  return lenisInstance;
}

export function stopLenis() {
  if (lenisInstance) lenisInstance.stop();
}

export function startLenis() {
  if (lenisInstance) lenisInstance.start();
}

export function scrollToTop() {
  if (lenisInstance) {
    lenisInstance.scrollTo(0, { immediate: true });
  } else {
    window.scrollTo(0, 0);
  }
}

export function initScrollProgress() {
  const bar = document.getElementById('scrollProgressBar');
  if (!bar) return;

  gsap.to(bar, {
    scaleX: 1,
    ease: 'none',
    scrollTrigger: {
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.25
    }
  });
}

export function initHeroParallax() {
  const heroBg = document.querySelector('[data-hero-parallax]');
  const heroCard = document.querySelector('.hero-card');
  if (!heroBg || !heroCard) return;

  gsap.fromTo(
    heroBg,
    { yPercent: -6, scale: 1.08 },
    {
      yPercent: 10,
      scale: 1.02,
      ease: 'none',
      scrollTrigger: {
        trigger: heroCard,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    }
  );
}

export function initWordReveal() {
  ScrollTrigger.getAll().forEach((st) => st.kill());

  const headings = document.querySelectorAll('[data-split-words]');
  headings.forEach((el) => {
    const rawText = el.textContent.trim();
    if (!rawText) return;
    const words = rawText.split(/\s+/);
    el.innerHTML = words
      .map((w) => `<span class="word-mask"><span class="word-inner">${escapeHtml(w)}</span></span>`)
      .join(' ');

    const innerWords = el.querySelectorAll('.word-inner');
    const isHero = el.hasAttribute('data-hero-heading');

    if (isHero) {
      gsap.fromTo(
        innerWords,
        { yPercent: 115, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.82,
          stagger: 0.055,
          ease: 'power3.out',
          delay: 0.06
        }
      );
    } else {
      gsap.fromTo(
        innerWords,
        { yPercent: 115, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.72,
          stagger: 0.048,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            once: true
          }
        }
      );
    }
  });

  initHeroParallax();
  initScrollProgress();
  ScrollTrigger.refresh();
}

export function initMotionCards() {
  const cards = document.querySelectorAll('[data-motion-card]');
  if (!cards.length) return;

  cards.forEach((card, idx) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(22px) scale(0.985)';
    let animated = false;

    const runEntrance = () => {
      if (animated) return;
      animated = true;
      animate(
        card,
        { opacity: [0, 1], y: [22, 0], scale: [0.985, 1] },
        { duration: 0.54, delay: (idx % 6) * 0.05, easing: [0.22, 1, 0.36, 1] }
      );
    };

    inView(
      card,
      () => {
        runEntrance();
      },
      { amount: 0.08 }
    );

    setTimeout(() => {
      const rect = card.getBoundingClientRect();
      if (!animated && rect.top < window.innerHeight + 80) runEntrance();
    }, 340);

    card.addEventListener('pointerenter', () => {
      animate(card, { y: -6, scale: 1.012 }, { duration: 0.28, easing: [0.22, 1, 0.36, 1] });
      card.style.boxShadow = '0 18px 42px rgba(30, 48, 37, 0.13)';
      const img = card.querySelector('.card-media img');
      if (img) img.style.transform = 'scale(1.06)';
    });

    card.addEventListener('pointerleave', () => {
      animate(card, { y: 0, scale: 1 }, { duration: 0.32, easing: [0.22, 1, 0.36, 1] });
      card.style.boxShadow = '';
      const img = card.querySelector('.card-media img');
      if (img) img.style.transform = 'scale(1)';
    });
  });
}

export function animateMobileDrawerOpen() {
  const items = document.querySelectorAll('#mobileDrawer .mobile-user-card, #mobileDrawer .mobile-nav-list > li');
  if (!items.length) return;
  gsap.killTweensOf(items);
  gsap.fromTo(
    items,
    { y: 18, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 0.42,
      stagger: 0.045,
      ease: 'power3.out',
      delay: 0.05
    }
  );
}

export function refreshAllAnimations() {
  requestAnimationFrame(() => {
    try { initLenis(); } catch (e) { console.warn('Lenis:', e); }
    try { initWordReveal(); } catch (e) { console.warn('GSAP:', e); }
    try { initMotionCards(); } catch (e) { console.warn('Motion:', e); }
  });
}
