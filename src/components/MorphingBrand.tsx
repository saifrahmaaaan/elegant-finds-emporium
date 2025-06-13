import React, { useEffect, useRef, useState } from 'react';

// Utility to interpolate between two values
function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

interface MorphingBrandProps {
  onMorphDone?: () => void;
  onMorphStart?: () => void;
}

export const MorphingBrand: React.FC<MorphingBrandProps> = ({ onMorphDone, onMorphStart }) => {
  const [scroll, setScroll] = useState(0);
  const [heroRect, setHeroRect] = useState<DOMRect | null>(null);
  const [navRect, setNavRect] = useState<DOMRect | null>(null);
  const [windowW, setWindowW] = useState(0);

  // Refs for measuring
  const brandRef = useRef<HTMLDivElement>(null);

  // Measure positions on mount and resize
  useEffect(() => {
    function measure() {
      const hero = document.getElementById('hero-brand-target');
      const nav = document.getElementById('navbar-logo-target');
      setHeroRect(hero?.getBoundingClientRect() || null);
      setNavRect(nav?.getBoundingClientRect() || null);
      setWindowW(window.innerWidth);
    }
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  // Track scroll
  useEffect(() => {
    function onScroll() {
      setScroll(window.scrollY);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Interpolate position/scale
  let style: React.CSSProperties = { position: 'fixed', left: 0, top: 0, pointerEvents: 'none', zIndex: 100 };
  let morphT = 0;
  if (heroRect && navRect) {
    // Calculate the scroll range where morph happens (hero center to navbar center)
    const heroCenterY = heroRect.top + heroRect.height / 2 + window.scrollY;
    const navCenterY = navRect.top + navRect.height / 2 + window.scrollY;
    
    // Calculate progress (0 to 1) based on scroll position
    const scrollRange = navCenterY - heroCenterY;
    const scrollProgress = (window.scrollY - heroCenterY + window.innerHeight/2) / scrollRange;
    
    // Clamp between 0 and 1
    const t = Math.min(1, Math.max(0, scrollProgress));
    morphT = t;
    
    // Interpolate position and scale
    const x = lerp(heroRect.left + heroRect.width/2, navRect.left + navRect.width/2, t) - windowW/2;
    const y = lerp(heroCenterY, navCenterY, t);
    const scale = lerp(1, 0.4, t);
    
    style = {
      position: 'fixed',
      left: `calc(50vw + ${x}px)`,
      top: y,
      transform: `translate(-50%, -50%) scale(${scale})`,
      color: `rgba(${Math.round(255 - 255 * t)},${Math.round(255 - 255 * t)},${Math.round(255 - 255 * t)},1)`,
      fontFamily: 'Playfair Display, serif',
      fontWeight: 700,
      fontSize: lerp(64, 36, t),
      letterSpacing: lerp(0.07, 0.2, t) + 'em',
      lineHeight: lerp(1.1, 1.2, t),
      transition: 'none',
      zIndex: 100,
      pointerEvents: 'none',
      textShadow: t < 0.5 ? '0 2px 24px #0006' : 'none',
      whiteSpace: 'nowrap',
    };
  }

  // Only render morphing brand when morphT is between 0 and 1
  // Track morph state for parent
  const lastMorphT = useRef<number>(-1);
  useEffect(() => {
    if (morphT > 0 && morphT < 1 && lastMorphT.current !== 0.5) {
      onMorphStart?.();
      lastMorphT.current = 0.5;
    } else if (morphT >= 1 && lastMorphT.current !== 1) {
      onMorphDone?.();
      lastMorphT.current = 1;
    } else if (morphT <= 0 && lastMorphT.current !== 0) {
      onMorphStart?.(); // also hide logo at top
      lastMorphT.current = 0;
    }
  }, [morphT, onMorphDone, onMorphStart]);

  if (!(heroRect && navRect)) return null;
  if (morphT <= 0 || morphT >= 1) return null;

  return (
    <div ref={brandRef} style={style}>
      <span style={{
        opacity: 1 - morphT,
        transition: 'opacity 0.2s',
        position: 'relative',
        zIndex: morphT < 0.5 ? 2 : 1,
        pointerEvents: 'none',
      }}>Elegant Finds</span>
      <span style={{
        opacity: morphT,
        position: 'absolute',
        left: 0,
        top: 0,
        transition: 'opacity 0.2s',
        zIndex: morphT >= 0.5 ? 2 : 1,
        pointerEvents: 'none',
      }}>EF</span>
    </div>
  );
};
