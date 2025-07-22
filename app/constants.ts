// Application Constants
// This file contains all configurable constants used throughout the application

// Initial number of cryptocurrencies to display on page load
export const INITIAL_CRYPTO_DISPLAY_LIMIT = 15;

// Cryptocurrency symbols supported by the application
export const CURRENCY_SYMBOLS = [
    'BTC', 'ETH', 'ADA', 'DOT', 'LINK', 'LTC', 'BCH', 'XLM', 'VET', 'DOGE',
    'SOL', 'AVAX', 'MATIC', 'ATOM', 'ALGO', 'XTZ', 'ICP', 'NEAR', 'FLOW', 'HBAR'
  ];

// Default number of cryptocurrency results to return from API
export const DEFAULT_RESULT_COUNT = 10; // Changed from 10

// Auto-refresh rate in minutes
export const REFRESH_RATE_MINUTES = 2; // Changed from 1

// Currency name mappings for display
export const CURRENCY_NAMES: Record<string, string> = {
  'BTC': 'Bitcoin',
  'ETH': 'Ethereum',
  'ADA': 'Cardano',
  'DOT': 'Polkadot',
  'LINK': 'Chainlink',
  'LTC': 'Litecoin',
  'BCH': 'Bitcoin Cash',
  'XLM': 'Stellar',
  'VET': 'VeChain',
  'DOGE': 'Dogecoin',
  'SOL': 'Solana',
  'AVAX': 'Avalanche',
  'MATIC': 'Polygon',
  'ATOM': 'Cosmos',
  'ALGO': 'Algorand',
  'XTZ': 'Tezos',
  'ICP': 'Internet Computer',
  'NEAR': 'NEAR Protocol',
  'FLOW': 'Flow',
  'HBAR': 'Hedera',
  'NEW_COIN': 'New Coin',
};