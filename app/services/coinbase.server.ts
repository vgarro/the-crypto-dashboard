/**
 * Coinbase API Service
 *
 * This service handles fetching cryptocurrency data from the Coinbase API
 * with proper error handling, timeouts, and fallback data mechanisms.
 *
 * Remix best practices:
 * - Server-side only (*.server.ts)
 * - Environment variable security
 * - Graceful error handling
 * - Type safety throughout
 */

export interface CryptoCurrency {
  id: number;
  name: string;
  symbol: string;
  exchangeRate: number;
  exchangeRateInBTC: number;
  order: number;
}

export interface CoinbaseApiResponse {
  data: {
    currency: string;
    rates: Record<string, string>;
  };
}

// Fallback data for when API is unavailable
const FALLBACK_CRYPTO_DATA: CryptoCurrency[] = [
  { id: 1, name: "Bitcoin", symbol: "BTC", exchangeRate: 43520.75, exchangeRateInBTC: 1.0, order: 0 },
  { id: 2, name: "Ethereum", symbol: "ETH", exchangeRate: 2678.32, exchangeRateInBTC: 0.0615, order: 1 },
  { id: 3, name: "Cardano", symbol: "ADA", exchangeRate: 0.4521, exchangeRateInBTC: 0.0000104, order: 2 },
  { id: 4, name: "Polkadot", symbol: "DOT", exchangeRate: 5.83, exchangeRateInBTC: 0.000134, order: 3 },
  { id: 5, name: "Chainlink", symbol: "LINK", exchangeRate: 14.72, exchangeRateInBTC: 0.000338, order: 4 },
  { id: 6, name: "Litecoin", symbol: "LTC", exchangeRate: 73.15, exchangeRateInBTC: 0.00168, order: 5 },
  { id: 7, name: "Bitcoin Cash", symbol: "BCH", exchangeRate: 234.67, exchangeRateInBTC: 0.00539, order: 6 },
  { id: 8, name: "Stellar", symbol: "XLM", exchangeRate: 0.1289, exchangeRateInBTC: 0.00000296, order: 7 },
  { id: 9, name: "VeChain", symbol: "VET", exchangeRate: 0.0275, exchangeRateInBTC: 0.00000063, order: 8 },
  { id: 10, name: "Dogecoin", symbol: "DOGE", exchangeRate: 0.0821, exchangeRateInBTC: 0.00000189, order: 9 },
  { id: 11, name: "Solana", symbol: "SOL", exchangeRate: 102.45, exchangeRateInBTC: 0.00235, order: 10 },
  { id: 12, name: "Avalanche", symbol: "AVAX", exchangeRate: 36.78, exchangeRateInBTC: 0.000845, order: 11 },
  { id: 13, name: "Polygon", symbol: "MATIC", exchangeRate: 0.7892, exchangeRateInBTC: 0.0000181, order: 12 },
  { id: 14, name: "Cosmos", symbol: "ATOM", exchangeRate: 9.67, exchangeRateInBTC: 0.000222, order: 13 },
  { id: 15, name: "Algorand", symbol: "ALGO", exchangeRate: 0.1634, exchangeRateInBTC: 0.00000375, order: 14 },
  { id: 16, name: "Tezos", symbol: "XTZ", exchangeRate: 0.9123, exchangeRateInBTC: 0.0000210, order: 15 },
  { id: 17, name: "Internet Computer", symbol: "ICP", exchangeRate: 4.78, exchangeRateInBTC: 0.000110, order: 16 },
  { id: 18, name: "NEAR Protocol", symbol: "NEAR", exchangeRate: 1.89, exchangeRateInBTC: 0.0000434, order: 17 },
  { id: 19, name: "Flow", symbol: "FLOW", exchangeRate: 0.6745, exchangeRateInBTC: 0.0000155, order: 18 },
  { id: 20, name: "Hedera", symbol: "HBAR", exchangeRate: 0.0567, exchangeRateInBTC: 0.00000130, order: 19 }
];

import { CURRENCY_SYMBOLS, DEFAULT_RESULT_COUNT, CURRENCY_NAMES } from '~/constants';

class CoinbaseService {
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly timeout: number;
  private readonly useFallback: boolean;

  constructor() {
    this.apiKey = process.env.COINBASE_API_KEY || '';
    this.baseUrl = 'https://api.coinbase.com/v2';
    this.timeout = parseInt(process.env.API_REQUEST_TIMEOUT || '5000');
    this.useFallback = process.env.USE_FALLBACK_DATA !== 'false';

    if (!this.apiKey) {
      console.warn('⚠️  COINBASE_API_KEY not found in environment variables. Using fallback data.');
    }
  }

  /**
   * Fetches exchange rates for a specific currency
   */
  private async fetchExchangeRates(currency: string): Promise<CoinbaseApiResponse | null> {
    if (!this.apiKey) {
      return null;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      //   Leaving this code here for future reference, but it's not needed for this particular API
      //   https://docs.cdp.coinbase.com/coinbase-business/track-apis/exchange-rates#data-api-exchange-rates
      const response = await fetch(`${this.baseUrl}/exchange-rates?currency=${currency}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Failed to fetch exchange rates for ${currency}:`, error);
      return null;
    }
  }

