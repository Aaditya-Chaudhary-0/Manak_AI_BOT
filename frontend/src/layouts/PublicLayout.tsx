import React from 'react';
import Header from '../components/navigation/Header';
import Footer from '../components/Footer';

function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-white text-black">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}

export default PublicLayout;
