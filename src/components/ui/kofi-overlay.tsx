'use client';

import Script from 'next/script';

export function KofiOverlay() {
  return (
    <Script
      src="https://storage.ko-fi.com/cdn/scripts/overlay-widget.js"
      strategy="afterInteractive"
      onLoad={() => {
        // @ts-expect-error: kofiWidgetOverlay is globally injected
        if (typeof kofiWidgetOverlay !== 'undefined') {
          // @ts-expect-error: kofiWidgetOverlay is globally injected
          kofiWidgetOverlay.draw('nakowafers', {
            'type': 'floating-chat',
            'floating-chat.donateButton.text': 'Support me',
            'floating-chat.donateButton.background-color': '#ff6700', // Matching your theme color
            'floating-chat.donateButton.text-color': '#fff'
          });
        }
      }}
    />
  );
}
