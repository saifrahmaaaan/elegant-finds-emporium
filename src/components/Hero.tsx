import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { MorphingBrand } from './MorphingBrand';

// Only show this when morphT <= 0 (top of page)
const StaticHeroBrand: React.FC = () => {
  // Use scroll position to hide when morph starts
  const [show, setShow] = React.useState(true);
  React.useEffect(() => {
    const onScroll = () => {
      // Hide when scrolled past a threshold (same as MorphingBrand morph start)
      setShow(window.scrollY < 20);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  if (!show) return null;
  return (
    <h1
      className="text-white font-garamond font-bold mb-12 tracking-tight drop-shadow-2xl"
      style={{
        fontSize: `clamp(2.5rem, 8vw, 5.5rem)`,
        opacity: 1,
        transition: 'opacity 0.3s',
        position: 'relative',
        zIndex: 30,
        pointerEvents: 'none',
      }}
    >
      Elegant Finds
    </h1>
  );
};

// Demo product images (replace with real data)
const productImages = [
  '/luxury-bag-1.jpg',
  '/luxury-bag-2.jpg',
  '/luxury-bag-3.jpg',
];

export const Hero: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);
  const [isScrollingDown, setIsScrollingDown] = useState(false);
  const lastScrollY = useRef(0);

  // Smooth zoom-out animation state for hero background
  const initialZoom = 1.27;
  const finalZoom = 1.04;
  const [zoom, setZoom] = useState(initialZoom); // Start zoomed but not too much

  // Handle scroll events for hero text animation
  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;
    setScrollY(currentScrollY);
    setIsScrollingDown(currentScrollY > lastScrollY.current);
    lastScrollY.current = currentScrollY;
  }, []);

  // Set up scroll listener
  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Hero background zoom animation
  useEffect(() => {
    let frame: number;
    let start: number | null = null;
    const duration = 1600;
    
    function animateZoomOut(ts: number) {
      if (start === null) start = ts;
      const elapsed = ts - start;
      const t = Math.min(1, elapsed / duration);
      // Ease in-out cubic
      const eased = t < 0.5
        ? 4 * t * t * t
        : 1 - Math.pow(-2 * t + 2, 3) / 2;
      setZoom(initialZoom + (finalZoom - initialZoom) * eased);
      if (t < 1) {
        frame = requestAnimationFrame(animateZoomOut);
      } else {
        setZoom(finalZoom);
      }
    }
    
    setZoom(initialZoom);
    frame = requestAnimationFrame(animateZoomOut);
    return () => cancelAnimationFrame(frame);
  }, []);
  
  // Update navbar logo based on scroll position
  useEffect(() => {
    const navbarLogo = document.getElementById('navbar-logo');
    if (!navbarLogo) return;
    
    const heroHeight = heroRef.current?.offsetHeight || 0;
    const scrollRatio = Math.min(1, scrollY / (heroHeight * 0.5));
    
    // Update navbar logo position and opacity
    if (scrollY > 50) {
      navbarLogo.style.opacity = '1';
      navbarLogo.style.transform = 'translateY(0)';
    } else {
      navbarLogo.style.opacity = '0';
      navbarLogo.style.transform = 'translateY(20px)';
    }
  }, [scrollY]);

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden luxury-hero-bg max-w-full"
    >
      {/* Cinematic full-screen fallback image background with smooth zoom-out effect */}
      <div
        className="absolute inset-0 w-full h-full object-cover object-center z-0 pointer-events-none bg-center bg-cover luxury-bg-parallax"
        style={{
          minHeight: '100vh',
          backgroundImage: "url('/luxury-hero-fallback.jpg')",
          transform: `scale(${zoom})`,
          transition: 'transform 1.6s cubic-bezier(.4,2,.3,1)',
        }}
        aria-hidden="true"
      />

      {/* Parallax gold shimmer overlay */}
      <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-br from-[#f8f6f000] via-[#f8f6f033] to-[#d4af3780] mix-blend-lighten animate-parallax-gold" />

      {/* Hero headline and description in a full-width blurred/glassmorphic box */}
      <div className="relative z-20 flex flex-col items-center justify-center w-full h-[60vh] text-center mt-32">
        <div className="w-full backdrop-blur-lg bg-white/30 shadow-xl px-4 md:px-8 py-10 flex flex-col items-center border-t border-b border-white/40">
          <div className="w-full max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 text-center drop-shadow-lg" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>Elegant Finds</h1>
            <p className="text-lg md:text-2xl text-gray-200 text-center mb-2" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
              Discover timeless luxury. Curated designer handbags & accessories for the discerning collector.
            </p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-5 justify-center z-20 relative mt-16">
          <Button
            onClick={(e) => {
              e.preventDefault();
              const featuredSection = document.getElementById('featured-collections');
              if (featuredSection) {
                featuredSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }}
            size="xl"
            className="bg-transparent border-2 border-white text-white hover:bg-transparent hover:text-white font-inter shadow-xl px-10 py-4 text-lg rounded-none luxury-btn-animate group relative overflow-visible"
          >
            <span className="relative inline-flex items-center justify-center">
              Explore Collections
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
            </span>
          </Button>
          <Button
            asChild
            variant="outline"
            size="xl"
            className="border-white text-white hover:bg-transparent hover:text-white font-inter shadow px-10 py-4 text-lg rounded-none luxury-btn-animate border-2 group relative overflow-visible"
          >
            <Link to="/new-arrivals" className="relative inline-flex items-center justify-center h-full">
              <span className="relative z-10">
                New Arrivals
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
              </span>
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
