import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { Button } from '@/components/ui/button';

interface SearchPopupProps {
  open: boolean;
  onClose: () => void;
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  trending?: string[];
  collections?: Array<{ id: string; handle: string; title: string }>;
  loadingCollections?: boolean;
}

export const SearchPopup: React.FC<SearchPopupProps> = ({
  open,
  onClose,
  searchTerm,
  setSearchTerm,
  onSubmit,
  trending = [],
  collections = [],
  loadingCollections = false,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  if (!open) return null;

  // Outside click backdrop
  const backdrop = (
    <div
      className="fixed inset-0 z-[9999] bg-transparent"
      onClick={onClose}
      aria-label="Close Search Popup Backdrop"
    />
  );

  const popup = (
    <div
      className="ef-search-popup fixed z-[10000] bg-white shadow-2xl border border-gray-200 animate-fade-in duration-150 flex flex-col rounded-none w-full max-w-[calc(100vw-1rem)] mx-auto left-0 right-0 mt-4 sm:rounded-none sm:w-full sm:max-w-xl sm:mx-0 sm:top-6 sm:right-6 sm:left-auto sm:mt-0 p-4"
      style={{
        top: '1.5rem',
        overflow: 'visible',
        minWidth: 0,
      }}
      onClick={e => e.stopPropagation()}>
      <form onSubmit={onSubmit} className="flex items-center gap-4 mb-4">
        <input
          ref={inputRef}
          type="text"
          placeholder="What are you looking for?"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full pl-2 pr-3 py-3 text-lg bg-background border-0 border-b border-black rounded-none shadow-none focus:outline-none focus:ring-0 focus:border-black font-garamond placeholder:text-muted-foreground"
        />
        <button 
          type="button" 
          onClick={onClose} 
          className="relative text-foreground hover:text-foreground ml-2 px-2 py-1 group"
        >
          <span className="relative">
            Cancel
            <span className="absolute bottom-0 left-0 w-0 h-px bg-black transition-all duration-300 group-hover:w-full"></span>
          </span>
        </button>
      </form>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="font-semibold text-gray-700 mb-2 tracking-wide text-base uppercase">Trending Searches</div>
          <ul className="space-y-2 text-base">
            {trending.length > 0 ? trending.map((term, idx) => (
              <li key={term + idx}>
                <a 
                  href={`/search?q=${encodeURIComponent(term)}`} 
                  className="relative flex items-center gap-2 group text-foreground hover:text-foreground"
                >
                  <span className="inline-block w-4 h-4 rounded-full border border-gold mr-2" />
                  <span className="relative">
                    {term}
                    <span className="absolute bottom-0 left-0 w-0 h-px bg-black transition-all duration-300 group-hover:w-full"></span>
                  </span>
                </a>
              </li>
            )) : (
              <li className="text-gray-400">No trending searches</li>
            )}
          </ul>
        </div>
        <div>
          <div className="font-semibold text-gray-700 mb-2 tracking-wide text-base uppercase">Find Your Perfect Style</div>
          <ul className="space-y-2 text-base">
            {loadingCollections ? (
              <li className="text-gray-400">Loading collections...</li>
            ) : (
              collections.length > 0 ? collections.map(col => (
                <li key={col.id}>
                  <a 
                    href={`/collections/${col.handle}`} 
                    className="relative group text-foreground hover:text-foreground"
                  >
                    {col.title}
                    <span className="absolute bottom-0 left-0 w-0 h-px bg-black transition-all duration-300 group-hover:w-full"></span>
                  </a>
                </li>
              )) : <li className="text-gray-400">No collections</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(<>{backdrop}{popup}</>, document.body);
};
