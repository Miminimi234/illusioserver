import { useCallback, useEffect, useState } from "react";
import { useWebSocket } from "./useWebSocket";

// Server API base URL
const SERVER_BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL || 
  (process.env.NODE_ENV === 'production' 
    ? 'https://servertest-production-6715.up.railway.app' 
    : 'http://localhost:8080');

// Types matching the server API
export interface ServerTokenData {
  id: number;
  name?: string;
  symbol?: string;
  mint: string; // Fixed: backend returns 'mint' not 'contract_address'
  creator?: string;
  source: string;
  launch_time?: string;
  decimals: number;
  supply: number;
  blocktime: string; // Fixed: backend returns string, not number
  status: 'fresh' | 'active' | 'curve';
  metadata_uri?: string;
  image_url?: string;
  bonding_curve_address?: string;
  is_on_curve: boolean;
  created_at: string;
  updated_at: string;
  display_name?: string;
  // Social media links from metadata
  website?: string;
  twitter?: string;
  telegram?: string;
  // Fixed: backend returns these properties directly on the token, not nested
  price_usd?: number;
  marketcap?: number;
  volume_24h?: number;
  liquidity?: number;
}

// Transformed token data for the frontend components
export interface TransformedTokenData {
  mint: string;
  name?: string;
  symbol?: string;
  decimals: number;
  supply: number;
  blocktime: number;
  status: 'fresh' | 'active' | 'curve';
  imageUrl?: string;
  metadataUri?: string;
  isOnCurve: boolean;
  bondingCurveAddress?: string;
  marketcap?: number;
  price_usd?: number;
  volume_24h?: number;
  liquidity?: number;
  source: string;
  // Social media links from metadata
  website?: string;
  twitter?: string;
  telegram?: string;
  links: {
    dexscreener: string;
    jupiter: string;
    explorer: string;
  };
  createdAt: Date;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface Stats {
  totalTokens: number;
  freshTokens: number;
  activeTokens: number;
}

// Transform server data to frontend format
const transformTokenData = (serverToken: ServerTokenData): TransformedTokenData => {
  return {
    mint: serverToken.mint, // Fixed: use 'mint' property
    name: serverToken.name,
    symbol: serverToken.symbol,
    decimals: serverToken.decimals,
    supply: serverToken.supply,
    blocktime: new Date(serverToken.blocktime).getTime(), // Convert string to timestamp
    status: serverToken.status,
    imageUrl: serverToken.image_url,
    metadataUri: serverToken.metadata_uri,
    isOnCurve: serverToken.is_on_curve,
    bondingCurveAddress: serverToken.bonding_curve_address,
    marketcap: serverToken.marketcap, // Fixed: match UI component expectations
    price_usd: serverToken.price_usd, // Fixed: match UI component expectations
    volume_24h: serverToken.volume_24h, // Fixed: match UI component expectations
    liquidity: serverToken.liquidity, // Fixed: use direct property
    source: serverToken.source,
    // Social media links from metadata
    website: serverToken.website,
    twitter: serverToken.twitter,
    telegram: serverToken.telegram,
    links: {
      dexscreener: `https://dexscreener.com/solana/${serverToken.mint}`,
      jupiter: `https://jup.ag/swap/SOL-${serverToken.mint}`,
      explorer: `https://solscan.io/token/${serverToken.mint}`,
    },
    createdAt: new Date(serverToken.created_at)
  };
};

export const useServerData = (isOpen: boolean) => {
  const [tokens, setTokens] = useState<TransformedTokenData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [connectionStatus, setConnectionStatus] = useState<string>("Connecting to server...");
  const [stats, setStats] = useState<Stats>({
    totalTokens: 0,
    freshTokens: 0,
    activeTokens: 0
  });
  const [live, setLive] = useState<boolean>(true);
  const [newTokenMint, setNewTokenMint] = useState<string | null>(null);
  const [isHoverPaused, setIsHoverPaused] = useState<boolean>(false);
  const [queuedTokens, setQueuedTokens] = useState<TransformedTokenData[]>([]);

  // WebSocket connection for real-time updates
  const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 
    (process.env.NODE_ENV === 'production' 
      ? 'wss://servertest-production-6715.up.railway.app/ws' 
      : 'ws://localhost:8080/ws');
  const { isConnected: wsConnected, lastMessage } = useWebSocket(wsUrl);

  // Fetch tokens from Jupiter API
  const fetchTokens = useCallback(async () => {
    try {
      console.log("🔍 Fetching tokens from Jupiter API...");
      setConnectionStatus("Fetching tokens from Jupiter...");
      
      // Add timeout to prevent hanging
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      // Use Jupiter recent tokens endpoint for new mints
      const response = await fetch('https://lite-api.jup.ag/tokens/v2/recent', {
        signal: controller.signal,
        cache: 'no-store', // Always fetch fresh data
        headers: {
          'Accept': 'application/json',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`Jupiter API responded with ${response.status}`);
      }
      
      const data = await response.json();
      console.log("📊 Received data from Jupiter:", { itemsCount: data?.length });
      
      // Transform Jupiter data to our format
      const transformedTokens = data.map((jupiterToken: any) => {
        // Determine status based on Jupiter data
        let status: 'fresh' | 'active' | 'curve' = 'fresh';
        
        // If it has significant trading activity, consider it active
        if (jupiterToken.stats24h?.numTraders && jupiterToken.stats24h.numTraders > 10) {
          status = 'active';
        }
        
        // If it's on a bonding curve (pump.fun, etc.), consider it curve
        if (jupiterToken.launchpad === 'pump.fun' || jupiterToken.bondingCurve > 0) {
          status = 'curve';
        }

        return {
          mint: jupiterToken.id,
          name: jupiterToken.name,
          symbol: jupiterToken.symbol,
          decimals: jupiterToken.decimals,
          supply: jupiterToken.totalSupply,
          blocktime: new Date(jupiterToken.firstPool.createdAt).getTime(),
          status,
          imageUrl: jupiterToken.icon,
          metadataUri: undefined,
          isOnCurve: jupiterToken.launchpad === 'pump.fun' || jupiterToken.bondingCurve > 0,
          bondingCurveAddress: jupiterToken.firstPool.id,
          marketcap: jupiterToken.mcap,
          price_usd: jupiterToken.usdPrice,
          volume_24h: jupiterToken.stats24h?.buyVolume || 0,
          liquidity: jupiterToken.liquidity,
          source: 'jupiter',
          website: jupiterToken.website,
          twitter: jupiterToken.twitter,
          telegram: undefined,
          links: {
            dexscreener: `https://dexscreener.com/solana/${jupiterToken.id}`,
            jupiter: `https://jup.ag/swap/SOL-${jupiterToken.id}`,
            explorer: `https://solscan.io/token/${jupiterToken.id}`,
          },
          createdAt: new Date(jupiterToken.firstPool.createdAt)
        };
      });
      
      // Sort by creation time (newest first)
      transformedTokens.sort((a: any, b: any) => b.createdAt.getTime() - a.createdAt.getTime());
      
      setTokens(transformedTokens);
      setLastUpdate(new Date());
      setConnectionStatus("Connected to Jupiter (Live)");
      
      // Calculate stats from the data
      const newStats = {
        totalTokens: transformedTokens.length,
        freshTokens: transformedTokens.filter((t: any) => t.status === 'fresh').length,
        activeTokens: transformedTokens.filter((t: any) => t.status === 'active').length
      };
      setStats(newStats);
      
      console.log("✅ fetchTokens from Jupiter completed successfully");
      
    } catch (error) {
      console.error("❌ Failed to fetch tokens from Jupiter:", error);
      if (error instanceof Error && error.name === 'AbortError') {
        setConnectionStatus("Request timeout - Jupiter API");
      } else {
        setConnectionStatus("Failed to connect to Jupiter API");
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Search tokens using Jupiter API
  const searchTokens = useCallback(async (query: string) => {
    if (!query || query.trim().length < 2) return;
    
    try {
      console.log("🔍 Searching tokens on Jupiter:", query);
      setConnectionStatus("Searching tokens...");
      
      const response = await fetch(`https://lite-api.jup.ag/tokens/v2/search?query=${encodeURIComponent(query)}`, {
        cache: 'no-store',
        headers: {
          'Accept': 'application/json',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Jupiter search failed with ${response.status}`);
      }
      
      const data = await response.json();
      
      // Transform Jupiter search results to our format
      const transformedTokens = data.map((jupiterToken: any) => {
        // Determine status based on Jupiter data
        let status: 'fresh' | 'active' | 'curve' = 'fresh';
        
        // If it has significant trading activity, consider it active
        if (jupiterToken.stats24h?.numTraders && jupiterToken.stats24h.numTraders > 10) {
          status = 'active';
        }
        
        // If it's on a bonding curve (pump.fun, etc.), consider it curve
        if (jupiterToken.launchpad === 'pump.fun' || jupiterToken.bondingCurve > 0) {
          status = 'curve';
        }

        return {
          mint: jupiterToken.id,
          name: jupiterToken.name,
          symbol: jupiterToken.symbol,
          decimals: jupiterToken.decimals,
          supply: jupiterToken.totalSupply,
          blocktime: new Date(jupiterToken.firstPool.createdAt).getTime(),
          status,
          imageUrl: jupiterToken.icon,
          metadataUri: undefined,
          isOnCurve: jupiterToken.launchpad === 'pump.fun' || jupiterToken.bondingCurve > 0,
          bondingCurveAddress: jupiterToken.firstPool.id,
          marketcap: jupiterToken.mcap,
          price_usd: jupiterToken.usdPrice,
          volume_24h: jupiterToken.stats24h?.buyVolume || 0,
          liquidity: jupiterToken.liquidity,
          source: 'jupiter',
          website: jupiterToken.website,
          twitter: jupiterToken.twitter,
          telegram: undefined,
          links: {
            dexscreener: `https://dexscreener.com/solana/${jupiterToken.id}`,
            jupiter: `https://jup.ag/swap/SOL-${jupiterToken.id}`,
            explorer: `https://solscan.io/token/${jupiterToken.id}`,
          },
          createdAt: new Date(jupiterToken.firstPool.createdAt)
        };
      });
      
      setTokens(transformedTokens);
      setLastUpdate(new Date());
      setConnectionStatus("Search completed");
      
    } catch (error) {
      console.error("Jupiter search failed:", error);
      setConnectionStatus("Search failed");
    }
  }, []);

  // Filter tokens by status (using existing Jupiter data)
  const filterByStatus = useCallback(async (status: 'fresh' | 'active') => {
    try {
      console.log("🔍 Filtering tokens by status:", status);
      setConnectionStatus(`Filtering by ${status}...`);
      
      // Fetch fresh data and filter
      await fetchTokens();
      
      // Apply status filter to current tokens
      setTokens(prev => prev.filter(token => token.status === status));
      setConnectionStatus(`Filtered by ${status}`);
      
    } catch (error) {
      console.error("Status filter failed:", error);
      setConnectionStatus("Filter failed");
    }
  }, [fetchTokens]);



  // Resume live updates
  const resumeLive = useCallback(() => {
    setLive(true);
    console.log("▶️ Live updates resumed");
  }, []);

  // Pause live updates
  const pauseLive = useCallback(() => {
    setLive(false);
    console.log("⏸️ Live updates paused");
  }, []);

  // Pause live updates due to hover
  const pauseLiveOnHover = useCallback(() => {
    setIsHoverPaused(true);
  }, []);

  // Resume live updates after hover ends
  const resumeLiveAfterHover = useCallback(() => {
    setIsHoverPaused(false);
    
    // Process any queued tokens
    if (queuedTokens.length > 0) {
      // console.log(`🔄 Processing ${queuedTokens.length} queued tokens after hover`);
      
      // Add queued tokens to the main list
      setTokens(prev => {
        const existingMints = new Set(prev.map(t => t.mint));
        const newTokens = queuedTokens.filter(t => !existingMints.has(t.mint));
        
        if (newTokens.length > 0) {
          const combined = [...newTokens, ...prev];
          // Limit to 200 tokens to prevent memory issues
          return combined.slice(0, 200);
        }
        
        return prev;
      });
      
      // Set the first queued token as the new token for animation
      if (queuedTokens.length > 0) {
        setNewTokenMint(queuedTokens[0].mint);
        setTimeout(() => setNewTokenMint(null), 1000);
      }
      
      // Clear the queue
      setQueuedTokens([]);
      setLastUpdate(new Date());
    }
  }, [queuedTokens]);

  // Handle WebSocket messages for real-time updates
  useEffect(() => {
    if (lastMessage) {
      if (lastMessage.type === 'new_token') {
        const newToken = transformTokenData(lastMessage.data);
        
        // Check if we're in hover pause mode
        if (isHoverPaused) {
          // Queue the token instead of adding it immediately
          setQueuedTokens(prev => {
            // Check for duplicates in queue
            const exists = prev.some(token => token.mint === newToken.mint);
            if (exists) {
              // console.log('⚠️ DUPLICATE TOKEN PREVENTED IN QUEUE:', newToken.mint);
              return prev;
            }
            // console.log('📦 TOKEN QUEUED DURING HOVER PAUSE:', newToken.name || newToken.symbol || newToken.mint);
            return [...prev, newToken];
          });
        } else {
          // Add new token to the list (check for duplicates)
          setTokens(prev => {
            // Check if token already exists
            const exists = prev.some(token => token.mint === newToken.mint);
            if (exists) {
              // console.log('⚠️ DUPLICATE TOKEN PREVENTED:', newToken.mint);
              return prev;
            }
            // console.log('🔥 NEW TOKEN RECEIVED VIA WEBSOCKET:', newToken.name || newToken.symbol || newToken.mint);
            const combined = [newToken, ...prev];
            // NO LIMIT - keep all tokens to prevent fresh mints from disappearing
            return combined;
          });
          setLastUpdate(new Date());
          setNewTokenMint(newToken.mint);
          
          // Clear the flag after animation
          setTimeout(() => setNewTokenMint(null), 1000);
        }
      } else if (lastMessage.type === 'token_update') {
        // Update existing token
        const updatedToken = transformTokenData(lastMessage.data);
        setTokens(prev => prev.map(token => 
          token.mint === updatedToken.mint ? updatedToken : token
        ));
        setLastUpdate(new Date());
        // console.log('🔄 TOKEN UPDATED VIA WEBSOCKET:', updatedToken.name || updatedToken.symbol || updatedToken.mint);
      } else if (lastMessage.type === 'price_alert') {
        // Handle significant price changes
        const priceAlert = lastMessage.data;
        console.log(`🚨 PRICE ALERT: ${priceAlert.mint} ${priceAlert.changePercent > 0 ? '+' : ''}${priceAlert.changePercent.toFixed(2)}% ($${priceAlert.previousPrice} → $${priceAlert.currentPrice})`);
        
        // Update the token in the list with new price data
        setTokens(prev => prev.map(token => {
          if (token.mint === priceAlert.mint) {
            return {
              ...token,
              price_usd: priceAlert.currentPrice,
              marketcap: priceAlert.marketcap,
              volume_24h: priceAlert.volume24h,
              // Add price change info for UI highlighting
              priceChange: {
                percent: priceAlert.changePercent,
                previous: priceAlert.previousPrice,
                current: priceAlert.currentPrice,
                timestamp: new Date(priceAlert.timestamp)
              }
            };
          }
          return token;
        }));
        setLastUpdate(new Date());
      }
    }
  }, [lastMessage]);

  // Initial fetch and periodic updates (reduced frequency since we have WebSocket)
  useEffect(() => {
    console.log("🚀 useServerData useEffect triggered:", { isOpen, live });
    if (isOpen) {
      console.log("📡 Calling fetchTokens...");
      fetchTokens();
      
      // Set up periodic refresh when live mode is on
      if (live) {
        const interval = setInterval(() => {
          console.log("🔄 Periodic refresh calling fetchTokens...");
          fetchTokens();
        }, 10000); // Refresh every 10 seconds for Jupiter API
        
        return () => clearInterval(interval);
      }
    }
  }, [isOpen, live, fetchTokens]);

  // Fallback: If we have tokens from WebSocket but still loading, set loading to false
  useEffect(() => {
    if (isLoading && tokens.length > 0) {
      console.log("🔄 Fallback: Setting isLoading to false because we have WebSocket tokens");
      setIsLoading(false);
      setConnectionStatus(wsConnected ? "Connected via WebSocket (Live)" : "Connected via WebSocket");
    }
  }, [isLoading, tokens.length, wsConnected]);

  return {
    tokens,
    isLoading,
    lastUpdate,
    stats,
    connectionStatus,
    live,
    resumeLive,
    pauseLive,
    pauseLiveOnHover,
    resumeLiveAfterHover,
    isHoverPaused,
    queuedTokens,
    searchTokens,
    filterByStatus,
    refresh: fetchTokens,
    newTokenMint
  };
};
