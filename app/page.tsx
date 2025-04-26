"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Search, Eye, Zap, Scan, Menu, X, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useMediaQuery } from "@/hooks/use-media-query"
import { fetchAllTokens } from "@/app/utils/api"

interface TokenData {
  id: string
  name: string
  ticker: string
  price: number
  marketcap: number
  holder_count: number
  volume: number
  price_1h: number
  btc_liquidity: number
  token_liquidity: number
  total_supply: string
  creator_balance?: string
}

export default function Home() {
  const [tokens, setTokens] = useState<TokenData[]>([])
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const isMobile = useMediaQuery("(max-width: 768px)")

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)
        setError(null)
  
        // Use the fetchAllTokens utility function
        const tokensData = await fetchAllTokens()
        // Add default values for missing fields
        const tokensWithDefaults = tokensData.map(token => ({
          price_1h: 0,
          btc_liquidity: 0,
          token_liquidity: 0,
          marketcap: token.marketcap ?? 0,
          volume: token.volume ?? 0,
          ...token,
        }))
        setTokens(tokensWithDefaults)
      } catch (error) {
        console.error("Error loading data:", error)
        setError(error instanceof Error ? error.message : "Failed to load data")
      } finally {
        setIsLoading(false)
      }
    }
  
    loadData()
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery) {
      window.location.href = `/results?search=${encodeURIComponent(searchQuery)}`
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0118] text-white overflow-hidden relative">
      {/* Background grid effect */}
      <div className="absolute inset-0 bg-[url('/images/humanz-background.png')] bg-cover bg-center opacity-40 z-0"></div>

      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/30 via-transparent to-purple-900/40 z-0"></div>

      {/* Header */}
      <header className="relative z-10 border-b border-purple-500/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 relative">
                <img 
                  src="https://humanz.fun/humanz-logo-animated.gif"
                  alt="HUMANZ Logo"
                  className="w-full h-full object-cover rounded-md"
                />
              </div>
              <div className="font-bold text-2xl tracking-wider text-white">
                <span className="text-[#f0c14b]">HUMANZ</span>
                <span className="text-xs ml-2 text-purple-300">SCANNER</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <NavLink href="/" label="Home" icon={<Eye className="w-4 h-4" />} />
            </nav>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(true)}
              className="md:hidden text-purple-300 hover:text-white hover:bg-purple-900/30"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex flex-col">
          <div className="flex justify-end p-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(false)}
              className="text-purple-300 hover:text-white"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>
          <div className="flex flex-col items-center justify-center space-y-8 flex-1">
            <MobileNavLink
              href="/"
              label="Home"
              icon={<Eye className="w-5 h-5" />}
              onClick={() => setIsMenuOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 relative z-10">
        {/* Hero Section */}
        <section className="py-8 md:py-20">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4 md:space-y-6">
                <div className="inline-block px-3 py-1 bg-purple-900/50 border border-purple-500/30 rounded-full text-purple-300 text-sm">
                  Odin.fun Token Analysis
                </div>
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight">
                  <span className="text-[#f0c14b]">Analyze</span> and <span className="text-[#f0c14b]">Track</span>{" "}
                  <br className="hidden md:block" />
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-300">
                    Odin Tokens
                  </span>
                </h1>
                <p className="text-base md:text-lg text-purple-200/80 max-w-md">
                  Advanced analytics for Odin.fun tokens with our proprietary risk assessment algorithm
                </p>

                {/* Search Box */}
                <div className="mt-6 md:mt-8">
                  <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                      <Input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Enter Odin token ID or address"
                        className="bg-purple-900/20 border-purple-500/30 focus:border-[#f0c14b] h-12 pl-10 text-white placeholder:text-purple-300/70"
                        required
                      />
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 h-5 w-5" />
                    </div>
                    <Button
                      type="submit"
                      className="h-12 px-6 bg-gradient-to-r from-[#f0c14b] to-[#e09f3e] text-black font-medium hover:opacity-90 transition-opacity"
                    >
                      Analyze
                    </Button>
                  </form>
                </div>
              </div>

              <div className="relative mt-6 md:mt-0">
                <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg blur-xl opacity-70"></div>
                <div className="relative bg-purple-900/30 border border-purple-500/30 rounded-lg p-4 md:p-6 backdrop-blur-sm">
                  <div className="w-full h-48 md:h-64 bg-purple-900/50 rounded-md flex items-center justify-center">
                    <img 
                      src="https://humanz.fun/new-eye-image.png" 
                      alt="HUMANZ Analysis" 
                      className="w-full h-full object-cover rounded-md"
                    />
                  </div>
                  <div className="mt-4 text-center">
                    <h3 className="text-xl font-semibold text-[#f0c14b]">All-Seeing Analysis</h3>
                    <p className="text-purple-300 text-sm mt-2">
                      Our algorithm sees everything, from token metrics to hidden risks
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Error display */}
        {error && (
          <section className="py-4">
            <div className="container mx-auto px-4">
              <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-4 text-red-300 text-sm">
                <p>Error loading data: {error}</p>
                <p className="mt-2">Don't worry, you can still use the search functionality.</p>
              </div>
            </div>
          </section>
        )}

        {/* Risk Assessment Section */}
        <section className="py-10 md:py-16 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/30 to-transparent"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-2xl md:text-4xl font-bold mb-3 md:mb-4">
                <span className="text-[#f0c14b]">Risk</span> <span className="text-white">Assessment</span>
              </h2>
              <p className="text-purple-300 max-w-2xl mx-auto text-sm md:text-base">
                Our advanced algorithm analyzes Odin.fun tokens across multiple risk categories
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              <RiskCard
                title="Low Risk"
                description="Tokens with verified creators, transparent launch, and balanced holder distribution"
                color="green"
              />
              <RiskCard
                title="Medium Risk"
                description="Tokens with some concerns but generally acceptable risk profiles for memecoin standards"
                color="yellow"
              />
              <RiskCard
                title="High Risk"
                description="Tokens with suspicious patterns, unknown creators, or highly concentrated ownership"
                color="red"
              />
            </div>
          </div>
        </section>

        {/* Token Metrics Section */}
        <section className="py-10 md:py-16 bg-purple-900/20 backdrop-blur-sm border-y border-purple-500/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-2xl md:text-4xl font-bold mb-3 md:mb-4">
                <span className="text-white">Comprehensive</span> <span className="text-[#f0c14b]">Token Metrics</span>
              </h2>
              <p className="text-purple-300 max-w-2xl mx-auto text-sm md:text-base">
                Get detailed insights into any Odin.fun token with our advanced analytics
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-4 md:p-6 backdrop-blur-sm">
                <h3 className="text-xl font-semibold text-[#f0c14b] mb-4">Key Metrics We Track</h3>
                <ul className="space-y-3">
                  <MetricItem icon={<Zap className="w-5 h-5" />} title="Market Cap & Volume" />
                  <MetricItem icon={<Eye className="w-5 h-5" />} title="Holder Distribution" />
                  <MetricItem icon={<Shield className="w-5 h-5" />} title="Creator Verification" />
                </ul>
                <div className="mt-6">
                  <Button className="w-full bg-gradient-to-r from-[#f0c14b] to-[#e09f3e] text-black">
                    View Sample Report
                  </Button>
                </div>
              </div>

              <div className="relative mt-6 md:mt-0">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg blur-md"></div>
                <div className="relative h-full flex flex-col bg-purple-900/40 border border-purple-500/30 rounded-lg p-4 md:p-6 backdrop-blur-sm overflow-hidden">
                  <div className="text-center mb-4">
                    <h4 className="text-lg font-semibold text-[#f0c14b] mb-2">Advanced Visualization</h4>
                    <p className="text-purple-300 text-sm">
                      Our reports include visual data representations for easier analysis
                    </p>
                  </div>

                  <div className="flex-1 flex items-center justify-center mt-4 relative">
                    <div className="w-36 h-36 md:w-64 md:h-64 relative bg-purple-900/50 rounded-lg flex items-center justify-center">
                      <img 
                        src="https://humanz.fun/humanz-logo-animated.gif" 
                        alt="HUMANZ Logo" 
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-10 md:py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-2xl md:text-4xl font-bold mb-3 md:mb-4">
                <span className="text-white">How It</span> <span className="text-[#f0c14b]">Works</span>
              </h2>
              <p className="text-purple-300 max-w-2xl mx-auto text-sm md:text-base">
                Our token analysis process is simple, fast, and comprehensive
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
              <StepCard
                number="01"
                title="Enter Token ID"
                description="Input any Odin.fun token ID or URL in our search box"
                icon={<Search className="w-6 h-6" />}
              />
              <StepCard
                number="02"
                title="AI Analysis"
                description="Our algorithm scans the token for risks and key metrics"
                icon={<Scan className="w-6 h-6" />}
              />
              <StepCard
                number="03"
                title="Review Report"
                description="Get a comprehensive analysis with actionable insights"
                icon={<Eye className="w-6 h-6" />}
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-10 md:py-16">
          <div className="container mx-auto px-4">
            <div className="bg-gradient-to-r from-purple-900/40 to-pink-900/40 border border-purple-500/30 rounded-lg p-4 md:p-8 backdrop-blur-sm">
              <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-center">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4">
                    <span className="text-[#f0c14b]">Ready</span> to Analyze Your{" "}
                    <span className="text-[#f0c14b]">Token?</span>
                  </h2>
                  <p className="text-purple-200 mb-4 md:mb-6 text-sm md:text-base">
                    Get started now with our advanced Odin.fun token analysis tool
                  </p>
                  <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                      <Input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Enter token ID or URL"
                        className="bg-purple-900/20 border-purple-500/30 focus:border-[#f0c14b] h-12 pl-10 text-white placeholder:text-purple-300/70"
                        required
                      />
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 h-5 w-5" />
                    </div>
                    <Button
                      type="submit"
                      className="h-12 px-6 bg-gradient-to-r from-[#f0c14b] to-[#e09f3e] text-black font-medium hover:opacity-90 transition-opacity"
                    >
                      Analyze Now
                    </Button>
                  </form>
                </div>
                <div className="flex justify-center md:justify-end mt-6 md:mt-0">
                  <div className="w-64 h-40 bg-purple-900/50 rounded-lg flex items-center justify-center">
                    <img 
                      src="https://humanz.fun/new-eye-image.png" 
                      alt="HUMANZ Image" 
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-purple-500/30 py-6 md:py-8 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="w-8 h-8 relative">
                <img 
                  src="https://humanz.fun/humanz-logo-animated.gif"
                  alt="HUMANZ Logo"
                  className="w-full h-full object-cover rounded-md"
                />
              </div>
              <span className="font-bold text-[#f0c14b] ml-2">HUMANZ</span>
              <span className="text-xs ml-1 text-purple-300">SCANNER</span>
            </div>

            <div className="flex space-x-6 mb-4 md:mb-0">
              <Link href="/terms" className="text-purple-300 hover:text-[#f0c14b] transition-colors">
                Terms
              </Link>
              <Link href="/privacy" className="text-purple-300 hover:text-[#f0c14b] transition-colors">
                Privacy
              </Link>
              <Link href="/docs" className="text-purple-300 hover:text-[#f0c14b] transition-colors">
                Docs
              </Link>
            </div>

            <div className="text-sm text-purple-400 text-center md:text-right">
              © {new Date().getFullYear()} HUMANZ. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

