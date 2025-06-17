
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { FeaturedCollections } from '@/components/FeaturedCollections';
import Footer from '@/components/Footer';
import React, { useState, useCallback } from 'react';

const Index = () => {
  const [showNavbarLogo, setShowNavbarLogo] = useState(false);

  // Called by MorphingBrand when morph completes
  const handleMorphDone = useCallback(() => {
    setShowNavbarLogo(true);
  }, []);
  const handleMorphStart = useCallback(() => {
    setShowNavbarLogo(false);
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header showNavbarLogo={false} />
      <main className="flex-1">
        <Hero />
        <FeaturedCollections />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
