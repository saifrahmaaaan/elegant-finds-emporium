import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ShoppingBag, User, LogOut, Search } from 'lucide-react';
import { Heart } from './Heart';
import { useWishlist } from '@/contexts/WishlistContext';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { AuthDialog } from './auth/AuthDialog';
import { ProfileDialog } from './ProfileDialog';
import { PasswordResetDialog } from './auth/PasswordResetDialog';
import { CartDrawer } from './CartDrawer';
import { CartPopup } from './CartPopup';
import { SearchPopup } from './SearchPopup';
import { ProfilePopup } from './ProfilePopup';
import { useCart } from '@/contexts/CartContext';
import { supabase } from '@/integrations/supabase/client';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';
import { Link, useNavigate, useLocation } from 'react-router-dom';  

import { fetchShopifyCollections } from '@/services/shopify';

// Only show EF logo after morph is complete (when scrollY is past hero)
const NavbarLogoAfterMorph: React.FC = () => {
  const [show, setShow] = useState(false);
  useEffect(() => {
    function onScroll() {
      // Find hero and navbar targets
      const hero = document.getElementById('hero-brand-target');
      const nav = document.getElementById('navbar-logo-target');
      if (!hero || !nav) return setShow(false);
      const heroRect = hero.getBoundingClientRect();
      const navRect = nav.getBoundingClientRect();
      // When the top of hero is above the navbar, morph is done
      setShow(heroRect.bottom < navRect.top + 8);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  if (!show) return null;
  return (
    <span
      className="font-garamond font-bold tracking-widest"
      style={{
        color: '#000',
        fontSize: '2.2rem',
        letterSpacing: '0.2em',
        lineHeight: '3.5rem',
        transition: 'all 0.5s cubic-bezier(.4,2,.3,1)',
        pointerEvents: 'none',
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        textAlign: 'center',
      }}
    >
      EF
    </span>
  );
};

export const Header = ({ showNavbarLogo }: { showNavbarLogo?: boolean }) => {
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [profilePopupOpen, setProfilePopupOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const { cart, toggleCart } = useCart();
  const [cartPopupOpen, setCartPopupOpen] = useState(false);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [passwordResetDialogOpen, setPasswordResetDialogOpen] = useState(false);

  // Helper to open cart popup when cart icon is clicked
  const handleCartIconClick = () => {
    setCartPopupOpen(true);
  };

  // Handler for 'View Shopping Bag' in popup
  const handleViewCart = () => {
    setCartPopupOpen(false);
    toggleCart();
  };

  // Handler for 'Checkout' in popup (open drawer and scroll to checkout section)
  const handleCheckout = () => {
    setCartPopupOpen(false);
    toggleCart();
    // Optionally, you could scroll to checkout section in drawer if needed
  };
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // --- Collections state for search modal ---
  const [collections, setCollections] = useState<any[]>([]);
  const [collectionsLoading, setCollectionsLoading] = useState(false);

  // Fetch collections when search modal opens
  useEffect(() => {
    if (isSearchOpen && collections.length === 0 && !collectionsLoading) {
      setCollectionsLoading(true);
      fetchShopifyCollections().then(cols => {
        setCollections(cols);
        setCollectionsLoading(false);
      });
    }
  }, [isSearchOpen, collections.length, collectionsLoading]);

  // Focus search input when dialog opens
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

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
      setIsSearchOpen(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsSearchOpen(false);
    }
  };

  // Scroll state for navbar/hero transitions
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  
  const [scrolled, setScrolled] = useState(!isHomePage);
  // Announcement bar fade state
  const [announceWhite, setAnnounceWhite] = useState(!isHomePage);

  useEffect(() => {
    if (isHomePage) {
      const onScroll = () => setScrolled(window.scrollY > 0);
      window.addEventListener('scroll', onScroll);
      return () => window.removeEventListener('scroll', onScroll);
    } else {
      setScrolled(true);
      setAnnounceWhite(true);
    }
  }, [isHomePage]);

  useEffect(() => {
    if (isHomePage) {
      const timer = setTimeout(() => setAnnounceWhite(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [isHomePage]);

  return (
    <>
      {/* Announcement Bar - Only on homepage */}
      {isHomePage && (
        <div 
          className={`w-full max-w-full text-center text-xs font-garamond uppercase h-[63px] flex items-center justify-center transition-none ${scrolled ? 'hidden' : ''} ${announceWhite ? 'bg-white text-black' : 'bg-neutral-900 text-white'}`}
          style={{ letterSpacing: '0.05em', overflowX: 'hidden' }}
        >
          <span>New Arrivals Alert: Shop the Latest Trends Now!</span>
        </div>
      )}
      
      <header
        className={`w-full max-w-full left-0 transition-all duration-[1400ms] h-16 overflow-y-hidden ${
          isHomePage 
            ? scrolled 
              ? 'sticky top-0 bg-white border-b border-border shadow-sm z-50' 
              : 'absolute top-[63px] z-40 bg-transparent'
            : 'sticky top-0 bg-white border-b border-border shadow-sm z-50'
        }`}
        style={{
    transition: 'all 1.4s cubic-bezier(.4,2,.3,1)',
    backdropFilter: scrolled ? 'blur(8px)' : 'none',
    overflowY: 'hidden',
  }}
      >
        <div className="w-full max-w-full px-2 sm:px-6 lg:px-8 mx-auto" style={{ overflowX: 'hidden' }}>
          <div className="relative flex items-center h-16 w-full max-w-full overflow-x-hidden overflow-y-hidden">
            {/* Left spacer to keep icons right-aligned when logo is absolute */}
            <div className="hidden sm:block min-w-[180px]" />

            {/* Logo - will be controlled by Hero component for scroll animation */}
            <div className={`transition-all duration-700 flex-1 flex items-center justify-center ${scrolled ? 'relative' : 'absolute left-0 top-0 w-full h-20 pointer-events-none'}`}
              style={{ zIndex: 20 }}>
              {/* Brand morph target for measurement only */}
              <div id="navbar-logo-target" style={{ width: '90px', height: '40px', display: 'inline-block', position: 'relative' }}>
                {/* Show clickable EF logo in center when scrolled (sticky navbar) */}
                {scrolled && (
                  <Link to="/" style={{ textDecoration: 'none', display: 'inline-block', width: '100%' }}>
                    <span
                      className="font-garamond font-bold tracking-widest"
                      style={{
                        color: '#000',
                        fontSize: '2.2rem',
                        letterSpacing: '0.2em',
                        lineHeight: '3.5rem',
                        transition: 'all 0.5s cubic-bezier(.4,2,.3,1)',
                        pointerEvents: 'auto',
                        position: 'relative',
                        width: '100%',
                        textAlign: 'center',
                        cursor: 'pointer',
                      }}
                    >
                      EF
                    </span>
                  </Link>
                )}
                {/* Existing morphing logo logic remains for non-scrolled state */}
                {!scrolled && showNavbarLogo && (
                  <span
                    className="font-garamond font-bold tracking-widest"
                    style={{
                      color: '#000',
                      fontSize: '2.2rem',
                      letterSpacing: '0.2em',
                      lineHeight: '3.5rem',
                      transition: 'all 0.5s cubic-bezier(.4,2,.3,1)',
                      pointerEvents: 'none',
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      width: '100%',
                      textAlign: 'center',
                    }}
                  >
                    EF
                  </span>
                )}
              </div>
            </div>

            {/* Right side icons - always right-aligned, color changes with scroll */}
            <div className="flex items-center space-x-1 sm:space-x-4 ml-auto max-w-full" style={{ color: scrolled ? '#000' : '#fff', transition: 'color 0.6s cubic-bezier(.4,2,.3,1)', zIndex: 51 }}>
              {/* Wishlist Heart Icon */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Wishlist"
                    className={`hover:bg-transparent ${!scrolled ? 'text-white' : 'text-foreground'}`}
                    onClick={() => {
                      if (user) {
                        navigate('/wishlist');
                      } else {
                        setProfilePopupOpen(true);
                      }
                    }}
                  >
                    <Heart className="w-6 h-6" strokeWidth={2.2} style={{ color: scrolled ? '#000' : '#fff' }} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">Wishlist</TooltipContent>
              </Tooltip>

              {/* Search button */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsSearchOpen(true)}
                    className={`hover:bg-transparent ${!scrolled ? 'text-white' : 'text-foreground'}`}
                    aria-label="Search"
                  >
                    <Search className="w-6 h-6" strokeWidth={2.2} style={{ color: scrolled ? '#000' : '#fff' }} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">Search</TooltipContent>
              </Tooltip>

              {/* Cart button and popup */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleCartIconClick}
                    className={`relative hover:bg-transparent ${!scrolled ? 'text-white' : 'text-foreground'}`}
                    aria-label="Cart"
                  >
                    <ShoppingBag className="w-6 h-6" strokeWidth={2.2} style={{ color: scrolled ? '#000' : '#fff', zIndex: 51 }} />
                    {Array.isArray(cart) && cart.length > 0 && (
  <span className="absolute top-1 right-0 text-xs font-bold select-none" style={{ color: scrolled ? '#000' : '#fff', background: 'none', borderRadius: 0, padding: 0, minWidth: '1.25rem', textAlign: 'center', lineHeight: 1, fontSize: '0.5rem' }}>
  {cart.length}
</span>
)}
                    {/* If cart is object with items array, use cart.items.length instead */}
                    {cart.items && cart.items.length > 0 && (
  <span className="absolute top-1 right-0 text-xs font-bold select-none" style={{ color: scrolled ? '#000' : '#fff', background: 'none', borderRadius: 0, padding: 0, minWidth: '1.25rem', textAlign: 'center', lineHeight: 1, fontSize: '0.5rem' }}>
  {cart.items.length}
</span>
)}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">Cart</TooltipContent>
              </Tooltip>

              {/* User/Profile section */}
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className={`hover:bg-transparent ${!scrolled ? 'text-white' : 'text-foreground'}`}
                    >
                      <span className="flex h-6 w-6 items-center justify-center">
                        {user.email ? user.email.charAt(0).toUpperCase() : 'U'}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent 
                    align="end" 
                    className="w-56 p-2 bg-white border border-gray-200 shadow-2xl rounded-none"
                  >
                    <DropdownMenuItem 
                      onClick={() => navigate('/my-profile')} 
                      className="px-3 py-2 text-sm font-garamond cursor-pointer group focus:bg-transparent focus:text-foreground hover:bg-transparent [&>span]:focus:bg-transparent"
                    >
                      <span className="relative">
                        My Profile
                        <span className="absolute bottom-0 left-0 w-0 h-px bg-black transition-all duration-300 group-hover:w-full"></span>
                      </span>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => navigate('/my-orders')} 
                      className="px-3 py-2 text-sm font-garamond cursor-pointer group focus:bg-transparent focus:text-foreground hover:bg-transparent [&>span]:focus:bg-transparent"
                    >
                      <span className="relative">
                        My Orders
                        <span className="absolute bottom-0 left-0 w-0 h-px bg-black transition-all duration-300 group-hover:w-full"></span>
                      </span>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => navigate('/account-settings')} 
                      className="px-3 py-2 text-sm font-garamond cursor-pointer group focus:bg-transparent focus:text-foreground hover:bg-transparent [&>span]:focus:bg-transparent"
                    >
                      <span className="relative">
                        Account Settings
                        <span className="absolute bottom-0 left-0 w-0 h-px bg-black transition-all duration-300 group-hover:w-full"></span>
                      </span>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => navigate('/address-book')} 
                      className="px-3 py-2 text-sm font-garamond cursor-pointer group focus:bg-transparent focus:text-foreground hover:bg-transparent [&>span]:focus:bg-transparent"
                    >
                      <span className="relative">
                        Address Book
                        <span className="absolute bottom-0 left-0 w-0 h-px bg-black transition-all duration-300 group-hover:w-full"></span>
                      </span>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => navigate('/wallet')} 
                      className="px-3 py-2 text-sm font-garamond cursor-pointer group focus:bg-transparent focus:text-foreground hover:bg-transparent [&>span]:focus:bg-transparent"
                    >
                      <span className="relative">
                        Wallet
                        <span className="absolute bottom-0 left-0 w-0 h-px bg-black transition-all duration-300 group-hover:w-full"></span>
                      </span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="my-1" />
                    <DropdownMenuItem 
                      onClick={() => setPasswordResetDialogOpen(true)} 
                      className="px-3 py-2 text-sm font-garamond text-gray-600 cursor-pointer group focus:bg-transparent focus:text-gray-600 hover:bg-transparent [&>span]:focus:bg-transparent"
                    >
                      <span className="relative">
                        Reset Password
                        <span className="absolute bottom-0 left-0 w-0 h-px bg-gray-600 transition-all duration-300 group-hover:w-full"></span>
                      </span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="my-1" />
                    <DropdownMenuItem 
                      onClick={handleSignOut} 
                      className="px-3 py-2 text-sm font-garamond text-red-600 cursor-pointer group focus:bg-transparent focus:text-red-600 hover:bg-transparent [&>span]:focus:bg-transparent"
                    >
                      <span className="relative">
                        Sign Out
                        <span className="absolute bottom-0 left-0 w-0 h-px bg-red-600 transition-all duration-300 group-hover:w-full"></span>
                      </span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setProfilePopupOpen(true)}
                    className="hover:text-accent"
                  >
                    <User className="w-6 h-6" strokeWidth={2.2} style={{ color: scrolled ? '#000' : '#fff', zIndex: 51 }} />
                  </Button>
                  <ProfilePopup
                    open={profilePopupOpen}
                    onClose={() => setProfilePopupOpen(false)}
                    showSocialLogin={true}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </header>
      <SearchPopup
        open={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onSubmit={handleSearchSubmit}
        trending={["Handbags", "Clutches", "Leather Bags", "Bags"]}
        collections={collections}
        loadingCollections={collectionsLoading}
      />
      <AuthDialog 
        open={authDialogOpen} 
        onOpenChange={setAuthDialogOpen} 
        showSocialLogin={true}
      />
      {user && (
        <ProfileDialog open={profileDialogOpen} onOpenChange={setProfileDialogOpen} user={user} />
      )}
      <PasswordResetDialog open={passwordResetDialogOpen} onOpenChange={setPasswordResetDialogOpen} />
      {/* Cart Popup (Gucci-style) */}
      <CartPopup
        open={cartPopupOpen}
        onClose={() => setCartPopupOpen(false)}
        onViewCart={() => {
          setCartPopupOpen(false);
          navigate('/cart');
        }}
      />
      <CartDrawer />
    </>
  );
};