// Navigation Link Component
function NavLink({ href, label, icon }: { href: string; label: string; icon: React.ReactNode }) {
  return (
    <Link href={href} className="flex items-center space-x-1 text-purple-300 hover:text-[#f0c14b] transition-colors">
      {icon}
      <span>{label}</span>
    </Link>
  )
}

// Mobile Navigation Link Component
function MobileNavLink({
  href,
  label,
  icon,
  onClick,
}: {
  href: string
  label: string
  icon: React.ReactNode
  onClick: () => void
}) {
  return (
    <Link
      href={href}
      className="flex flex-col items-center space-y-2 text-purple-300 hover:text-[#f0c14b] transition-colors"
      onClick={onClick}
    >
      <div className="p-3 bg-purple-900/30 rounded-full border border-purple-500/30">{icon}</div>
      <span className="text-lg">{label}</span>
    </Link>
  )
}

// Risk Card Component
function RiskCard({
  title,
  description,
  color,
}: {
  title: string
  description: string
  color: "green" | "yellow" | "red"
}) {
  const colorClasses = {
    green: "from-green-500/20 to-green-700/20 border-green-500/30",
    yellow: "from-yellow-500/20 to-yellow-700/20 border-yellow-500/30",
    red: "from-red-500/20 to-red-700/20 border-red-500/30",
  }

  return (
    <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg overflow-hidden backdrop-blur-sm hover:border-[#f0c14b]/50 transition-all duration-300 group">
      <div className="p-3 md:p-4 flex items-center space-x-3 md:space-x-4">
        <div className="w-12 h-12 md:w-16 md:h-16 rounded-full overflow-hidden border-2 border-purple-500/30 flex-shrink-0 bg-purple-900/50 flex items-center justify-center">
          <div className="text-[#f0c14b] text-xl font-bold">{title.charAt(0)}</div>
        </div>
        <div>
          <h3 className="text-lg md:text-xl font-semibold text-white">{title}</h3>
          <div className={`h-2 w-20 md:w-24 mt-2 rounded-full bg-gradient-to-r ${colorClasses[color]}`}></div>
        </div>
      </div>
      <div className="p-3 md:p-4 border-t border-purple-500/30">
        <p className="text-purple-300 text-xs md:text-sm">{description}</p>
      </div>
    </div>
  )
}

// Metric Item Component
function MetricItem({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center space-x-3 p-3 bg-purple-900/40 rounded-lg border border-purple-500/20">
      <div className="text-[#f0c14b]">{icon}</div>
      <span className="text-white">{title}</span>
    </div>
  )
}

// Step Card Component
function StepCard({
  number,
  title,
  description,
  icon,
}: {
  number: string
  title: string
  description: string
  icon: React.ReactNode
}) {
  return (
    <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4 md:p-6 backdrop-blur-sm hover:border-[#f0c14b]/50 transition-all duration-300 relative overflow-hidden group">
      <div className="absolute -top-6 -right-6 text-6xl md:text-8xl font-bold text-purple-500/10 group-hover:text-[#f0c14b]/10 transition-colors">
        {number}
      </div>
      <div className="relative z-10">
        <div className="p-2 md:p-3 bg-gradient-to-br from-purple-800/50 to-purple-900/50 rounded-full w-10 h-10 md:w-14 md:h-14 flex items-center justify-center mb-3 md:mb-4 border border-purple-500/30">
          <div className="text-[#f0c14b]">{icon}</div>
        </div>
        <h3 className="text-lg md:text-xl font-semibold text-white mb-1 md:mb-2">{title}</h3>
        <p className="text-purple-300 text-xs md:text-sm">{description}</p>
      </div>
    </div>
  )
}
