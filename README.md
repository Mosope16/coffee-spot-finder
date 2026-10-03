# ☕ Project #5: Coffee Shop Finder — Remote Work & Digital Nomad Radar

A modern, warm-roast coffee shop discovery and workspace rating web app designed for digital nomads, remote workers, students, and specialty coffee connoisseurs.


---

## 🌟 Key Features

### 1. 🗺️ Interactive Café Radar Map (Leaflet + OpenStreetMap)
- **100% Free**: Uses OpenStreetMap Humanitarian tiles with **zero API keys, zero watermarks, and no payment card required**.
- **Espresso Stage Pins**: Custom pins with glowing amber rings color-coded by work-readiness (*Work Sanctuary* 🟢 vs *Balanced Vibe* 🟡).
- **City Quick Selector**: Pan instantly across Seattle, San Francisco, New York, London, Tokyo, Lagos, and Melbourne.

### 2. ⚡ Verified Remote Work Benchmarks
- **Measured Wi-Fi Speeds**: Real-world tested Mbps badges (e.g. `⚡ 245 Mbps - Blazing Video Calls`).
- **Power Outlet Density**: `⚡ Outlets at Every Desk`, `🔌 Plentiful Outlets`, `⚠️ Limited Outlets`, `❌ No Outlets`.
- **Noise & Seating Layout**: Filter by `Quiet Space`, `Lo-Fi Background Beats`, or `Outdoor Garden Patio`.

### 3. 👥 Live Desk Check-Ins & Busyness Meter
- Community-reported desk availability: `Plenty of Open Desks`, `Seats Available`, `Mostly Full`, `Packed`.
- 1-click live crowd check-in modal with confetti feedback.

### 4. 🥐 Specialty Coffee & Menu Showcase
- Signature brews with price tiers: Single-origin Ethiopian pour-overs, nitro cold brews, oat cortados, matcha tonics, and artisan pastries.
- Dietary tags for Oat/Almond Milk, Vegan Bakeries, and late-night hours.

### 5. ✨ "Find My Café Vibe" 3-Step Matcher
- 3-step interactive quiz tailored to work mission (Deep coding sprint, video calls, book reading, casual brunch).

### 6. 💬 Nomad Reviews & Insider Tips
- Community reviews with star ratings, Wi-Fi scores, outlet ratings, and insider secrets (e.g. *"Upstairs mezzanine has dual sockets behind the radiator"*).

### 7. 🗄️ Shared Supabase Database Integration
- Full offline-first LocalStorage fallback with pre-seeded global cafés.
- Namespaced database migration script in [`supabase/schema.sql`](supabase/schema.sql) with tables `cafe_spots`, `cafe_checkins`, `cafe_reviews`, and `cafe_favorites` so you can safely run it on your existing shared Supabase project without conflicting with other projects.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router + Turbopack)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS (Artisanal Coffee Dark Roast Palette)
- **Icons**: Lucide React
- **Mapping**: Leaflet + OpenStreetMap Humanitarian
- **Effects**: Canvas Confetti
- **Backend / Database**: Supabase (PostgreSQL + RLS) + LocalStorage offline sync

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) (or Next.js allocated port) in your browser.

### 3. Build for Production
```bash
npm run build
npm run start
```
