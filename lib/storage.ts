import { CafeSpot, CafeReview, CafeCheckIn, BusynessLevel } from './types';
import { INITIAL_CAFES } from './data/seed-cafes';

const CAFES_STORAGE_KEY = 'coffee_finder_spots_v1';
const FAVORITES_STORAGE_KEY = 'coffee_finder_favs_v1';
const CHECKINS_STORAGE_KEY = 'coffee_finder_checkins_v1';

export function getStoredCafes(): CafeSpot[] {
  if (typeof window === 'undefined') return INITIAL_CAFES;
  try {
    const raw = localStorage.getItem(CAFES_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(CAFES_STORAGE_KEY, JSON.stringify(INITIAL_CAFES));
      return INITIAL_CAFES;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_CAFES;
  }
}

export function saveStoredCafes(cafes: CafeSpot[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CAFES_STORAGE_KEY, JSON.stringify(cafes));
  } catch (e) {
    console.error('Failed to save cafes to localStorage', e);
  }
}

export function getFavoriteCafeIds(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(FAVORITES_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function toggleFavoriteCafe(cafeId: string): string[] {
  if (typeof window === 'undefined') return [];
  const current = getFavoriteCafeIds();
  const exists = current.includes(cafeId);
  const updated = exists ? current.filter((id) => id !== cafeId) : [...current, cafeId];
  try {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to update favorites', e);
  }
  return updated;
}

export function recordCafeCheckIn(
  cafeId: string,
  busyness: BusynessLevel,
  reportedWifi?: number
): CafeSpot | null {
  const cafes = getStoredCafes();
  const index = cafes.findIndex((c) => c.id === cafeId);
  if (index === -1) return null;

  const scoreMap: Record<BusynessLevel, number> = {
    empty: 20,
    'seats-available': 45,
    'mostly-full': 75,
    packed: 95
  };

  const target = cafes[index];
  const updatedCafe: CafeSpot = {
    ...target,
    live_busyness: busyness,
    busyness_score: scoreMap[busyness],
    wifi_speed_mbps: reportedWifi && reportedWifi > 0 ? reportedWifi : target.wifi_speed_mbps,
    last_reported_minutes_ago: 0
  };

  cafes[index] = updatedCafe;
  saveStoredCafes(cafes);

  // Store checkin log
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem(CHECKINS_STORAGE_KEY);
      const list: CafeCheckIn[] = raw ? JSON.parse(raw) : [];
      list.unshift({
        id: 'chk-' + Date.now(),
        cafe_id: cafeId,
        busyness,
        reported_wifi_mbps: reportedWifi,
        created_at: new Date().toISOString()
      });
      localStorage.setItem(CHECKINS_STORAGE_KEY, JSON.stringify(list));
    } catch (e) {
      console.error('Failed to log checkin', e);
    }
  }

  return updatedCafe;
}

export function addCafeReview(
  cafeId: string,
  review: Omit<CafeReview, 'id' | 'created_at'>
): CafeSpot | null {
  const cafes = getStoredCafes();
  const index = cafes.findIndex((c) => c.id === cafeId);
  if (index === -1) return null;

  const target = cafes[index];
  const newReview: CafeReview = {
    ...review,
    id: 'rev-' + Date.now(),
    created_at: new Date().toISOString()
  };

  const updatedReviews = [newReview, ...target.reviews];
  const avgRating = Number(
    (
      updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length
    ).toFixed(1)
  );

  const updatedCafe: CafeSpot = {
    ...target,
    rating: avgRating,
    review_count: target.review_count + 1,
    reviews: updatedReviews
  };

  cafes[index] = updatedCafe;
  saveStoredCafes(cafes);
  return updatedCafe;
}
