
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

export const Hero = () => {
  const [text, setText] = useState('');
  const fullText = 'Elegant Handbag Finds';
  
  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      setText(fullText.slice(0, index + 1));
      index++;
      if (index === fullText.length) {
        clearInterval(timer);
      }
    }, 100);
    
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-background via-background to-accent/5">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center opacity-10"></div>
      <div className="relative z-10 text-center max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-playfair font-bold mb-6 animate-fade-in">
          <span className="luxury-text-gradient">{text}</span>
          <span className="animate-pulse">|</span>
        </h1>
        <p className="text-lg sm:text-xl text-muted-foreground mb-8 font-garamond max-w-2xl mx-auto animate-slide-up">
          Discover exquisite luxury handbags from world-renowned designers. 
          Curated collections that define elegance and sophistication.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
          <Button 
            size="lg" 
            className="luxury-gold-gradient text-black hover:opacity-90 transition-opacity font-garamond"
          >
            Explore Collections
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            className="border-accent text-accent hover:bg-accent/10 font-garamond"
          >
            New Arrivals
          </Button>
        </div>
      </div>
    </section>
  );
};
