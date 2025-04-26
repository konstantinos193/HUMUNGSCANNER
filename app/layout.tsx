import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'HUMANZ Scanner - Odin Token Analysis',
  description: 'Advanced analytics and risk assessment for Odin.fun tokens',
  generator: 'Next.js',
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
        {/* Removed icon and apple-touch-icon links, and manifest */}
      </head>
      <body className="min-h-screen bg-[#0a0118]">{children}</body>
    </html>
  )
}
