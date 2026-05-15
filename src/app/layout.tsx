import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

export const metadata: Metadata = {
  title: {
    template: '%s | The Lineage of Jesus from Adam',
    default: 'The Lineage of Jesus from Adam | Interactive Genealogy',
  },
  description: 'Explore the complete biblical family tree from Adam to Jesus Christ. Trace the Royal line through Matthew 1 and the Biological line through Luke 3 in this interactive visualization. All scripture references use the New Living Translation (NLT).',
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
    'NLT Bible genealogy'
  ],
  metadataBase: new URL('https://fromadamtojesus.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'The Lineage of Jesus from Adam | Interactive Genealogy',
    description: 'Explore the complete biblical family tree from Adam to Jesus Christ. Trace the Royal and Biological lines with interactive maps and NLT verses.',
    url: 'https://fromadamtojesus.com',
    siteName: 'The Lineage of Jesus',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Lineage of Jesus from Adam | Interactive Genealogy',
    description: 'Explore the complete biblical family tree from Adam to Jesus Christ. Trace the Royal and Biological lines with interactive maps and NLT verses.',
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

export const runtime = 'edge';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable} bg-black`}>
      <body className="font-sans antialiased bg-black text-zinc-50">
        {children}
      </body>
    </html>
  )
}
