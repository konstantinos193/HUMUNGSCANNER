import Link from "next/link"
import Image from "next/image"
import { ArrowLeft } from "lucide-react"

export default function TermsPage() {
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
            <h1 className="text-2xl md:text-4xl font-bold mb-4 md:mb-6 text-[#f0c14b]">Terms of Service</h1>

            <div className="space-y-4 md:space-y-6 text-purple-100 text-sm md:text-base">
              <section>
                <h2 className="text-lg md:text-xl font-semibold mb-2 md:mb-3 text-white">1. Acceptance of Terms</h2>
                <p>
                  By accessing or using HUMANZ SCANNER, you agree to be bound by these Terms of Service. If you do not
                  agree to these terms, please do not use our service.
                </p>
              </section>

              <section>
                <h2 className="text-lg md:text-xl font-semibold mb-2 md:mb-3 text-white">2. Description of Service</h2>
                <p>
                  HUMANZ SCANNER provides token analysis for Odin.fun tokens. Our service is provided "as is" and "as
                  available" without warranties of any kind.
                </p>
              </section>

              <section>
                <h2 className="text-lg md:text-xl font-semibold mb-2 md:mb-3 text-white">3. User Responsibilities</h2>
                <p>
                  Users are responsible for all activity that occurs under their account. You agree not to use the
                  service for any illegal purposes or to conduct any illegal activity.
                </p>
              </section>

              <section>
                <h2 className="text-lg md:text-xl font-semibold mb-2 md:mb-3 text-white">4. Limitation of Liability</h2>
                <p>
                  HUMANZ SCANNER shall not be liable for any direct, indirect, incidental, special, consequential, or
                  exemplary damages resulting from your use of the service. Our analysis is provided for informational
                  purposes only.
                </p>
              </section>

              <section>
                <h2 className="text-lg md:text-xl font-semibold mb-2 md:mb-3 text-white">5. Risk Disclaimer</h2>
                <p>
                  Cryptocurrency investments are volatile and high risk. Our analysis is not financial advice. Always
                  conduct your own research before making investment decisions.
                </p>
              </section>

              <section>
                <h2 className="text-lg md:text-xl font-semibold mb-2 md:mb-3 text-white">6. Modifications to Terms</h2>
                <p>
                  We reserve the right to modify these terms at any time. Continued use of the service after any
                  modifications indicates your acceptance of the modified terms.
                </p>
              </section>

              <section>
                <h2 className="text-lg md:text-xl font-semibold mb-2 md:mb-3 text-white">7. Governing Law</h2>
                <p>
                  These terms shall be governed by and construed in accordance with the laws of the jurisdiction in
                  which HUMANZ SCANNER operates, without regard to its conflict of law provisions.
                </p>
              </section>

              <section>
                <h2 className="text-lg md:text-xl font-semibold mb-2 md:mb-3 text-white">8. Privacy Commitment</h2>
                <p>
                  We are committed to user privacy. HUMANZ SCANNER does not collect any personal information from users.
                  We do not track, store, or process any personal data while you use our service.
                </p>
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
                src="https://humanz.fun/humanz-logo-animated.gif"
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
