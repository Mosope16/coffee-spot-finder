'use client';

import React from 'react';
import { CITIES } from '@/lib/constants';
import {
  Coffee,
  MapPin,
  Search,
  Heart,
  Sparkles,
  Wifi,
  Laptop
} from 'lucide-react';

interface NavbarProps {
  selectedCity: string;
  onCityChange: (city: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  savedCount: number;
  showOnlySaved: boolean;
  onToggleSavedOnly: () => void;
  onOpenQuiz: () => void;
}

export default function Navbar({
  selectedCity,
  onCityChange,
  searchQuery,
  onSearchChange,
  savedCount,
  showOnlySaved,
  onToggleSavedOnly,
  onOpenQuiz
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#2d2218] bg-[#120e0a]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-3">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-700 to-yellow-600 shadow-warm">
            <Coffee className="w-5 h-5 text-white" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-base sm:text-lg font-black tracking-tight text-white">
                COFFEE<span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">FINDER</span>
              </span>
              <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-bold uppercase rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Nomad Radar
              </span>
            </div>
            <p className="text-[11px] text-stone-400 hidden sm:block">
              Wi-Fi speeds, power outlets & remote-work friendly cafés
            </p>
          </div>
        </div>

        {/* Search & City Filter (Desktop) */}
        <div className="flex-1 max-w-md hidden md:flex items-center gap-2">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search café, neighborhood, or pour-over..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-[#1b1510] border border-[#2d2218] text-stone-100 placeholder:text-stone-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 transition-all"
            />
          </div>

          {/* City Selector */}
          <div className="relative">
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#1b1510] border border-[#2d2218] text-xs text-stone-200 cursor-pointer hover:border-stone-700">
              <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <select
                value={selectedCity}
                onChange={(e) => onCityChange(e.target.value)}
                className="bg-transparent text-xs text-stone-200 focus:outline-none cursor-pointer pr-1"
              >
                {CITIES.map((c) => (
                  <option key={c.value} value={c.value} className="bg-[#1b1510] text-stone-200">
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quiz Button */}
          <button
            onClick={onOpenQuiz}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-amber-600 to-amber-700 hover:brightness-110 shadow-warm transition-all active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Match My Vibe</span>
          </button>

          {/* Saved Toggle */}
          <button
            onClick={onToggleSavedOnly}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
              showOnlySaved
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/50'
                : 'bg-[#1b1510] border-[#2d2218] text-stone-300 hover:border-stone-700 hover:text-white'
            }`}
            title="Saved Cafés"
          >
            <Heart className={`w-3.5 h-3.5 ${showOnlySaved ? 'fill-rose-500 text-rose-500' : 'text-stone-400'}`} />
            <span className="hidden sm:inline">Favorites</span>
            {savedCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-600 text-white">
                {savedCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Search & City */}
      <div className="md:hidden px-4 py-2 border-t border-[#2d2218] bg-[#16110c] flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search café or pour-over..."
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg bg-[#1b1510] border border-[#2d2218] text-stone-100 placeholder:text-stone-500 focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-[#1b1510] border border-[#2d2218] text-xs text-stone-200">
          <MapPin className="w-3 h-3 text-amber-500" />
          <select
            value={selectedCity}
            onChange={(e) => onCityChange(e.target.value)}
            className="bg-transparent text-xs text-stone-200 focus:outline-none pr-1 max-w-[100px]"
          >
            {CITIES.map((c) => (
              <option key={c.value} value={c.value} className="bg-[#1b1510] text-stone-200">
                {c.name.split(',')[0]}
              </option>
            ))}
          </select>
        </div>
      </div>
    </header>
  );
}
