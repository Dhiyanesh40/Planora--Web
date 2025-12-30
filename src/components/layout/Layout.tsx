import { ReactNode } from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

interface LayoutProps {
  children: ReactNode;
  showNavbar?: boolean;
}

export const Layout = ({ children, showNavbar = true }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {showNavbar && <Navbar />}
      <main className={`flex-1 ${showNavbar ? 'pt-16' : ''}`}>
        {children}
      </main>
      <Footer />
    </div>
  );
};
