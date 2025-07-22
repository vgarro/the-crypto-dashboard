# Crypto Dashboard

A modern, responsive cryptocurrency dashboard built with Remix, TypeScript, and Tailwind CSS. This application displays cryptocurrency exchange rates in an elegant credit card-style interface, following Remix best practices for optimal performance and user experience.

## Features

- 🎨 **Credit Card Design**: Beautiful card-based UI with gradients and shadows
- 📱 **Fully Responsive**: Optimized layout for mobile, tablet, and desktop
- ⚡ **Remix Optimized**: Server-side rendering with minimal client-side JavaScript
- ~~🌙 **Dark Mode Support**: Beautiful dark theme with proper contrast~~
- 💰 **20+ Cryptocurrencies**: Comprehensive list with real-time data from Coinbase API
- ₿ **Bitcoin Conversion**: Shows exchange rates in both USD and Bitcoin
- 🎯 **Performance Focused**: Fast loading with efficient rendering
- 🔄 **Real-time Data**: Live cryptocurrency rates with automatic fallback
- 🔄 **Auto-Refresh**: Automatic data refresh every minute with manual refresh option
- 🎛️ **Unified Action Bar**: Three-column horizontal control panel with organized layout
- 🎯 **Drag & Drop**: Intuitive card reordering with persistent order preferences
- 💾 **Order Persistence**: Card arrangements saved to localStorage and restored on refresh
- 🔍 **Smart Search**: Intelligent search with local caching and API fallback
- 🎨 **Enhanced Search UI**: Prominent filter input with search button and real-time feedback
- 🧠 **Smart Caching**: Local-first search with automatic API expansion for comprehensive results
- 🛡️ **Secure API Integration**: Environment-based configuration with secure token handling
- ⚠️ **Error Handling**: Graceful degradation when APIs are unavailable
- 📊 **Status Indicators**: Clear indicators for live vs. fallback data

## Layout

The dashboard displays:
- **10 cryptocurrency cards** from a pool of 20 available currencies
- **Responsive grid layout**:
  - 1 card per row on mobile
  - 2 cards per row on tablets
  - 3 cards per row on desktop
- **Credit card styling** with gradients, shadows, and hover effects

## Cryptocurrency Data

Each card displays:
- **ID**: Unique identifier
- **Card Name**: Full cryptocurrency name
- **Symbol**: Trading symbol (BTC, ETH, etc.)
- **Exchange Rate**: Current USD value
- **Exchange Rate in Bitcoin**: Value converted to Bitcoin

## Tech Stack

