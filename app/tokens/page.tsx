"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { Search, Filter, ChevronRight, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { calculateRiskLevel } from "../utils/calculateRiskLevel"
import { fetchAllTokens, generateMockTokens, API_ENDPOINTS } from "../utils/api"

interface Token {
  id: string
  name: string
  ticker: string
  price: number
  marketcap?: number
  volume?: number
  holder_count: number
  created_time: string
  creator: string
  total_supply: string
  creator_balance?: string
}

const formatPrice = (price: number): string => {
  if (price >= 1000000) {
    return `$${(price / 1000000).toFixed(2)}M`
  } else if (price >= 1000) {
    return `$${(price / 1000).toFixed(2)}K`
  } else if (price >= 1) {
    return `$${price.toFixed(2)}`
  } else if (price >= 0.01) {
    return `$${price.toFixed(2)}`
  } else if (price >= 0.0001) {
    return `$${price.toFixed(5)}`
  } else {
    return `$${price.toFixed(6)}`
  }
}

// Token card component
const TokenCard = ({ token }: { token: Token }) => {
  const [risk, setRisk] = useState({ level: "Loading...", color: "text-purple-300", warning: "" })

  useEffect(() => {
    // Calculate risk level
    const riskAssessment = calculateRiskLevel(token)
    setRisk(riskAssessment)
  }, [token])

  return (
    <Card className="bg-gray-900/80 border-purple-500/30 overflow-hidden hover:border-[#f0c14b]/50 transition-all duration-300">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-900/50 rounded-lg flex items-center justify-center text-[#f0c14b] font-bold">
              {token.ticker.substring(0, 4)}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[#f0c14b] truncate max-w-[150px]">{token.name}</h3>
              <div className="text-purple-300 text-sm">{token.ticker}</div>
            </div>
          </div>
          <div className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${risk.color} bg-black/30`}>
            <AlertTriangle className="h-3 w-3 mr-1" />
            {risk.level}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-y-2 text-sm">
          <div className="text-purple-300/70">Price:</div>
          <div className="text-[#f0c14b] font-medium text-right">{formatPrice(token.price)}</div>

          <div className="text-purple-300/70">Holders:</div>
          <div className="text-[#f0c14b] text-right">{token.holder_count}</div>
        </div>

        <div className="mt-3 text-xs text-purple-300/50">{risk.warning}</div>

        <div className="mt-4 flex justify-between items-center">
          <div className="text-xs text-purple-300/50">{new Date(token.created_time).toLocaleDateString()}</div>
          <Link
            href={`/results?search=${token.id}`}
            className="inline-flex items-center text-purple-300 hover:text-[#f0c14b] transition-colors px-3 py-1 rounded-md hover:bg-purple-900/30"
          >
            View Details <ChevronRight className="ml-1 h-3 w-3" />
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

export default function TokensPage() {
  const [tokens, setTokens] = useState<Token[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentTime, setCurrentTime] = useState<string>("")

  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(new Date().toLocaleTimeString('en-US'));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Load tokens
  const loadTokens = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      console.log("Loading tokens...")

      const tokensData = await fetchAllTokens()
      console.log("Received tokens data:", { count: tokensData.length })

      if (tokensData && tokensData.length > 0) {
        // Sort by newest first
        const sortedTokens = tokensData
          .sort((a: Token, b: Token) => new Date(b.created_time).getTime() - new Date(a.created_time).getTime())
          .map((token: Token) => ({
            ...token,
            name: token.name || `Token ${token.id}`,
            ticker: token.ticker || `TKN${token.id}`,
            price: Number(token.price || 0),
            holder_count: token.holder_count || 0,
          }))

        setTokens(sortedTokens)
        setError(null)
      } else {
        setTokens([])
        setError("No tokens returned from API")
      }
    } catch (error) {
      console.error("Error loading tokens:", error)
      setError(error instanceof Error ? error.message : "Failed to load tokens")
      setTokens([])
    } finally {
      console.log("Setting loading to false")
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadTokens()
  }, [loadTokens])

  // Filter tokens based on search
  const filteredTokens = tokens.filter(
    (token) =>
      token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      token.ticker.toLowerCase().includes(searchQuery.toLowerCase()) ||
      token.id.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  console.log("Render state:", { loading, tokensCount: tokens.length, filteredCount: filteredTokens.length, error })

  return (
    <div className="min-h-screen w-full bg-[#0a0118] text-white">
      {/* Background grid effect */}
      <div className="absolute inset-0 bg-[url('/images/humanz-background.png')] bg-cover bg-center opacity-40 z-0"></div>

      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/30 via-transparent to-purple-900/40 z-0"></div>

      <div className="container px-4 py-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Header with logo and title */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-purple-900 rounded-md flex items-center justify-center text-[#f0c14b] font-bold mr-3">
                H
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-[#f0c14b]">HUMANZ</h1>
                <div className="text-xs text-purple-300">SCANNER</div>
              </div>
            </div>

            <Button asChild className="bg-gradient-to-r from-[#f0c14b] to-[#e09f3e] text-black hover:opacity-90">
              <Link href="/">Analyze</Link>
            </Button>
          </div>

          {/* API endpoint display for debugging */}
          <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-2 mb-4 text-xs text-purple-300">
            Using API: {API_ENDPOINTS.allTokens}
          </div>

          {/* Search bar */}
          <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-4 mb-6">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-purple-300/50" />
                </div>
                <Input
                  placeholder="Search tokens..."
                  className="pl-10 bg-purple-900/20 border-purple-500/30 focus:border-[#f0c14b] text-[#f0c14b] placeholder:text-purple-300/50"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <Button variant="outline" className="gap-2 border-purple-500/30 text-purple-300 bg-black/50">
                <Filter className="h-4 w-4" />
                Filters
              </Button>
            </div>
          </div>

          {/* Token grid */}
          <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-4">
            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block w-6 h-6 border-2 border-purple-300/30 border-t-[#f0c14b] rounded-full animate-spin"></div>
                <p className="mt-2 text-purple-300">Loading tokens...</p>
              </div>
            ) : error ? (
              <div className="text-center py-8 text-red-400">
                <AlertTriangle className="h-6 w-6 mx-auto mb-2" />
                <p>{error}</p>
                <Button onClick={loadTokens} className="mt-4 bg-purple-900/50 text-purple-300 hover:bg-purple-900/70">
                  Try Again
                </Button>
              </div>
            ) : filteredTokens.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTokens.map((token) => (
                  <TokenCard key={`token-${token.id}`} token={token} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-purple-300">No tokens found matching your search.</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-6 text-center text-sm text-purple-300/50">
            Updated {currentTime}
          </div>
        </div>
      </div>
    </div>
  )
}
