import { WorkVibe, OutletDensity, NoiseLevel, BusynessLevel } from './types';

export const CITIES = [
  { name: 'All Cities', value: 'all', lat: 47.6062, lng: -122.3321, zoom: 4 },
  { name: 'Seattle, WA', value: 'Seattle, WA', lat: 47.6062, lng: -122.3321, zoom: 13 },
  { name: 'San Francisco, CA', value: 'San Francisco, CA', lat: 37.7749, lng: -122.4194, zoom: 13 },
  { name: 'New York, NY', value: 'New York, NY', lat: 40.7128, lng: -74.006, zoom: 13 },
  { name: 'London, UK', value: 'London, UK', lat: 51.5074, lng: -0.1278, zoom: 12 },
  { name: 'Tokyo, JP', value: 'Tokyo, JP', lat: 35.6762, lng: 139.6503, zoom: 13 },
  { name: 'Lagos, NG', value: 'Lagos, NG', lat: 6.5244, lng: 3.3792, zoom: 13 },
  { name: 'Melbourne, AU', value: 'Melbourne, AU', lat: -37.8136, lng: 144.9631, zoom: 13 }
];

export const WORK_VIBE_META: Record<WorkVibe, { label: string; badgeClass: string; desc: string; icon: string }> = {
  sanctuary: {
    label: 'Work Sanctuary',
    badgeClass: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    desc: 'Library-level focus, abundant outlets, great for deep work & calls',
    icon: 'Laptop'
  },
  balanced: {
    label: 'Balanced Nomad Vibe',
    badgeClass: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    desc: 'Lo-fi background tunes, decent seating, casual working',
    icon: 'Coffee'
  },
  'social-buzz': {
    label: 'Social Buzz & Chill',
    badgeClass: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
    desc: 'Bustling café, better for casual reading or meetings than deep coding',
    icon: 'Users'
  }
};

export const OUTLET_DENSITY_META: Record<OutletDensity, { label: string; color: string; desc: string }> = {
  'every-seat': {
    label: 'Outlets at Every Table',
    color: '#10b981',
    desc: '120V & USB-C ports built into every desk and booth'
  },
  plentiful: {
    label: 'Plentiful Outlets',
    color: '#34d399',
    desc: 'Easy to find along walls and communal counters'
  },
  limited: {
    label: 'Limited Outlets',
    color: '#fbbf24',
    desc: 'Only 2-3 sockets near the back or bar area'
  },
  none: {
    label: 'No Outlets (Unplugged)',
    color: '#f43f5e',
    desc: 'Strictly battery power or laptop-free zones'
  }
};

export const BUSYNESS_META: Record<BusynessLevel, { label: string; color: string; badgeClass: string }> = {
  empty: {
    label: 'Plenty of Open Tables',
    color: '#10b981',
    badgeClass: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
  },
  'seats-available': {
    label: 'Seats Available',
    color: '#34d399',
    badgeClass: 'bg-teal-500/15 text-teal-400 border-teal-500/30'
  },
  'mostly-full': {
    label: 'Mostly Full (1-2 Desks Left)',
    color: '#f59e0b',
    badgeClass: 'bg-amber-500/15 text-amber-400 border-amber-500/30'
  },
  packed: {
    label: 'Packed / Standing Room',
    color: '#f43f5e',
    badgeClass: 'bg-rose-500/15 text-rose-400 border-rose-500/30'
  }
};

export const NOISE_META: Record<NoiseLevel, { label: string; icon: string }> = {
  quiet: { label: 'Quiet / Whisper Only', icon: 'VolumeX' },
  moderate: { label: 'Soft Lo-Fi Hum', icon: 'Volume1' },
  lively: { label: 'Bustling & Energetic', icon: 'Volume2' }
};
