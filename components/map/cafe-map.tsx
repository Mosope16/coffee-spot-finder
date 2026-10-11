'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { CafeSpot } from '@/lib/types';
import { WORK_VIBE_META } from '@/lib/constants';
import { Wifi, Star, ChevronRight, X } from 'lucide-react';
import type L from 'leaflet';

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
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [id: string]: L.Marker }>({});
  const [dismissedPreviewId, setDismissedPreviewId] = useState<string | null>(null);

  const selectedCafe = selectedCafeId && dismissedPreviewId !== selectedCafeId
    ? cafes.find((c) => c.id === selectedCafeId)
    : null;

  useEffect(() => {
    if (!mapContainerRef.current || typeof window === 'undefined') return;

    let isCancelled = false;

    const setupMap = async () => {
      // Dynamic import to prevent "window is not defined" error in Node / SSR / Vercel
      const leafletModule = await import('leaflet');
      const L = leafletModule.default || leafletModule;

      if (isCancelled || !mapContainerRef.current) return;

      if (!mapInstanceRef.current) {
        const map = L.map(mapContainerRef.current, {
          center: [47.6062, -122.3321],
          zoom: 12,
          zoomControl: false,
          attributionControl: true,
          scrollWheelZoom: false, // Prevent hijacking scroll wheel
          preferCanvas: true      // Hardware-accelerated canvas markers
        });

        L.control.zoom({ position: 'bottomright' }).addTo(map);

        // OpenStreetMap Humanitarian Tiles - 100% Free, Zero Keys
        L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        mapInstanceRef.current = map;
      }

      const map = mapInstanceRef.current;

      // Clear previous markers
      Object.values(markersRef.current).forEach((m) => m.remove());
      markersRef.current = {};

      // Create Custom Coffee Pin
      const createCafePin = (cafe: CafeSpot, isSelected: boolean) => {
        const isSanctuary = cafe.work_vibe === 'sanctuary';
        const pinColor = isSanctuary ? '#10b981' : '#d97706';
        const ring = isSelected
          ? 'border: 2px solid #ffffff; box-shadow: 0 0 16px #f59e0b;'
          : `border: 2px solid ${pinColor};`;

        const html = `
          <div style="position: relative; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center;">
            ${isSelected ? `<span style="position: absolute; inset: -4px; border-radius: 9999px; border: 2px solid #f59e0b; opacity: 0.85;"></span>` : ''}
            <div style="
              position: relative;
              width: 30px;
              height: 30px;
              border-radius: 9999px;
              background: #1c140e;
              ${ring}
              display: flex;
              align-items: center;
              justify-content: center;
              color: #faf5ee;
              font-size: 14px;
            ">
              ☕
            </div>
          </div>
        `;

        return L.divIcon({
          html,
          className: 'custom-cafe-pin',
          iconSize: [34, 34],
          iconAnchor: [17, 17],
          popupAnchor: [0, -17]
        });
      };

      // Add markers for all visible cafes
      cafes.forEach((c) => {
        const isSelected = c.id === selectedCafeId;
        const marker = L.marker([c.lat, c.lng], {
          icon: createCafePin(c, isSelected)
        }).addTo(map);

        const popupHtml = `
          <div style="font-family: inherit; width: 210px; padding: 4px;">
            <div style="font-size: 10px; font-weight: 800; color: #f59e0b; text-transform: uppercase;">⚡ ${c.wifi_speed_mbps} Mbps Wi-Fi • ${c.neighborhood}</div>
            <div style="font-size: 14px; font-weight: 800; color: #ffffff; margin-top: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${c.name}</div>
            <div style="font-size: 11px; color: #a89f91; margin-top: 2px; line-clamp: 2;">${c.tagline}</div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 8px; padding-top: 6px; border-top: 1px solid #36291e;">
              <span style="font-size: 11px; font-weight: 700; color: #10b981;">${c.rating} ★ (${c.review_count})</span>
              <span style="font-size: 10px; background: rgba(217, 119, 6, 0.2); color: #f59e0b; padding: 2px 6px; border-radius: 4px; font-weight: 700;">Explore</span>
            </div>
          </div>
        `;

        marker.bindPopup(popupHtml);
        marker.on('click', () => {
          onSelectCafe(c);
        });

        markersRef.current[c.id] = marker;
      });

      // Fly to selected or fit bounds
      if (selectedCafeId && markersRef.current[selectedCafeId]) {
        const target = cafes.find((c) => c.id === selectedCafeId);
        if (target) {
          map.flyTo([target.lat, target.lng], 14, { duration: 0.8 });
          markersRef.current[selectedCafeId].openPopup();
        }
      } else if (cafes.length > 0) {
        const bounds = L.latLngBounds(cafes.map((c) => [c.lat, c.lng]));
        map.fitBounds(bounds, { padding: [35, 35], maxZoom: 14 });
      }
    };

    setupMap();

    return () => {
      isCancelled = true;
    };
  }, [cafes, selectedCafeId, onSelectCafe, selectedCity]);

  return (
    <div className="relative w-full h-full min-h-[360px] sm:min-h-[420px] rounded-2xl sm:rounded-3xl overflow-hidden border border-[#2d2218] shadow-2xl bg-[#14100c]">
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Floating Radar Tag */}
      <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-[20] flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-black/85 border border-stone-800 text-[11px] sm:text-xs font-semibold text-white shadow-lg pointer-events-none">
        <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
        <span>Café Radar</span>
        <span className="text-[10px] text-amber-400 font-bold">({cafes.length} Spots)</span>
      </div>

      {/* Floating Selected Café Preview Card (Optimized for mobile & tablet screens) */}
      {selectedCafe && (
        <div className="absolute bottom-3 left-3 right-3 sm:left-auto sm:right-4 sm:w-80 z-[20] bg-[#1a140f]/95 border border-amber-500/40 rounded-2xl p-2.5 sm:p-3 shadow-2xl backdrop-blur-md animate-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center justify-between pb-1.5 border-b border-[#2d2218] mb-2">
            <span className="text-[10px] font-bold uppercase text-amber-400 tracking-wider flex items-center gap-1">
              📍 Pin Selected
            </span>
            <button
              onClick={() => setDismissedPreviewId(selectedCafe.id)}
              className="p-1 rounded-full text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
              title="Dismiss preview"
            >
              <X className="w-3.5 h-3.5" />
            </button>
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
