'use client';

import React, { useEffect, useRef } from 'react';
import { CafeSpot } from '@/lib/types';
import { WORK_VIBE_META } from '@/lib/constants';
import L from 'leaflet';

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

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [47.6062, -122.3321],
        zoom: 12,
        zoomControl: false,
        attributionControl: true
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
      const glow = isSelected ? 'box-shadow: 0 0 20px #f59e0b, 0 0 35px #d97706;' : `box-shadow: 0 0 10px ${pinColor};`;

      const html = `
        <div style="position: relative; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center;">
          ${isSelected ? `<span style="position: absolute; width: 100%; height: 100%; border-radius: 9999px; background: ${pinColor}; opacity: 0.75; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></span>` : ''}
          <div style="
            position: relative;
            width: 32px;
            height: 32px;
            border-radius: 9999px;
            background: #1c140e;
            border: 2px solid ${pinColor};
            ${glow}
            display: flex;
            align-items: center;
            justify-content: center;
            color: #faf5ee;
            font-size: 15px;
          ">
            ☕
          </div>
        </div>
      `;

      return L.divIcon({
        html,
        className: 'custom-cafe-pin',
        iconSize: [36, 36],
        iconAnchor: [18, 18],
        popupAnchor: [0, -18]
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
        map.flyTo([target.lat, target.lng], 14, { duration: 1.2 });
        markersRef.current[selectedCafeId].openPopup();
      }
    } else if (cafes.length > 0) {
      const bounds = L.latLngBounds(cafes.map((c) => [c.lat, c.lng]));
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
    }
  }, [cafes, selectedCafeId, onSelectCafe, selectedCity]);

  return (
    <div className="relative w-full h-full min-h-[380px] rounded-3xl overflow-hidden border border-[#2d2218] shadow-2xl bg-[#14100c]">
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Floating Radar Tag */}
      <div className="absolute top-4 left-4 z-[400] flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-stone-800 text-xs font-semibold text-white shadow-lg">
        <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
        <span>Café Radar</span>
        <span className="text-[10px] text-amber-400 font-bold">({cafes.length} Spots)</span>
      </div>
    </div>
  );
}
