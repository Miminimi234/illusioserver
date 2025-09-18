"use client";
import { useEffect, useState } from "react";
import CreationTimeDisplay from './CreationTimeDisplay';

type TokenData = {
  mint: string;
  name: string;
  symbol: string;
  imageUrl?: string;
  marketcap?: number;
  price_usd?: number;
  volume_24h?: number;
  liquidity?: number;
  fdv?: number;
  holderCount?: number;
  priceChange24h?: number;
  numTraders24h?: number;
  numBuys24h?: number;
  numSells24h?: number;
  netBuyers24h?: number;
  bondingCurve?: number;
  launchpad?: string;
  organicScore?: number;
  organicScoreLabel?: string;
  audit?: any;
  website?: string;
  twitter?: string;
  telegram?: string;
  createdAt: Date;
  status: "new" | "final" | "migrated";
};

export default function ScopeBoard() {
  const [tokens, setTokens] = useState<TokenData[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastFetchTime, setLastFetchTime] = useState<Date | null>(null);

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const res = await fetch("https://lite-api.jup.ag/tokens/v2/recent");
        const data = await res.json();
        if (Array.isArray(data)) {
          // Transform Jupiter data to our format
          const transformedTokens = data.map((jupiterToken: any) => {
            // Determine status based on Jupiter data
            let status: 'new' | 'final' | 'migrated' = 'new';
            
            // If it has significant trading activity, consider it final
            if (jupiterToken.stats24h?.numTraders && jupiterToken.stats24h.numTraders > 10) {
              status = 'final';
            }
            
            // If it's migrated from pump.fun, consider it migrated
            if (jupiterToken.launchpad === 'pump.fun' && jupiterToken.bondingCurve === 0) {
              status = 'migrated';
            }

            return {
              mint: jupiterToken.id,
              name: jupiterToken.name,
              symbol: jupiterToken.symbol,
              imageUrl: jupiterToken.icon,
              marketcap: jupiterToken.mcap || jupiterToken.fdv,
              price_usd: jupiterToken.usdPrice,
              volume_24h: jupiterToken.stats24h?.buyVolume || 0,
              liquidity: jupiterToken.liquidity,
              fdv: jupiterToken.fdv,
              holderCount: jupiterToken.holderCount,
              priceChange24h: jupiterToken.stats24h?.priceChange || 0,
              numTraders24h: jupiterToken.stats24h?.numTraders || 0,
              numBuys24h: jupiterToken.stats24h?.numBuys || 0,
              numSells24h: jupiterToken.stats24h?.numSells || 0,
              netBuyers24h: jupiterToken.stats24h?.numNetBuyers || 0,
              bondingCurve: jupiterToken.bondingCurve,
              launchpad: jupiterToken.launchpad,
              organicScore: jupiterToken.organicScore,
              organicScoreLabel: jupiterToken.organicScoreLabel,
              audit: jupiterToken.audit,
              website: jupiterToken.website,
              twitter: jupiterToken.twitter,
              telegram: jupiterToken.telegram,
              status,
              createdAt: new Date(jupiterToken.firstPool.createdAt)
            };
          });
          
          // Add new tokens to existing list (avoid duplicates)
          setTokens(prevTokens => {
            const existingMints = new Set(prevTokens.map(t => t.mint));
            const newTokens = transformedTokens.filter(token => !existingMints.has(token.mint));
            
            if (newTokens.length > 0) {
              console.log(`Adding ${newTokens.length} new tokens to existing ${prevTokens.length}`);
            }
            
            // Combine and sort by creation time (newest first)
            const combinedTokens = [...newTokens, ...prevTokens];
            combinedTokens.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
            
            // Keep only the most recent 100 tokens to prevent memory issues
            return combinedTokens.slice(0, 100);
          });
          
          setLastFetchTime(new Date());
        } else {
          console.error("Invalid data format from Jupiter API:", data);
        }
      } catch (err) {
        console.error("Error fetching tokens from Jupiter:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTokens();
    const interval = setInterval(fetchTokens, 10000); // refresh every 10s for Jupiter API
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="text-white p-6">Loading Scope...</div>;

  if (!Array.isArray(tokens)) {
    return <div className="text-white p-6">Error loading tokens</div>;
  }

  const newPairs = tokens.filter((t) => t.status === "new");
  const finalStretch = tokens.filter((t) => t.status === "final");
  const migrated = tokens.filter((t) => t.status === "migrated");

  return (
    <div className="p-6 text-white" style={{ background: 'radial-gradient(circle at bottom center, rgba(0,0,0,0.9), rgba(0,0,0,0.7))' }}>
      {/* Status header */}
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Live Token Stream</h1>
        <div className="text-sm opacity-70">
          Total: {tokens.length} tokens | Last update: {lastFetchTime ? lastFetchTime.toLocaleTimeString() : 'Never'}
        </div>
      </div>
      
      {/* Single column for chronological display */}
      <div className="space-y-3 max-h-screen overflow-y-auto">
        {tokens.map((token, index) => (
          <TokenCard key={`${token.mint}-${index}`} token={token} index={index} />
        ))}
      </div>
    </div>
  );
}

function TokenCard({ token, index }: { token: TokenData; index: number }) {
  const isNew = index < 5; // Highlight first 5 tokens as "new"
  
  return (
    <div
      className={`p-4 rounded-lg border transition-all duration-300 hover:shadow-glow ${
        isNew 
          ? 'bg-green-500/10 border-green-500/30 hover:border-green-500/50' 
          : 'bg-white/5 border-white/10 hover:border-white/30'
      }`}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center space-x-3">
          {token.imageUrl && (
            <img 
              src={token.imageUrl} 
              alt={token.name} 
              className="w-8 h-8 rounded-full"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          )}
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-medium text-lg">{token.name}</span>
              <span className="text-sm opacity-70">({token.symbol})</span>
              {isNew && (
                <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded text-xs font-bold">
                  NEW
                </span>
              )}
            </div>
            <span className="text-xs opacity-50">{token.mint.slice(0,8)}…{token.mint.slice(-4)}</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm opacity-70">#{index + 1}</div>
          <CreationTimeDisplay createdAt={token.createdAt} />
        </div>
      </div>
      
      <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
        <div className="space-y-1">
          <div className="flex justify-between">
            <span className="opacity-70">Market Cap:</span>
            <span className="font-medium">${token.marketcap?.toLocaleString() || 'N/A'}</span>
          </div>
          <div className="flex justify-between">
            <span className="opacity-70">Price:</span>
            <span className="font-medium">${token.price_usd?.toFixed(8) || 'N/A'}</span>
          </div>
          <div className="flex justify-between">
            <span className="opacity-70">Liquidity:</span>
            <span className="font-medium">${token.liquidity?.toLocaleString() || 'N/A'}</span>
          </div>
        </div>
        
        <div className="space-y-1">
          <div className="flex justify-between">
            <span className="opacity-70">24h Change:</span>
            <span className={`font-medium ${token.priceChange24h && token.priceChange24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {token.priceChange24h ? `${token.priceChange24h > 0 ? '+' : ''}${token.priceChange24h.toFixed(2)}%` : 'N/A'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="opacity-70">Volume 24h:</span>
            <span className="font-medium">${token.volume_24h?.toLocaleString() || 'N/A'}</span>
          </div>
          <div className="flex justify-between">
            <span className="opacity-70">Traders:</span>
            <span className="font-medium">{token.numTraders24h || 'N/A'}</span>
          </div>
        </div>
      </div>
      
      <div className="mt-3 flex flex-wrap gap-2">
        {token.launchpad && (
          <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs">
            {token.launchpad}
          </span>
        )}
        {token.bondingCurve && token.bondingCurve > 0 && (
          <span className="px-2 py-1 bg-orange-500/20 text-orange-300 rounded text-xs">
            Curve: {token.bondingCurve.toFixed(2)}%
          </span>
        )}
        {token.holderCount && (
          <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-xs">
            {token.holderCount} holders
          </span>
        )}
        <span className={`px-2 py-1 rounded text-xs ${
          token.status === 'new' ? 'bg-green-500/20 text-green-300' :
          token.status === 'final' ? 'bg-yellow-500/20 text-yellow-300' :
          'bg-gray-500/20 text-gray-300'
        }`}>
          {token.status}
        </span>
      </div>
    </div>
  );
}
