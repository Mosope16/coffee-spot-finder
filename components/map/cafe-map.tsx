'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { CafeSpot } from '@/lib/types';
import { Wifi, Star, ChevronRight, X, ExternalLink, Compass } from 'lucide-react';

const GoogleCafeMap = dynamic(() => import('./google-cafe-map'), { ssr: false });
const LeafletCafeMap = dynamic(() => import('./leaflet-cafe-map'), { ssr: false });

interface CafeMapProps {
  cafes: CafeSpot[];
  selectedCafeId: string | null;
  onSelectCafe: (cafe: CafeSpot) => void;
  selectedCity: string;
}

export default function CafeMap({
  cafes,
  selectedCafeId,
  onSelectCafe,
  selectedCity
}: CafeMapProps) {
  const googleApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';
  // Default to OSM so map is instantly crystal-clear with zero watermarks or billing restrictions
  const [mapEngine, setMapEngine] = useState<'google' | 'osm'>('osm');
  const [dismissedPreviewId, setDismissedPreviewId] = useState<string | null>(null);

  const selectedCafe =
    selectedCafeId && dismissedPreviewId !== selectedCafeId
      ? cafes.find((c) => c.id === selectedCafeId)
      : null;

  const handleGoogleFallback = () => {
    console.warn('Google Maps unavailable. Switching to OpenStreetMap engine.');
    setMapEngine('osm');
  };

  const getDirectionsUrl = (cafe: CafeSpot) =>
    `https://www.google.com/maps/dir/?api=1&destination=${cafe.lat},${cafe.lng}&destination_place_id=${encodeURIComponent(cafe.name)}`;

  return (
    <div className="relative w-full h-full min-h-[360px] sm:min-h-[420px] rounded-2xl sm:rounded-3xl overflow-hidden border border-[#2d2218] shadow-2xl bg-[#14100c]">
      {/* Active Map Engine Rendering */}
      {mapEngine === 'google' && googleApiKey ? (
        <GoogleCafeMap
          cafes={cafes}
          selectedCafeId={selectedCafeId}
          onSelectCafe={onSelectCafe}
          selectedCity={selectedCity}
          apiKey={googleApiKey}
          onErrorFallback={handleGoogleFallback}
        />
      ) : (
        <LeafletCafeMap
          cafes={cafes}
          selectedCafeId={selectedCafeId}
          onSelectCafe={onSelectCafe}
          selectedCity={selectedCity}
        />
      )}

      {/* Floating Radar Tag (Top Left) */}
      <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-[20] flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-black/85 border border-stone-800 text-[11px] sm:text-xs font-semibold text-white shadow-lg pointer-events-none backdrop-blur-md">
        <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
        <span>Café Radar</span>
        <span className="text-[10px] text-amber-400 font-bold">({cafes.length} Spots)</span>
      </div>

      {/* Map Engine Switcher (Top Right) */}
      <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-[20] flex items-center p-0.5 rounded-full bg-black/85 border border-stone-800 shadow-xl backdrop-blur-md">
        <button
          onClick={() => setMapEngine('google')}
          className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-bold transition-all ${
            mapEngine === 'google'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'text-stone-400 hover:text-stone-200'
          }`}
          title="Switch to Google Maps"
        >
          <span>Google</span>
        </button>
        <button
          onClick={() => setMapEngine('osm')}
          className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-bold transition-all ${
            mapEngine === 'osm'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'text-stone-400 hover:text-stone-200'
          }`}
          title="Switch to OpenStreetMap"
        >
          <span>OSM</span>
        </button>
      </div>

      {/* Floating Selected Café Preview Card */}
      {selectedCafe && (
        <div className="absolute bottom-3 left-3 right-3 sm:left-auto sm:right-4 sm:w-84 z-[20] bg-[#1a140f]/95 border border-amber-500/40 rounded-2xl p-2.5 sm:p-3 shadow-2xl backdrop-blur-md animate-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center justify-between pb-1.5 border-b border-[#2d2218] mb-2">
            <span className="text-[10px] font-bold uppercase text-amber-400 tracking-wider flex items-center gap-1">
              📍 Pin Selected
            </span>
            <div className="flex items-center gap-1">
              <a
                href={getDirectionsUrl(selectedCafe)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-[10px] font-bold text-amber-400 hover:text-amber-300 hover:underline px-1.5 py-0.5 rounded bg-black/40 border border-amber-500/30 transition-colors"
                title="Get Directions in Google Maps"
              >
                <span>Directions</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
              <button
                onClick={() => setDismissedPreviewId(selectedCafe.id)}
                className="p-1 rounded-full text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
                title="Dismiss preview"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden shrink-0 border border-[#2d2218]">
              <Image
                src={selectedCafe.images[0]}
                alt={selectedCafe.name}
                fill
                sizes="56px"
                className="object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-black text-white truncate">{selectedCafe.name}</h4>
              <p className="text-[11px] text-amber-300 truncate">{selectedCafe.neighborhood}</p>
              <div className="flex items-center gap-2 mt-0.5 text-[10px]">
                <span className="text-emerald-400 font-bold flex items-center gap-0.5">
                  <Wifi className="w-3 h-3" />
                  {selectedCafe.wifi_speed_mbps}M
                </span>
                <span className="text-stone-500">•</span>
                <span className="text-amber-300 font-bold flex items-center gap-0.5">
                  <Star className="w-3 h-3 fill-amber-300" />
                  {selectedCafe.rating}
                </span>
              </div>
            </div>
            <button
              onClick={() => onSelectCafe(selectedCafe)}
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shrink-0 transition-all shadow-md active:scale-95 flex items-center gap-1"
              title="Open full café details"
            >
              <span className="hidden sm:inline">View</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
