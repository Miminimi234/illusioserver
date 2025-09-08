"use client";
import { useEffect } from 'react';
import dynamic from 'next/dynamic';

// EXACT same imports as main page
const RetroGeometry = dynamic(() => import("@/components/RetroGeometry"), { ssr: false });
const BackgroundVideo = dynamic(() => import("@/components/BackgroundVideo"), { ssr: false });

export default function MobilePage() {
  useEffect(() => {
    document.title = 'FUTURE - Mobile Coming Soon';
    console.log('Mobile page loaded');
    
    // Force zoom out effect on mobile by clearing the session storage
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('geometryHasZoomed');
      // Set a custom mobile zoom level to start even smaller
      sessionStorage.setItem('mobileZoomStart', '0.1');
    }
  }, []);

  return (
    <main className="fixed inset-0 overflow-hidden" style={{ 
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      overflow: 'hidden',
      touchAction: 'none',
      userSelect: 'none',
      pointerEvents: 'none'
    }}>
      {/* EXACT same background components as main page */}
      <RetroGeometry key="mobile-geometry" isSlow={false} isOracleOpen={false} isScopeOpen={false} />
      <BackgroundVideo key="mobile-video" isOracleOpen={false} />
      
      {/* Content overlay */}
      <div className="absolute inset-0 flex items-center justify-center p-6" style={{ 
        zIndex: 100,
        pointerEvents: 'none',
        userSelect: 'none'
      }}>
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
    </main>
  );
}