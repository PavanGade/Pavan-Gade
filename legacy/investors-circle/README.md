# Investors Circle — Modern Landing Page

A Stripe-inspired redesign of the [Investors Circle](https://investorscircle.in/) real estate investor landing page.

## Features

- **Stripe-style design** — gradient mesh backgrounds, clean typography, and polished UI
- **Glass morphism buttons** — frosted glass CTAs and navigation with hover effects
- **Interactive graphs** — portfolio growth, micro-market analysis, and rental yield charts (Recharts)
- **Interactive insights** — tabbed dashboard with hoverable market cards and live data tooltips
- **Infographics** — step-by-step investor journey and key metric visualizations
- **Animated stats** — counting animations on scroll
- **Application form** — curated membership request flow with success state

## Quick Start

```bash
cd investors-circle
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Build for Production

```bash
npm run build
npm run preview
```

Deploy the `dist/` folder to your hosting provider (Vercel, Netlify, Cloudflare Pages, etc.).

## Tech Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS v4
- Framer Motion
- Recharts
- Lucide Icons

## Project Structure

```
investors-circle/
├── src/
│   ├── components/       # UI sections and components
│   ├── data/content.ts   # Copy, stats, and chart data
│   └── index.css         # Global styles + glass morphism utilities
└── index.html
```
