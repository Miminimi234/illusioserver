"use client";
import { useEffect } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the EXACT same components as main page
const RetroGeometry = dynamic(() => import("@/components/RetroGeometry"), { ssr: false });
const BackgroundVideo = dynamic(() => import("@/components/BackgroundVideo"), { ssr: false });

export default function MobilePage() {
  useEffect(() => {
    document.title = 'FUTURE - Mobile Coming Soon';
  }, []);

  return (
    <div className="fixed inset-0 overflow-visible" style={{ cursor: 'none' }}>
      {/* EXACT same background as main page - NO VIDEO */}
      <RetroGeometry isSlow={false} isOracleOpen={false} isScopeOpen={false} />
      
      {/* Content overlay */}
      <div className="absolute inset-0 flex items-center justify-center p-6" style={{ zIndex: 100, cursor: 'none' }}>
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