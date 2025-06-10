
import { useState } from 'react';
import { Search, User, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AuthDialog } from '@/components/auth/AuthDialog';

export const Header = () => {
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-playfair font-bold luxury-text-gradient">
                EH
              </h1>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:block">
            <div className="flex items-baseline space-x-8">
              <a href="#" className="text-foreground hover:text-accent transition-colors duration-200 font-garamond">
                Collections
              </a>
              <a href="#" className="text-foreground hover:text-accent transition-colors duration-200 font-garamond">
                New Arrivals
              </a>
              <a href="#" className="text-foreground hover:text-accent transition-colors duration-200 font-garamond">
                Designers
              </a>
            </div>
          </nav>

          {/* Right Icons */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="hover:bg-accent/10">
              <Search className="h-5 w-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="hover:bg-accent/10"
              onClick={() => setIsAuthOpen(true)}
            >
              <User className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="hover:bg-accent/10">
              <ShoppingBag className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      <AuthDialog open={isAuthOpen} onOpenChange={setIsAuthOpen} />
    </header>
  );
};
