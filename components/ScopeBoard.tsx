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
          
          setTokens(transformedTokens);
        } else {
          setTokens([]);
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
    <div className="grid grid-cols-3 gap-6 p-6 text-white" style={{ background: 'radial-gradient(circle at bottom center, rgba(0,0,0,0.9), rgba(0,0,0,0.7))' }}>
      <TokenColumn title="New Pairs" tokens={newPairs} />
      <TokenColumn title="Final Stretch" tokens={finalStretch} />
      <TokenColumn title="Migrated" tokens={migrated} />
    </div>
  );
}

function TokenColumn({ title, tokens }: { title: string; tokens: TokenData[] }) {
  return (
    <div className="bg-black/40 rounded-lg p-4 border border-white/10">
      <h2 className="text-lg font-bold mb-4 text-white">{title}</h2>
      <div className="space-y-3">
        {tokens.map((t) => (
          <div
            key={t.mint}
            className="p-3 rounded bg-white/5 border border-white/10 hover:border-white/30 transition-all duration-300 hover:shadow-glow"
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center space-x-2">
                {t.imageUrl && (
                  <img 
                    src={t.imageUrl} 
                    alt={t.name} 
                    className="w-6 h-6 rounded-full"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                )}
                <div>
                  <span className="font-medium">{t.name}</span>
                  <span className="text-xs opacity-70 ml-1">({t.symbol})</span>
                </div>
              </div>
              <span className="text-xs opacity-70">{t.mint.slice(0,6)}…</span>
            </div>
            
            <div className="mt-2 text-sm opacity-80">
              <div className="flex justify-between">
                <span>MC: ${t.marketcap?.toLocaleString() || 'N/A'}</span>
                <span>FDV: ${t.fdv?.toLocaleString() || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span>Price: ${t.price_usd?.toFixed(8) || 'N/A'}</span>
                <span className={t.priceChange24h && t.priceChange24h >= 0 ? 'text-green-400' : 'text-red-400'}>
                  {t.priceChange24h ? `${t.priceChange24h > 0 ? '+' : ''}${t.priceChange24h.toFixed(2)}%` : 'N/A'}
                </span>
              </div>
            </div>
            
            <div className="mt-1 text-xs opacity-70">
              <div className="flex justify-between">
                <span>Liquidity: ${t.liquidity?.toLocaleString() || 'N/A'}</span>
                <span>Holders: {t.holderCount || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span>Vol 24h: ${t.volume_24h?.toLocaleString() || 'N/A'}</span>
                <span>Traders: {t.numTraders24h || 'N/A'}</span>
              </div>
            </div>
            
            <div className="mt-1 text-xs opacity-60">
              <div className="flex justify-between">
                <span>Buys: {t.numBuys24h || 'N/A'}</span>
                <span>Sells: {t.numSells24h || 'N/A'}</span>
                <span>Net: {t.netBuyers24h || 'N/A'}</span>
              </div>
              {t.launchpad && (
                <div className="mt-1">
                  <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs">
                    {t.launchpad}
                  </span>
                  {t.bondingCurve && t.bondingCurve > 0 && (
                    <span className="ml-2 px-2 py-1 bg-orange-500/20 text-orange-300 rounded text-xs">
                      Curve: {t.bondingCurve.toFixed(2)}%
                    </span>
                  )}
                </div>
              )}
            </div>
            
            <div className="mt-2">
              <CreationTimeDisplay createdAt={t.createdAt} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
