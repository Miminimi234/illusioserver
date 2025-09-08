"use client";
import { useEffect } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import RetroGeometry to avoid SSR issues
const RetroGeometry = dynamic(() => import("@/components/RetroGeometry"), { ssr: false });

export default function MobilePage() {
  useEffect(() => {
    document.title = 'FUTURE - Mobile Coming Soon';
  }, []);

  return (
    <div className="fixed inset-0 bg-black overflow-hidden">
      {/* Geometry background */}
      <div className="absolute inset-0 z-0">
        <RetroGeometry isSlow={false} isOracleOpen={false} isScopeOpen={false} />
      </div>
      
      {/* Content overlay */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-6">
        <div className="text-center max-w-sm mx-auto">
          {/* Main message */}
          <h1 className="text-2xl font-bold text-white mb-4 font-mono">
            FUTURE
          </h1>
          
          <p className="text-gray-300 text-base mb-8 leading-relaxed">
            Mobile version under construction. Please visit us on desktop for the full experience.
          </p>

          {/* Desktop button */}
          <button 
            onClick={() => {
              const url = window.location.origin;
              navigator.clipboard.writeText(url).then(() => {
                alert('Link copied! Open on desktop to access FUTURE.');
              }).catch(() => {
                const textArea = document.createElement('textarea');
                textArea.value = url;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                alert('Link copied! Open on desktop to access FUTURE.');
              });
            }}
            className="w-full bg-white text-black font-semibold py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors duration-200"
          >
            Open on Desktop
          </button>
        </div>
      </div>
    </div>
  );
}