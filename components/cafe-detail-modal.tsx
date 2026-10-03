'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { CafeSpot, CafeReview } from '@/lib/types';
import {
  WORK_VIBE_META,
  BUSYNESS_META,
  OUTLET_DENSITY_META,
  NOISE_META
} from '@/lib/constants';
import {
  X,
  MapPin,
  Clock,
  Wifi,
  Zap,
  Volume2,
  Users,
  Coffee,
  Heart,
  Share2,
  Star,
  CheckCircle2,
  Sparkles,
  Send,
  MessageSquare
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { addCafeReview } from '@/lib/storage';

interface CafeDetailModalProps {
  cafe: CafeSpot;
  isSaved: boolean;
  onClose: () => void;
  onToggleSave: () => void;
  onOpenCheckIn: (cafe: CafeSpot) => void;
  onReviewAdded: (updatedCafe: CafeSpot) => void;
  onShowToast: (msg: string) => void;
}

export default function CafeDetailModal({
  cafe,
  isSaved,
  onClose,
  onToggleSave,
  onOpenCheckIn,
  onReviewAdded,
  onShowToast
}: CafeDetailModalProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [authorName, setAuthorName] = useState('');
  const [authorRole, setAuthorRole] = useState('Remote Nomad');
  const [rating, setRating] = useState(5);
  const [wifiRating, setWifiRating] = useState(5);
  const [outletRating, setOutletRating] = useState(5);
  const [comment, setComment] = useState('');
  const [tip, setTip] = useState('');
  const [copied, setCopied] = useState(false);

  const vibeMeta = WORK_VIBE_META[cafe.work_vibe];
  const busynessMeta = BUSYNESS_META[cafe.live_busyness];
  const outletMeta = OUTLET_DENSITY_META[cafe.outlet_density];
  const noiseMeta = NOISE_META[cafe.noise_level];

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      onShowToast('🔗 Café link copied to clipboard!');
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !comment.trim()) return;

    const updated = addCafeReview(cafe.id, {
      cafe_id: cafe.id,
      author_name: authorName.trim(),
      author_role: authorRole.trim(),
      rating,
      wifi_rating: wifiRating,
      outlet_rating: outletRating,
      comment: comment.trim(),
      tip: tip.trim() || undefined
    });

    if (updated) {
      onReviewAdded(updated);
      setShowReviewForm(false);
      setComment('');
      setTip('');
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 }
      });
      onShowToast('⭐ Review submitted! Thank you for helping nomads.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-3xl bg-[#17120e] border border-[#2d2218] shadow-2xl text-stone-100 flex flex-col">
        {/* Top Hero Banner */}
        <div className="relative h-64 sm:h-72 w-full shrink-0 bg-stone-950">
          <Image
            src={cafe.images[activeImageIndex] || cafe.images[0]}
            alt={cafe.name}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 800px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#17120e] via-black/40 to-black/60" />

          {/* Top Controls */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md border ${vibeMeta.badgeClass} bg-black/50`}>
                {vibeMeta.label}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md bg-black/50 text-emerald-400 border border-emerald-500/30">
                ⚡ {cafe.wifi_speed_mbps} Mbps
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="p-2 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white hover:bg-black/80"
                title="Share Café"
              >
                {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
              </button>

              <button
                onClick={onToggleSave}
                className="p-2 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white hover:bg-black/80"
                title="Save Café"
              >
                <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-500 text-rose-500' : 'text-stone-200'}`} />
              </button>

              <button
                onClick={onClose}
                className="p-2 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white hover:bg-black/80"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Title & Neighborhood */}
          <div className="absolute bottom-4 left-4 right-4 z-10">
            <div className="flex items-center gap-1.5 text-xs text-amber-400 font-semibold mb-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>{cafe.neighborhood}</span>
              <span>•</span>
              <span>{cafe.city}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight">
              {cafe.name}
            </h1>
          </div>

          {/* Thumbnail Gallery (if multiple) */}
          {cafe.images.length > 1 && (
            <div className="absolute bottom-4 right-4 flex items-center gap-1.5 z-10">
              {cafe.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-11 h-11 rounded-lg overflow-hidden border-2 relative transition-all ${
                    activeImageIndex === idx ? 'border-amber-400 scale-105' : 'border-white/40 opacity-70 hover:opacity-100'
                  }`}
                >
                  <Image src={img} alt="thumb" fill sizes="48px" className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 space-y-6">
          {/* Nomad Work Readiness Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-[#1e1711] border border-[#2d2218] text-xs">
            {/* Wi-Fi */}
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                <Wifi className="w-4 h-4" />
              </div>
              <div>
                <span className="text-stone-400 block text-[10px]">Speed Tested</span>
                <span className="font-bold text-white text-xs">{cafe.wifi_speed_mbps} Mbps</span>
              </div>
            </div>

            {/* Outlets */}
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <span className="text-stone-400 block text-[10px]">Power Outlets</span>
                <span className="font-bold text-white text-xs">{outletMeta.label}</span>
              </div>
            </div>

            {/* Noise */}
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
                <Volume2 className="w-4 h-4" />
              </div>
              <div>
                <span className="text-stone-400 block text-[10px]">Noise Level</span>
                <span className="font-bold text-white text-xs">{noiseMeta.label}</span>
              </div>
            </div>

            {/* Seating */}
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <span className="text-stone-400 block text-[10px]">Seating Layout</span>
                <span className="font-bold text-white text-xs capitalize">{cafe.seating_capacity}</span>
              </div>
            </div>
          </div>

          {/* Live Crowd & Busyness Banner */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-[#1e1711] border border-[#2d2218] text-xs">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2.5 h-2.5 rounded-full animate-ping" style={{ backgroundColor: busynessMeta.color }} />
                <span className="font-bold text-white text-sm">
                  Live Desk Status: <span style={{ color: busynessMeta.color }}>{busynessMeta.label}</span>
                </span>
              </div>
              <p className="text-stone-400 text-[11px]">
                Desk availability index: {cafe.busyness_score}% • Updated {cafe.last_reported_minutes_ago === 0 ? 'just now' : `${cafe.last_reported_minutes_ago}m ago`}
              </p>
            </div>

            <button
              onClick={() => onOpenCheckIn(cafe)}
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold transition-all shadow-md active:scale-95"
            >
              Report Live Desk Status
            </button>
          </div>

          {/* Insider Tip & Specialty Coffee */}
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-[#231a13] border border-[#3b2d20]">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-xs mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Insider Remote Worker Tip</span>
              </div>
              <p className="text-xs text-stone-300 leading-relaxed italic">
                &ldquo;{cafe.insider_tip}&rdquo;
              </p>
            </div>

            {/* Specialties & Hours */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-2">
                  Specialty Brews & Menu
                </h4>
                <div className="flex flex-wrap gap-1.5 text-xs">
                  {cafe.coffee_specialties.map((item) => (
                    <span
                      key={item}
                      className="px-2.5 py-1 rounded-lg bg-[#1e1711] border border-[#2d2218] text-amber-300 font-medium"
                    >
                      ☕ {item}
                    </span>
                  ))}
                  {cafe.has_outdoor_patio && (
                    <span className="px-2.5 py-1 rounded-lg bg-teal-950/40 border border-teal-500/30 text-teal-300">
                      🌿 Outdoor Patio
                    </span>
                  )}
                  {cafe.has_vegan_options && (
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-300">
                      🌱 Vegan Milk & Pastries
                    </span>
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-2">
                  Location & Hours
                </h4>
                <p className="text-xs text-stone-300 mb-1">{cafe.address}</p>
                <div className="flex items-center gap-1.5 text-xs text-stone-400">
                  <Clock className="w-3.5 h-3.5 text-amber-500" />
                  <span>Open {cafe.hours.open} – {cafe.hours.close}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Nomad Community Reviews Section */}
          <div className="pt-4 border-t border-[#2d2218] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-amber-400" />
                <h4 className="text-sm font-bold text-white">
                  Nomad Reviews ({cafe.reviews.length})
                </h4>
              </div>

              <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="text-xs text-amber-400 hover:text-amber-300 font-semibold"
              >
                {showReviewForm ? 'Cancel Review' : '+ Leave a Review'}
              </button>
            </div>

            {/* Review Form */}
            {showReviewForm && (
              <form onSubmit={handleSubmitReview} className="p-4 rounded-2xl bg-[#1e1711] border border-[#2d2218] space-y-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-stone-300 font-bold mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      placeholder="e.g. Jordan K."
                      className="w-full px-3 py-2 rounded-xl bg-[#14100c] border border-[#2d2218] text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-300 font-bold mb-1">Role / Profession</label>
                    <input
                      type="text"
                      value={authorRole}
                      onChange={(e) => setAuthorRole(e.target.value)}
                      placeholder="e.g. Software Engineer, Designer"
                      className="w-full px-3 py-2 rounded-xl bg-[#14100c] border border-[#2d2218] text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-stone-300 font-bold mb-1">Overall (1-5)</label>
                    <select
                      value={rating}
                      onChange={(e) => setRating(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-[#14100c] border border-[#2d2218] text-white focus:outline-none"
                    >
                      {[5, 4, 3, 2, 1].map((n) => (
                        <option key={n} value={n}>{n} Stars</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-stone-300 font-bold mb-1">Wi-Fi (1-5)</label>
                    <select
                      value={wifiRating}
                      onChange={(e) => setWifiRating(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-[#14100c] border border-[#2d2218] text-white focus:outline-none"
                    >
                      {[5, 4, 3, 2, 1].map((n) => (
                        <option key={n} value={n}>{n} Stars</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-stone-300 font-bold mb-1">Outlets (1-5)</label>
                    <select
                      value={outletRating}
                      onChange={(e) => setOutletRating(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-[#14100c] border border-[#2d2218] text-white focus:outline-none"
                    >
                      {[5, 4, 3, 2, 1].map((n) => (
                        <option key={n} value={n}>{n} Stars</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-stone-300 font-bold mb-1">Your Feedback</label>
                  <textarea
                    required
                    rows={2}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="How was the desk space, coffee, and work environment?"
                    className="w-full px-3 py-2 rounded-xl bg-[#14100c] border border-[#2d2218] text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-stone-300 font-bold mb-1">Nomad Tip (Optional)</label>
                  <input
                    type="text"
                    value={tip}
                    onChange={(e) => setTip(e.target.value)}
                    placeholder="e.g. Best sockets are upstairs by the bookshelf"
                    className="w-full px-3 py-2 rounded-xl bg-[#14100c] border border-[#2d2218] text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold transition-all shadow-md active:scale-95 flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Review</span>
                </button>
              </form>
            )}

            {/* Reviews List */}
            <div className="space-y-3">
              {cafe.reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="p-3.5 rounded-2xl bg-[#1e1711]/70 border border-[#2d2218] text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-white block">{rev.author_name}</span>
                      <span className="text-[10px] text-stone-400">{rev.author_role}</span>
                    </div>
                    <div className="flex items-center gap-1 text-amber-300 font-bold">
                      <Star className="w-3 h-3 fill-amber-300" />
                      <span>{rev.rating}</span>
                    </div>
                  </div>
                  <p className="text-stone-300">{rev.comment}</p>
                  {rev.tip && (
                    <p className="text-[11px] text-amber-400/90 font-medium">
                      💡 Tip: {rev.tip}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
