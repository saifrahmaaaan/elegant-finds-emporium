import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import Index from "./pages/Index";
import NotFound from './pages/NotFound';
import MyProfilePage from './pages/MyProfilePage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import WishlistPage from './pages/WishlistPage';
import CollectionsPage from './pages/CollectionsPage'; 
import CollectionDetailPage from './pages/CollectionDetailPage';
import NewArrivalsPage from './pages/NewArrivalsPage';
import DesignersPage from './pages/DesignersPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import SearchResultsPage from './pages/SearchResultsPage';
import AboutUsPage from './pages/AboutUsPage';
import SalePage from './pages/SalePage';
import HelpCenterPage from './pages/HelpCenterPage';
import ReturnsPage from './pages/ReturnsPage';
import ShippingInfoPage from './pages/ShippingInfoPage';
import ContactPage from './pages/ContactPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsPage from './pages/TermsPage';

const queryClient = new QueryClient();

const App = () => {
  console.log('Rendering App component');
  
  return (
    <QueryClientProvider client={queryClient}>
      <WishlistProvider>
        <CartProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/about-us" element={<AboutUsPage />} />
                <Route path="/sale" element={<SalePage />} />
                <Route path="/help-center" element={<HelpCenterPage />} />
                <Route path="/returns" element={<ReturnsPage />} />
                <Route path="/shipping" element={<ShippingInfoPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/privacy" element={<PrivacyPolicyPage />} />
                <Route path="/terms" element={<TermsPage />} />
                <Route path="/collections" element={<CollectionsPage />} />
                <Route 
                  path="/collections/:handle" 
                  element={
                    <ErrorBoundary>
                      <CollectionDetailPage />
                    </ErrorBoundary>
                  }
                />
                <Route path="/products/:handle" element={<ProductDetailsPage />} />
                <Route path="/new-arrivals" element={<NewArrivalsPage />} />
                <Route path="/designers" element={<DesignersPage />} />
                <Route path="/search" element={<SearchResultsPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="/my-profile" element={<MyProfilePage />} />
                <Route path="/wishlist" element={<WishlistPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </CartProvider>
      </WishlistProvider>
    </QueryClientProvider>
  );
};

function ErrorBoundary({ children }: { children: React.ReactNode }) {
  const [hasError, setHasError] = React.useState(false);

  React.useEffect(() => {
    const errorHandler = (error: ErrorEvent) => {
      console.error('Error caught by boundary:', error);
      setHasError(true);
    };
    
    window.addEventListener('error', errorHandler);
    return () => window.removeEventListener('error', errorHandler);
  }, []);

  if (hasError) {
    return <div className="p-4 text-red-500">Something went wrong</div>;
  }

  return <>{children}</>;
}

export default App;
