'use client';

import React from 'react';
import { WorkVibe, FilterState } from '@/lib/types';
import { WORK_VIBE_META } from '@/lib/constants';
import {
  Wifi,
  Zap,
  VolumeX,
  Sun,
  LayoutGrid,
  Columns,
  Map as MapIcon,
  SlidersHorizontal,
  Laptop
} from 'lucide-react';

interface FiltersBarProps {
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  layoutMode: 'split' | 'grid' | 'map';
  onLayoutChange: (mode: 'split' | 'grid' | 'map') => void;
  totalResultsCount: number;
}

export default function FiltersBar({
  filters,
  onFilterChange,
  layoutMode,
  onLayoutChange,
  totalResultsCount
}: FiltersBarProps) {
  return (
    <div className="w-full border-b border-[#2d2218] bg-[#16110c] py-3 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-3">
        {/* Top Row: Work Vibe Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          <button
            onClick={() => onFilterChange({ workVibe: 'all' })}
            className={`px-3 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all border ${
              filters.workVibe === 'all'
                ? 'bg-amber-600 text-white border-amber-400 shadow-warm'
                : 'bg-[#1e1711] text-stone-300 border-[#2d2218] hover:border-stone-600 hover:text-white'
            }`}
          >
            All Work Vibes
          </button>

          {(['sanctuary', 'balanced', 'social-buzz'] as WorkVibe[]).map((vibe) => {
            const meta = WORK_VIBE_META[vibe];
            const isActive = filters.workVibe === vibe;

            return (
              <button
                key={vibe}
                onClick={() => onFilterChange({ workVibe: vibe })}
                className={`px-3 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all border flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-amber-600 text-white border-amber-400 shadow-warm'
                    : 'bg-[#1e1711] text-stone-300 border-[#2d2218] hover:border-stone-600 hover:text-white'
                }`}
              >
                <span>{meta.label}</span>
              </button>
            );
          })}
        </div>

        {/* Bottom Row: Nomad Quick Filters & Layout Switch */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-xs">
          {/* Nomad Quick Filter Toggles */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {/* 100+ Mbps Wi-Fi */}
            <button
              onClick={() =>
                onFilterChange({
                  minWifiMbps: filters.minWifiMbps >= 100 ? 0 : 100
                })
              }
              className={`px-2.5 py-1 rounded-lg font-medium shrink-0 transition-all border flex items-center gap-1.5 ${
                filters.minWifiMbps >= 100
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                  : 'bg-[#1e1711] text-stone-400 border-[#2d2218] hover:text-white'
              }`}
            >
              <Wifi className="w-3.5 h-3.5 text-emerald-400" />
              <span>⚡ Fast Wi-Fi (100+ Mbps)</span>
            </button>

            {/* Outlets Needed */}
            <button
              onClick={() =>
                onFilterChange({ needsOutlets: !filters.needsOutlets })
              }
              className={`px-2.5 py-1 rounded-lg font-medium shrink-0 transition-all border flex items-center gap-1.5 ${
                filters.needsOutlets
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                  : 'bg-[#1e1711] text-stone-400 border-[#2d2218] hover:text-white'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>🔌 Outlets Plentiful</span>
            </button>

            {/* Quiet Only */}
            <button
              onClick={() =>
                onFilterChange({ quietOnly: !filters.quietOnly })
              }
              className={`px-2.5 py-1 rounded-lg font-medium shrink-0 transition-all border flex items-center gap-1.5 ${
                filters.quietOnly
                  ? 'bg-purple-500/20 text-purple-300 border-purple-500/50'
                  : 'bg-[#1e1711] text-stone-400 border-[#2d2218] hover:text-white'
              }`}
            >
              <VolumeX className="w-3.5 h-3.5 text-purple-400" />
              <span>🤫 Quiet Space</span>
            </button>

            {/* Outdoor Patio */}
            <button
              onClick={() =>
                onFilterChange({ outdoorPatioOnly: !filters.outdoorPatioOnly })
              }
              className={`px-2.5 py-1 rounded-lg font-medium shrink-0 transition-all border flex items-center gap-1.5 ${
                filters.outdoorPatioOnly
                  ? 'bg-teal-500/20 text-teal-300 border-teal-500/50'
                  : 'bg-[#1e1711] text-stone-400 border-[#2d2218] hover:text-white'
              }`}
            >
              <Sun className="w-3.5 h-3.5 text-teal-400" />
              <span>🌿 Outdoor Patio</span>
            </button>
          </div>

          {/* Right: Sort & Layout */}
          <div className="flex items-center gap-3 ml-auto">
            {/* Sort Dropdown */}
            <div className="flex items-center gap-1 bg-[#1e1711] border border-[#2d2218] rounded-lg px-2 py-1">
              <span className="text-stone-400 hidden sm:inline">Sort:</span>
              <select
                value={filters.sortBy}
                onChange={(e) =>
                  onFilterChange({
                    sortBy: e.target.value as FilterState['sortBy']
                  })
                }
                className="bg-transparent text-stone-200 focus:outline-none cursor-pointer"
              >
                <option value="recommended" className="bg-[#1e1711]">Recommended</option>
                <option value="wifi-fastest" className="bg-[#1e1711]">Fastest Wi-Fi</option>
                <option value="rating-highest" className="bg-[#1e1711]">Highest Rated</option>
                <option value="quietest" className="bg-[#1e1711]">Quietest First</option>
              </select>
            </div>

            {/* Layout Mode Switch */}
            <div className="hidden md:flex items-center bg-[#1e1711] border border-[#2d2218] rounded-lg p-0.5">
              <button
                onClick={() => onLayoutChange('split')}
                className={`p-1.5 rounded-md transition-colors ${
                  layoutMode === 'split' ? 'bg-amber-600 text-white' : 'text-stone-400 hover:text-white'
                }`}
                title="Split View (Map + Cafés)"
              >
                <Columns className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onLayoutChange('grid')}
                className={`p-1.5 rounded-md transition-colors ${
                  layoutMode === 'grid' ? 'bg-amber-600 text-white' : 'text-stone-400 hover:text-white'
                }`}
                title="Cards Grid"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onLayoutChange('map')}
                className={`p-1.5 rounded-md transition-colors ${
                  layoutMode === 'map' ? 'bg-amber-600 text-white' : 'text-stone-400 hover:text-white'
                }`}
                title="Full Screen Map Radar"
              >
                <MapIcon className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
