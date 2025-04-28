"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import {
  ArrowLeft,
  ExternalLink,
  Globe,
  Send,
  AlertTriangle,
  Info,
  Shield,
  Activity,
  ChevronDown,
  ChevronUp,
  Users,
  BarChart3,
  TrendingUp,
  Clock,
  DollarSign,
  Share2,
  Wallet,
  Search,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { calculateRiskLevel } from "../../app/utils/calculateRiskLevel"
import { config } from '../config';

// Types
interface Token {
  id: string
  name: string
  ticker: string
  price: number
  marketcap: number
  volume: number
  volume24hBTC?: number
  volumeUSD?: number
  btcPrice?: number
  holder_count: number
  created_time: string
  creator: string
  total_supply: string
  btc_liquidity: number
  token_liquidity: number
  creator_balance?: string
  description?: string
  website?: string
  twitter?: string
  telegram?: string
  rune?: string
  volumeMetrics?: VolumeMetrics
  creatorRisk: {
    tokenCount: number
    hasMultipleTokens: boolean
    otherTokens: Array<{
      id: string
      name: string
      ticker: string
    }>
  }
  creator_tokens_count?: number
  holders?: Holder[]
  trades?: any[]
}

interface Holder {
  user: string
  user_username?: string
  balance: string
  percentage: string
  pnl?: number
}

interface VolumeMetrics {
  volume24h: number
  volume24hUSD?: number
  averageDailyVolume: number
  averageDailyVolumeUSD?: number
  tradeCount24h: number
  buyVolume24h: number
  buyVolumeUSD?: number
  sellVolume24h: number
  sellVolumeUSD?: number
  buySellRatio: number
  spikeRatio: number
  volumeChange: string
}

interface HolderGrowthMetrics {
  dailyGrowth: {
    current: number
    previous: number
    growthRate: number
    newHolders: number
  }
  weeklyGrowth: {
    current: number
    previous: number
    growthRate: number
    newHolders: number
  }
  retentionRate: number
}

interface Trade {
  time: string
  amount_btc: string
  buy: boolean
}

interface RiskAssessment {
  level: string
  message: string
  warning: string
  color?: string
  stats?: {
    devPercentage: number
    top5Percentage: number
    top10Percentage: number
  }
}

// Helper functions
const formatUSDValue = (value: number | undefined | null): string => {
  if (value === undefined || value === null || isNaN(value)) return "$0.00"
  
  const absValue = Math.abs(value)
  if (absValue === 0) return "$0.00"
  if (absValue < 0.00001) return "<$0.00001"
  if (absValue < 1) return `$${absValue.toFixed(5)}`
  if (absValue < 1000) return `$${absValue.toFixed(2)}`
  // For values >= 1M, show as xx.xxK instead of xxxx.xxK
  if (absValue >= 1000000) return `$${(absValue / 1000000).toFixed(2)}K`
  // For regular thousands
  return `$${(absValue / 1000).toFixed(2)}K`
}

