# Crypto Dashboard

Modern cryptocurrency dashboard built with **Remix + TypeScript + Tailwind**. Features real-time data, drag & drop reordering, smart search, and responsive design.
<img width="1431" height="1179" alt="Screenshot 2025-07-21 at 9 27 25 PM" src="https://github.com/user-attachments/assets/579653cc-027f-413f-a3dd-5fe8f2d34576" />
<img width="1493" height="1214" alt="Screenshot 2025-07-21 at 9 11 51 PM" src="https://github.com/user-attachments/assets/b71f1f90-8f77-4f30-9c8a-aaed708b6150" />

DEMO: https://drive.google.com/file/d/1FVCxxZiaGNFMdJa5aeleBnoYsIrY5b0L/view?usp=sharing

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

### ⚖️ Tradeoffs:
- Usage of direct API to retrieve data.
   - Since Exchange rates change SO often, a local database to persist data that changes constantly is overkill.
   - In case a more robust caching mechanism is necessary, the local storage version of the smart cache can be changed.
   - SMART Cache:
        - Since the Backend limits results to 10, the initial search is being done in those 10,
        - When found, a local storage is implemented to save the results by the search Key (fast retrieval on subsequent calls)
        - When no results, hit the public API for results.
  - When the API is down, there's placeholder data to be displayed (Live icon is updated accordingly)
- Action Bar Component (Main)
    - This component holds 3 other components: Search, Live updates and Auto Update toggle.
    - There are reason to split it is for readability and maintainability
- Drag and Drop Library:
    - Used dnd-kit for it's simplicity and support for React. Suggested by Chat-GPT research.

- Bonus points:
    - Local storage to keep drag and drop option: :success:
    - Dark / Light Mode: I attempted three approaches (tailwind CSS + Cookie), (tailwind CSS + React), (Themed Remix + CSS + Cookie) without luck.
     I ended up dropping the effort. Suggested approaches by CHAT-GPT
    - Jest tests: The initial test setup was failing and my brain was

CURSOR usage
- Yes, I used cursor for generating the majority of this code
- Full Transparency: I'm attaching chat history (Prompt + Results) in [x-cursor-logs](https://github.com/vgarro/the-crypto-dashboard/tree/main/x-cursor-logs)



**Environment Variables:**
```bash
COINBASE_API_KEY=optional_but_recommended  # Live data vs sample fallback
API_REQUEST_TIMEOUT=5000                   # Balance speed vs reliability
USE_FALLBACK_DATA=true                     # Graceful degradation
```

### Performance Considerations
- **SSR + Minimal JS:** Fast initial loads, SEO-friendly
- **Auto-refresh Rate:** Default 2min (configurable in `app/constants.ts`)
- **Client-side Filtering:** No server calls during search (Smart cache applied)
- **localStorage Persistence:** Card order survives sessions

### Deployment Options
- **Static Hosting:** Build with `npm run build` → deploy `/build` folder
- **Node.js Server:** Full SSR with `npm start` (recommended)
- **API Requirements:** Coinbase API (optional), fallback data included

## Common Customizations

All configurable constants are centralized in `app/constants.ts`:

```typescript
// Initial display limit (app/constants.ts)
export const INITIAL_CRYPTO_DISPLAY_LIMIT = 10;

// Supported currencies (app/constants.ts)
export const CURRENCY_SYMBOLS = ['BTC', 'ETH', 'NEW_COIN'];

// Default result count (app/constants.ts)
export const DEFAULT_RESULT_COUNT = 15; // Changed from 10

// Auto-refresh rate (app/constants.ts)
export const REFRESH_RATE_MINUTES = 2; // Changed from 1
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
