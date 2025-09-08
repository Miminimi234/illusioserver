"use client";
import { useEffect } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import LogoGeometry for mobile - simpler geometry
const LogoGeometry = dynamic(() => import("@/components/LogoGeometry"), { ssr: false });

export default function MobilePage() {
  useEffect(() => {
    document.title = 'FUTURE - Mobile Coming Soon';
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden">
      {/* Geometry background - multiple LogoGeometry components for full coverage */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4">
          <LogoGeometry />
        </div>
        <div className="absolute top-1/4 right-1/4">
          <LogoGeometry />
        </div>
        <div className="absolute bottom-1/4 left-1/4">
          <LogoGeometry />
        </div>
        <div className="absolute bottom-1/4 right-1/4">
          <LogoGeometry />
        </div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <LogoGeometry />
        </div>
      </div>
      
      {/* Content overlay */}
      <div className="absolute inset-0 flex items-center justify-center p-6" style={{ zIndex: 100 }}>
        <div className="text-center max-w-sm mx-auto">
          {/* Main message */}
          <h1 className="text-2xl font-bold text-white mb-4 font-mono">
            FUTURE
          </h1>
          
          <p className="text-gray-300 text-base leading-relaxed">
            Mobile version under construction. Please visit us on desktop for the full experience.
          </p>
        </div>
      </div>
    </div>
  );
}