import React from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';

const AboutLayout = ({ children, hero }) => {
  return (
    <div className="min-h-screen bg-white flex flex-col relative overflow-hidden">
      <Navbar />

      {/* Optional Hero Section (Full Width) */}
      {hero}

      {/* Content Area */}
      <main className="flex-1 relative z-10">
        {children}
      </main>

      <Footer />
    </div>
  );
};

export default AboutLayout;