  /**
   * Calculates Bitcoin exchange rate for a given USD rate
   */
  private calculateBTCRate(usdRate: number, btcUsdRate: number): number {
    if (btcUsdRate === 0) return 0;
    return usdRate / btcUsdRate;
  }

  /**
   * Fetches all cryptocurrency data with fallback mechanism
   */
  async getCryptocurrencies(limit: number = DEFAULT_RESULT_COUNT): Promise<{
    data: CryptoCurrency[];
    isLiveData: boolean;
    lastUpdated: string;
    totalAvailable: number;
  }> {
    try {
      console.log('🔄 Fetching live cryptocurrency data from Coinbase API...');

      // Fetch Bitcoin rate first (needed for BTC conversion)
      const btcData = await this.fetchExchangeRates('BTC');
      const btcUsdRate = btcData?.data?.rates?.USD ? parseFloat(btcData.data.rates.USD) : 0;

      if (!btcData || btcUsdRate === 0) {
        throw new Error('Failed to fetch Bitcoin reference rate');
      }

      // Fetch data for all currencies
      const cryptoPromises = CURRENCY_SYMBOLS.map(async (symbol, index) => {
        const data = await this.fetchExchangeRates(symbol);

        if (!data?.data?.rates?.USD) {
          return null;
        }

        const usdRate = parseFloat(data.data.rates.USD);
        const btcRate = symbol === 'BTC' ? 1.0 : this.calculateBTCRate(usdRate, btcUsdRate);

        return {
          id: index + 1,
          name: CURRENCY_NAMES[symbol] || symbol,
          symbol,
          exchangeRate: usdRate,
          exchangeRateInBTC: btcRate,
          order: index,
        };
      });

      const results = await Promise.all(cryptoPromises);
      const validResults = results.filter((result): result is CryptoCurrency => result !== null);

      // If we got some valid results, use them
      if (validResults.length >= Math.min(limit, 10)) {
        console.log(`✅ Successfully fetched ${validResults.length} live cryptocurrency rates`);
        return {
          data: validResults.slice(0, limit),
          isLiveData: true,
          lastUpdated: new Date().toISOString(),
          totalAvailable: validResults.length,
        };
      }

      throw new Error(`Insufficient data: only ${validResults.length} currencies fetched`);

    } catch (error) {
      console.error('❌ Failed to fetch live data:', error);

      if (this.useFallback) {
        console.log('🔄 Falling back to cached sample data...');
        return {
          data: FALLBACK_CRYPTO_DATA.slice(0, limit),
          isLiveData: false,
          lastUpdated: new Date().toISOString(),
          totalAvailable: FALLBACK_CRYPTO_DATA.length,
        };
      }

      throw error;
    }
  }

  /**
   * Search cryptocurrencies by name or symbol
   */
  async searchCryptocurrencies(query: string, limit: number = 20): Promise<{
    data: CryptoCurrency[];
    isLiveData: boolean;
    lastUpdated: string;
    searchQuery: string;
  }> {
    const searchTerm = query.toLowerCase().trim();

    if (!searchTerm) {
      const result = await this.getCryptocurrencies(limit);
      return {
        ...result,
        searchQuery: query,
      };
    }

    try {
      console.log(`🔍 Searching for cryptocurrencies matching: "${searchTerm}"`);

      // Get full dataset for searching
      const result = await this.getCryptocurrencies(CURRENCY_SYMBOLS.length);

      // Filter results based on search term
      const filteredData = result.data.filter(crypto => {
        const nameMatch = crypto.name.toLowerCase().includes(searchTerm);
        const symbolMatch = crypto.symbol.toLowerCase().includes(searchTerm);
        return nameMatch || symbolMatch;
      });

      console.log(`✅ Found ${filteredData.length} cryptocurrencies matching "${searchTerm}"`);

      return {
        data: filteredData.slice(0, limit),
        isLiveData: result.isLiveData,
        lastUpdated: result.lastUpdated,
        searchQuery: query,
      };
    } catch (error) {
      console.error('❌ Failed to search cryptocurrencies:', error);

      // Fallback search in static data
      if (this.useFallback) {
        console.log('🔄 Falling back to search in cached sample data...');
        const filteredData = FALLBACK_CRYPTO_DATA.filter(crypto => {
          const nameMatch = crypto.name.toLowerCase().includes(searchTerm);
          const symbolMatch = crypto.symbol.toLowerCase().includes(searchTerm);
          return nameMatch || symbolMatch;
        });

        return {
          data: filteredData.slice(0, limit),
          isLiveData: false,
          lastUpdated: new Date().toISOString(),
          searchQuery: query,
        };
      }

      throw error;
    }
  }

  /**
   * Health check for the API service
   */
  async healthCheck(): Promise<{ healthy: boolean; message: string }> {
    if (!this.apiKey) {
      return {
        healthy: false,
        message: 'API key not configured',
      };
    }

    try {
      const data = await this.fetchExchangeRates('BTC');
      return {
        healthy: !!data,
        message: data ? 'API is responsive' : 'API request failed',
      };
    } catch (error) {
      return {
        healthy: false,
        message: `API health check failed: ${error}`,
      };
    }
  }
}

// Export singleton instance
export const coinbaseService = new CoinbaseService();