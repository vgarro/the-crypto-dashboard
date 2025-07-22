# Crypto Dashboard

Modern cryptocurrency dashboard built with **Remix + TypeScript + Tailwind**. Features real-time data, drag & drop reordering, smart search, and responsive design.

**🔗 [See FULL_README.md](./FULL_README.md) for comprehensive documentation**

## Quick Start

### Prerequisites
- Node.js 20.0.0+
- Optional: Coinbase API key (automatically falls back to sample data)

### Setup & Development

```bash
# Install dependencies
npm install

# Optional: Configure API key for live data
cp .env.example .env
# Edit .env and add: COINBASE_API_KEY=your_api_key_here

# Start development server
npm run dev
# → http://localhost:5173
```

### Production Deployment

```bash
# Build for production
npm run build

# Start production server
npm start
```

## Architecture Overview

**Tech Stack:** Remix (SSR) • TypeScript • Tailwind CSS • DND Kit • Coinbase API

**Key Files:**
- `app/routes/_index.tsx` - Main dashboard with loader
- `app/services/coinbase.server.ts` - API service layer with configurable constants
- `app/components/` - Reusable UI components

**Data Flow:** Remix loader → Coinbase API → Client hydration → Real-time updates

**Tradeoffs:**
- Usage of direct API to retrieve data.
   - Since Exchange rates change SO often, a local database to persist data that changes constantly is overkill.
   - In case a more robust caching mechanism is necessary, the local storage version of the smart cache can be changed.
- Action Bar Component (Main)
    - This component holds 3 other components: Search, Live updates and Auto Update toggle.
    - There are reason to split it

- Bonus points:
    - Local storage to keep drag and drop option: :success:
    - Dark / Light Mode: I attempted three approaches (tailwind CSS + Cookie), (tailwind CSS + React), (Themed Remix + CSS + Cookie) without luck.
     I ended up dropping the effort.
    - Jest tests: The initial test setup was failing and my brain was


**Environment Variables:**
```bash
COINBASE_API_KEY=optional_but_recommended  # Live data vs sample fallback
API_REQUEST_TIMEOUT=5000                   # Balance speed vs reliability
USE_FALLBACK_DATA=true                     # Graceful degradation
```

### Performance Considerations
- **SSR + Minimal JS:** Fast initial loads, SEO-friendly
- **Auto-refresh Rate:** Default 1min (configurable in `RefreshControls.tsx` using a constant)
- **Client-side Filtering:** No server calls during search (Smart cache applied)
- **localStorage Persistence:** Card order survives sessions

### Deployment Options
- **Static Hosting:** Build with `npm run build` → deploy `/build` folder
- **Node.js Server:** Full SSR with `npm start` (recommended)
- **API Requirements:** Coinbase API (optional), fallback data included

## Common Customizations

```typescript
// Display more currencies (app/routes/_index.tsx)
const displayedCrypto = result.data.slice(0, 15); // Change from 10

// Add currencies (app/services/coinbase.server.ts)
const CURRENCY_SYMBOLS = ['BTC', 'ETH', 'NEW_COIN'];

// Default result count (app/services/coinbase.server.ts)
const DEFAULT_RESULT_COUNT = 15; // Change from 10

// Auto-refresh rate (app/components/RefreshControls.tsx)
const REFRESH_RATE_MINUTES = 2; // Change from 1
```

## Development Commands

```bash
npm run dev        # Development server with hot reload
npm run build      # Production build
npm start          # Production server
npm run lint       # Code quality check
npm run typecheck  # TypeScript validation
```

---

**For detailed features, customization guides, and troubleshooting:** [FULL_README.md](./FULL_README.md)
