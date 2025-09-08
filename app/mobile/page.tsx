"use client";
import { useEffect } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import RetroGeometry to avoid SSR issues
const RetroGeometry = dynamic(() => import("@/components/RetroGeometry"), { ssr: false });

export default function MobilePage() {
  console.log('Mobile page rendering...');
  
  // Set metadata immediately on render to prevent flash
  useEffect(() => {
    document.title = 'FUTURE - Mobile Coming Soon';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'FUTURE mobile version coming soon. Visit us on desktop for the full experience.');
    }
    
    // Force hide any other content that might be interfering
    const app = document.getElementById('app');
    if (app) {
      app.style.display = 'block';
      app.style.visibility = 'visible';
      app.style.opacity = '1';
      app.style.backgroundColor = '#000000';
    }
    
    // Hide any other potential interfering elements
    const body = document.body;
    if (body) {
      body.style.overflow = 'auto';
      body.style.position = 'static';
      body.style.backgroundColor = '#000000';
    }
  }, []);
  
  return (
    <>
      {/* Geometry background */}
      <div className="fixed inset-0 z-0">
        <RetroGeometry isSlow={false} isOracleOpen={false} isScopeOpen={false} />
      </div>
      
      {/* Immediate black background with text to prevent any flash */}
      <div 
        style={{ 
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'transparent',
          zIndex: 10000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          fontFamily: 'VT323, monospace',
          fontSize: '18px',
          textAlign: 'center',
          padding: '20px'
        }}
      >
        <div>
          <div style={{ fontSize: '24px', marginBottom: '10px', color: '#ffffff' }}>FUTURE</div>
          <div>FUTURE is currently only available on desktop. Our mobile version is under construction and will be released soon.</div>
        </div>
      </div>
      
      <div 
        className="min-h-screen flex items-center justify-center p-6" 
        style={{ 
          backgroundColor: 'transparent', 
          minHeight: '100vh',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
      <div className="max-w-md mx-auto text-center" style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)', padding: '2rem', borderRadius: '1rem', backdropFilter: 'blur(10px)' }}>
        {/* Debug indicator */}
        <div className="mb-4 p-2 bg-red-500 text-white text-xs">
          MOBILE PAGE LOADED - FIXED POSITION
        </div>
        
        {/* Logo */}
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-cyan-400 to-purple-600 rounded-full flex items-center justify-center mb-4">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
        </div>

        {/* Main Message */}
        <h1 className="text-3xl font-bold text-white mb-4" style={{ color: '#ffffff' }}>
          FUTURE
        </h1>
        
        <p className="text-gray-300 text-lg mb-6 leading-relaxed" style={{ color: '#d1d5db' }}>
          FUTURE is currently only available on desktop. Our mobile version is under construction and will be released soon.
        </p>

        {/* Features Card */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-8" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <div className="flex items-center justify-center mb-4">
            <div className="w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center mr-3">
              <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-white">Mobile Version</h2>
          </div>
          <p className="text-white text-lg font-medium mb-4">
            Under Construction
          </p>
          
          <div className="space-y-3 text-left">
            <div className="flex items-center text-gray-300">
              <svg className="w-5 h-5 mr-3 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm">Advanced trading interface</span>
            </div>
            <div className="flex items-center text-gray-300">
              <svg className="w-5 h-5 mr-3 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm">AI-powered market analysis</span>
            </div>
            <div className="flex items-center text-gray-300">
              <svg className="w-5 h-5 mr-3 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm">Real-time Solana data</span>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="space-y-4">
          <button 
            onClick={() => {
              const url = window.location.origin;
              navigator.clipboard.writeText(url).then(() => {
                alert('Link copied! Open on desktop to access FUTURE.');
              }).catch(() => {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = url;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                alert('Link copied! Open on desktop to access FUTURE.');
              });
            }}
            className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105"
          >
            Open on Desktop
          </button>
          
          <div className="flex justify-center space-x-6 text-sm">
            <a 
              href="https://twitter.com/yourhandle" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-white hover:text-gray-300 transition-colors duration-200"
            >
              Follow
            </a>
            <a 
              href="mailto:contact@yourdomain.com" 
              className="text-white hover:text-gray-300 transition-colors duration-200"
            >
              Contact
            </a>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}
