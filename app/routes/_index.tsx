import type { MetaFunction, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useState, useCallback } from "react";
import { coinbaseService, type CryptoCurrency } from "~/services/coinbase.server";
import Refresh from "~/components/Refresh";

export const meta: MetaFunction = () => {
  return [
    { title: "Crypto Dashboard" },
    { name: "description", content: "Cryptocurrency Dashboard with Real-time Rates" },
  ];
};

// Interface for the crypto data structure
interface CryptoData {
  cryptocurrencies: CryptoCurrency[];
  totalAvailable: number;
  isLiveData: boolean;
  lastUpdated: string;
  error?: string;
}

// Remix Loader Function - Server-side data fetching for initial render
export const loader = async ({ request }: LoaderFunctionArgs) => {
  try {
    // Fetch cryptocurrency data from the Coinbase service
    const result = await coinbaseService.getCryptocurrencies();

    // Display only the first 10 cryptocurrencies
    const displayedCrypto = result.data.slice(0, 10);

    return json({
      cryptocurrencies: displayedCrypto,
      totalAvailable: result.data.length,
      isLiveData: result.isLiveData,
      lastUpdated: result.lastUpdated,
    });
  } catch (error) {
    // If everything fails, return empty array with error status
    console.error("Failed to load cryptocurrency data:", error);
    return json({
      cryptocurrencies: [],
      totalAvailable: 0,
      isLiveData: false,
      lastUpdated: new Date().toISOString(),
      error: "Failed to load cryptocurrency data",
    }, { status: 500 });
  }
};

interface CryptoCardProps {
  crypto: CryptoCurrency;
}

function CryptoCard({ crypto }: CryptoCardProps) {
  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl p-6 shadow-2xl border border-gray-700 hover:shadow-3xl hover:scale-105 transition-all duration-300 min-h-[200px] flex flex-col justify-between">
      {/* Card Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
            {crypto.symbol.slice(0, 2)}
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg leading-tight">{crypto.name}</h3>
            <p className="text-gray-400 text-sm">ID: {crypto.id}</p>
          </div>
        </div>
        <div className="bg-yellow-500 text-black px-2 py-1 rounded-md text-xs font-bold">
          {crypto.symbol}
        </div>
      </div>

      {/* Card Body */}
      <div className="space-y-3 flex-grow">
        <div>
          <p className="text-gray-400 text-sm">Exchange Rate</p>
          <p className="text-white text-xl font-bold">
            ${crypto.exchangeRate.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 8
            })}
          </p>
        </div>

        <div>
          <p className="text-gray-400 text-sm">Rate in Bitcoin</p>
          <p className="text-orange-400 text-lg font-semibold">
            ₿ {crypto.exchangeRateInBTC.toFixed(8)}
          </p>
        </div>
      </div>

      {/* Card Footer */}
      <div className="mt-4 pt-3 border-t border-gray-700">
        <div className="flex justify-between items-center">
          <span className="text-gray-500 text-xs">CRYPTO CARD</span>
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Index() {
  const initialData = useLoaderData<typeof loader>();

  // Client-side state for managing crypto data
  const [cryptoData, setCryptoData] = useState<CryptoData>(initialData);

  // Client-side refresh function
  const handleRefresh = useCallback(async () => {
    try {
      const response = await fetch('/api/crypto');
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const newData = await response.json();
      setCryptoData(newData);
    } catch (error) {
      console.error('Failed to refresh data:', error);
      // Optionally show an error message to the user
    }
  }, []);

  const { cryptocurrencies, totalAvailable, isLiveData, lastUpdated, error } = cryptoData;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Dashboard Header */}
        <header className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-2">
            Crypto Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Real-time cryptocurrency exchange rates and Bitcoin conversions
          </p>

          {/* Status and Info Bar */}
          <div className="mt-4 space-y-2">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-900 rounded-full">
              <span className="text-blue-800 dark:text-blue-200 text-sm font-medium">
                Displaying {cryptocurrencies.length} of {totalAvailable} currencies
              </span>
            </div>

            {/* Refresh Component - replaces the old Live Data Status section */}
            <Refresh
              onRefresh={handleRefresh}
              lastUpdated={lastUpdated}
              isLiveData={isLiveData}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-4 max-w-md mx-auto">
              <div className="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-800 dark:text-red-200">
                      {error}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </header>

        {/* Crypto Cards Grid */}
        {cryptocurrencies.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
            {cryptocurrencies.map((crypto) => (
              <CryptoCard key={crypto.id} crypto={crypto} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="mx-auto h-12 w-12 text-gray-400">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No cryptocurrency data available</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Unable to load cryptocurrency data. Please check your API configuration.
            </p>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-12 text-center">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Built with Remix • Styled with Tailwind CSS • Powered by Coinbase API
          </p>
        </footer>
      </div>
    </div>
  );
}
