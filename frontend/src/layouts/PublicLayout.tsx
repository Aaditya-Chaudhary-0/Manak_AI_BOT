import React from 'react';
import Header from '../components/navigation/Header';
import Footer from '../components/Footer';

function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen w-full min-w-full bg-[#F7F8FA] text-gray-900">
      <Header />
      <main className="flex-1 w-full">
        {children}
      </main>
      <Footer />
    </div>
  );
}

export default PublicLayout;
