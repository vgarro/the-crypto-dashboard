# Crypto Dashboard

A modern, responsive cryptocurrency dashboard built with Remix, TypeScript, and Tailwind CSS. This application displays cryptocurrency exchange rates in an elegant credit card-style interface, following Remix best practices for optimal performance and user experience.

## Features

- 🎨 **Credit Card Design**: Beautiful card-based UI with gradients and shadows
- 📱 **Fully Responsive**: Optimized layout for mobile, tablet, and desktop
- ⚡ **Remix Optimized**: Server-side rendering with minimal client-side JavaScript
- 🌙 **Dark Mode Support**: Beautiful dark theme with proper contrast
- 💰 **20+ Cryptocurrencies**: Comprehensive list with real-time style data
- ₿ **Bitcoin Conversion**: Shows exchange rates in both USD and Bitcoin
- 🎯 **Performance Focused**: Fast loading with efficient rendering

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

- **[Remix](https://remix.run/)** - Full-stack web framework
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Vite](https://vitejs.dev/)** - Fast build tool
- **[React 18](https://reactjs.org/)** - UI library (minimal usage per Remix best practices)

## Prerequisites

Before running this project, ensure you have:

- **Node.js** (version 20.0.0 or higher)
- **npm** (comes with Node.js)

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

### 3. Development Server

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

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
│   │   └── _index.tsx          # Main dashboard route
│   ├── root.tsx                # Root layout component
│   ├── entry.client.tsx        # Client entry point
│   ├── entry.server.tsx        # Server entry point
│   └── tailwind.css            # Tailwind CSS imports
├── public/                     # Static assets
├── package.json                # Dependencies and scripts
├── tailwind.config.ts          # Tailwind configuration
├── tsconfig.json              # TypeScript configuration
└── vite.config.ts             # Vite configuration
```

## Customization

### Adding More Cryptocurrencies

To add more currencies, edit the `cryptocurrencies` array in `app/routes/_index.tsx`:

```typescript
const cryptocurrencies = [
  // Add new cryptocurrency object
  {
    id: 21,
    name: "New Coin",
    symbol: "NEW",
    exchangeRate: 1.23,
    exchangeRateInBTC: 0.0000282
  },
  // ... existing currencies
];
```

### Changing Display Count

To display more or fewer cards, modify the slice operation:

```typescript
// Display first 15 instead of 10
const displayedCrypto = cryptocurrencies.slice(0, 15);
```

### Customizing Card Design

The card styling is in the `CryptoCard` component. Modify the Tailwind classes to change:
- Colors and gradients
- Spacing and sizing
- Hover effects
- Typography

## Browser Support

This application supports all modern browsers including:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance Features

- **Server-Side Rendering (SSR)**: Fast initial page loads
- **Static Asset Optimization**: Efficient asset delivery
- **Minimal JavaScript**: Reduced bundle size
- **Progressive Enhancement**: Works without JavaScript

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