const formatSupply = (format: "short" | "full" = "short", supply?: string): string => {
  if (!supply) return "0"
  const num = Number(supply) / 1e11
  if (format === "short") {
    if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`
    if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`
    if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K`
    return num.toFixed(2)
  }
  return num.toLocaleString()
}

const formatTokenPrice = (price: number): string => {
  const properDecimal = price / 1000
  return `$${properDecimal.toFixed(5)}`
}

const formatMarketCap = (price: number, totalSupply: string, btcPrice: number): string => {
  const priceUsd = (price / 100000000) * btcPrice
  const supply = Number(totalSupply) / 1e11
  const marketCapUsd = priceUsd * supply
  return `$${(marketCapUsd / 1000000000).toFixed(2)}M`
}

const formatPercentage = (balance: string, totalSupply: string): string => {
  const balanceNum = Number(balance)
  const totalSupplyNum = Number(totalSupply)
  if (!balanceNum || !totalSupplyNum) return "0.00%"
  const percentage = (balanceNum / totalSupplyNum) * 100
  return `${percentage.toFixed(2)}%`
}

function forceHttps(url: string): string {
  if (!url) return url;
  return url.replace(/^http:\/\//i, 'https://');
}

// Mock data
const MOCK_TOKEN: Token = {
  id: "2ait",
  name: "AIEYE",
  ticker: "AIEYE",
  price: 0.0001,
  marketcap: 10000,
  volume: 5000,
  holder_count: 5,
  created_time: "2023-01-01T00:00:00Z",
  creator: "creator1",
  total_supply: "100000000000",
  btc_liquidity: 0.5,
  token_liquidity: 50000,
  description: "AI-powered token for the Odin ecosystem with advanced analytics and trading capabilities.",
  website: "https://example.com",
  twitter: "https://twitter.com/example",
  telegram: "https://t.me/example",
  rune: "ODINDOG•ID•YTTL•ODIN",
  creatorRisk: {
    tokenCount: 1,
    hasMultipleTokens: false,
    otherTokens: [],
  },
  creator_balance: "50000000000"
}

const MOCK_HOLDERS: Holder[] = [
  { user: "creator1", user_username: "Creator", balance: "50000000000", percentage: "100.00%" },
  { user: "user1", user_username: "Whale1", balance: "20000000000", percentage: "40.00%" },
  { user: "user2", user_username: "Whale2", balance: "10000000000", percentage: "20.00%" },
  { user: "user3", user_username: "Whale3", balance: "5000000000", percentage: "10.00%" },
  { user: "user4", user_username: "Whale4", balance: "2500000000", percentage: "5.00%" }
]

const MOCK_VOLUME_METRICS: VolumeMetrics = {
  volume24h: 5000,
  volume24hUSD: 500,
  averageDailyVolume: 3000,
  averageDailyVolumeUSD: 300,
  tradeCount24h: 42,
  buyVolume24h: 3000,
  buyVolumeUSD: 300,
  sellVolume24h: 2000,
  sellVolumeUSD: 200,
  buySellRatio: 1.5,
  spikeRatio: 1.67,
  volumeChange: "67.00",
}

const MOCK_HOLDER_GROWTH: HolderGrowthMetrics = {
  dailyGrowth: {
    current: 5,
    previous: 6,
    growthRate: -16.67,
    newHolders: -1,
  },
  weeklyGrowth: {
    current: 5,
    previous: 10,
    growthRate: -50,
    newHolders: -5,
  },
  retentionRate: 50,
}

// Components
const TokenHeader = ({ token, btcUsdPrice }: { token: Token; btcUsdPrice: number }) => {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center gap-6 p-6 bg-gradient-to-r from-[#1a1a2e] to-[#16213e] rounded-xl shadow-lg">
      <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden bg-[#0f3460] border-2 border-[#e94560]/30 shadow-glow">
        <Image
          src={forceHttps(`https://images.odin.fun/token/${token.id}`)}
          alt={token.name}
          fill
          className="object-cover"
          unoptimized
        />
      </div>

      <div className="flex-1">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <h1 className="text-2xl md:text-3xl font-bold text-white">{token.name}</h1>
          <span className="px-2 py-0.5 bg-[#0f3460] text-[#e94560] text-sm rounded-md">{token.ticker}</span>
        </div>

        <p className="text-gray-300 text-sm md:text-base mb-2 max-w-2xl">
          {token.description || "No description available"}
        </p>

        <div className="flex flex-wrap items-center gap-3 text-sm">
          {token.website && (
            <Link
              href={token.website}
              target="_blank"
              className="flex items-center gap-1 text-[#e94560] hover:text-[#ff6b6b] transition-colors"
            >
              <Globe className="h-4 w-4" />
              <span>Website</span>
            </Link>
          )}

          {token.twitter && (
            <Link
              href={token.twitter}
              target="_blank"
              className="flex items-center gap-1 text-[#e94560] hover:text-[#ff6b6b] transition-colors"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 1200 1227"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-[#e94560]"
              >
                <path
                  d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.137 519.284H714.163ZM569.165 687.828L521.697 619.934L144.011 79.6944H306.615L611.412 515.685L658.88 583.579L1055.08 1150.3H892.476L569.165 687.854V687.828Z"
                  fill="currentColor"
                />
              </svg>
              <span>Twitter</span>
            </Link>
          )}

          {token.telegram && (
            <Link
              href={token.telegram}
              target="_blank"
              className="flex items-center gap-1 text-[#e94560] hover:text-[#ff6b6b] transition-colors"
            >
              <Send className="h-4 w-4" />
              <span>Telegram</span>
            </Link>
          )}

          {token.rune && (
            <Link
              href={`https://unisat.io/runes/detail/${token.rune}`}
              target="_blank"
              className="flex items-center gap-1 text-[#e94560] hover:text-[#ff6b6b] transition-colors"
            >
              <Shield className="h-4 w-4" />
              <span>{token.rune}</span>
            </Link>
          )}
        </div>
      </div>

      <div className="flex flex-col items-end gap-2 mt-4 md:mt-0">
        <div className="text-3xl font-bold text-white">
          {formatTokenPrice((Number(token.price) / 100000000) * btcUsdPrice)}
        </div>
        <div className="text-[#e94560]">
          Market Cap: {formatMarketCap(token.price, token.total_supply, btcUsdPrice)}
        </div>
        <Button className="mt-2 bg-[#e94560] hover:bg-[#ff6b6b] text-white border-none">
          <Link href={`https://odin.fun/token/${token.id}`} target="_blank" className="flex items-center gap-2">
            <Wallet className="h-4 w-4" />
            <span>Trade Token</span>
          </Link>
        </Button>
      </div>
    </div>
  )
}

