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
    <div className="fixed top-6 right-6 z-[10000] bg-white shadow-2xl rounded-xl w-full max-w-xl border border-gray-200 animate-fade-in flex flex-col p-8" style={{ overflow: 'visible' }} onClick={e => e.stopPropagation()}>
      <form onSubmit={onSubmit} className="flex items-center gap-4 mb-4">
        <input
          ref={inputRef}
          type="text"
          placeholder="What are you looking for?"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full pl-2 pr-4 py-4 text-lg bg-background border border-border rounded-lg shadow-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent font-garamond placeholder:text-muted-foreground"
        />
        <Button type="button" variant="ghost" size="sm" onClick={onClose} className="ml-2">Cancel</Button>
      </form>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="font-semibold text-gray-700 mb-2 tracking-wide text-base uppercase">Trending Searches</div>
          <ul className="space-y-2 text-base">
            {trending.length > 0 ? trending.map((term, idx) => (
              <li key={term + idx}>
                <a href={`/search?q=${encodeURIComponent(term)}`} className="hover:underline flex items-center gap-2">
                  <span className="inline-block w-4 h-4 rounded-full border border-gold mr-2" />{term}
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
                  <a href={`/collections/${col.handle}`} className="hover:underline">{col.title}</a>
                </li>
              )) : <li className="text-gray-400">No collections</li>
            )}
          </ul>
        </div>
      </div>
      <button onClick={onClose} aria-label="Close" className="absolute top-4 right-4 text-gray-500 hover:text-black text-xl">×</button>
    </div>
  );

  return ReactDOM.createPortal(<>{backdrop}{popup}</>, document.body);
};
