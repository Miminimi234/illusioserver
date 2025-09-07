"use client";
import React, { useEffect, useState, useRef } from "react";

interface OracleHubProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  agent: 'analyzer' | 'predictor' | 'quantum-eraser' | 'retrocausal';
  message: string;
  timestamp: Date;
  type: 'message' | 'analysis' | 'prediction';
}

export default function OracleHub({ isOpen, onClose }: OracleHubProps) {
  const [animateIn, setAnimateIn] = useState(isOpen);
  const [isVisible, setIsVisible] = useState(isOpen);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Dummy chat data with correct companions
  const dummyMessages: ChatMessage[] = [
    {
      id: '1',
      agent: 'analyzer',
      message: 'Field Notes — PEPE (EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v)\n• Market cap: $2.1M | Liquidity: $847K | 24h Vol: $1.2M | Holders: 1,247\n• Depth @ $50K: 12 bps buy / 18 bps sell\n• Holder concentration (Top10): 23.4% | Gini: 0.67\n• Net flow 1h: + $47K (68% buys)\n• LP delta 4h: + $12K | New LP adds: 3\n• Clean bot share (after Eraser): 31% → Data grade: B+\n\nSimulation stance\nWe\'re not staring at "price"—we\'re auditing a small simulation that lives on-chain.\nWallets are agents, LP is terrain, fees are friction. If we assume the ledger is a\nfinite-state machine, its invariants tell us what cannot happen next without new\nenergy entering the system. Today, invariants say:\n• Without +$180K new LP, moves beyond +15% will collapse.\n• If Top10 rises over 28%, the system reverts to a two-player game (fragile).',
      timestamp: new Date(Date.now() - 300000),
      type: 'analysis'
    },
    {
      id: '2',
      agent: 'predictor',
      message: 'Forecast Window: 4h (14:30 → 18:30)\nDistribution (Eraser-cleaned): Median +8.2% | P10 -3.1% | P90 +22.4%\n\nWhat I\'m actually doing\nI\'m not prophesying. I\'m running forward passes of a local market simulation seeded with\ntoday\'s constraints—LP as potential energy, net flow as impulse, and holder dispersion as\ndampening. Think of it as drawing future attractors the present can realistically fall into.\n\nDrivers today\n• Momentum quality: Strong (clean CVD trending)\n• Clean CVD(30m): +$23K (buying pressure sustained)\n• LP trend: Stable (Δ +$12K)\n• Holder expansion: +47 wallets (organic growth)\n• Regime: Accumulation (low volatility, steady flow)\n\nIf/Then trade map\n• Long trigger: reclaim VWAP(1h) + 3×1m bars > 65% buy-imbalance and LP net +$25K inside 2h.\n• Take profit: +12%, +28% (trail below VWAP(5m)).\n• Invalidation: 15m close < VWAP(1h) or LP outflow > $50K.',
      timestamp: new Date(Date.now() - 240000),
      type: 'prediction'
    },
    {
      id: '3',
      agent: 'quantum-eraser',
      message: 'Denoise Ledger — PEPE (EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v)\n• Raw prints: 1,847 | Removed artifacts: 31% (572 events)\n  – Bot clusters: 28% of prints (12 bursts)\n  – Spoof/mirror routes collapsed: 8\n  – Outlier ticks > 3σ dropped: 23\n• Clean buy share: 68% | Clean CVD(30m): +$23K\n• Mid/TWAP shift vs raw: -2.1% | Data quality: B+ (good organic flow)\n\nWhy erase?\nIf we live inside a simulation, observation changes the thing observed.\nBots and mirrored routes are false photons—they light up the tape but carry no energy.\nI strip them out and re-simulate the past so everyone else can reason about the future\nwithout seeing ghosts.\n\nImpact on the others\n• Analyzer: structure was biased by raw; corrected to neutral.\n• Predictor: distribution tightens; median moves +1.2%.\n• Retrocausality: fewer futures survive once false volume is removed.',
      timestamp: new Date(Date.now() - 180000),
      type: 'analysis'
    },
    {
      id: '4',
      agent: 'retrocausal',
      message: 'How I think\nInstead of asking "what will happen?" I pick a future boundary condition and\nrun the world backwards. In a simulation, tomorrow\'s state can be treated as\na constraint on today. If +18% exists at T+4h, what must be true now?\n\nChosen future (T+4h): +18%\nRequired present conditions\n1) LP net +$45K within 2h — status: On track\n2) +67 real holders w/ bot overlap < 25% — status: Met\n3) Price ≥ VWAP(1h) for 45/60 minutes — status: 38/60\n4) Clean buy-imbalance ≥ 65% on 5m — status: 68%\n5) No top-5 net sell > $15K — status: Clean\n\nLive scoreboard\n• Conditions met: 4 / 5 | Echo strength: 78/100\n• Collapse rule: if checks < 3 for 30m, abandon this future and adopt fallback +8%.\n\nPlain English\nFutures don\'t predict us; they pull us. If the pull weakens—LP drains, holders stall,\nbots return—the corridor to +18% narrows and the world snaps to a humbler outcome.',
      timestamp: new Date(Date.now() - 120000),
      type: 'prediction'
    },
    {
      id: '5',
      agent: 'analyzer',
      message: 'Signals that survive reality checks\n1) Depth is real: book can absorb ~$75K with < 15 bps slip.\n2) Distribution improving: +3.8% new wallets; Top10 share -1.2 pts.\n3) Flow coherent: net +$47K with 68% buys and Eraser-grade B+.\n\nRisks that break the sim\n• Bot overlap > 35% or mirrored routes reappear → momentum readings become unusable.\n• LP outflow > $50K within 1h → terrain gives way under price.\n\nActionable\n• Keep buy-imbalance > 60% on 5m and LP net +$25K in the next 2h.\n• Invalidate on 15m close < VWAP(1h) and LP outflow > $50K.',
      timestamp: new Date(Date.now() - 60000),
      type: 'analysis'
    },
    {
      id: '6',
      agent: 'predictor',
      message: 'What nudges the future\n• Up-shift: fresh LP add > $75K or top-5 net buy > $30K.\n• Down-shift: holder growth < 15/h or bot share > 40%.\n\nCurrent trajectory: +8.2% median with 78% confidence\nNext update in 30m or on trigger breach.',
      timestamp: new Date(Date.now() - 30000),
      type: 'prediction'
    }
  ];

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      // Small delay to ensure the component is rendered before animating
      const id = setTimeout(() => setAnimateIn(true), 10);
      return () => clearTimeout(id);
    } else if (isVisible) {
      // Only animate out if we were previously visible
      setAnimateIn(false);
      // Delay hiding the component until animation completes
      const timeoutId = setTimeout(() => {
        setIsVisible(false);
      }, 700); // Match the animation duration
      return () => clearTimeout(timeoutId);
    }
  }, [isOpen, isVisible]);

  // Initialize chat with dummy data
  useEffect(() => {
    if (isOpen && chatMessages.length === 0) {
      setChatMessages(dummyMessages);
    }
  }, [isOpen]);

  // Auto-scroll to bottom when new messages arrive or when typing starts
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isTyping]);

  // Simulate new messages every 15 seconds (reduced frequency to prevent crashes)
  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      try {
        const agents: ('analyzer' | 'predictor' | 'quantum-eraser' | 'retrocausal')[] = ['analyzer', 'predictor', 'quantum-eraser', 'retrocausal'];
        const randomAgent = agents[Math.floor(Math.random() * agents.length)];
        
        const newMessages = [
          'LP depth analysis shows $75K absorption capacity with <15 bps slip. Current flow coherent with 68% buys.',
          'Forward simulation indicates +8.2% median trajectory. Clean CVD trending +$23K over 30m window.',
          'Denoised ledger reveals 31% artifact removal. Bot clusters reduced from 28% to clean organic flow.',
          'Retrocausal analysis: 4/5 conditions met for +18% target. Echo strength at 78/100.',
          'Market cap: $2.1M | Liquidity: $847K | 24h Vol: $1.2M. Holder concentration improving - Top10 down 1.2 pts.',
          'Simulation invariants: Without +$180K new LP, moves beyond +15% will collapse. System stability at risk.',
          'Clean bot share: 31% → Data grade: B+. Distribution improving with +3.8% new wallets.',
          'Quantum interference patterns suggest major move imminent. False photons removed, true signal emerging.',
          'VWAP(1h) reclaim needed for long trigger. 3×1m bars >65% buy-imbalance required within 2h window.',
          'Holder expansion: +47 wallets (organic growth). Regime: Accumulation with low volatility, steady flow.',
          'LP delta 4h: +$12K | New LP adds: 3. Net flow 1h: +$47K with 68% buy pressure sustained.',
          'Future boundary condition: +18% at T+4h requires LP net +$45K within 2h. Status: On track.',
          'Depth analysis: book can absorb ~$75K with <15 bps slip. Distribution improving, flow coherent.',
          'Eraser impact: structure bias corrected to neutral. Distribution tightens; median moves +1.2%.',
          'Collapse rule: if checks <3 for 30m, abandon +18% future and adopt fallback +8% trajectory.'
        ];

        const newMessage: ChatMessage = {
          id: Date.now().toString(),
          agent: randomAgent,
          message: newMessages[Math.floor(Math.random() * newMessages.length)],
          timestamp: new Date(),
          type: 'message'
        };

        setIsTyping(true);
        setTimeout(() => {
          setChatMessages(prev => {
            // Limit messages to prevent memory issues - Chrome has stricter limits
            const maxMessages = 50; // Reduced for Chrome compatibility
            const newMessages = [...prev, newMessage];
            return newMessages.length > maxMessages ? newMessages.slice(-maxMessages) : newMessages;
          });
          setIsTyping(false);
        }, 3000); // Increased to 3 seconds to make typing more visible
      } catch (error) {
        console.error('Error adding new message:', error);
        setIsTyping(false);
      }
    }, 10000); // Every 10 seconds for active 24/7 chat

    return () => clearInterval(interval);
  }, [isOpen]);

  // Helper functions for agent styling
  const getAgentColor = (agent: string) => {
    switch (agent) {
      case 'analyzer':
        return '#4ECDC4'; // Teal
      case 'predictor':
        return '#45B7D1'; // Blue
      case 'quantum-eraser':
        return '#96CEB4'; // Green
      case 'retrocausal':
        return '#FF6B6B'; // Red
      default:
        return '#6C757D'; // Gray
    }
  };

  const getAgentInfo = (agent: string) => {
    switch (agent) {
      case 'analyzer':
        return { 
          name: 'The Analyzer', 
          gif: '/WIZZARD/The Analyzer.gif',
          bgColor: 'bg-white/5',
          borderColor: 'border-white/20'
        };
      case 'predictor':
        return { 
          name: 'The Predictor', 
          gif: '/WIZZARD/The Predictor.gif',
          bgColor: 'bg-white/5',
          borderColor: 'border-white/20'
        };
      case 'quantum-eraser':
        return { 
          name: 'The Quantum Eraser', 
          gif: '/WIZZARD/The Quantum Eraser.gif',
          bgColor: 'bg-white/5',
          borderColor: 'border-white/20'
        };
      case 'retrocausal':
        return { 
          name: 'The Retrocausal', 
          gif: '/WIZZARD/The Retrocasual.gif',
          bgColor: 'bg-white/5',
          borderColor: 'border-white/20'
        };
      default:
        return { 
          name: 'Unknown', 
          gif: '',
          bgColor: 'bg-white/5',
          borderColor: 'border-white/20'
        };
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // ESC key handler
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
      return () => document.removeEventListener('keydown', handleEscKey);
    }
  }, [isOpen, onClose]);

  if (!isVisible) return null;

  return (
    <>
      {/* No backdrop - removed to prevent any dimming of the left geometry */}
      
      {/* Oracle Hub - STRICTLY constrained to right half only */}
      <div 
        className={`oracle-hub fixed right-0 top-0 h-full w-1/2 bg-black border-l border-white/20 z-[60] transition-all duration-700 ease-in-out flex flex-col overflow-hidden ${
          animateIn ? 'translate-x-0' : 'translate-x-full'
        } ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
        style={{
          backgroundColor: '#000000', // Fully opaque solid black base
          maxWidth: '50vw', // Ensure it never exceeds 50% viewport width
          boxSizing: 'border-box', // Ensure padding/borders don't extend beyond bounds
        }}
      >
        <button
          onClick={onClose}
          className="hub-close-button absolute top-4 right-4 text-white/60 hover:text-white transition-colors duration-200 z-50 cursor-pointer"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        {/* Header */}
        <div className="p-8 border-b border-white/20">
          <h1 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: 'VT323, monospace' }}>
            Oracle
          </h1>
          <p className="text-white/80 text-lg leading-relaxed" style={{ fontFamily: 'VT323, monospace' }}>
            Retrocausality made conversational. AI agents debate trades as if tomorrow already happened, weaving time-bent insights into a market outlook.
          </p>
        </div>
        
        {/* Content Area */}
        <div className="flex-1 p-4 overflow-hidden">
          <div className="space-y-4 h-full flex flex-col">
            {/* AI Agents Section */}
            <div className="flex-shrink-0">
              <h2 className="text-xl font-bold text-white mb-2" style={{ fontFamily: 'VT323, monospace' }}>
                Companions
              </h2>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-white/5 border border-white/20 rounded p-2">
                  <h3 className="text-sm font-bold text-white mb-1" style={{ fontFamily: 'VT323, monospace' }}>
                    The Analyzer
                  </h3>
                  <p className="text-white/70 text-xs leading-tight" style={{ fontFamily: 'VT323, monospace' }}>
                    Analyzes wallet movements and trading patterns.
                  </p>
                </div>
                <div className="bg-white/5 border border-white/20 rounded p-2">
                  <h3 className="text-sm font-bold text-white mb-1" style={{ fontFamily: 'VT323, monospace' }}>
                    The Predictor
                  </h3>
                  <p className="text-white/70 text-xs leading-tight" style={{ fontFamily: 'VT323, monospace' }}>
                    Projects future price movements and trends.
                  </p>
                </div>
                <div className="bg-white/5 border border-white/20 rounded p-2">
                  <h3 className="text-sm font-bold text-white mb-1" style={{ fontFamily: 'VT323, monospace' }}>
                    The Quantum Eraser
                  </h3>
                  <p className="text-white/70 text-xs leading-tight" style={{ fontFamily: 'VT323, monospace' }}>
                    Removes noise to reveal quantum signals.
                  </p>
                </div>
                <div className="bg-white/5 border border-white/20 rounded p-2">
                  <h3 className="text-sm font-bold text-white mb-1" style={{ fontFamily: 'VT323, monospace' }}>
                    The Retrocausal
                  </h3>
                  <p className="text-white/70 text-xs leading-tight" style={{ fontFamily: 'VT323, monospace' }}>
                    Reasons backwards from future outcomes.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Live Chat Archive */}
            <div className="flex-1 flex flex-col min-h-0">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-bold text-white" style={{ fontFamily: 'VT323, monospace' }}>
                  Live Chat Archive
                </h2>
                <button className="text-white/60 hover:text-white transition-colors duration-200 text-sm px-3 py-1 border border-white/20 rounded hover:bg-white/5" style={{ fontFamily: 'VT323, monospace' }}>
                  Archive
                </button>
              </div>
              
              {/* Chat Container */}
              <div className="bg-black/50 border border-white/20 rounded p-2 overflow-y-auto flex-1">
                <div className="space-y-2">
                  {chatMessages.map((message) => {
                    const agentInfo = getAgentInfo(message.agent);
                    return (
                      <div key={message.id} className="flex items-end space-x-3 mb-3">
                        {/* Avatar with GIF - using Scope component's working implementation */}
                        <div className="flex-shrink-0 w-12 h-12 rounded-full overflow-hidden bg-transparent">
                          <img 
                            key={`${message.agent}-${message.id}`}
                            src={agentInfo.gif}
                            alt={agentInfo.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                            decoding="async"
                            style={{ 
                              mixBlendMode: 'screen',
                              filter: 'brightness(1.2) contrast(1.1)',
                              background: 'transparent !important',
                              backgroundColor: 'transparent !important',
                              backgroundImage: 'none !important',
                              backgroundClip: 'padding-box',
                              WebkitBackgroundClip: 'padding-box',
                              maxWidth: '48px',
                              maxHeight: '48px',
                              imageRendering: 'auto'
                            }}
                            onError={(e) => {
                              // Fallback to colored circle if GIF fails
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const parent = target.parentElement;
                              if (parent) {
                                parent.innerHTML = `<div class="w-full h-full rounded-full flex items-center justify-center" style="background-color: ${getAgentColor(message.agent)}"><span class="text-white text-sm font-bold">${agentInfo.name.charAt(0)}</span></div>`;
                              }
                            }}
                          />
                        </div>
                        
                        {/* Message Bubble */}
                        <div className="flex flex-col max-w-[80%]">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-bold text-white text-sm" style={{ fontFamily: 'VT323, monospace' }}>
                              {agentInfo.name}
                            </h4>
                            <span className="text-white/40 text-xs" style={{ fontFamily: 'VT323, monospace' }}>
                              {formatTime(message.timestamp)}
                            </span>
                          </div>
                          <div className="bg-white/10 border border-white/20 rounded-2xl rounded-bl-md px-4 py-3 shadow-lg">
                            <p className="text-white/90 text-sm leading-relaxed" style={{ fontFamily: 'VT323, monospace' }}>
                              {message.message}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  
                  {/* Typing Indicator - appears at bottom */}
                  {isTyping && (
                    <div className="flex items-end space-x-3 mb-3">
                      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-white/40 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                      <div className="flex flex-col max-w-[80%]">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-bold text-white text-sm" style={{ fontFamily: 'VT323, monospace' }}>
                            System
                          </h4>
                        </div>
                        <div className="bg-white/10 border border-white/20 rounded-2xl rounded-bl-md px-4 py-3 shadow-lg">
                          <p className="text-white/60 text-sm" style={{ fontFamily: 'VT323, monospace' }}>
                            A companion is analyzing...
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={chatEndRef} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
