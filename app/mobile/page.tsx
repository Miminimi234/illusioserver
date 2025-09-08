"use client";
import { useEffect } from 'react';

export default function MobilePage() {
  useEffect(() => {
    document.title = 'FUTURE - Mobile Coming Soon';
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden">
      {/* CSS-based geometric background */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(circle at 20% 20%, rgba(0, 255, 255, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255, 0, 255, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 20% 80%, rgba(255, 255, 0, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(0, 255, 0, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, rgba(255, 0, 0, 0.1) 0%, transparent 50%),
            linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.05) 50%, transparent 70%),
            linear-gradient(-45deg, transparent 30%, rgba(255, 255, 255, 0.05) 50%, transparent 70%)
          `,
          backgroundSize: '100% 100%, 100% 100%, 100% 100%, 100% 100%, 100% 100%, 200px 200px, 200px 200px',
          animation: 'geometricPulse 4s ease-in-out infinite alternate'
        }}
      />
      
      {/* Animated geometric lines */}
      <div className="absolute inset-0">
        <div 
          className="absolute top-1/4 left-1/4 w-32 h-32 border border-cyan-400/30 rounded-full animate-spin"
          style={{ animationDuration: '20s' }}
        />
        <div 
          className="absolute top-1/4 right-1/4 w-24 h-24 border border-purple-400/30 rounded-full animate-spin"
          style={{ animationDuration: '15s', animationDirection: 'reverse' }}
        />
        <div 
          className="absolute bottom-1/4 left-1/4 w-28 h-28 border border-yellow-400/30 rounded-full animate-spin"
          style={{ animationDuration: '25s' }}
        />
        <div 
          className="absolute bottom-1/4 right-1/4 w-20 h-20 border border-green-400/30 rounded-full animate-spin"
          style={{ animationDuration: '18s', animationDirection: 'reverse' }}
        />
        <div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 border border-white/20 rounded-full animate-pulse"
        />
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
      
      {/* Add CSS animation */}
      <style jsx>{`
        @keyframes geometricPulse {
          0% { opacity: 0.3; }
          100% { opacity: 0.7; }
        }
      `}</style>
    </div>
  );
}