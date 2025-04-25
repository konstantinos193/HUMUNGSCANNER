import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Search, Eye, Shield, Zap } from "lucide-react"

export default function DocsPage() {
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
              <Image
                src="/images/humanz-logo-animated.jpeg"
                alt="HUMANZ Logo"
                width={40}
                height={40}
                className="rounded-md"
              />
              <div className="font-bold text-2xl tracking-wider text-white">
                <span className="text-[#f0c14b]">HUMANZ</span>
                <span className="text-xs ml-2 text-purple-300">SCANNER</span>
              </div>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 relative z-10">
        <div className="container mx-auto px-4 py-6 md:py-12">
          <div className="mb-6 md:mb-8">
            <Link href="/" className="flex items-center text-purple-300 hover:text-[#f0c14b] transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              <span>Back to Home</span>
            </Link>
          </div>

          <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-4 md:p-8 backdrop-blur-sm">
            <h1 className="text-2xl md:text-4xl font-bold mb-4 md:mb-6 text-[#f0c14b]">Documentation</h1>

            <div className="space-y-6 md:space-y-8 text-purple-100 text-sm md:text-base">
              <section>
                <h2 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4 text-white">Getting Started</h2>
                <p className="mb-3 md:mb-4">
                  HUMANZ SCANNER is a powerful tool for analyzing Odin.fun tokens. This documentation will help you
                  understand how to use our platform effectively.
                </p>
                <div className="bg-purple-900/40 border border-purple-500/20 rounded-lg p-3 md:p-4 mt-3 md:mt-4">
                  <h3 className="text-base md:text-lg font-medium mb-2 text-[#f0c14b]">Quick Start</h3>
                  <ol className="list-decimal pl-5 md:pl-6 space-y-1 md:space-y-2">
                    <li>Enter an Odin.fun token ID or URL in the search box</li>
                    <li>Click "Analyze" to generate a comprehensive report</li>
                    <li>Review the analysis results and metrics</li>
                  </ol>
                </div>
              </section>

              <section>
                <h2 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4 text-white">Features</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mt-3 md:mt-4">
                  <div className="bg-purple-900/40 border border-purple-500/20 rounded-lg p-3 md:p-4">
                    <div className="flex items-center mb-2">
                      <Search className="w-4 h-4 md:w-5 md:h-5 text-[#f0c14b] mr-2" />
                      <h3 className="text-base md:text-lg font-medium text-white">Token Search</h3>
                    </div>
                    <p className="text-xs md:text-sm text-purple-200">
                      Search for any Odin.fun token using its ID or URL to get detailed analysis.
                    </p>
                  </div>

                  <div className="bg-purple-900/40 border border-purple-500/20 rounded-lg p-3 md:p-4">
                    <div className="flex items-center mb-2">
                      <Shield className="w-4 h-4 md:w-5 md:h-5 text-[#f0c14b] mr-2" />
                      <h3 className="text-base md:text-lg font-medium text-white">Risk Assessment</h3>
                    </div>
                    <p className="text-xs md:text-sm text-purple-200">
                      Get a comprehensive risk evaluation based on multiple factors.
                    </p>
                  </div>

                  <div className="bg-purple-900/40 border border-purple-500/20 rounded-lg p-3 md:p-4">
                    <div className="flex items-center mb-2">
                      <Zap className="w-4 h-4 md:w-5 md:h-5 text-[#f0c14b] mr-2" />
                      <h3 className="text-base md:text-lg font-medium text-white">Market Metrics</h3>
                    </div>
                    <p className="text-xs md:text-sm text-purple-200">
                      View detailed market metrics including price, volume, and market cap.
                    </p>
                  </div>

                  <div className="bg-purple-900/40 border border-purple-500/20 rounded-lg p-3 md:p-4">
                    <div className="flex items-center mb-2">
                      <Eye className="w-4 h-4 md:w-5 md:h-5 text-[#f0c14b] mr-2" />
                      <h3 className="text-base md:text-lg font-medium text-white">Holder Analysis</h3>
                    </div>
                    <p className="text-xs md:text-sm text-purple-200">
                      Analyze token holder distribution and concentration.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4 text-white">Understanding Risk Levels</h2>

                <div className="space-y-3 md:space-y-4 mt-3 md:mt-4">
                  <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-3 md:p-4">
                    <h3 className="text-base md:text-lg font-medium text-green-400 mb-1 md:mb-2">Low Risk</h3>
                    <p className="text-xs md:text-sm text-purple-200">
                      Tokens with verified creators, transparent launch, and balanced holder distribution.
                    </p>
                  </div>

                  <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-3 md:p-4">
                    <h3 className="text-base md:text-lg font-medium text-yellow-400 mb-1 md:mb-2">Medium Risk</h3>
                    <p className="text-xs md:text-sm text-purple-200">
                      Tokens with some concerns but generally acceptable risk profiles for memecoin standards.
                    </p>
                  </div>

                  <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3 md:p-4">
                    <h3 className="text-base md:text-lg font-medium text-red-400 mb-1 md:mb-2">High Risk</h3>
                    <p className="text-xs md:text-sm text-purple-200">
                      Tokens with suspicious patterns, unknown creators, or highly concentrated ownership.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4 text-white">FAQ</h2>

                <div className="space-y-3 md:space-y-4 mt-3 md:mt-4">
                  <div className="bg-purple-900/40 border border-purple-500/20 rounded-lg p-3 md:p-4">
                    <h3 className="text-base md:text-lg font-medium text-[#f0c14b] mb-1 md:mb-2">
                      Is this financial advice?
                    </h3>
                    <p className="text-xs md:text-sm text-purple-200">
                      No, HUMANZ SCANNER provides analysis and metrics but does not offer financial advice. Always do
                      your own research before making investment decisions.
                    </p>
                  </div>

                  <div className="bg-purple-900/40 border border-purple-500/20 rounded-lg p-3 md:p-4">
                    <h3 className="text-base md:text-lg font-medium text-[#f0c14b] mb-1 md:mb-2">
                      How accurate is the risk assessment?
                    </h3>
                    <p className="text-xs md:text-sm text-purple-200">
                      Our risk assessment algorithm analyzes multiple factors to provide an accurate evaluation, but no
                      system is perfect. Use our analysis as one of many tools in your research process.
                    </p>
                  </div>

                  <div className="bg-purple-900/40 border border-purple-500/20 rounded-lg p-3 md:p-4">
                    <h3 className="text-base md:text-lg font-medium text-[#f0c14b] mb-1 md:mb-2">
                      How often is data updated?
                    </h3>
                    <p className="text-xs md:text-sm text-purple-200">
                      We update our data regularly to provide the most current information available.
                    </p>
                  </div>

                  <div className="bg-purple-900/40 border border-purple-500/20 rounded-lg p-3 md:p-4">
                    <h3 className="text-base md:text-lg font-medium text-[#f0c14b] mb-1 md:mb-2">
                      Do you collect my personal data?
                    </h3>
                    <p className="text-xs md:text-sm text-purple-200">
                      No, HUMANZ SCANNER does not collect any personal information from our users. We don't track your
                      device, IP address, or any other personal identifiers. Your privacy is our priority.
                    </p>
                  </div>
                </div>
              </section>
            </div>

            <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t border-purple-500/30 text-purple-300 text-xs md:text-sm">
              <p>Last updated: {new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-purple-500/30 py-6 md:py-8 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Image
                src="/images/humanz-logo-animated.jpeg"
                alt="HUMANZ Logo"
                width={30}
                height={30}
                className="rounded-md"
              />
              <span className="ml-2 font-bold text-[#f0c14b]">HUMANZ</span>
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
