import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CollectionsPage from './pages/CollectionsPage'; 
import CollectionDetailPage from './pages/CollectionDetailPage';
import NewArrivalsPage from './pages/NewArrivalsPage';
import DesignersPage from './pages/DesignersPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import SearchResultsPage from './pages/SearchResultsPage';

const queryClient = new QueryClient();

const App = () => {
  console.log('Rendering App component');
  
  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
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
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </CartProvider>
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
