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

interface ArchiveEntry {
  id: string;
  date: string;
  time: string;
  messages: ChatMessage[];
  messageCount: number;
}

export default function OracleHub({ isOpen, onClose }: OracleHubProps) {
  const [animateIn, setAnimateIn] = useState(isOpen);
  const [isVisible, setIsVisible] = useState(isOpen);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isArchiveMode, setIsArchiveMode] = useState(false);
  const [archives, setArchives] = useState<ArchiveEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [messageCounter, setMessageCounter] = useState(0);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Dummy chat data with correct companions
  const dummyMessages: ChatMessage[] = [
    {
      id: '1',
      agent: 'analyzer',
      message: 'Market cap: $2.1M | Liquidity: $847K | 24h Vol: $1.2M | Holders: 1,247. Depth analysis shows $75K absorption capacity.',
      timestamp: new Date(Date.now() - 300000),
      type: 'analysis'
    },
    {
      id: '2',
      agent: 'predictor',
      message: 'Forecast Window: 4h. Distribution: Median +8.2% | P10 -3.1% | P90 +22.4%. Clean CVD trending +$23K over 30m.',
      timestamp: new Date(Date.now() - 240000),
      type: 'prediction'
    },
    {
      id: '3',
      agent: 'quantum-eraser',
      message: 'Denoised ledger: 1,847 raw prints, 31% artifacts removed. Bot clusters reduced from 28% to clean organic flow.',
      timestamp: new Date(Date.now() - 180000),
      type: 'analysis'
    },
    {
      id: '4',
      agent: 'retrocausal',
      message: 'Future boundary: +18% at T+4h. Conditions met: 4/5 | Echo strength: 78/100. LP net +$45K required within 2h.',
      timestamp: new Date(Date.now() - 120000),
      type: 'prediction'
    },
    {
      id: '5',
      agent: 'analyzer',
      message: 'Signals: Depth real, distribution improving +3.8% new wallets. Flow coherent: net +$47K with 68% buys.',
      timestamp: new Date(Date.now() - 60000),
      type: 'analysis'
    },
    {
      id: '6',
      agent: 'predictor',
      message: 'Current trajectory: +8.2% median with 78% confidence. Up-shift: fresh LP >$75K. Down-shift: holder growth <15/h.',
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
      setMessageCounter(dummyMessages.length);
    }
  }, [isOpen]);

  // Auto-archive every 100 messages
  useEffect(() => {
    if (messageCounter > 0 && messageCounter % 100 === 0) {
      const now = new Date();
      const archiveEntry: ArchiveEntry = {
        id: `archive-${now.getTime()}`,
        date: now.toLocaleDateString(),
        time: now.toLocaleTimeString(),
        messages: [...chatMessages],
        messageCount: chatMessages.length
      };
      
      setArchives(prev => [archiveEntry, ...prev]);
      console.log(`📦 Archived ${chatMessages.length} messages at ${archiveEntry.time}`);
    }
  }, [messageCounter, chatMessages]);

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
          'LP depth analysis shows $75K absorption capacity. Current flow coherent with 68% buys.',
          'Forward simulation indicates +8.2% median trajectory. Clean CVD trending +$23K.',
          'Denoised ledger reveals 31% artifact removal. Bot clusters reduced to clean flow.',
          'Retrocausal analysis: 4/5 conditions met for +18% target. Echo strength at 78/100.',
          'Market cap: $2.1M | Liquidity: $847K | 24h Vol: $1.2M. Holder concentration improving.',
          'Simulation invariants: Without +$180K new LP, moves beyond +15% will collapse.',
          'Clean bot share: 31% → Data grade: B+. Distribution improving with +3.8% new wallets.',
          'Quantum interference patterns suggest major move imminent. True signal emerging.',
          'VWAP(1h) reclaim needed for long trigger. 3×1m bars >65% buy-imbalance required.',
          'Holder expansion: +47 wallets (organic growth). Regime: Accumulation with steady flow.',
          'LP delta 4h: +$12K | New LP adds: 3. Net flow 1h: +$47K with 68% buy pressure.',
          'Future boundary condition: +18% at T+4h requires LP net +$45K within 2h.',
          'Depth analysis: book can absorb ~$75K with <15 bps slip. Distribution improving.',
          'Eraser impact: structure bias corrected to neutral. Distribution tightens.',
          'Collapse rule: if checks <3 for 30m, abandon +18% future and adopt fallback +8%.'
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
            const maxMessages = 10; // Severely reduced to prevent crashes
            const newMessages = [...prev, newMessage];
            return newMessages.length > maxMessages ? newMessages.slice(-maxMessages) : newMessages;
          });
          setMessageCounter(prev => prev + 1);
          setIsTyping(false);
        }, 3000); // Increased to 3 seconds to make typing more visible
      } catch (error) {
        console.error('Error adding new message:', error);
        setIsTyping(false);
      }
    }, 20000); // Every 20 seconds to reduce memory pressure

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

  // Archive functions
  const toggleArchiveMode = () => {
    setIsArchiveMode(!isArchiveMode);
    setSearchQuery('');
  };

  const getFilteredArchives = () => {
    if (!searchQuery) return archives;
    
    return archives.filter(archive => 
      archive.messages.some(message => 
        message.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
        message.agent.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  };

  const getCurrentMessages = () => {
    if (isArchiveMode) {
      const filteredArchives = getFilteredArchives();
      // Flatten all messages from filtered archives
      return filteredArchives.flatMap(archive => archive.messages);
    }
    return chatMessages;
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
                  {isArchiveMode ? 'Archive' : 'Live Chat Archive'}
                </h2>
                <button 
                  onClick={toggleArchiveMode}
                  className={`transition-colors duration-200 text-sm px-3 py-1 border rounded ${
                    isArchiveMode 
                      ? 'text-white bg-white/10 border-white/40' 
                      : 'text-white/60 hover:text-white border-white/20 hover:bg-white/5'
                  }`} 
                  style={{ fontFamily: 'VT323, monospace' }}
                >
                  {isArchiveMode ? 'Live Chat' : 'Archive'}
                </button>
              </div>

              {/* Search bar - only show in archive mode */}
              {isArchiveMode && (
                <div className="mb-3">
                  <input
                    type="text"
                    placeholder="Search archives..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-3 py-2 bg-black/50 border border-white/20 rounded text-white placeholder-white/40 focus:outline-none focus:border-white/40"
                    style={{ fontFamily: 'VT323, monospace' }}
                  />
                </div>
              )}

              {/* Archive info - only show in archive mode */}
              {isArchiveMode && (
                <div className="mb-2 text-white/60 text-sm" style={{ fontFamily: 'VT323, monospace' }}>
                  {archives.length > 0 ? (
                    <>
                      {getFilteredArchives().length} archive{getFilteredArchives().length !== 1 ? 's' : ''} found
                      {searchQuery && ` for "${searchQuery}"`}
                    </>
                  ) : (
                    'No archives yet'
                  )}
                </div>
              )}
              
              {/* Chat Container */}
              <div className="bg-black/50 border border-white/20 rounded p-2 overflow-y-auto flex-1">
                <div className="space-y-2">
                  {getCurrentMessages().map((message) => {
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
                              // Simple fallback - just hide the image
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
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
                  
                  {/* Typing Indicator - appears at bottom, only in live mode */}
                  {isTyping && !isArchiveMode && (
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
