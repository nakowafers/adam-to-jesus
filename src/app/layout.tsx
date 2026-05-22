import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { SiteHeader } from '@/components/site-header'
import './globals.css'

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

export const metadata: Metadata = {
  title: {
    template: '%s | From Adam to Jesus',
    default: 'From Adam to Jesus',
  },
  description: 'Explore the biblical narrative through interactive history — the genealogy of Jesus, the twelve apostles, and more.',
  keywords: [
    'Genealogy of Jesus',
    'Adam to Jesus timeline',
    'Biblical family tree',
    'Matthew 1',
    'Luke 3',
    'Bible genealogy',
    'Jesus lineage',
    'Royal line of David',
    'Biological line of Jesus',
    'NLT Bible genealogy',
    'Disciples of Jesus',
    'Apostles',
    'Biblical history',
  ],
  metadataBase: new URL('https://fromadamtojesus.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'From Adam to Jesus',
    description: 'Explore the biblical narrative through interactive history — the genealogy of Jesus, the twelve apostles, and more.',
    url: 'https://fromadamtojesus.com',
    siteName: 'From Adam to Jesus',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'From Adam to Jesus',
    description: 'Explore the biblical narrative through interactive history — the genealogy of Jesus, the twelve apostles, and more.',
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable} bg-black`}>
      <body className="font-sans antialiased bg-black text-zinc-50">
        <SiteHeader />
        {children}
      </body>
    </html>
  )
}
