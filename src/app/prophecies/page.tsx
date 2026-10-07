import type { Metadata } from 'next';
import { Suspense } from 'react';
import { prophecyRepository } from '@/lib/scripture/prophecy-repository';
import { PropheciesLedgerView } from '@/components/scripture/prophecies-ledger-view';
import type { ProphecyItem } from '@/lib/scripture/prophecies-data';

export const metadata: Metadata = {
  title: 'Old Testament Prophecies Fulfilled in the Gospels | From Adam to Jesus',
  description: 'Explore 20 canonical Old Testament messianic prophecies and their exact fulfillment recorded by the Gospel writers in the English Standard Version (ESV).',
  keywords: [
    'Messianic Prophecies',
    'Old Testament Prophecy',
    'Gospel Fulfillment',
    'Prophecies of Jesus',
    'ESV Bible',
    'Isaiah 53',
    'Psalm 22',
    'Micah 5:2',
    'Virgin Birth Prophecy',
    'Suffering Servant',
    'Biblical Archeology and Prophecy',
  ],
  alternates: {
    canonical: '/prophecies',
  },
  openGraph: {
    title: 'Old Testament Prophecies Fulfilled in the Gospels | From Adam to Jesus',
    description: 'Explore 20 canonical Old Testament messianic prophecies and their exact fulfillment recorded by the Gospel writers in the English Standard Version (ESV).',
    url: 'https://fromadamtojesus.com/prophecies',
    siteName: 'From Adam to Jesus',
    locale: 'en_US',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Old Testament Prophecies Fulfilled in the Gospels | From Adam to Jesus',
    description: 'Explore 20 canonical Old Testament messianic prophecies and their exact fulfillment recorded by the Gospel writers in the English Standard Version (ESV).',
  },
};

function getPropheciesJsonLd(items: ProphecyItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Old Testament Prophecies Fulfilled in the Gospels',
    description: 'A canonical catalog comparing Old Testament messianic prophecies with their Gospel fulfillments (ESV).',
    itemListElement: items.map((prophecy, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Article',
        name: prophecy.prophecyTitle,
        headline: prophecy.prophecyTitle,
        description: prophecy.prophecyDescription,
        articleSection: prophecy.theme,
        text: `Prophecy: ${prophecy.otReference} — "${prophecy.otEsvText}". Fulfillment: ${prophecy.ntReference} — "${prophecy.ntEsvText}". ${prophecy.significance}`,
        url: `https://fromadamtojesus.com/prophecies#${prophecy.id}`,
      },
    })),
  };
}

export default async function PropheciesPage() {
  const initialProphecies = await prophecyRepository.getAllProphecies();
  const jsonLd = getPropheciesJsonLd(initialProphecies);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Suspense
        fallback={
          <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center py-24">
            <div className="text-center space-y-3">
              <div className="w-8 h-8 border-2 border-stone-300 border-t-amber-800 rounded-full animate-spin mx-auto" />
              <p className="text-stone-500 text-xs font-mono">Loading messianic prophecies...</p>
            </div>
          </div>
        }
      >
        <PropheciesLedgerView initialProphecies={initialProphecies} />
      </Suspense>
    </>
  );
}
