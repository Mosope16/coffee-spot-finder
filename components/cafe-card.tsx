'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { CafeSpot } from '@/lib/types';
import { WORK_VIBE_META, BUSYNESS_META, OUTLET_DENSITY_META } from '@/lib/constants';
import {
  Wifi,
  Zap,
  MapPin,
  Star,
  Heart,
  Clock,
  Coffee,
  ChevronRight
} from 'lucide-react';

interface CafeCardProps {
  cafe: CafeSpot;
  isSelected: boolean;
  isSaved: boolean;
  priority?: boolean;
  onSelect: (cafe: CafeSpot) => void;
  onToggleSave: (e: React.MouseEvent, cafeId: string) => void;
  onOpenCheckIn: (e: React.MouseEvent, cafe: CafeSpot) => void;
}

export default function CafeCard({
  cafe,
  isSelected,
  isSaved,
  priority = false,
  onSelect,
  onToggleSave,
  onOpenCheckIn
}: CafeCardProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const vibeMeta = WORK_VIBE_META[cafe.work_vibe];
  const busynessMeta = BUSYNESS_META[cafe.live_busyness];
  const outletMeta = OUTLET_DENSITY_META[cafe.outlet_density];

  return (
    <div
      onClick={() => onSelect(cafe)}
      className={`group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 border flex flex-col justify-between ${
        isSelected
          ? 'bg-[#1b1510] border-amber-500 shadow-warm ring-2 ring-amber-500/30'
          : 'bg-[#1b1510]/95 border-[#2d2218] hover:border-stone-700 hover:shadow-card hover:-translate-y-0.5'
      }`}
    >
      {/* Photo Header */}
      <div className="relative h-48 w-full overflow-hidden bg-stone-950">
        <Image
          src={cafe.images[0]}
          alt={cafe.name}
          fill
          priority={priority}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1b1510] via-[#1b1510]/20 to-black/60" />

        {/* Work Vibe Badge (Top Left) */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border backdrop-blur-md ${vibeMeta.badgeClass} bg-black/40`}>
            {vibeMeta.label}
          </span>
        </div>

        {/* Favorite Button (Top Right) */}
        <button
          onClick={(e) => onToggleSave(e, cafe.id)}
          className="absolute top-3 right-3 p-2 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white hover:bg-black/80 transition-all active:scale-90 z-10"
          title={isSaved ? 'Remove from favorites' : 'Save café'}
        >
          <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-rose-500 text-rose-500' : 'text-stone-200'}`} />
        </button>

        {/* Bottom Banner Stats: Wi-Fi Speed & Busyness */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2">
          {/* Wi-Fi Speed Tag */}
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-emerald-500/40 text-emerald-300 text-xs font-bold">
            <Wifi className="w-3.5 h-3.5 text-emerald-400" />
            <span>{cafe.wifi_speed_mbps} Mbps</span>
          </div>

          {/* Live Busyness Pill */}
          <div className={`px-2.5 py-1 rounded-full text-[10px] font-bold border backdrop-blur-md flex items-center gap-1.5 ${busynessMeta.badgeClass} bg-black/60`}>
            <span
              className="w-1.5 h-1.5 rounded-full animate-ping"
              style={{ backgroundColor: busynessMeta.color }}
            />
            <span>{busynessMeta.label}</span>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Location & Rating */}
          <div className="flex items-center justify-between gap-2 text-xs mb-1">
            <div className="flex items-center gap-1 text-amber-400/90 font-semibold truncate">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{cafe.neighborhood}</span>
              <span className="text-stone-500">•</span>
              <span className="text-stone-400 font-normal">{cafe.city}</span>
            </div>

            <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-[#2d2218] text-amber-300 text-xs font-bold shrink-0">
              <Star className="w-3 h-3 fill-amber-300" />
              <span>{cafe.rating}</span>
            </div>
          </div>

          {/* Café Name */}
          <h3 className="font-extrabold text-base text-white group-hover:text-amber-400 transition-colors line-clamp-1 mb-1">
            {cafe.name}
          </h3>

          {/* Tagline */}
          <p className="text-xs text-stone-400 line-clamp-2 leading-relaxed mb-3">
            {cafe.tagline}
          </p>

          {/* Outlets & Specialty Highlights */}
          <div className="flex flex-wrap items-center gap-1.5 text-[11px] mb-3">
            <span className="px-2 py-0.5 rounded-md bg-[#251d16] border border-[#382b20] text-stone-300 flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-400" />
              {outletMeta.label}
            </span>

            {cafe.coffee_specialties[0] && (
              <span className="px-2 py-0.5 rounded-md bg-[#251d16] border border-[#382b20] text-amber-300/90 truncate max-w-[170px]">
                ☕ {cafe.coffee_specialties[0]}
              </span>
            )}
          </div>
        </div>

        {/* Card Footer: Hours & Check-in / Explore */}
        <div className="pt-3 border-t border-[#2d2218] flex items-center justify-between gap-2 mt-2">
          <div className="flex items-center gap-1 text-[11px] text-stone-400">
            <Clock className="w-3 h-3 text-stone-500" />
            <span>{cafe.hours.open} – {cafe.hours.close}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={(e) => onOpenCheckIn(e, cafe)}
              className="px-2.5 py-1 rounded-lg bg-[#251d16] hover:bg-[#33271e] text-stone-300 hover:text-white text-[11px] font-semibold border border-[#382b20] transition-colors"
              title="Report current crowd & Wi-Fi"
            >
              Check-In
            </button>

            <button
              onClick={() => onSelect(cafe)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-all shadow-md group-hover:shadow-warm"
            >
              <span>View</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
