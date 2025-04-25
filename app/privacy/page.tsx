import Link from "next/link"
import Image from "next/image"
import { ArrowLeft } from "lucide-react"

export default function PrivacyPage() {
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
                src="https://humanz.fun/humanz-logo-animated.gif"
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
            <h1 className="text-2xl md:text-4xl font-bold mb-4 md:mb-6 text-[#f0c14b]">Privacy Policy</h1>

            <div className="space-y-4 md:space-y-6 text-purple-100 text-sm md:text-base">
              <section>
                <h2 className="text-lg md:text-xl font-semibold mb-2 md:mb-3 text-white">1. Information We Collect</h2>
                <p>
                  We do not collect any personal information from our users. HUMANZ SCANNER operates with complete
                  privacy, and we do not track, store, or process any personal data.
                </p>
              </section>

              <section>
                <h2 className="text-lg md:text-xl font-semibold mb-2 md:mb-3 text-white">2. Our Privacy Commitment</h2>
                <p>
                  Since we don't collect any personal information, there's nothing to use or share. Our service is
                  designed to provide token analysis without requiring any personal data from our users.
                </p>
              </section>

              <section>
                <h2 className="text-lg md:text-xl font-semibold mb-2 md:mb-3 text-white">3. No Information Sharing</h2>
                <p>
                  We don't collect personal information, so there's nothing to share with third parties. Your privacy is
                  completely protected when using our service.
                </p>
              </section>

              <section>
                <h2 className="text-lg md:text-xl font-semibold mb-2 md:mb-3 text-white">4. Data Security</h2>
                <p>
                  While we don't collect personal data, we still maintain high security standards for our platform to
                  ensure the integrity of our service.
                </p>
              </section>

              <section>
                <h2 className="text-lg md:text-xl font-semibold mb-2 md:mb-3 text-white">5. No Cookies or Tracking</h2>
                <p>
                  We do not use cookies or any tracking technologies to monitor user behavior or collect information.
                </p>
              </section>

              <section>
                <h2 className="text-lg md:text-xl font-semibold mb-2 md:mb-3 text-white">6. Your Rights</h2>
                <p>
                  Depending on your location, you may have certain rights regarding your personal information, such as
                  the right to access, correct, or delete your personal information.
                </p>
              </section>

              <section>
                <h2 className="text-lg md:text-xl font-semibold mb-2 md:mb-3 text-white">
                  7. Changes to This Privacy Policy
                </h2>
                <p>
                  We may update this privacy policy from time to time. We will notify you of any changes by posting the
                  new privacy policy on this page.
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
