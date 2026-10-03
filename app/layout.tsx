import type { Metadata } from 'next';
import './globals.css';
import ServiceWorkerRegistration from '@/components/service-worker-registration';

export const metadata: Metadata = {
  title: 'Coffee Shop Finder | Remote Work Cafés, Wi-Fi & Outlets',
  description: 'Find verified remote work cafes with gigabit Wi-Fi, plenty of power outlets, quiet seating, and specialty pour-overs.',
  keywords: ['coffee shop finder', 'work cafes', 'digital nomad cafes', 'wifi coffee shops', 'remote work coffee']
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
        <meta name="theme-color" content="#120e0a" />
      </head>
      <body className="min-h-screen bg-[#120e0a] text-stone-100 antialiased selection:bg-amber-600/30 selection:text-amber-200">
        <ServiceWorkerRegistration />
        {children}
      </body>
    </html>
  );
}
