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
      message: 'I\'ve detected a significant pattern in the wallet movements. The top 10 holders have been accumulating steadily over the past 24 hours, with minimal selling pressure.',
      timestamp: new Date(Date.now() - 300000),
      type: 'analysis'
    },
    {
      id: '2',
      agent: 'predictor',
      message: 'Based on the current momentum and volume patterns, I\'m projecting a 15-20% upward movement within the next 4 hours. The key resistance level is at $0.000052.',
      timestamp: new Date(Date.now() - 240000),
      type: 'prediction'
    },
    {
      id: '3',
      agent: 'quantum-eraser',
      message: 'I\'ve erased the noise from the data stream. The true signal shows a 73% probability of continued upward movement, with quantum interference patterns suggesting a major move is imminent.',
      timestamp: new Date(Date.now() - 180000),
      type: 'analysis'
    },
    {
      id: '4',
      agent: 'retrocausal',
      message: 'From tomorrow\'s perspective, I can see that today\'s price action at 2:47 PM EST will be the critical decision point. The retrocausal feedback loop is already influencing current market behavior.',
      timestamp: new Date(Date.now() - 120000),
      type: 'prediction'
    },
    {
      id: '5',
      agent: 'analyzer',
      message: 'The liquidity depth analysis reveals strong support at $0.000045. The order book shows institutional-sized buy walls that weren\'t there yesterday.',
      timestamp: new Date(Date.now() - 60000),
      type: 'analysis'
    },
    {
      id: '6',
      agent: 'predictor',
      message: 'My models are showing a divergence between price and sentiment. The market is undervaluing this token by approximately 40% based on current fundamentals.',
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

  // Auto-scroll to top (which is bottom in reversed layout) when new messages arrive
  useEffect(() => {
    if (chatEndRef.current) {
      const container = chatEndRef.current.parentElement?.parentElement;
      if (container) {
        container.scrollTop = 0; // Scroll to top since we're using flex-col-reverse
      }
    }
  }, [chatMessages]);

  // Simulate new messages every 15 seconds (reduced frequency to prevent crashes)
  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      try {
        const agents: ('analyzer' | 'predictor' | 'quantum-eraser' | 'retrocausal')[] = ['analyzer', 'predictor', 'quantum-eraser', 'retrocausal'];
        const randomAgent = agents[Math.floor(Math.random() * agents.length)];
        
        const newMessages = [
          'The market is showing interesting patterns today.',
          'I\'m detecting unusual volume spikes in the last hour.',
          'The quantum field is fluctuating - something big is coming.',
          'From tomorrow\'s perspective, this dip looks like a buying opportunity.',
          'The sentiment indicators are diverging from price action.',
          'I see multiple timeline probabilities converging at this price point.',
          'The retrocausal signals suggest a major move within 24 hours.',
          'Whale movements are creating ripples in the quantum field.'
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
            // Limit messages to prevent memory issues
            const maxMessages = 50;
            const newMessages = [...prev, newMessage];
            return newMessages.length > maxMessages ? newMessages.slice(-maxMessages) : newMessages;
          });
          setIsTyping(false);
        }, 1000);
      } catch (error) {
        console.error('Error adding new message:', error);
        setIsTyping(false);
      }
    }, 15000); // Increased to 15 seconds to reduce load

    return () => clearInterval(interval);
  }, [isOpen]);

  // Helper functions for agent styling
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
                AI Agents
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
              <h2 className="text-xl font-bold text-white mb-2" style={{ fontFamily: 'VT323, monospace' }}>
                Live Chat Archive
              </h2>
              
              {/* Chat Container */}
              <div className="bg-black/50 border border-white/20 rounded p-2 overflow-y-auto flex-1 flex flex-col-reverse">
                <div className="space-y-2">
                  {chatMessages.slice().reverse().map((message) => {
                    const agentInfo = getAgentInfo(message.agent);
                    return (
                      <div key={message.id} className="flex items-end space-x-3 mb-3">
                        {/* Avatar with GIF */}
                        <div className="flex-shrink-0 w-12 h-12 rounded-full overflow-hidden">
                          <img 
                            src={agentInfo.gif} 
                            alt={agentInfo.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                            onError={(e) => {
                              // Fallback to a colored circle if GIF fails to load
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const parent = target.parentElement;
                              if (parent) {
                                parent.innerHTML = `<div class="w-full h-full bg-white/20 rounded-full flex items-center justify-center text-white text-sm font-bold">${agentInfo.name.charAt(0)}</div>`;
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
