'use client';

import React, { useEffect, useRef } from 'react';
import { CafeSpot } from '@/lib/types';
import type L from 'leaflet';

interface LeafletCafeMapProps {
  cafes: CafeSpot[];
  selectedCafeId: string | null;
  onSelectCafe: (cafe: CafeSpot) => void;
  selectedCity: string;
}

export default function LeafletCafeMap({
  cafes,
  selectedCafeId,
  onSelectCafe,
  selectedCity
}: LeafletCafeMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [id: string]: L.Marker }>({});

  useEffect(() => {
    if (!mapContainerRef.current || typeof window === 'undefined') return;

    let isCancelled = false;

    const setupMap = async () => {
      const leafletModule = await import('leaflet');
      const L = leafletModule.default || leafletModule;

      if (isCancelled || !mapContainerRef.current) return;

      if (!mapInstanceRef.current) {
        const map = L.map(mapContainerRef.current, {
          center: [47.6062, -122.3321],
          zoom: 12,
          zoomControl: false,
          attributionControl: true,
          scrollWheelZoom: false,
          preferCanvas: true
        });

        L.control.zoom({ position: 'bottomright' }).addTo(map);

        // OpenStreetMap Humanitarian Tiles
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

  return <div ref={mapContainerRef} className="w-full h-full" />;
}
