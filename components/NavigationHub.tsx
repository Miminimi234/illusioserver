"use client";
import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import QuantumEraserSketch from "./QuantumEraserSketch";
import SolanaTransactions from "./SolanaTransactions";

interface NavigationHubProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = 'trades' | 'holders' | 'liquidity' | 'events';

export default function NavigationHub({ isOpen, onClose }: NavigationHubProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('trades');
  const [showHelp, setShowHelp] = useState(false);
  const [showLegend, setShowLegend] = useState(false);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [predictionData, setPredictionData] = useState({
    confidence: 0.75,
    expectedRange: { min: 5, max: 15 },
    upProbability: 0.6,
    downProbability: 0.4
  });
  
  const searchInputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // ESC key handler
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        if (showHelp) {
          setShowHelp(false);
        } else {
          onClose();
        }
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
      return () => document.removeEventListener('keydown', handleEscKey);
    }
  }, [isOpen, onClose, showHelp]);

  // Focus search input when hub opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    // Debounce search
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    debounceRef.current = setTimeout(() => {
      if (value.trim()) {
        setIsAnalyzing(true);
        // Simulate analysis
        setTimeout(() => {
          setIsAnalyzing(false);
          // Update prediction data based on search
          setPredictionData({
            confidence: 0.6 + Math.random() * 0.3,
            expectedRange: { min: 3 + Math.random() * 10, max: 10 + Math.random() * 20 },
            upProbability: 0.3 + Math.random() * 0.4,
            downProbability: 0.3 + Math.random() * 0.4
          });
        }, 1500);
      }
    }, 400);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsAnalyzing(true);
      // Trigger analysis
    }
  };

  const copyToClipboard = () => {
    if (searchQuery) {
      navigator.clipboard.writeText(searchQuery);
    }
  };

  const tabs = [
    { id: 'trades' as TabType, label: 'Trades', count: 42 },
    { id: 'holders' as TabType, label: 'Holders', count: 128 },
    { id: 'liquidity' as TabType, label: 'Liquidity', count: 8 },
    { id: 'events' as TabType, label: 'Events', count: 15 }
  ];

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            className="fixed inset-0 bg-black/50 z-[40] cursor-default"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onClick={onClose}
          />
          
          {/* Navigation Hub */}
          <motion.div 
            className="fixed inset-0 z-[50] overflow-visible flex flex-col cursor-default"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ 
              duration: 0.4, 
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
            style={{
              background: 'radial-gradient(circle at center bottom, #000000, #111111)',
            }}
          >
        {/* Top Bar */}
        <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-sm border-b border-white/10 px-4 lg:px-6 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Left: Title */}
            <div className="flex items-center justify-between lg:justify-start gap-3">
              <div className="flex items-center gap-3">
                <h1 className="text-lg lg:text-xl font-bold text-white tracking-wider">RETROCAUSALITY LAB</h1>
                <span className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full border border-blue-500/30">
                  BETA
                </span>
              </div>
              
              {/* Mobile Actions */}
              <div className="flex items-center gap-2 lg:hidden">
                <button
                  onClick={() => setShowHelp(true)}
                  className="p-2 text-white/70 hover:text-white border border-white/20 rounded hover:border-white/40 cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
                <button
                  onClick={onClose}
                  className="p-2 text-white/70 hover:text-white cursor-pointer"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Center: Search */}
            <div className="flex-1 max-w-md lg:mx-8">
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Paste token name or CA..."
                  className="w-full px-4 py-2 bg-black/50 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400/50"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={copyToClipboard}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                )}
              </form>
              {isAnalyzing && (
                <div className="absolute top-full left-0 right-0 mt-1 px-3 py-1 bg-blue-500/20 text-blue-300 text-xs rounded border border-blue-500/30">
                  Analyzing...
                </div>
              )}
            </div>

            {/* Right: Actions (Desktop) */}
            <div className="hidden lg:flex items-center gap-3">
              <button
                onClick={() => setShowLegend(!showLegend)}
                className="px-3 py-1 text-sm text-white/70 hover:text-white border border-white/20 rounded hover:border-white/40 cursor-pointer"
              >
                Legend
              </button>
              <button
                onClick={() => setShowHelp(true)}
                className="p-2 text-white/70 hover:text-white border border-white/20 rounded hover:border-white/40 cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
              <button
                onClick={onClose}
                className="p-2 text-white/70 hover:text-white cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Metrics Bands */}
        <div className="px-4 lg:px-6 py-4 border-b border-white/10 bg-black/20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {/* Insights */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-white tracking-wider">MARKET INSIGHTS</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                  <div className="text-xs text-green-300/80 mb-1">Market Cap</div>
                  <div className="text-lg font-bold text-green-300">$2.4M</div>
                </div>
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                  <div className="text-xs text-blue-300/80 mb-1">Liquidity</div>
                  <div className="text-lg font-bold text-blue-300">$180K</div>
                </div>
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3">
                  <div className="text-xs text-purple-300/80 mb-1">24h Volume</div>
                  <div className="text-lg font-bold text-purple-300">$45K</div>
                </div>
                <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-3">
                  <div className="text-xs text-orange-300/80 mb-1">Holders</div>
                  <div className="text-lg font-bold text-orange-300">128</div>
                </div>
              </div>
            </div>

            {/* Forecast */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-white tracking-wider">QUANTUM FORECAST</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-3">
                  <div className="text-xs text-cyan-300/80 mb-1">10m Prediction</div>
                  <div className="text-lg font-bold text-cyan-300">+2.3%</div>
                </div>
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-3">
                  <div className="text-xs text-cyan-300/80 mb-1">1h Prediction</div>
                  <div className="text-lg font-bold text-cyan-300">+5.7%</div>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                  <div className="text-xs text-yellow-300/80 mb-1">Expected Range</div>
                  <div className="text-lg font-bold text-yellow-300">±8%</div>
                </div>
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                  <div className="text-xs text-green-300/80 mb-1">Up Probability</div>
                  <div className="text-lg font-bold text-green-300">60%</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row h-[calc(100vh-200px)]">
          {/* Left: Quantum Field (58% on desktop, 65% on tablet, full width on mobile) */}
          <div className="w-full lg:w-[58%] xl:w-[58%] 2xl:w-[58%] md:w-[65%] h-1/2 lg:h-full relative">
            <QuantumEraserSketch 
              onNodeHover={setHoveredNode}
              predictionData={predictionData}
            />
            
            {/* Legend Overlay */}
            {showLegend && (
              <div className="absolute top-4 right-4 bg-black/95 border border-white/30 rounded-lg p-5 text-white text-sm max-w-sm shadow-xl">
                <h4 className="font-bold mb-4 text-blue-300 text-base">QUANTUM FIELD LEGEND</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-red-500 rounded-full border border-white/20"></div>
                    <div>
                      <div className="font-semibold text-red-300">LASER</div>
                      <div className="text-xs text-white/70">Quantum light source</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-blue-500 rounded-full border border-white/20"></div>
                    <div>
                      <div className="font-semibold text-blue-300">BBO</div>
                      <div className="text-xs text-white/70">Entanglement crystal</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-cyan-500 rounded-full border border-white/20 transform rotate-45"></div>
                    <div>
                      <div className="font-semibold text-cyan-300">BS (Beam Splitters)</div>
                      <div className="text-xs text-white/70">Split quantum signals</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-green-500 border border-white/20 transform rotate-45"></div>
                    <div>
                      <div className="font-semibold text-green-300">M (Mirrors)</div>
                      <div className="text-xs text-white/70">Reflect quantum info</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-white rounded-full border border-white/20"></div>
                    <div>
                      <div className="font-semibold text-white">D (Detectors)</div>
                      <div className="text-xs text-white/70">Measure quantum states</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-blue-400 rounded-full border border-white/20"></div>
                    <div>
                      <div className="font-semibold text-blue-300">PREDICTION ENGINE</div>
                      <div className="text-xs text-white/70">Analyzes all data</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="hidden lg:block w-px bg-white/10"></div>
          <div className="lg:hidden w-full h-px bg-white/10"></div>

          {/* Right: Stream Panel (42% on desktop, 35% on tablet, full width on mobile) */}
          <div className="w-full lg:w-[42%] xl:w-[42%] 2xl:w-[42%] md:w-[35%] h-1/2 lg:h-full flex flex-col">
            {/* Tabs */}
            <div className="flex border-b border-white/10">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-3 text-sm font-medium relative cursor-pointer ${
                    activeTab === tab.id
                      ? 'text-white border-b-2 border-blue-400'
                      : 'text-white/60 hover:text-white/80'
                  }`}
                >
                  {tab.label}
                  <span className="ml-2 px-1.5 py-0.5 bg-white/10 text-xs rounded">
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-auto">
              {activeTab === 'trades' && <SolanaTransactions />}
              {activeTab === 'holders' && (
                <div className="p-6 text-center text-white/60">
                  <div className="text-4xl mb-2">👥</div>
                  <div>Holders data coming soon</div>
                </div>
              )}
              {activeTab === 'liquidity' && (
                <div className="p-6 text-center text-white/60">
                  <div className="text-4xl mb-2">💧</div>
                  <div>Liquidity data coming soon</div>
                </div>
              )}
              {activeTab === 'events' && (
                <div className="p-6 text-center text-white/60">
                  <div className="text-4xl mb-2">📊</div>
                  <div>Events data coming soon</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Help Modal */}
        {showHelp && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowHelp(false)} />
          <div className="relative bg-black/90 border border-white/20 rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Help</h2>
              <button
                onClick={() => setShowHelp(false)}
                className="text-white/70 hover:text-white"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-6 text-white/80">
              <div>
                <h3 className="font-semibold text-white mb-2">What you're seeing</h3>
                <p className="text-sm">Quantum Field is a visual sandbox of token impact points (decoders D1–D4, base states BS*, momentum vectors Ma/Mb, and the Prediction Engine). Shapes glow when new signal arrives.</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-white mb-2">How to use</h3>
                <p className="text-sm">Paste CA or search name → press Enter → watch metrics & stream.</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-white mb-2">What the metrics mean</h3>
                <p className="text-sm">Forecast: Short-term price path with confidence and expected range. Not financial advice.</p>
                <p className="text-sm">Future-Echo Δ: A retrocausal heuristic—how future paths echo into present order flow.</p>
                <p className="text-sm">Stream: Real-time trades/holders/liquidity/events. Filter via tabs.</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-white mb-2">Limits</h3>
                <p className="text-sm">Market data can be delayed or rate-limited; we cache and retry automatically.</p>
              </div>
            </div>
          </div>
        </div>
        )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}