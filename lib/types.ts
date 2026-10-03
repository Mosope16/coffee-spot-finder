export type WorkVibe = 'sanctuary' | 'balanced' | 'social-buzz';
export type OutletDensity = 'every-seat' | 'plentiful' | 'limited' | 'none';
export type NoiseLevel = 'quiet' | 'moderate' | 'lively';
export type SeatingCapacity = 'spacious' | 'moderate' | 'cozy-limited';
export type BusynessLevel = 'empty' | 'seats-available' | 'mostly-full' | 'packed';

export interface CafeReview {
  id: string;
  cafe_id: string;
  author_name: string;
  author_role: string;
  rating: number;
  wifi_rating: number;
  outlet_rating: number;
  comment: string;
  tip?: string;
  created_at: string;
}

export interface CafeSpot {
  id: string;
  name: string;
  tagline: string;
  neighborhood: string;
  city: string;
  address: string;
  lat: number;
  lng: number;
  images: string[];
  work_vibe: WorkVibe;
  wifi_speed_mbps: number;
  wifi_rating: 'blazing' | 'solid' | 'spotty';
  outlet_density: OutletDensity;
  noise_level: NoiseLevel;
  seating_capacity: SeatingCapacity;
  has_outdoor_patio: boolean;
  has_food_menu: boolean;
  has_vegan_options: boolean;
  coffee_specialties: string[];
  price_tier: '$' | '$$' | '$$$';
  hours: {
    open: string;
    close: string;
    is_open_late: boolean;
  };
  rating: number;
  review_count: number;
  live_busyness: BusynessLevel;
  busyness_score: number; // 0 - 100
  last_reported_minutes_ago: number;
  insider_tip: string;
  reviews: CafeReview[];
}

export interface CafeCheckIn {
  id: string;
  cafe_id: string;
  busyness: BusynessLevel;
  reported_wifi_mbps?: number;
  created_at: string;
}

export interface FilterState {
  searchQuery: string;
  city: string;
  workVibe: 'all' | WorkVibe;
  minWifiMbps: number;
  needsOutlets: boolean;
  quietOnly: boolean;
  openNowOnly: boolean;
  outdoorPatioOnly: boolean;
  sortBy: 'recommended' | 'wifi-fastest' | 'rating-highest' | 'quietest';
}
