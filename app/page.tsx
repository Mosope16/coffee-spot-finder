'use client';

import React, { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { CafeSpot, FilterState, WorkVibe } from '@/lib/types';
import { INITIAL_CAFES } from '@/lib/data/seed-cafes';
import {
  getStoredCafes,
  getFavoriteCafeIds,
  toggleFavoriteCafe
} from '@/lib/storage';

import Navbar from '@/components/navbar';
import FiltersBar from '@/components/filters-bar';
import CafeCard from '@/components/cafe-card';
import CafeDetailModal from '@/components/cafe-detail-modal';
import CheckInModal from '@/components/checkin-modal';
import VibeQuizModal from '@/components/vibe-quiz-modal';

import {
  Coffee,
  Wifi,
  Zap,
  MapPin,
  Clock,
  FilterX,
  Sparkles,
  ChevronRight,
  Flame,
  Star
} from 'lucide-react';

const CafeMap = dynamic(() => import('@/components/map/cafe-map'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[380px] rounded-3xl bg-[#16110c] flex flex-col items-center justify-center text-stone-400 text-xs gap-3 border border-[#2d2218]">
      <div className="w-6 h-6 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
      <span>Loading Interactive Café Radar...</span>
    </div>
  )
});

export default function CoffeeShopDashboard() {
  const [cafes, setCafes] = useState<CafeSpot[]>(INITIAL_CAFES);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [selectedCafeId, setSelectedCafeId] = useState<string | null>(
    INITIAL_CAFES[0]?.id || null
  );
  const [selectedCity, setSelectedCity] = useState('all');
  const [showOnlySaved, setShowOnlySaved] = useState(false);
  const [layoutMode, setLayoutMode] = useState<'split' | 'grid' | 'map'>('split');

  // Modals & Extras
  const [activeModal, setActiveModal] = useState<'detail' | 'checkin' | 'quiz' | null>(null);
  const [modalTargetCafe, setModalTargetCafe] = useState<CafeSpot | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync client storage on mount
  useEffect(() => {
    setCafes(getStoredCafes());
    setSavedIds(getFavoriteCafeIds());
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  // Filter State
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    city: 'all',
    workVibe: 'all',
    minWifiMbps: 0,
    needsOutlets: false,
    quietOnly: false,
    openNowOnly: false,
    outdoorPatioOnly: false,
    sortBy: 'recommended'
  });

  const handleFilterUpdate = (newFilters: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
    handleFilterUpdate({ city });
  };

  const handleToggleSave = (e: React.MouseEvent | null, cafeId: string) => {
    if (e) e.stopPropagation();
    const updated = toggleFavoriteCafe(cafeId);
    setSavedIds(updated);
    const isNowSaved = updated.includes(cafeId);
    showToast(isNowSaved ? '❤️ Added café to favorites!' : 'Removed from favorites.');
  };

  const handleSelectCafe = (cafe: CafeSpot) => {
    setSelectedCafeId(cafe.id);
    setModalTargetCafe(cafe);
    setActiveModal('detail');
  };

  const handleOpenCheckIn = (e: React.MouseEvent, cafe: CafeSpot) => {
    e.stopPropagation();
    setModalTargetCafe(cafe);
    setActiveModal('checkin');
  };

  // Filter Logic
  const filteredCafes = useMemo(() => {
    let result = [...cafes];

    if (showOnlySaved) {
      result = result.filter((c) => savedIds.includes(c.id));
    }

    if (selectedCity !== 'all') {
      result = result.filter((c) => c.city === selectedCity);
    }

    if (filters.workVibe !== 'all') {
      result = result.filter((c) => c.work_vibe === filters.workVibe);
    }

    if (filters.minWifiMbps > 0) {
      result = result.filter((c) => c.wifi_speed_mbps >= filters.minWifiMbps);
    }

    if (filters.needsOutlets) {
      result = result.filter(
        (c) => c.outlet_density === 'every-seat' || c.outlet_density === 'plentiful'
      );
    }

    if (filters.quietOnly) {
      result = result.filter((c) => c.noise_level === 'quiet');
    }

    if (filters.outdoorPatioOnly) {
      result = result.filter((c) => c.has_outdoor_patio);
    }

    if (filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.neighborhood.toLowerCase().includes(q) ||
          c.city.toLowerCase().includes(q) ||
          c.coffee_specialties.some((s) => s.toLowerCase().includes(q))
      );
    }

    // Sorting
    result.sort((a, b) => {
      if (filters.sortBy === 'wifi-fastest') return b.wifi_speed_mbps - a.wifi_speed_mbps;
      if (filters.sortBy === 'rating-highest') return b.rating - a.rating;
      if (filters.sortBy === 'quietest') {
        const score = { quiet: 3, moderate: 2, lively: 1 };
        return score[b.noise_level] - score[a.noise_level];
      }
      // default: recommended (score based on rating & wifi)
      return b.rating * b.wifi_speed_mbps - a.rating * a.wifi_speed_mbps;
    });

    return result;
  }, [cafes, savedIds, showOnlySaved, selectedCity, filters]);

  // Featured Spotlight Café
  const spotlightCafe = useMemo(() => {
    return cafes.find((c) => c.work_vibe === 'sanctuary') || cafes[0];
  }, [cafes]);

  return (
    <div className="min-h-screen bg-[#120e0a] text-stone-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        selectedCity={selectedCity}
        onCityChange={handleCitySelect}
        searchQuery={filters.searchQuery}
        onSearchChange={(q) => handleFilterUpdate({ searchQuery: q })}
        savedCount={savedIds.length}
        showOnlySaved={showOnlySaved}
        onToggleSavedOnly={() => setShowOnlySaved((prev) => !prev)}
        onOpenQuiz={() => setActiveModal('quiz')}
      />

      {/* Hero Nomad Spotlight Banner */}
      {spotlightCafe && !showOnlySaved && !filters.searchQuery && (
        <section className="relative w-full border-b border-[#2d2218] bg-gradient-to-b from-[#1c1510] to-[#120e0a] overflow-hidden py-8 px-4 sm:px-6">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(217,119,6,0.15),transparent_50%)] pointer-events-none" />
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
            <div className="space-y-3 max-w-xl text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-amber-500/20 text-amber-300 border border-amber-500/30">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Featured Remote Work Sanctuary</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                {spotlightCafe.name}
              </h2>
              <p className="text-sm font-semibold text-amber-300">
                {spotlightCafe.neighborhood} • {spotlightCafe.city}
              </p>
              <p className="text-xs text-stone-400 line-clamp-2 leading-relaxed">
                {spotlightCafe.tagline}
              </p>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
                <button
                  onClick={() => handleSelectCafe(spotlightCafe)}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 text-white font-extrabold text-xs shadow-warm hover:brightness-110 transition-all active:scale-95 flex items-center gap-2"
                >
                  <Coffee className="w-4 h-4" />
                  <span>Explore Desks & Menu</span>
                </button>

                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#1b1510] border border-[#2d2218] text-xs">
                  <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="font-bold text-white">{spotlightCafe.wifi_speed_mbps} Mbps</span>
                  <span className="text-stone-500">•</span>
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-stone-300 font-medium">Outlets at Every Seat</span>
                </div>
              </div>
            </div>

            {/* Quick Stats Pill Cards */}
            <div className="grid grid-cols-2 gap-3 w-full md:w-auto shrink-0 text-xs">
              <div className="p-4 rounded-2xl bg-[#1e1711]/90 border border-[#2d2218] text-center">
                <span className="text-[10px] uppercase font-bold text-stone-400 block mb-0.5">Rating</span>
                <span className="text-xl font-black text-amber-400 flex items-center justify-center gap-1">
                  <Star className="w-4 h-4 fill-amber-400" />
                  {spotlightCafe.rating}
                </span>
                <span className="text-[10px] text-stone-500 block mt-0.5">{spotlightCafe.review_count} Nomad Reviews</span>
              </div>
              <div className="p-4 rounded-2xl bg-[#1e1711]/90 border border-[#2d2218] text-center">
                <span className="text-[10px] uppercase font-bold text-stone-400 block mb-0.5">Desk Status</span>
                <span className="text-xl font-black text-emerald-400">{spotlightCafe.busyness_score}%</span>
                <span className="text-[10px] text-stone-500 block mt-0.5">Seats Available</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Filter and Control Bar */}
      <FiltersBar
        filters={filters}
        onFilterChange={handleFilterUpdate}
        layoutMode={layoutMode}
        onLayoutChange={setLayoutMode}
        totalResultsCount={filteredCafes.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6">
        {/* Results Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h3 className="font-extrabold text-lg text-white">
              {showOnlySaved ? 'Your Saved Cafés' : 'Remote Work Cafés Near You'}
            </h3>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-[#1e1711] text-amber-300 border border-[#2d2218]">
              {filteredCafes.length} Spots
            </span>
          </div>

          {showOnlySaved && (
            <button
              onClick={() => setShowOnlySaved(false)}
              className="text-xs text-amber-400 hover:text-amber-300 font-semibold"
            >
              ← Back to All Cafés
            </button>
          )}
        </div>

        {/* Content Layout Modes */}
        {layoutMode === 'split' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Café Cards */}
            <div className="lg:col-span-7 xl:col-span-6 space-y-4">
              {filteredCafes.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filteredCafes.map((cafe, index) => (
                    <CafeCard
                      key={cafe.id}
                      cafe={cafe}
                      priority={index < 2}
                      isSelected={selectedCafeId === cafe.id}
                      isSaved={savedIds.includes(cafe.id)}
                      onSelect={handleSelectCafe}
                      onToggleSave={handleToggleSave}
                      onOpenCheckIn={handleOpenCheckIn}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 px-4 rounded-3xl border border-dashed border-[#2d2218] space-y-3">
                  <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-400 mx-auto flex items-center justify-center">
                    <FilterX className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-white text-base">No cafés match your criteria</h4>
                  <p className="text-xs text-stone-400 max-w-sm mx-auto">
                    Try relaxing the minimum Wi-Fi speed or unchecking outlet filters to discover more cozy spots.
                  </p>
                  <button
                    onClick={() => {
                      setSelectedCity('all');
                      setFilters({
                        searchQuery: '',
                        city: 'all',
                        workVibe: 'all',
                        minWifiMbps: 0,
                        needsOutlets: false,
                        quietOnly: false,
                        openNowOnly: false,
                        outdoorPatioOnly: false,
                        sortBy: 'recommended'
                      });
                      setShowOnlySaved(false);
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-600 text-white shadow-md"
                  >
                    Reset All Filters
                  </button>
                </div>
              )}
            </div>

            {/* Right Column: Sticky Interactive Café Radar Map */}
            <div className="lg:col-span-5 xl:col-span-6 lg:sticky lg:top-24 h-[420px] lg:h-[calc(100vh-140px)]">
              <CafeMap
                cafes={filteredCafes}
                selectedCafeId={selectedCafeId}
                onSelectCafe={handleSelectCafe}
                selectedCity={selectedCity}
              />
            </div>
          </div>
        )}

        {layoutMode === 'grid' && (
          <div>
            {filteredCafes.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filteredCafes.map((cafe, index) => (
                  <CafeCard
                    key={cafe.id}
                    cafe={cafe}
                    priority={index < 4}
                    isSelected={selectedCafeId === cafe.id}
                    isSaved={savedIds.includes(cafe.id)}
                    onSelect={handleSelectCafe}
                    onToggleSave={handleToggleSave}
                    onOpenCheckIn={handleOpenCheckIn}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 px-4 rounded-3xl border border-dashed border-[#2d2218] space-y-3">
                <h4 className="font-bold text-white text-base">No matching cafés</h4>
                <p className="text-xs text-stone-400">Try adjusting your filters.</p>
              </div>
            )}
          </div>
        )}

        {layoutMode === 'map' && (
          <div className="w-full h-[calc(100vh-180px)] min-h-[500px]">
            <CafeMap
              cafes={filteredCafes}
              selectedCafeId={selectedCafeId}
              onSelectCafe={handleSelectCafe}
              selectedCity={selectedCity}
            />
          </div>
        )}
      </main>

      {/* Modals */}
      {activeModal === 'detail' && modalTargetCafe && (
        <CafeDetailModal
          cafe={modalTargetCafe}
          isSaved={savedIds.includes(modalTargetCafe.id)}
          onClose={() => setActiveModal(null)}
          onToggleSave={() => handleToggleSave(null, modalTargetCafe.id)}
          onOpenCheckIn={(c) => {
            setModalTargetCafe(c);
            setActiveModal('checkin');
          }}
          onReviewAdded={(updated) => {
            setCafes((prev) =>
              prev.map((c) => (c.id === updated.id ? updated : c))
            );
            setModalTargetCafe(updated);
          }}
          onShowToast={showToast}
        />
      )}

      {activeModal === 'checkin' && modalTargetCafe && (
        <CheckInModal
          cafe={modalTargetCafe}
          onClose={() => setActiveModal(null)}
          onCheckInSuccess={(updated) => {
            setCafes((prev) =>
              prev.map((c) => (c.id === updated.id ? updated : c))
            );
            setModalTargetCafe(updated);
            showToast(`🎉 Check-in recorded for ${updated.name}!`);
          }}
        />
      )}

      {activeModal === 'quiz' && (
        <VibeQuizModal
          cafes={cafes}
          onClose={() => setActiveModal(null)}
          onSelectCafe={(c) => {
            setSelectedCafeId(c.id);
            setModalTargetCafe(c);
            setActiveModal('detail');
          }}
        />
      )}

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl bg-[#1e1711]/95 border border-amber-500/50 shadow-warm text-white text-xs font-semibold backdrop-blur-md animate-in fade-in slide-in-from-bottom-3 duration-200">
          {toastMessage}
        </div>
      )}
    </div>
  );
}
