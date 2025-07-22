# Crypto Dashboard

A modern, responsive cryptocurrency dashboard built with Remix, TypeScript, and Tailwind CSS. This application displays cryptocurrency exchange rates in an elegant credit card-style interface, following Remix best practices for optimal performance and user experience.

## Features

- 🎨 **Credit Card Design**: Beautiful card-based UI with gradients and shadows
- 📱 **Fully Responsive**: Optimized layout for mobile, tablet, and desktop
- ⚡ **Remix Optimized**: Server-side rendering with minimal client-side JavaScript
- 🌙 **Dark Mode Support**: Beautiful dark theme with proper contrast
- 💰 **20+ Cryptocurrencies**: Comprehensive list with real-time data from Coinbase API
- ₿ **Bitcoin Conversion**: Shows exchange rates in both USD and Bitcoin
- 🎯 **Performance Focused**: Fast loading with efficient rendering
- 🔄 **Real-time Data**: Live cryptocurrency rates with automatic fallback
- 🔄 **Auto-Refresh**: Automatic data refresh every minute with manual refresh option
- 🎛️ **Refresh Control**: Toggle auto-refresh on/off with visual status indicators
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
│   │   └── Refresh.tsx         # Auto-refresh component with toggle and manual refresh
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

### Auto-Refresh Feature

The dashboard includes an intelligent auto-refresh system:

- **Auto-Refresh Toggle**: Enable/disable automatic data updates (default: ON)
- **Manual Refresh Button**: Instantly refresh data with loading indicator
- **Refresh Rate**: Automatically updates every 1 minute when enabled
- **Client-Side Updates**: Seamless data refresh without page reload
- **Visual Feedback**: Loading spinner during refresh operations

**How to Use:**
1. **Auto-Refresh Toggle**: Click the toggle switch to enable/disable automatic updates
2. **Manual Refresh**: Click the "Refresh" button to immediately update data
3. **Status Monitoring**: Watch the "Last Updated" timestamp to track refresh activity

The auto-refresh feature uses client-side fetching to update data without requiring a full page reload, providing a smooth user experience while keeping cryptocurrency data current.

## Customization

### Adding More Cryptocurrencies

To add more currencies, edit the `CURRENCY_SYMBOLS` and `CURRENCY_NAMES` arrays in `app/services/coinbase.server.ts`:

```typescript
const CURRENCY_SYMBOLS = [
  'BTC', 'ETH', 'ADA', // ... existing symbols
  'NEW',  // Add new symbol
];

const CURRENCY_NAMES: Record<string, string> = {
  // ... existing mappings
  'NEW': 'New Coin',  // Add name mapping
};
```

### Changing Display Count

To display more or fewer cards, modify the slice operation in the loader function:

```typescript
// In app/routes/_index.tsx loader function
const displayedCrypto = result.data.slice(0, 15); // Display first 15 instead of 10
```

### Customizing Card Design

The card styling is in the `CryptoCard` component. Modify the Tailwind classes to change:
- Colors and gradients
- Spacing and sizing
- Hover effects
- Typography

### Customizing Auto-Refresh Rate

To change the auto-refresh interval, modify the `REFRESH_RATE_MINUTES` constant in `app/components/Refresh.tsx`:

```typescript
// Change from 1 minute to 2 minutes
const REFRESH_RATE_MINUTES = 2;
```

**Available Options:**
- Set to any positive number for minutes (e.g., `0.5` for 30 seconds)
- Recommended range: 0.5 to 5 minutes for optimal user experience
- Lower values provide more real-time data but increase API usage

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
