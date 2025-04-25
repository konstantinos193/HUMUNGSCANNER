import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'HUMANZ Scanner - Odin Token Analysis',
  description: 'Advanced analytics and risk assessment for Odin.fun tokens',
  generator: 'Next.js',
  icons: {
    icon: 'https://humanz.fun/humanz-logo-animated.gif',
    apple: 'https://humanz.fun/humanz-logo-animated.gif',
  },
  manifest: '/manifest.json',
  keywords: ['Odin', 'token analysis', 'crypto', 'HUMANZ', 'scanner'],
  authors: [{ name: 'HUMANZ' }],
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  themeColor: '#0a0118',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="https://humanz.fun/humanz-logo-animated.gif" type="image/gif" />
        <link rel="apple-touch-icon" href="https://humanz.fun/humanz-logo-animated.gif" />
      </head>
      <body className="min-h-screen bg-[#0a0118]">{children}</body>
    </html>
  )
}
