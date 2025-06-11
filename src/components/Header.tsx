import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ShoppingBag, User, LogOut } from 'lucide-react';
import { AuthDialog } from './auth/AuthDialog';
import { CartDrawer } from './CartDrawer';
import { useCart } from '@/contexts/CartContext';
import { supabase } from '@/integrations/supabase/client';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';
import { Link, useNavigate } from 'react-router-dom';  

export const Header = () => {
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const { cart, toggleCart } = useCart();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast({
          title: 'Error',
          description: 'Failed to sign out. Please try again.',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Signed Out',
          description: 'You have been successfully signed out.',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred.',
        variant: 'destructive',
      });
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchTerm.trim();
    if (q) {
      navigate(`/search?q=${encodeURIComponent(q)}`);
      setSearchTerm('');
    }
  };

  return (
    <>
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="text-2xl font-playfair font-bold luxury-text-gradient">
                EH
              </div>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link to="/collections" className="nav-link">
                <Button variant="ghost" className="font-garamond hover:text-accent">
                  Collections
                </Button>
              </Link>
              <Link to="/new-arrivals" className="nav-link">
                <Button variant="ghost" className="font-garamond hover:text-accent">
                  New Arrivals
                </Button>
              </Link>
              <Link to="/designers" className="nav-link">
                <Button variant="ghost" className="font-garamond hover:text-accent">
                  Designers
                </Button>
              </Link>
            </nav>

            {/* Right side icons */}
            <div className="flex items-center space-x-4">
              {/* Search input visible on md+ */}
              <form onSubmit={handleSearchSubmit} className="hidden md:block">
                <input
                  type="search"
                  placeholder="Search…"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-3 py-2 border border-border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent font-garamond placeholder:text-muted-foreground"
                />
              </form>
              
              <Button variant="ghost" size="icon" className="relative" onClick={toggleCart}>
                <ShoppingBag className="h-5 w-5" />
                {cart.itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-garamond font-bold">
                    {cart.itemCount > 9 ? '9+' : cart.itemCount}
                  </span>
                )}
              </Button>
              
              {user ? (
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={handleSignOut}
                  className="hover:text-accent"
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              ) : (
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setAuthDialogOpen(true)}
                >
                  <User className="h-5 w-5" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <AuthDialog 
        open={authDialogOpen} 
        onOpenChange={setAuthDialogOpen} 
      />
      <CartDrawer />
    </>
  );
};
