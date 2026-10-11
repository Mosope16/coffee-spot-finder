import type { Metadata } from 'next';
import './globals.css';
import 'leaflet/dist/leaflet.css';
import ServiceWorkerRegistration from '@/components/service-worker-registration';

export const metadata: Metadata = {
  title: 'Coffee Spot Finder | Remote Work Cafés, Wi-Fi & Outlets',
  description: 'Find verified remote work cafes with gigabit Wi-Fi, plenty of power outlets, quiet seating, and specialty pour-overs via OpenStreetMap.',
  keywords: ['coffee shop finder', 'work cafes', 'digital nomad cafes', 'wifi coffee shops', 'remote work coffee', 'openstreetmap cafes']
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta name="theme-color" content="#120e0a" />
      </head>
      <body className="min-h-screen bg-[#120e0a] text-stone-100 antialiased selection:bg-amber-600/30 selection:text-amber-200">
        <ServiceWorkerRegistration />
        {children}
      </body>
    </html>
  );
}
