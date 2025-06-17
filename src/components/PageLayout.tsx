import React from 'react';
import { Header } from '@/components/Header';
import Footer from '@/components/Footer';

type PageLayoutProps = {
  title: string;
  children: React.ReactNode;
};

const PageLayout: React.FC<PageLayoutProps> = ({ title, children }) => {
  return (
    <>
      <Header />
      <main className="container py-12 px-4 min-h-[60vh] font-sans">
        <h1 className="text-3xl font-bold mb-8">{title}</h1>
        <div className="max-w-3xl mx-auto">
          {children}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default PageLayout;