- **[Remix](https://remix.run/)** - Full-stack web framework with server-side rendering
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Vite](https://vitejs.dev/)** - Fast build tool
- **[React 18](https://reactjs.org/)** - UI library (minimal usage per Remix best practices)
- **[DND Kit](https://dndkit.com/)** - Modern drag and drop toolkit for React
- **[Coinbase API](https://developers.coinbase.com/)** - Real-time cryptocurrency data

## Prerequisites

Before running this project, ensure you have:

- **Node.js** (version 20.0.0 or higher)
- **npm** (comes with Node.js)
- **Coinbase API Key** (for real-time data - optional, falls back to sample data)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd the-crypto-dashboard
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

#### Option A: Get Real-Time Data (Recommended)

1. **Create a Coinbase Account**: Visit [Coinbase](https://www.coinbase.com/) and sign up
2. **Generate an API Key**:
   - Log into your Coinbase account
   - Navigate to **Settings** > **API**
   - Click **+ New API Key**
   - Choose appropriate permissions (read-only is sufficient)
   - Set IP whitelist for production (optional for development)
   - Copy your **API Key** (save the secret securely)

3. **Setup Environment File**:
   ```bash
   cp .env.example .env
   ```

4. **Add Your API Key**:
   Edit the `.env` file and replace `your_coinbase_api_key_here` with your actual API key:
   ```bash
   COINBASE_API_KEY=your_actual_api_key_here
   API_REQUEST_TIMEOUT=5000
   USE_FALLBACK_DATA=true
   ```

#### Option B: Use Sample Data Only

If you prefer to skip the API setup, the application will automatically use sample data. No configuration needed!

### 4. Development Server

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

> **Note**: If no API key is configured, you'll see a "Fallback Data" indicator and the app will use sample cryptocurrency data.

### 4. Build for Production

Create a production build:

```bash
npm run build
```

### 5. Start Production Server

```bash
npm start
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reloading |
| `npm run build` | Build the application for production |
| `npm start` | Start the production server |
| `npm run lint` | Run ESLint to check code quality |
| `npm run typecheck` | Run TypeScript type checking |

## Project Structure

```
the-crypto-dashboard/
├── app/
│   ├── routes/
│   │   ├── _index.tsx          # Main dashboard route with loader and client-side state
│   │   └── api.crypto.tsx      # Resource route for client-side data fetching
│   ├── services/
│   │   └── coinbase.server.ts  # Coinbase API service (server-side)
│   ├── components/
│   │   ├── ActionBar.tsx       # Main action bar container (composition root)
│   │   ├── SearchFilter.tsx    # Search input and filter functionality
│   │   ├── StatusIndicator.tsx # Status badges and information display
│   │   ├── RefreshControls.tsx # Auto-refresh toggle and manual refresh button
│   │   ├── SortableCryptoCard.tsx # Individual draggable crypto card component
│   │   └── SortableCryptoGrid.tsx # Drag and drop container with dnd-kit integration
│   ├── utils/
│   │   ├── localStorage.ts     # Local storage utilities for order persistence
│   │   └── smartCache.ts       # Smart caching logic for search functionality
│   ├── root.tsx                # Root layout component
│   ├── entry.client.tsx        # Client entry point
│   ├── entry.server.tsx        # Server entry point
│   └── tailwind.css            # Tailwind CSS imports
├── public/                     # Static assets
├── .env.example               # Environment variables template
├── package.json               # Dependencies and scripts
├── tailwind.config.ts         # Tailwind configuration
├── tsconfig.json             # TypeScript configuration
└── vite.config.ts            # Vite configuration
```

## API Configuration

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `COINBASE_API_KEY` | Your Coinbase API key for real-time data | - | No (uses fallback data) |
| `API_REQUEST_TIMEOUT` | Request timeout in milliseconds | `5000` | No |
| `USE_FALLBACK_DATA` | Enable fallback data when API fails | `true` | No |

### Data Source Behavior

- **With API Key**: Fetches live data from Coinbase API with automatic fallback
- **Without API Key**: Uses curated sample data immediately
- **API Timeout/Error**: Gracefully falls back to sample data

### Status Indicators

The dashboard shows real-time status:
- 🟢 **Live Data**: Successfully fetching from Coinbase API
- 🟠 **Fallback Data**: Using sample data (API unavailable/not configured)
- **Last Updated**: Timestamp of most recent data fetch

### ActionBar - Modular Control Panel

The dashboard features a modular ActionBar system composed of three specialized components following React best practices:

#### **Component Architecture:**

**ActionBar.tsx (Composition Root):**
- Orchestrates the three sub-components
- Handles responsive layout switching (mobile vs desktop)
- Manages prop distribution to child components
- Maintains overall layout structure

**SearchFilter.tsx:**
- **Enhanced Filter Input**: Prominently positioned search field with responsive sizing
- **Search Button**: Dedicated search button with loading states
- **Clear Filter**: Easy-to-access clear button when filter is active
- **Real-time Feedback**: Visual indicators for search states

**StatusIndicator.tsx:**
- **Live Data Indicator**: Green/orange status showing data source (API vs fallback)
- **Last Updated**: Timestamp with clock icon showing when data was last refreshed
- **Search Results Info**: Shows result count and data source (cached vs live)
- **Conditional Display**: Smart visibility based on current state

**RefreshControls.tsx:**
- **Auto-Refresh Toggle**: Enable/disable automatic data updates (default: ON)
- **Manual Refresh Button**: Instant refresh with loading indicator and spinner
- **Refresh Rate**: Configurable 1-minute auto-refresh interval
- **State Management**: Independent state for refresh functionality

#### **Design Benefits:**
- **Single Responsibility**: Each component has a focused purpose
- **Reusability**: Components can be used independently or in different layouts
- **Testability**: Isolated logic makes unit testing straightforward
- **Maintainability**: Changes to one feature don't affect others
- **Responsive Design**: Adapts gracefully from mobile stack to desktop grid
- **Type Safety**: Full TypeScript interfaces for all component props

#### **Responsive Behavior:**
- **Mobile/Tablet (< lg)**: Vertical stack layout with search priority
- **Desktop (≥ lg)**: Three-column horizontal grid layout
- **Adaptive Components**: Each component handles its own responsive styling

The modular ActionBar follows Remix and React best practices while maintaining all original functionality and improving code organization.

### Drag & Drop Functionality

The dashboard features an intuitive drag and drop system for customizing card order:

- **Drag to Reorder**: Click and drag any crypto card to reposition it within the grid
- **Visual Feedback**: Smooth animations and visual indicators during drag operations
- **Persistent Order**: Card arrangements are automatically saved to browser localStorage
- **Cross-Session Persistence**: Your custom order is restored when you refresh or revisit the page
- **Touch Support**: Works seamlessly on both desktop and mobile devices

**How to Use:**
1. **Reorder Cards**: Click and drag any cryptocurrency card to your desired position
2. **Visual Cues**: A drag handle icon appears on hover to indicate draggable elements
3. **Automatic Saving**: Your new order is instantly saved to localStorage
4. **Persistent Layout**: Refresh the page or auto-refresh data - your order remains intact

The drag and drop system maintains order even when new data is fetched, ensuring your personalized layout persists across all interactions.

### Smart Search System

The ActionBar features an intelligent search system with advanced caching capabilities:

- **Smart Caching Logic**: Searches local cache first, then expands to full API dataset
- **Multi-Tier Search**: Local cache → Extended cache → Live API search
- **Debounced Input**: 300ms delay prevents excessive API calls during typing
- **Cache Management**: 5-minute cache duration with intelligent invalidation
- **Performance Optimization**: Reduces API calls by up to 80% for common searches
- **Fallback Resilience**: Graceful degradation when API is unavailable

**ActionBar Search Features:**
- **Prominent Positioning**: Search input occupies the center column (50% of ActionBar width)
- **Search Button**: Dedicated blue search button with loading states
- **Real-time Feedback**: Visual indicators for cache hits, API calls, and search status
- **Search Results Info**: Displays result count and data source (cached vs live)
- **Progressive Enhancement**: Works offline with cached data
- **Preserved Order**: Search results maintain your custom drag-and-drop order

**How to Use:**
1. **Search Cards**: Type in the filter input to search by cryptocurrency name (e.g., "Bitcoin") or symbol (e.g., "BTC")
2. **Use Search Button**: Click the search button to focus input or trigger advanced search features
3. **Case Insensitive**: Search works regardless of uppercase or lowercase input
4. **Clear Filter**: Click the "×" button in the input field or the "Clear filter" button in no-results state
5. **Instant Results**: Cards appear/disappear immediately as you type

**Search Examples:**
- Type "bit" → Shows Bitcoin, Bitcoin Cash
- Type "ETH" → Shows Ethereum
- Type "sol" → Shows Solana
- Type "ada" → Shows Cardano

The enhanced filter system in the ActionBar provides a more intuitive and visually appealing search experience while maintaining all existing functionality.

## Customization

### Centralized Constants

All configurable constants are centralized in `app/constants.ts` for easy maintenance:

```typescript
// Application Constants
export const INITIAL_CRYPTO_DISPLAY_LIMIT = 10;
export const CURRENCY_SYMBOLS = [/* too many to list */];
export const DEFAULT_RESULT_COUNT = 15; // Changed from 10
export const REFRESH_RATE_MINUTES = 2; // Changed from 1
export const CURRENCY_NAMES: Record<string, string> = {
  // ... currency mappings
};
```

This centralization makes it easy to configure the application behavior in one place.

### Adding More Cryptocurrencies

To add more currencies, edit the `CURRENCY_SYMBOLS` and `CURRENCY_NAMES` arrays in `app/constants.ts`:

```typescript
export const CURRENCY_SYMBOLS = [
  'BTC', 'ETH', 'NEW_COIN', // Current supported symbols
  'ANOTHER_COIN',  // Add new symbol
];

export const CURRENCY_NAMES: Record<string, string> = {
  'BTC': 'Bitcoin',
  'ETH': 'Ethereum',
  'NEW_COIN': 'New Coin',
  'ANOTHER_COIN': 'Another Coin',  // Add name mapping
};
```

### Configuring Default Result Count

The service uses a default result count that also serves as the minimum threshold for API success. This is controlled by the `DEFAULT_RESULT_COUNT` constant:

```typescript
// In app/constants.ts
export const DEFAULT_RESULT_COUNT = 15; // Default number of results to return

// This also serves as minimum successful responses required
// If fewer than this number of currencies return valid data,
// the service will fall back to sample data
```

**Customization Options:**
- **Lower values (5-8)**: More tolerant of API failures, faster fallback
- **Higher values (12-15)**: Stricter data quality requirements
- **Current default (15)**: Enhanced data quality requirements ensuring reliable data

### Changing Display Count

To display more or fewer cards, modify the `INITIAL_CRYPTO_DISPLAY_LIMIT` constant in `app/constants.ts`:

```typescript
// In app/constants.ts
export const INITIAL_CRYPTO_DISPLAY_LIMIT = 10; // Change this value
```

This constant is used in the loader function to determine how many cryptocurrencies to display initially.

### Customizing Card Design

The card styling is in the `CryptoCard` component. Modify the Tailwind classes to change:
- Colors and gradients
- Spacing and sizing
- Hover effects
- Typography

### Customizing Auto-Refresh Rate

To change the auto-refresh interval, modify the `REFRESH_RATE_MINUTES` constant in `app/constants.ts`:

```typescript
// Change from 2 minutes to different value
export const REFRESH_RATE_MINUTES = 2; // Current default
```

**Available Options:**
- Set to any positive number for minutes (e.g., `0.5` for 30 seconds)
- Recommended range: 0.5 to 5 minutes for optimal user experience
- Lower values provide more real-time data but increase API usage

### Customizing Drag & Drop Behavior

To modify drag and drop settings, edit the `SortableCryptoGrid.tsx` component:

```typescript
// Adjust drag activation distance (pixels before drag starts)
useSensor(PointerSensor, {
  activationConstraint: {
    distance: 8, // Change this value (default: 8px)
  },
})
```

**Drag Sensitivity Options:**
- Lower values (1-5): More sensitive, easier to accidentally trigger
- Default value (8): Balanced for most users
- Higher values (10-15): Requires more deliberate drag motion

### Managing Order Storage

The order persistence system provides several utilities in `app/utils/localStorage.ts`:

```typescript
import { clearCryptoOrder } from "~/utils/localStorage";

// Reset all saved card orders
clearCryptoOrder();
```

**Storage Management:**
- Orders are stored per-browser using localStorage
- Data persists across browser sessions
- Storage is automatically cleaned up if invalid
- No server-side storage required

### Customizing ActionBar Layout

The ActionBar uses a modular component system with flexible layout options:

#### **Desktop Layout Customization (`ActionBar.tsx`):**
```typescript
// Adjust column proportions (currently 3-6-3 out of 12)
<div className="grid grid-cols-12 gap-4 items-center">
  <div className="col-span-3">  {/* StatusIndicator */}
  <div className="col-span-6">  {/* SearchFilter */}
  <div className="col-span-3">  {/* RefreshControls */}
```

#### **Component-Level Customization:**

**SearchFilter.tsx:**
```typescript
// Modify search input responsive behavior
className="pr-16 lg:pr-20"  // Adjust padding for button placement
```

**RefreshControls.tsx:**
```typescript
// Customize refresh rate
const REFRESH_RATE_MINUTES = 2;  // Change from 1 minute
```

**StatusIndicator.tsx:**
```typescript
// Modify badge styling or add new status types
// Each status badge has independent styling
```

#### **Layout Customization Options:**
- **Column Proportions**: Adjust grid ratios (e.g., 2-8-2 for wider search area)
- **Component Order**: Reorder components within grid layout
- **Responsive Breakpoints**: Modify mobile/desktop transition point (`lg:` prefix)
- **Individual Styling**: Each component accepts className props for custom styling
- **Component Replacement**: Swap entire components while maintaining interface

### Customizing Filter Behavior

The filter functionality can be customized in the main page component (`app/routes/_index.tsx`):

```typescript
// Modify filter logic to include additional fields
const filteredCryptocurrencies = cryptoData.cryptocurrencies.filter((crypto) => {
  if (!filterValue.trim()) return true;

  const searchTerm = filterValue.toLowerCase().trim();
  const nameMatch = crypto.name.toLowerCase().includes(searchTerm);
  const symbolMatch = crypto.symbol.toLowerCase().includes(searchTerm);
  // Add custom matching logic here

  return nameMatch || symbolMatch;
});
```

**Filter Customization Options:**
- Add fuzzy matching for typo tolerance
- Include exchange rate ranges in search
- Add category-based filtering
- Implement advanced search operators

### Filter Performance

The filter system is optimized for real-time performance:

- **Client-side Filtering**: No server requests during search
- **Memoized Results**: Efficient re-rendering with React best practices
- **Debounced Input**: Smooth typing experience without lag
- **Preserved State**: Filter state maintains during auto-refresh cycles

## Browser Support

This application supports all modern browsers including:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance Features

- **Server-Side Rendering (SSR)**: Fast initial page loads with Remix loader
- **API Request Optimization**: Concurrent API calls with timeout protection
- **Automatic Fallback**: Instant fallback to cached data on API failure
- **Static Asset Optimization**: Efficient asset delivery
- **Minimal JavaScript**: Reduced bundle size following Remix patterns
- **Progressive Enhancement**: Works without JavaScript
- **Error Boundaries**: Graceful error handling throughout the application

## Troubleshooting

### Common Issues

**"Fallback Data" showing instead of live data:**
- Check that `COINBASE_API_KEY` is set in your `.env` file
- Verify your API key has the correct permissions (read-only is sufficient)
- Check the server console for API error messages

**API requests timing out:**
- Increase `API_REQUEST_TIMEOUT` in your `.env` file
- Check your internet connection
- Verify Coinbase API status at [status.coinbase.com](https://status.coinbase.com)

**No data showing at all:**
- Ensure `USE_FALLBACK_DATA=true` in your `.env` file
- Check the browser console for JavaScript errors
- Restart the development server with `npm run dev`

### Debug Mode

To enable detailed API logging, check your server console when running `npm run dev`. The service logs:
- 🔄 API fetch attempts
- ✅ Successful data retrieval
- ❌ API failures and fallback usage

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Run tests: `npm run lint && npm run typecheck`
5. Commit your changes: `git commit -m 'Add feature'`
6. Push to the branch: `git push origin feature-name`
7. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For questions or issues, please open an issue on the GitHub repository.

---

Built with ❤️ using Remix and Tailwind CSS