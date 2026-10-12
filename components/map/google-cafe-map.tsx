'use client';

import React, { useEffect, useRef, useState } from 'react';
import { CafeSpot } from '@/lib/types';

declare global {
  interface Window {
    gm_authFailure?: () => void;
  }
}

interface GoogleCafeMapProps {
  cafes: CafeSpot[];
  selectedCafeId: string | null;
  onSelectCafe: (cafe: CafeSpot) => void;
  selectedCity: string;
  apiKey: string;
  onErrorFallback?: () => void;
}

// Custom luxury dark roast map style matching #120e0a
const DARK_ROAST_MAP_STYLE: google.maps.MapTypeStyle[] = [
  { elementType: 'geometry', stylers: [{ color: '#16110c' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#16110c' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#d6bc9a' }] },
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#f59e0b' }]
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#ad8151' }]
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [{ color: '#111b15' }]
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#10b981' }]
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#251c15' }]
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#1c140e' }]
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#a89f91' }]
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{ color: '#38271a' }]
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#241910' }]
  },
  {
    featureType: 'transit',
    elementType: 'geometry',
    stylers: [{ color: '#1c140e' }]
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#0c141d' }]
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#38bdf8' }]
  }
];

export default function GoogleCafeMap({
  cafes,
  selectedCafeId,
  onSelectCafe,
  selectedCity,
  apiKey,
  onErrorFallback
}: GoogleCafeMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<{ [id: string]: google.maps.Marker }>({});
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Load Google Maps JavaScript API script
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (window.google?.maps) {
      setIsScriptLoaded(true);
      return;
    }

    const scriptId = 'google-maps-script';
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;

    window.gm_authFailure = () => {
      console.warn('Google Maps API authentication failed.');
      setLoadError('Google Maps API key error or quota exceeded.');
      if (onErrorFallback) onErrorFallback();
    };

    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => setIsScriptLoaded(true);
      script.onerror = () => {
        setLoadError('Failed to load Google Maps SDK');
        if (onErrorFallback) onErrorFallback();
      };
      document.head.appendChild(script);
    } else {
      script.addEventListener('load', () => setIsScriptLoaded(true));
    }
  }, [apiKey, onErrorFallback]);

  // Initialize and update Map
  useEffect(() => {
    if (!isScriptLoaded || !mapContainerRef.current || !window.google?.maps) return;

    // Create Map Instance if not exists
    if (!mapInstanceRef.current) {
      const initialCenter = cafes[0]
        ? { lat: cafes[0].lat, lng: cafes[0].lng }
        : { lat: 47.6062, lng: -122.3321 };

      const map = new google.maps.Map(mapContainerRef.current, {
        center: initialCenter,
        zoom: 13,
        styles: DARK_ROAST_MAP_STYLE,
        disableDefaultUI: false,
        zoomControl: true,
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: false,
        backgroundColor: '#120e0a'
      });

      infoWindowRef.current = new google.maps.InfoWindow({
        pixelOffset: new google.maps.Size(0, -32)
      });

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Clear existing markers
    Object.values(markersRef.current).forEach((m) => m.setMap(null));
    markersRef.current = {};

    const bounds = new google.maps.LatLngBounds();

    // Create custom SVG Pin Icon
    const getPinIcon = (isSanctuary: boolean, isSelected: boolean) => {
      const pinFill = isSelected ? '#d97706' : '#1c140e';
      const border = isSelected ? '#ffffff' : (isSanctuary ? '#10b981' : '#f59e0b');
      const innerCircle = isSanctuary ? '#065f46' : '#78350f';

      const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="38" height="46" viewBox="0 0 38 46">
          <defs>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="#000000" flood-opacity="0.8"/>
            </filter>
          </defs>
          <path d="M19 44 C12 31 3 25 3 16 A 16 16 0 0 1 35 16 C 35 25 26 31 19 44 Z" fill="${pinFill}" stroke="${border}" stroke-width="${isSelected ? '3' : '2'}" filter="url(#glow)"/>
          <circle cx="19" cy="16" r="10" fill="${innerCircle}"/>
          <text x="19" y="20.5" font-size="12" text-anchor="middle" fill="#faf5ee">☕</text>
        </svg>
      `;

      return {
        url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`,
        scaledSize: new google.maps.Size(38, 46),
        anchor: new google.maps.Point(19, 46)
      };
    };

    // Place markers for each cafe
    cafes.forEach((cafe) => {
      const isSelected = cafe.id === selectedCafeId;
      const isSanctuary = cafe.work_vibe === 'sanctuary';

      const marker = new google.maps.Marker({
        position: { lat: cafe.lat, lng: cafe.lng },
        map,
        title: cafe.name,
        icon: getPinIcon(isSanctuary, isSelected),
        zIndex: isSelected ? 999 : 100
      });

      marker.addListener('click', () => {
        onSelectCafe(cafe);

        if (infoWindowRef.current) {
          const contentString = `
            <div style="font-family: inherit; background: #1c1510; color: #faf5ee; padding: 4px; border-radius: 8px; width: 210px;">
              <div style="font-size: 10px; font-weight: 800; color: #f59e0b; text-transform: uppercase;">
                ⚡ ${cafe.wifi_speed_mbps} Mbps Wi-Fi • ${cafe.neighborhood}
              </div>
              <div style="font-size: 14px; font-weight: 800; color: #ffffff; margin-top: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                ${cafe.name}
              </div>
              <div style="font-size: 11px; color: #a89f91; margin-top: 2px;">
                ${cafe.tagline}
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 8px; padding-top: 6px; border-top: 1px solid #36291e;">
                <span style="font-size: 11px; font-weight: 700; color: #10b981;">${cafe.rating} ★ (${cafe.review_count})</span>
                <span style="font-size: 10px; background: rgba(217, 119, 6, 0.2); color: #f59e0b; padding: 2px 6px; border-radius: 4px; font-weight: 700;">Explore</span>
              </div>
            </div>
          `;
          infoWindowRef.current.setContent(contentString);
          infoWindowRef.current.open(map, marker);
        }
      });

      markersRef.current[cafe.id] = marker;
      bounds.extend({ lat: cafe.lat, lng: cafe.lng });
    });

    // Animate to selected cafe or fit bounds
    if (selectedCafeId && markersRef.current[selectedCafeId]) {
      const selectedCafe = cafes.find((c) => c.id === selectedCafeId);
      if (selectedCafe) {
        map.panTo({ lat: selectedCafe.lat, lng: selectedCafe.lng });
        map.setZoom(14);
      }
    } else if (cafes.length > 0) {
      map.fitBounds(bounds, 40);
    }
  }, [isScriptLoaded, cafes, selectedCafeId, onSelectCafe, selectedCity]);

  if (loadError) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-[#16110c] text-stone-300 rounded-3xl border border-[#2d2218] gap-3">
        <span className="text-2xl">⚠️</span>
        <h4 className="font-bold text-white text-sm">Google Maps Notice</h4>
        <p className="text-xs text-stone-400 max-w-sm">
          {loadError} Switching to OpenStreetMap.
        </p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainerRef} className="w-full h-full" />
      {!isScriptLoaded && (
        <div className="absolute inset-0 bg-[#16110c] flex flex-col items-center justify-center text-stone-400 text-xs gap-3">
          <div className="w-6 h-6 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
          <span>Loading Google Maps Radar...</span>
        </div>
      )}
    </div>
  );
}