const StatCard = ({
  title,
  value,
  change,
  icon,
  bgClass = "bg-[#1a1a2e]",
}: {
  title: string
  value: string | number
  change?: { value: number; isPositive: boolean } | null
  icon: React.ReactNode
  bgClass?: string
}) => {
  // Format value if it's a number and includes "volume"
  const formattedValue = typeof value === 'number' && title.toLowerCase().includes('volume') 
    ? formatUSDValue(value)
    : value;

  return (
    <div className={`${bgClass} p-5 rounded-xl shadow-md border border-[#0f3460]`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-gray-400 text-sm">{title}</h3>
        <div className="p-2 bg-[#0f3460]/50 rounded-lg text-[#e94560]">{icon}</div>
      </div>
      <div className="text-xl font-bold text-white mb-1">{formattedValue}</div>
      {change && (
        <div className={`text-xs flex items-center ${change.isPositive ? "text-green-400" : "text-red-400"}`}>
          {change.isPositive ? <ChevronUp className="h-3 w-3 mr-1" /> : <ChevronDown className="h-3 w-3 mr-1" />}
          <span>{Math.abs(change.value).toFixed(2)}%</span>
        </div>
      )}
    </div>
  )
}

const RiskIndicator = ({ risk }: { risk: RiskAssessment }) => {
  const getBgColor = () => {
    if (risk.level.includes("LOW")) return "bg-gradient-to-r from-green-900/30 to-green-700/30 border-green-500/30"
    if (risk.level.includes("MEDIUM"))
      return "bg-gradient-to-r from-yellow-900/30 to-yellow-700/30 border-yellow-500/30"
    if (risk.level.includes("HIGH") || risk.level.includes("EXTREME"))
      return "bg-gradient-to-r from-red-900/30 to-red-700/30 border-red-500/30"
    return "bg-gradient-to-r from-gray-900/30 to-gray-700/30 border-gray-500/30"
  }

  const getTextColor = () => {
    if (risk.level.includes("LOW")) return "text-green-400"
    if (risk.level.includes("MEDIUM")) return "text-yellow-400"
    if (risk.level.includes("HIGH") || risk.level.includes("EXTREME")) return "text-red-400"
    return "text-gray-400"
  }

  return (
    <div className={`p-6 rounded-xl border ${getBgColor()}`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">Risk Assessment</h2>
        <div className={`px-3 py-1 rounded-full ${getTextColor()} border border-current text-sm font-medium`}>
          {risk.level}
        </div>
      </div>

      <p className="text-gray-300 mb-4">{risk.message}</p>
      <div className={`p-3 rounded-lg ${getTextColor()} bg-black/20 text-sm mb-4`}>{risk.warning}</div>

      {risk.stats && (
        <div className="space-y-3">
          <div className="flex flex-col">
            <div className="flex justify-between text-sm text-gray-400 mb-1">
              <span>Developer Holdings</span>
              <span className={getTextColor()}>{risk.stats.devPercentage.toFixed(2)}%</span>
            </div>
            <div className="w-full bg-gray-700/30 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${risk.stats.devPercentage > 30 ? "bg-red-500" : "bg-green-500"}`}
                style={{ width: `${Math.min(risk.stats.devPercentage, 100)}%` }}
              ></div>
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex justify-between text-sm text-gray-400 mb-1">
              <span>Top 5 Holders</span>
              <span className={getTextColor()}>{risk.stats.top5Percentage.toFixed(2)}%</span>
            </div>
            <div className="w-full bg-gray-700/30 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${risk.stats.top5Percentage > 50 ? "bg-red-500" : "bg-green-500"}`}
                style={{ width: `${Math.min(risk.stats.top5Percentage, 100)}%` }}
              ></div>
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex justify-between text-sm text-gray-400 mb-1">
              <span>Top 10 Holders</span>
              <span className={getTextColor()}>{risk.stats.top10Percentage.toFixed(2)}%</span>
            </div>
            <div className="w-full bg-gray-700/30 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${risk.stats.top10Percentage > 70 ? "bg-red-500" : "bg-green-500"}`}
                style={{ width: `${Math.min(risk.stats.top10Percentage, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const TopHoldersTable = ({ holders, tokenData }: { holders: Holder[]; tokenData: Token }) => {
  const [expanded, setExpanded] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [allHolders, setAllHolders] = useState<Holder[]>(holders);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 100;

  useEffect(() => {
    setAllHolders(holders);
  }, [holders]);

  const loadMoreHolders = async () => {
    try {
      setLoading(true);
      const nextPage = currentPage + 1;
      const response = await fetch(`https://api.humanz.fun/api/token/${tokenData.id}/owners?page=${nextPage}&limit=${pageSize}`, {
        headers: {
          'Accept': 'application/json'
        },
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch more holders');
      }

      const data = await response.json();
      setAllHolders(prev => [...prev, ...data.data]);
      setCurrentPage(nextPage);
      setTotalCount(data.count);
    } catch (error) {
      console.error('Error loading more holders:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!allHolders || allHolders.length === 0) {
    return (
      <div className="bg-[#1a1a2e] rounded-xl border border-[#0f3460] p-6 text-center">
        <div className="text-gray-400">No holder data available</div>
      </div>
    );
  }

  const displayHolders = expanded ? allHolders : allHolders.slice(0, 5);
  const hasMore = totalCount > allHolders.length;

  return (
    <div className="bg-[#1a1a2e] rounded-xl border border-[#0f3460] overflow-hidden">
      <div className="p-5 border-b border-[#0f3460]">
        <h2 className="text-xl font-bold text-white">Top Holders</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-[#0f3460]/50 text-left">
              <th className="p-3 text-gray-400 font-medium">#</th>
              <th className="p-3 text-gray-400 font-medium">Holder</th>
              <th className="p-3 text-gray-400 font-medium text-right">Balance</th>
              <th className="p-3 text-gray-400 font-medium text-right">% Supply</th>
            </tr>
          </thead>
          <tbody>
            {displayHolders.map((holder, index) => (
              <tr key={holder.user} className="border-b border-[#0f3460]/30 hover:bg-[#0f3460]/20">
                <td className="p-3 text-gray-400">{index + 1}</td>
                <td className="p-3">
                  <div className="flex items-center">
                    <Link
                      href={`https://odin.fun/user/${holder.user}`}
                      target="_blank"
                      className="text-[#e94560] hover:text-[#ff6b6b] flex items-center"
                    >
                      {holder.user_username || holder.user.substring(0, 8)}
                      <ExternalLink className="h-3 w-3 ml-1 inline" />
                    </Link>
                    {holder.user === tokenData.creator && (
                      <span className="ml-2 px-2 py-0.5 bg-[#0f3460] text-[#e94560] text-xs rounded-md">Creator</span>
                    )}
                  </div>
                </td>
                <td className="p-3 text-white text-right">
                  {(Number(holder.balance) / 1e11).toLocaleString()} {tokenData.ticker}
                </td>
                <td className="p-3 text-white text-right">{holder.percentage}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {allHolders.length > 5 && (
        <div className="p-3 border-t border-[#0f3460] text-center">
          <button
            onClick={() => {
              if (!expanded && hasMore) {
                loadMoreHolders();
              }
              setExpanded(!expanded);
            }}
            className="text-[#e94560] hover:text-[#ff6b6b] text-sm flex items-center justify-center w-full"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center">
                <div className="w-4 h-4 border-2 border-[#e94560] border-t-transparent rounded-full animate-spin mr-2"></div>
                Loading...
              </div>
            ) : expanded ? (
              <>
                Show Less <ChevronUp className="h-4 w-4 ml-1" />
              </>
            ) : (
              <>
                Show All Holders <ChevronDown className="h-4 w-4 ml-1" />
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

const VolumeAnalysis = ({ volumeMetrics }: { volumeMetrics: VolumeMetrics | null }) => {
  if (!volumeMetrics) return null

  return (
    <div className="bg-[#1a1a2e] rounded-xl border border-[#0f3460] overflow-hidden">
      <div className="p-5 border-b border-[#0f3460]">
        <h2 className="text-xl font-bold text-white">Volume Analysis</h2>
      </div>

      <div className="p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-[#0f3460]/30 p-4 rounded-lg">
            <div className="text-gray-400 text-sm mb-1">24h Volume</div>
            <div className="text-xl font-bold text-white">{formatUSDValue(volumeMetrics.volume24hUSD || 0)}</div>
            <div className="text-xs text-green-400 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              <span>{volumeMetrics.volumeChange}% from average</span>
            </div>
          </div>

          <div className="bg-[#0f3460]/30 p-4 rounded-lg">
            <div className="text-gray-400 text-sm mb-1">Buy/Sell Ratio</div>
            <div className="text-xl font-bold text-white">{volumeMetrics.buySellRatio.toFixed(2)}</div>
            <div className="flex mt-2 h-2 rounded-full overflow-hidden bg-gray-700/30">
              <div
                className="bg-green-500 h-full"
                style={{
                  width: `${(volumeMetrics.buyVolume24h / (volumeMetrics.buyVolume24h + volumeMetrics.sellVolume24h)) * 100}%`,
                }}
              ></div>
              <div
                className="bg-red-500 h-full"
                style={{
                  width: `${(volumeMetrics.sellVolume24h / (volumeMetrics.buyVolume24h + volumeMetrics.sellVolume24h)) * 100}%`,
                }}
              ></div>
            </div>
            <div className="flex justify-between text-xs mt-1">
              <span className="text-green-400">Buy: {formatUSDValue(volumeMetrics.buyVolumeUSD || 0)}</span>
              <span className="text-red-400">Sell: {formatUSDValue(volumeMetrics.sellVolumeUSD || 0)}</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between py-2 border-b border-[#0f3460]/30">
            <span className="text-gray-400">Average Daily Volume</span>
            <span className="text-white">{formatUSDValue(volumeMetrics.averageDailyVolumeUSD || 0)}</span>
          </div>

          <div className="flex justify-between py-2 border-b border-[#0f3460]/30">
            <span className="text-gray-400">24h Trades</span>
            <span className="text-white">{volumeMetrics.tradeCount24h}</span>
          </div>

          <div className="flex justify-between py-2 border-b border-[#0f3460]/30">
            <span className="text-gray-400">Volume Spike Ratio</span>
            <span className="text-white">{volumeMetrics.spikeRatio.toFixed(2)}x</span>
          </div>
        </div>
      </div>
    </div>
  )
}

const HolderGrowthCard = ({ holderAnalysis }: { holderAnalysis: HolderGrowthMetrics | null }) => {
  if (!holderAnalysis) return null

  return (
    <div className="bg-[#1a1a2e] rounded-xl border border-[#0f3460] overflow-hidden">
      <div className="p-5 border-b border-[#0f3460]">
        <h2 className="text-xl font-bold text-white">Holder Growth</h2>
      </div>

      <div className="p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-[#0f3460]/30 p-4 rounded-lg">
            <div className="text-gray-400 text-sm mb-1">Current Holders</div>
            <div className="text-xl font-bold text-white">{holderAnalysis.dailyGrowth.current}</div>
            <div
              className={`text-xs flex items-center mt-1 ${holderAnalysis.dailyGrowth.growthRate >= 0 ? "text-green-400" : "text-red-400"}`}
            >
              {holderAnalysis.dailyGrowth.growthRate >= 0 ? (
                <ChevronUp className="h-3 w-3 mr-1" />
              ) : (
                <ChevronDown className="h-3 w-3 mr-1" />
              )}
              <span>{Math.abs(holderAnalysis.dailyGrowth.growthRate).toFixed(2)}% in 24h</span>
            </div>
          </div>

          <div className="bg-[#0f3460]/30 p-4 rounded-lg">
            <div className="text-gray-400 text-sm mb-1">Retention Rate</div>
            <div className="text-xl font-bold text-white">{holderAnalysis.retentionRate}%</div>
            <div className="w-full bg-gray-700/30 rounded-full h-2 mt-2">
              <div
                className={`h-2 rounded-full ${holderAnalysis.retentionRate > 50 ? "bg-green-500" : "bg-red-500"}`}
                style={{ width: `${holderAnalysis.retentionRate}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between py-2 border-b border-[#0f3460]/30">
            <span className="text-gray-400">Daily Change</span>
            <span className={holderAnalysis.dailyGrowth.newHolders >= 0 ? "text-green-400" : "text-red-400"}>
              {holderAnalysis.dailyGrowth.newHolders > 0 ? "+" : ""}
              {holderAnalysis.dailyGrowth.newHolders}
            </span>
          </div>

          <div className="flex justify-between py-2 border-b border-[#0f3460]/30">
            <span className="text-gray-400">Weekly Change</span>
            <span className={holderAnalysis.weeklyGrowth.newHolders >= 0 ? "text-green-400" : "text-red-400"}>
              {holderAnalysis.weeklyGrowth.newHolders > 0 ? "+" : ""}
              {holderAnalysis.weeklyGrowth.newHolders}
            </span>
          </div>

          <div className="flex justify-between py-2 border-b border-[#0f3460]/30">
            <span className="text-gray-400">Previous Holders</span>
            <span className="text-white">{holderAnalysis.dailyGrowth.previous}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

const TokenOverview = ({ tokenData, creatorUsername }: { tokenData: Token; creatorUsername: string }) => {
  return (
    <div className="bg-[#1a1a2e] rounded-xl border border-[#0f3460] overflow-hidden">
      <div className="p-5 border-b border-[#0f3460]">
        <h2 className="text-xl font-bold text-white">Token Overview</h2>
      </div>

      <div className="p-5">
        <div className="space-y-3">
          <div className="flex justify-between py-2 border-b border-[#0f3460]/30">
            <span className="text-gray-400">Name</span>
            <span className="text-white">{tokenData.name}</span>
          </div>

          <div className="flex justify-between py-2 border-b border-[#0f3460]/30">
            <span className="text-gray-400">Ticker</span>
            <span className="text-white">{tokenData.ticker}</span>
          </div>

          <div className="flex justify-between py-2 border-b border-[#0f3460]/30">
            <span className="text-gray-400">Creator</span>
            <Link
              href={`https://odin.fun/user/${tokenData.creator}`}
              target="_blank"
              className="text-[#e94560] hover:text-[#ff6b6b]"
            >
              {creatorUsername}
            </Link>
          </div>

          <div className="flex justify-between py-2 border-b border-[#0f3460]/30">
            <span className="text-gray-400">Total Supply</span>
            <span className="text-white">
              {formatSupply("short", tokenData.total_supply)} {tokenData.ticker}
            </span>
          </div>

          <div className="flex justify-between py-2 border-b border-[#0f3460]/30">
            <span className="text-gray-400">Created</span>
            <span className="text-white">{new Date(tokenData.created_time).toLocaleDateString()}</span>
          </div>

          <div className="flex justify-between py-2 border-b border-[#0f3460]/30">
            <span className="text-gray-400">Liquidity</span>
            <span className="text-white">{Number(tokenData.token_liquidity) > 0 ? "Available" : "Not Available"}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// Add test cases for formatUSDValue
const testFormatUSDValue = () => {
  const testCases = [
    { input: 26170000, expected: "$26.17M" },
    { input: 26170, expected: "$26.17K" },
    { input: 26.17, expected: "$26.17" },
    { input: 0.00001, expected: "$0.00001" },
    { input: 1000000000, expected: "$1.00B" }
  ];

  testCases.forEach(({ input, expected }) => {
    const result = formatUSDValue(input);
    console.log(`Test case: ${input} -> ${result} (Expected: ${expected})`);
    if (result !== expected) {
      console.warn(`❌ Formatting mismatch for ${input}! Got: ${result}, Expected: ${expected}`);
    } else {
      console.log(`✅ Formatting correct for ${input}`);
    }
  });
};

export default function ResultsPage() {
  const searchParams = useSearchParams()
  const search = searchParams?.get("search") || ""

  const [tokenData, setTokenData] = useState<Token | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [holders, setHolders] = useState<Holder[]>([])
  const [creatorUsername, setCreatorUsername] = useState<string>("")
  const [btcUsdPrice, setBtcUsdPrice] = useState(0)
  const [holderAnalysis, setHolderAnalysis] = useState<HolderGrowthMetrics | null>(null)
  const [volumeMetrics, setVolumeMetrics] = useState<VolumeMetrics | null>(null)
  const [risk, setRisk] = useState<RiskAssessment | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!search) {
          setError("No token ID provided")
          setLoading(false)
          return
        }

        setLoading(true)

        // Fetch token data first
        const tokenResponse = await fetch(`https://api.humanz.fun/api/token/${search}`, {
          headers: {
            'Accept': 'application/json'
          },
          credentials: 'include'
        })
        if (!tokenResponse.ok) {
          throw new Error(`Failed to fetch token data: ${tokenResponse.status}`)
        }

        const tokenData = await tokenResponse.json()
        
        // Set initial data
        setTokenData(tokenData)
        setCreatorUsername(tokenData.creator_username || tokenData.creator)
        setBtcUsdPrice(30000) // Default BTC price
        
        // Calculate initial risk assessment
        const initialRisk = calculateRiskLevel(tokenData, [])
        setRisk(initialRisk)
        
        // Set loading to false after initial data is shown
        setLoading(false)

        // Fetch additional data in parallel
        const [btcPriceResponse, holdersResponse] = await Promise.all([
          fetch('https://mempool.space/api/v1/prices'),
          fetch(`https://api.humanz.fun/api/token/${search}/owners?page=1&limit=100`, {
            headers: {
              'Accept': 'application/json'
            },
            credentials: 'include'
          })
        ])

        if (!btcPriceResponse.ok) {
          throw new Error(`Failed to fetch BTC price: ${btcPriceResponse.status}`)
        }

        const btcPriceData = await btcPriceResponse.json()
        setBtcUsdPrice(btcPriceData.USD)

        if (holdersResponse.ok) {
          const holdersData = await holdersResponse.json()
          if (holdersData && holdersData.data) {
            setHolders(holdersData.data)
            
            // Update risk assessment with holders data
            const updatedRisk = calculateRiskLevel(tokenData, holdersData.data)
            setRisk(updatedRisk)
          }
        }

      } catch (error) {
        console.error("Error fetching data:", error)
        setError(error instanceof Error ? error.message : "Failed to fetch token data")
        setLoading(false)
      }
    }

    fetchData()
  }, [search])

  useEffect(() => {
    if (tokenData) {
      console.log('Volume data:', {
        rawVolume: tokenData.volumeUSD,
        formattedVolume: formatUSDValue(tokenData.volumeUSD)
      });
    }
  }, [tokenData]);

  // Run tests when component mounts
  useEffect(() => {
    testFormatUSDValue();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f0f1a] text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-[80vh]">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 border-4 border-[#e94560] border-t-transparent rounded-full animate-spin mb-4"></div>
              <h2 className="text-xl font-bold text-[#e94560]">Loading Token Data</h2>
              <p className="text-gray-400 mt-2">Analyzing token metrics and risk factors...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0f0f1a] text-white flex items-center justify-center">
        <div className="bg-[#1a1a2e] border border-[#e94560]/30 rounded-xl p-8 max-w-md w-full shadow-glow">
          <AlertTriangle className="h-16 w-16 text-[#e94560] mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white text-center mb-4">Error</h2>
          <p className="text-gray-300 text-center mb-6">{error}</p>
          <Button asChild className="w-full bg-[#e94560] hover:bg-[#ff6b6b] text-white">
            <Link href="/">Return Home</Link>
          </Button>
        </div>
      </div>
    )
  }

  if (!tokenData) {
    return (
      <div className="min-h-screen bg-[#0f0f1a] text-white flex items-center justify-center">
        <div className="bg-[#1a1a2e] border border-[#0f3460] rounded-xl p-8 max-w-md w-full">
          <Info className="h-16 w-16 text-[#e94560] mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white text-center mb-4">No Data Found</h2>
          <p className="text-gray-300 text-center mb-6">No token data available for the requested ID.</p>
          <Button asChild className="w-full bg-[#e94560] hover:bg-[#ff6b6b] text-white">
            <Link href="/">Return Home</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0f0f1a] text-white">
      {/* Header */}
      <header className="bg-[#1a1a2e] border-b border-[#0f3460] sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <Image
                  src={forceHttps("https://humanz.fun/humanz-logo-animated.gif")}
                  alt="HUMANZ Logo"
                  width={40}
                  height={40}
                  className="rounded-lg mr-3"
                  unoptimized
                />
                <div>
                  <h1 className="text-xl font-bold text-[#e94560]">HUMANZ</h1>
                  <div className="text-xs text-gray-400">SCANNER</div>
                </div>
              </Link>
            </div>

            <div className="flex items-center gap-3">
              <Button
                asChild
                variant="outline"
                size="sm"
                className="border-[#0f3460] text-gray-300 hover:text-white hover:bg-[#0f3460]"
              >
                <Link href="/tokens">
                  <Activity className="h-4 w-4 mr-2" />
                  All Tokens
                </Link>
              </Button>

              <Button asChild className="bg-[#e94560] hover:bg-[#ff6b6b] text-white">
                <Link href="/">
                  <Search className="h-4 w-4 mr-2" />
                  New Search
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* Back button */}
        <div className="mb-6">
          <Button asChild variant="ghost" size="sm" className="text-gray-400 hover:text-white">
            <Link href="/tokens">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Tokens
            </Link>
          </Button>
        </div>

        {/* Token header */}
        <TokenHeader token={tokenData} btcUsdPrice={btcUsdPrice} />

        {/* Key stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <StatCard
            title="Price"
            value={formatTokenPrice((Number(tokenData.price) / 100000000) * btcUsdPrice)}
            icon={<DollarSign className="h-5 w-5" />}
            bgClass="bg-gradient-to-br from-[#1a1a2e] to-[#16213e]"
          />

          <StatCard
            title="Holders"
            value={tokenData.holder_count}
            change={
              holderAnalysis
                ? {
                    value: holderAnalysis.dailyGrowth.growthRate,
                    isPositive: holderAnalysis.dailyGrowth.growthRate >= 0,
                  }
                : null
            }
            icon={<Users className="h-5 w-5" />}
            bgClass="bg-gradient-to-br from-[#1a1a2e] to-[#16213e]"
          />

          <StatCard
            title="Volume (24h)"
            value={tokenData.volumeUSD || 0}
            change={
              volumeMetrics
                ? { value: Number(volumeMetrics.volumeChange), isPositive: Number(volumeMetrics.volumeChange) >= 0 }
                : null
            }
            icon={<BarChart3 className="h-5 w-5" />}
            bgClass="bg-gradient-to-br from-[#1a1a2e] to-[#16213e]"
          />

          <StatCard
            title="Created"
            value={new Date(tokenData.created_time).toLocaleDateString()}
            icon={<Clock className="h-5 w-5" />}
            bgClass="bg-gradient-to-br from-[#1a1a2e] to-[#16213e]"
          />
        </div>

        {/* Main content in grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-6">
            {risk && <RiskIndicator risk={risk} />}
            <TopHoldersTable holders={holders} tokenData={tokenData} />
          </div>

          {/* Right column */}
          <div className="space-y-6">
            <TokenOverview tokenData={tokenData} creatorUsername={creatorUsername} />
            {holderAnalysis && <HolderGrowthCard holderAnalysis={holderAnalysis} />}
            {volumeMetrics && <VolumeAnalysis volumeMetrics={volumeMetrics} />}
          </div>
        </div>

        {/* Share section */}
        <div className="mt-6 bg-gradient-to-r from-[#1a1a2e] to-[#16213e] rounded-xl border border-[#0f3460] p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white mb-2">Share This Analysis</h2>
              <p className="text-gray-400">Share this token analysis with your community</p>
            </div>

            <div className="flex gap-3">
              <Button className="bg-[#0f3460] hover:bg-[#1a3d6e] text-white">
                <Share2 className="h-4 w-4 mr-2" />
                Copy Link
              </Button>

              <Button className="bg-[#e94560] hover:bg-[#ff6b6b] text-white">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 71 55"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="mr-2"
                >
                  <path
                    d="M60.1045 4.8978C55.5792 2.8214 50.7265 1.2916 45.6527 0.41542C45.5603 0.39851 45.468 0.440769 45.4204 0.525289C44.7963 1.6353 44.105 3.0834 43.6209 4.2216C38.1637 3.4046 32.7345 3.4046 27.3892 4.2216C26.905 3.0581 26.1886 1.6353 25.5617 0.525289C25.5141 0.443589 25.4218 0.40133 25.3294 0.41542C20.2584 1.2888 15.4057 2.8186 10.8776 4.8978C10.8384 4.9147 10.8048 4.9429 10.7825 4.9795C1.57795 18.7309 -0.943561 32.1443 0.293408 45.3914C0.299005 45.4562 0.335386 45.5182 0.385761 45.5576C6.45866 50.0174 12.3413 52.7249 18.1147 54.5195C18.2071 54.5477 18.305 54.5139 18.3638 54.4378C19.7295 52.5728 20.9469 50.6063 21.9907 48.5383C22.0523 48.4172 21.9935 48.2735 21.8676 48.2256C19.9366 47.4931 18.0979 46.6 16.3292 45.5858C16.1893 45.5041 16.1781 45.304 16.3068 45.2082C16.679 44.9293 17.0513 44.6391 17.4067 44.3461C17.471 44.2926 17.5606 44.2813 17.6362 44.3151C29.2558 49.6202 41.8354 49.6202 53.3179 44.3151C53.3935 44.2785 53.4831 44.2898 53.5502 44.3433C53.9057 44.6363 54.2779 44.9293 54.6529 45.2082C54.7816 45.304 54.7732 45.5041 54.6333 45.5858C52.8646 46.6197 51.0259 47.4931 49.0921 48.2228C48.9662 48.2707 48.9102 48.4172 48.9718 48.5383C50.038 50.6034 51.2554 52.5699 52.5959 54.435C52.6519 54.5139 52.7526 54.5477 52.845 54.5195C58.6464 52.7249 64.529 50.0174 70.6019 45.5576C70.6551 45.5182 70.6887 45.459 70.6943 45.3942C72.1747 30.0791 68.2147 16.7757 60.1968 4.9823C60.1772 4.9429 60.1437 4.9147 60.1045 4.8978ZM23.7259 37.3253C20.2276 37.3253 17.3451 34.1136 17.3451 30.1693C17.3451 26.225 20.1717 23.0133 23.7259 23.0133C27.308 23.0133 30.1626 26.2532 30.1066 30.1693C30.1066 34.1136 27.28 37.3253 23.7259 37.3253ZM47.3178 37.3253C43.8196 37.3253 40.9371 34.1136 40.9371 30.1693C40.9371 26.225 43.7636 23.0133 47.3178 23.0133C50.9 23.0133 53.7545 26.2532 53.6986 30.1693C53.6986 34.1136 50.9 37.3253 47.3178 37.3253Z"
                    fill="currentColor"
                  />
                </svg>
                Share to Discord
              </Button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#1a1a2e] border-t border-[#0f3460] mt-10 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Image
                src={forceHttps("https://humanz.fun/humanz-logo-animated.gif")}
                alt="HUMANZ Logo"
                width={30}
                height={30}
                className="rounded-md mr-2"
                unoptimized
              />
              <span className="font-bold text-[#e94560]">HUMANZ</span>
              <span className="text-xs ml-1 text-gray-400">SCANNER</span>
            </div>

            <div className="flex space-x-6 mb-4 md:mb-0">
              <Link href="/terms" className="text-gray-400 hover:text-[#e94560] transition-colors">
                Terms
              </Link>
              <Link href="/privacy" className="text-gray-400 hover:text-[#e94560] transition-colors">
                Privacy
              </Link>
              <Link href="/docs" className="text-gray-400 hover:text-[#e94560] transition-colors">
                Docs
              </Link>
            </div>

            <div className="text-sm text-gray-500 text-center md:text-right">
              © {new Date().getFullYear()} HUMANZ. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
