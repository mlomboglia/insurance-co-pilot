import './globals.css'
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import Navigation from '@/components/Navigation'
import { ErrorBoundary } from '@/components/ErrorBoundary'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
})

export const metadata: Metadata = {
  title: {
    default: 'Insurance Co-Pilot - AI-Powered Roadside Assistance',
    template: '%s | Insurance Co-Pilot'
  },
  description: 'Revolutionary AI-powered roadside assistance platform with voice interaction, real-time claim processing, and intelligent agent oversight. Experience the future of insurance technology.',
  keywords: [
    'insurance',
    'roadside assistance',
    'AI',
    'voice interface',
    'claim processing',
    'customer service',
    'automotive insurance',
    'emergency assistance'
  ],
  authors: [{ name: 'Insurance Co-Pilot Team' }],
  creator: 'Insurance Co-Pilot',
  publisher: 'Insurance Co-Pilot',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'Insurance Co-Pilot - AI-Powered Roadside Assistance',
    description: 'Revolutionary AI-powered roadside assistance platform with voice interaction and real-time claim processing.',
    siteName: 'Insurance Co-Pilot',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Insurance Co-Pilot Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Insurance Co-Pilot - AI-Powered Roadside Assistance',
    description: 'Revolutionary AI-powered roadside assistance platform with voice interaction and real-time claim processing.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_VERIFICATION_ID,
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />

        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://api.openai.com" />
        <link rel="dns-prefetch" href="https://api.openai.com" />

        {/* Performance hints */}
        <meta name="format-detection" content="telephone=no" />
        <meta name="msapplication-TileColor" content="#2563eb" />
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <ErrorBoundary>
          <Navigation />
          <main className="min-h-screen pt-24 md:pt-20">
            <div className="fade-in">
              {children}
            </div>
          </main>
        </ErrorBoundary>

        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebApplication',
              name: 'Insurance Co-Pilot',
              description: 'AI-powered roadside assistance platform with voice interaction and real-time claim processing.',
              url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
              applicationCategory: 'InsuranceApplication',
              operatingSystem: 'Web Browser',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD',
              },
              creator: {
                '@type': 'Organization',
                name: 'Insurance Co-Pilot Team',
              },
            }),
          }}
        />
      </body>
    </html>
  )
}