import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { useQuery } from '@tanstack/react-query';
import { fetchShopifyCollections } from '@/services/shopify';
import { Link } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';

const CARD_WIDTH = 320;
const CARD_GAP = 16;
const SCROLL_INTERVAL = 3000; // 3 seconds

export const FeaturedCollections = () => {
  const { data: collections = [], isLoading } = useQuery({
    queryKey: ['featured-collections'],
    queryFn: () => fetchShopifyCollections(),
  });

  const carouselRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const scrollInterval = useRef<NodeJS.Timeout>();

  // Auto-scroll functionality
  useEffect(() => {
    if (collections.length <= 1) return;
    
    const carousel = carouselRef.current?.querySelector('[role="list"]');
    if (!carousel) return;

    let currentIndex = 0;
    const itemWidth = CARD_WIDTH + CARD_GAP;
    const totalItems = collections.length;
    
    const scrollToItem = (index: number) => {
      if (!carousel) return;
      
      // Calculate scroll position
      const scrollPosition = index * itemWidth;
      
      // Smooth scroll to the item
      carousel.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      });
      
      // Update current index
      currentIndex = (index + 1) % totalItems;
      
      // If we've reached the end, reset to start after a small delay
      if (currentIndex === 0) {
        setTimeout(() => {
          if (carousel) {
            carousel.scrollLeft = 0;
          }
        }, 500);
      }
    };
    
    // Start auto-scroll
    scrollInterval.current = setInterval(() => {
      if (!isHovered) {
        scrollToItem(currentIndex);
      }
    }, SCROLL_INTERVAL);

    // Clean up
    return () => {
      if (scrollInterval.current) {
        clearInterval(scrollInterval.current);
      }
    };
  }, [collections, isHovered]);
  
  // Pause auto-scroll on hover
  const handleMouseEnter = () => {
    setIsHovered(true);
  };
  
  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  if (isLoading) {
    return (
      <section className="py-12 bg-background w-full overflow-hidden">
        <div className="w-full px-0">
          <h2 className="text-2xl font-garamond font-bold mb-8 text-center">Featured Collections</h2>
          <div className="flex space-x-4 overflow-hidden px-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex-shrink-0 w-[320px] h-[320px] relative">
                <Skeleton className="w-full h-full rounded-none" />
                <Skeleton className="h-6 w-3/4 mt-4 mx-auto absolute bottom-4 left-0 right-0" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (collections.length === 0) return null;

  return (
    <section id="featured-collections" className="py-12 bg-background w-full overflow-hidden">
      <div className="w-full px-0">
        <h2 className="text-2xl font-garamond font-bold mb-8 text-center">Featured Collections</h2>
        <div 
          ref={carouselRef} 
          className="relative w-full"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <Carousel
            opts={{
              align: 'start',
              dragFree: true,
            }}
            className="w-full"
          >
            <CarouselContent className="ml-0">
              {collections.map((collection) => (
                <CarouselItem 
                  key={collection.id}
                  className="basis-auto pl-0"
                  style={{ width: CARD_WIDTH }}
                >
                  <Link 
                    to={`/collections/${collection.handle}`} 
                    className="group block h-full"
                  >
                    <Card className="overflow-hidden transition-all duration-300 group-hover:shadow-lg h-full border-0 rounded-none">
                      <div className="relative w-[320px] h-[320px] overflow-hidden">
                        <img
                          src={collection.image?.url || '/placeholder-collection.jpg'}
                          alt={collection.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                      </div>
                      <CardContent className="p-4 absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white">
                        <h3 className="font-medium text-center text-lg group">
                          <span className="relative inline-block">
                            {collection.title}
                            <span className="absolute bottom-0 left-0 w-0 h-px bg-white transition-all duration-300 group-hover:w-full"></span>
                          </span>
                        </h3>
                      </CardContent>
                    </Card>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2 hidden md:flex" />
            <CarouselNext className="right-2 hidden md:flex" />
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCollections;
