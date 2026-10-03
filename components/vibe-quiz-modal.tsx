'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { CafeSpot } from '@/lib/types';
import {
  X,
  Sparkles,
  Wifi,
  Zap,
  ArrowRight,
  RotateCcw,
  Coffee
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface VibeQuizModalProps {
  cafes: CafeSpot[];
  onClose: () => void;
  onSelectCafe: (cafe: CafeSpot) => void;
}

export default function VibeQuizModal({
  cafes,
  onClose,
  onSelectCafe
}: VibeQuizModalProps) {
  const [step, setStep] = useState(1);
  const [workType, setWorkType] = useState<string | null>(null);
  const [amenity, setAmenity] = useState<string | null>(null);
  const [matchedCafe, setMatchedCafe] = useState<CafeSpot | null>(null);
  const [matchScore, setMatchScore] = useState(98);

  const handleFinishQuiz = (selectedNoise: string) => {
    // Pick the optimal cafe
    let match = cafes[0];
    if (workType === 'calls' || amenity === 'wifi') {
      match = cafes.find((c) => c.wifi_speed_mbps >= 200) || match;
    } else if (workType === 'reading' || amenity === 'patio') {
      match = cafes.find((c) => c.has_outdoor_patio) || match;
    } else {
      match = cafes.find((c) => c.work_vibe === 'sanctuary') || match;
    }

    setMatchedCafe(match);
    setMatchScore(Math.floor(Math.random() * 5) + 95);
    setStep(4);

    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const resetQuiz = () => {
    setStep(1);
    setWorkType(null);
    setAmenity(null);
    setMatchedCafe(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-[#17120e] border border-[#2d2218] shadow-2xl text-stone-100 p-6 overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-amber-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-yellow-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#2d2218] relative z-10">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-700 text-white shadow-warm">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">Find My Café Vibe</h3>
              <p className="text-[11px] text-stone-400">
                {step <= 3 ? `Step ${step} of 3` : 'Match Results'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-stone-800 text-stone-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Progress Bar */}
        {step <= 3 && (
          <div className="w-full h-1.5 bg-[#251d16] rounded-full overflow-hidden my-4">
            <div
              className="h-full bg-gradient-to-r from-amber-600 to-amber-500 transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        )}

        {/* Step 1: Work Type */}
        {step === 1 && (
          <div className="space-y-4 py-2 relative z-10">
            <h4 className="text-sm font-bold text-white">
              What kind of work session are you planning?
            </h4>
            <div className="space-y-2.5">
              {[
                { id: 'deep', label: '💻 Deep Focus & Programming Sprint', desc: 'Need quiet tables, no distractions, and lots of power outlets' },
                { id: 'calls', label: '📞 Video Calls & Client Syncs', desc: 'Need 150+ Mbps fiber and moderate background ambience' },
                { id: 'reading', label: '📖 Creative Reading & Journaling', desc: 'Comfy leather armchairs, specialty pour-over and calm atmosphere' },
                { id: 'social', label: '☕ Casual Nomad Coworking with Friends', desc: 'Large communal bench, good food, and lively energy' }
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => {
                    setWorkType(opt.id);
                    setStep(2);
                  }}
                  className="w-full p-3.5 rounded-2xl bg-[#1e1711] border border-[#2d2218] hover:border-amber-500 hover:bg-amber-950/20 text-left transition-all group flex items-center justify-between"
                >
                  <div>
                    <span className="font-bold text-xs text-white block group-hover:text-amber-300">
                      {opt.label}
                    </span>
                    <span className="text-[11px] text-stone-400">{opt.desc}</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-stone-500 group-hover:text-amber-400 shrink-0" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Essential Amenity */}
        {step === 2 && (
          <div className="space-y-4 py-2 relative z-10">
            <h4 className="text-sm font-bold text-white">
              What is your non-negotiable perk?
            </h4>
            <div className="space-y-2.5">
              {[
                { id: 'outlets', label: '🔌 Outlets at Every Single Table', desc: 'Never worry about your battery dying mid-project' },
                { id: 'wifi', label: '⚡ Blazing High-Speed Wi-Fi (150+ Mbps)', desc: 'Zero lag for git clones, video calls, or uploads' },
                { id: 'patio', label: '🌿 Sunny Outdoor Patio / Courtyard', desc: 'Fresh air, natural sunlight and garden green vibes' },
                { id: 'menu', label: '🥐 Gourmet Specialty Coffee & Full Kitchen', desc: 'Artisan pour-overs, sourdough toasts, and vegan treats' }
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => {
                    setAmenity(opt.id);
                    setStep(3);
                  }}
                  className="w-full p-3.5 rounded-2xl bg-[#1e1711] border border-[#2d2218] hover:border-amber-500 hover:bg-amber-950/20 text-left transition-all group flex items-center justify-between"
                >
                  <div>
                    <span className="font-bold text-xs text-white block group-hover:text-amber-300">
                      {opt.label}
                    </span>
                    <span className="text-[11px] text-stone-400">{opt.desc}</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-stone-500 group-hover:text-amber-400 shrink-0" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Noise Level */}
        {step === 3 && (
          <div className="space-y-4 py-2 relative z-10">
            <h4 className="text-sm font-bold text-white">
              Preferred noise environment?
            </h4>
            <div className="space-y-2.5">
              {[
                { id: 'quiet', label: '🤫 Pin-Drop Quiet / Library Feel', desc: 'Soft whispers only, maximum mental clarity' },
                { id: 'lofi', label: '🎧 Soft Lo-Fi Beats & Ambient Grind', desc: 'Pleasant acoustic background hum that sparks creativity' },
                { id: 'lively', label: '☕ Energetic Café Buzz', desc: 'Vibrant neighborhood hub with background conversations' }
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => handleFinishQuiz(opt.id)}
                  className="w-full p-3.5 rounded-2xl bg-[#1e1711] border border-[#2d2218] hover:border-amber-500 hover:bg-amber-950/20 text-left transition-all group flex items-center justify-between"
                >
                  <div>
                    <span className="font-bold text-xs text-white block group-hover:text-amber-300">
                      {opt.label}
                    </span>
                    <span className="text-[11px] text-stone-400">{opt.desc}</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-stone-500 group-hover:text-amber-400 shrink-0" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Results */}
        {step === 4 && matchedCafe && (
          <div className="text-center py-4 space-y-4 relative z-10 animate-in zoom-in-95 duration-300">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{matchScore}% Perfect Work Café Match!</span>
            </div>

            {/* Matched Card */}
            <div className="relative rounded-2xl overflow-hidden border border-[#3b2d20] bg-[#1e1711] text-left shadow-2xl">
              <div className="relative h-44 w-full">
                <Image
                  src={matchedCafe.images[0]}
                  alt={matchedCafe.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 500px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1e1711] via-transparent to-black/40" />
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <span className="text-xs text-amber-400 font-semibold">{matchedCafe.neighborhood}</span>
                  <h4 className="text-lg font-black">{matchedCafe.name}</h4>
                  <p className="text-xs text-stone-300">{matchedCafe.tagline}</p>
                </div>
              </div>

              <div className="p-4 flex items-center justify-between gap-3 text-xs">
                <div>
                  <span className="text-emerald-400 font-extrabold text-sm block">⚡ {matchedCafe.wifi_speed_mbps} Mbps Wi-Fi</span>
                  <span className="text-stone-400 text-[11px]">Rating: {matchedCafe.rating} ★</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={resetQuiz}
                    className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors"
                    title="Retake Quiz"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      onSelectCafe(matchedCafe);
                      onClose();
                    }}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 text-white font-extrabold shadow-warm hover:brightness-110 transition-all flex items-center gap-1.5"
                  >
                    <span>Explore Café</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
