'use client';

import React, { useState } from 'react';
import { CafeSpot, BusynessLevel } from '@/lib/types';
import { BUSYNESS_META } from '@/lib/constants';
import { recordCafeCheckIn } from '@/lib/storage';
import { X, Users, Wifi, Send, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CheckInModalProps {
  cafe: CafeSpot;
  onClose: () => void;
  onCheckInSuccess: (updatedCafe: CafeSpot) => void;
}

export default function CheckInModal({
  cafe,
  onClose,
  onCheckInSuccess
}: CheckInModalProps) {
  const [selectedBusyness, setSelectedBusyness] = useState<BusynessLevel>('seats-available');
  const [reportedWifi, setReportedWifi] = useState<number | undefined>(undefined);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = recordCafeCheckIn(cafe.id, selectedBusyness, reportedWifi);

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });

    setSubmitted(true);
    if (updated) {
      onCheckInSuccess(updated);
    }
  };

  const busynessOptions: { level: BusynessLevel; label: string; desc: string; icon: string }[] = [
    { level: 'empty', label: 'Plenty of Open Tables', desc: 'Lots of free desks and open sockets', icon: '🟢' },
    { level: 'seats-available', label: 'Seats Available', desc: 'A few open tables, easy to sit down', icon: '🟡' },
    { level: 'mostly-full', label: 'Mostly Full', desc: '1-2 desks left, filling up fast', icon: '🟠' },
    { level: 'packed', label: 'Packed / Standing Only', desc: 'No open seats, grab & go only', icon: '🔴' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl bg-[#17120e] border border-[#2d2218] shadow-2xl text-stone-100 p-6 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#2d2218]">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">Live Desk Check-In</h3>
              <p className="text-[11px] text-stone-400 truncate max-w-[240px]">
                {cafe.name} ({cafe.neighborhood})
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

        {!submitted ? (
          <form onSubmit={handleSubmit} className="py-4 space-y-4 text-xs">
            <div>
              <label className="block text-stone-300 font-bold mb-2">
                How crowded is the seating right now?
              </label>
              <div className="space-y-2">
                {busynessOptions.map((opt) => (
                  <button
                    key={opt.level}
                    type="button"
                    onClick={() => setSelectedBusyness(opt.level)}
                    className={`w-full p-3 rounded-2xl border text-left transition-all flex items-center justify-between ${
                      selectedBusyness === opt.level
                        ? 'bg-amber-600/20 border-amber-500 text-white shadow-warm'
                        : 'bg-[#1e1711] border-[#2d2218] text-stone-400 hover:text-white'
                    }`}
                  >
                    <div>
                      <span className="font-bold text-xs block text-stone-100">
                        {opt.icon} {opt.label}
                      </span>
                      <span className="text-[11px] text-stone-400">{opt.desc}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Optional Wi-Fi Speed Test */}
            <div>
              <label className="block text-stone-300 font-bold mb-1">
                Measured Wi-Fi Speed (Mbps, Optional)
              </label>
              <div className="relative">
                <Wifi className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
                <input
                  type="number"
                  min={1}
                  max={1000}
                  value={reportedWifi || ''}
                  onChange={(e) => setReportedWifi(Number(e.target.value) || undefined)}
                  placeholder="e.g. 180"
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#1e1711] border border-[#2d2218] text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:brightness-110 text-white font-extrabold transition-all shadow-warm flex items-center justify-center gap-2 active:scale-95"
            >
              <Send className="w-4 h-4" />
              <span>Submit Live Check-In</span>
            </button>
          </form>
        ) : (
          <div className="text-center py-6 space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="font-extrabold text-white text-base">Check-In Broadcasted!</h4>
            <p className="text-xs text-stone-400 max-w-xs mx-auto">
              Your report helps other remote workers and students find open desks with reliable Wi-Fi.
            </p>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-white font-bold text-xs"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
