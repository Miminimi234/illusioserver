import { useCallback, useEffect, useState } from "react";

// Jupiter API token data structure
interface JupiterTokenData {
  id: string;
  name: string;
  symbol: string;
  icon: string;
  decimals: number;
  twitter?: string;
  website?: string;
  dev: string;
  circSupply: number;
  totalSupply: number;
  tokenProgram: string;
  launchpad: string;
  firstPool: {
    id: string;
    createdAt: string;
  };
  holderCount: number;
  audit: {
    mintAuthorityDisabled: boolean;
    freezeAuthorityDisabled: boolean;
    topHoldersPercentage?: number;
    devBalancePercentage?: number;
    devMigrations?: number;
    blockaidRugpull?: boolean;
  };
  organicScore: number;
  organicScoreLabel: string;
  tags: string[];
  fdv: number;
  mcap: number;
  usdPrice: number;
  priceBlockId: number;
  liquidity: number;
  stats5m: {
    priceChange?: number;
    liquidityChange?: number;
    buyVolume?: number;
    sellVolume?: number;
    numBuys?: number;
    numSells?: number;
    numTraders?: number;
    numNetBuyers?: number;
    buyOrganicVolume?: number;
    holderChange?: number;
  };
  stats1h: {
    priceChange?: number;
    liquidityChange?: number;
    buyVolume?: number;
    sellVolume?: number;
    numBuys?: number;
    numSells?: number;
    numTraders?: number;
    numNetBuyers?: number;
    buyOrganicVolume?: number;
    holderChange?: number;
  };
  stats6h: {
    priceChange?: number;
    liquidityChange?: number;
    buyVolume?: number;
    sellVolume?: number;
    numBuys?: number;
    numSells?: number;
    numTraders?: number;
    numNetBuyers?: number;
    buyOrganicVolume?: number;
    holderChange?: number;
  };
  stats24h: {
    priceChange?: number;
    liquidityChange?: number;
    buyVolume?: number;
    sellVolume?: number;
    numBuys?: number;
    numSells?: number;
    numTraders?: number;
    numNetBuyers?: number;
    buyOrganicVolume?: number;
    holderChange?: number;
  };
  bondingCurve: number;
  updatedAt: string;
}

// Transformed token data for the frontend components (matching existing format)
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

interface Stats {
  totalTokens: number;
  freshTokens: number;
  activeTokens: number;
}

// Transform Jupiter data to frontend format
const transformJupiterTokenData = (jupiterToken: JupiterTokenData): TransformedTokenData => {
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
    metadataUri: undefined, // Jupiter doesn't provide this
    isOnCurve: jupiterToken.launchpad === 'pump.fun' || jupiterToken.bondingCurve > 0,
    bondingCurveAddress: jupiterToken.firstPool.id,
    marketcap: jupiterToken.mcap,
    price_usd: jupiterToken.usdPrice,
    volume_24h: jupiterToken.stats24h?.buyVolume || 0,
    liquidity: jupiterToken.liquidity,
    source: 'jupiter',
    // Social media links
    website: jupiterToken.website,
    twitter: jupiterToken.twitter,
    telegram: undefined, // Jupiter doesn't provide this
    links: {
      dexscreener: `https://dexscreener.com/solana/${jupiterToken.id}`,
      jupiter: `https://jup.ag/swap/SOL-${jupiterToken.id}`,
      explorer: `https://solscan.io/token/${jupiterToken.id}`,
    },
    createdAt: new Date(jupiterToken.firstPool.createdAt)
  };
};

export const useJupiterData = (isOpen: boolean) => {
  const [tokens, setTokens] = useState<TransformedTokenData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [connectionStatus, setConnectionStatus] = useState<string>("Connecting to Jupiter...");
  const [stats, setStats] = useState<Stats>({
    totalTokens: 0,
    freshTokens: 0,
    activeTokens: 0
  });
  const [live, setLive] = useState<boolean>(true);

  // Fetch tokens from Jupiter API
  const fetchTokens = useCallback(async () => {
    try {
      console.log("🔍 Fetching tokens from Jupiter API...");
      setConnectionStatus("Fetching tokens from Jupiter...");
      
      // Add timeout to prevent hanging
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await fetch('https://lite-api.jup.ag/tokens/v2', {
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
      
      const data: JupiterTokenData[] = await response.json();
      console.log("📊 Received data from Jupiter:", { itemsCount: data?.length });
      
      const transformedTokens = data.map(transformJupiterTokenData);
      
      // Sort by creation time (newest first)
      transformedTokens.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      
      setTokens(transformedTokens);
      setLastUpdate(new Date());
      setConnectionStatus("Connected to Jupiter (Live)");
      
      // Calculate stats from the data
      const newStats = {
        totalTokens: transformedTokens.length,
        freshTokens: transformedTokens.filter(t => t.status === 'fresh').length,
        activeTokens: transformedTokens.filter(t => t.status === 'active').length
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

  // Search tokens (using Jupiter search API)
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
      
      const data: JupiterTokenData[] = await response.json();
      const transformedTokens = data.map(transformJupiterTokenData);
      
      setTokens(transformedTokens);
      setLastUpdate(new Date());
      setConnectionStatus("Search completed");
      
    } catch (error) {
      console.error("Jupiter search failed:", error);
      setConnectionStatus("Search failed");
    }
  }, []);

  // Filter tokens by status
  const filterByStatus = useCallback(async (status: 'fresh' | 'active') => {
    try {
      console.log("🔍 Filtering tokens by status:", status);
      setConnectionStatus(`Filtering by ${status}...`);
      
      // Fetch fresh data and filter
      await fetchTokens();
      
      // Apply status filter
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

  // Initial fetch and periodic updates
  useEffect(() => {
    console.log("🚀 useJupiterData useEffect triggered:", { isOpen, live });
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

  return {
    tokens,
    isLoading,
    lastUpdate,
    stats,
    connectionStatus,
    live,
    resumeLive,
    pauseLive,
    searchTokens,
    filterByStatus,
    refresh: fetchTokens
  };
};
