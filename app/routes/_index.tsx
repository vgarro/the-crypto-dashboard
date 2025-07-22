import type { MetaFunction, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useState, useCallback, useEffect } from "react";
import { coinbaseService, type CryptoCurrency } from "~/services/coinbase.server";
import ActionBar from "~/components/ActionBar";
import SortableCryptoGrid from "~/components/SortableCryptoGrid";
import { applySavedOrder, saveCryptoOrder, generateOrderMapping } from "~/utils/localStorage";
import { smartCache, type SearchResult } from "~/utils/smartCache";

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
  isSearchResult?: boolean;
  searchQuery?: string;
  fromCache?: boolean;
  hasMoreResults?: boolean;
}

// Remix Loader Function - Server-side data fetching for initial render
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const loader = async ({ request }: LoaderFunctionArgs) => {
  try {
    // Fetch cryptocurrency data from the Coinbase service
    const result = await coinbaseService.getCryptocurrencies();

    // Display only the first 10 cryptocurrencies
    const displayedCrypto = result.data.slice(0, 10);

    return json({
      cryptocurrencies: displayedCrypto,
      totalAvailable: result.totalAvailable,
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



export default function Index() {
  const initialData = useLoaderData<typeof loader>();

  // Client-side state for managing crypto data
  const [cryptoData, setCryptoData] = useState<CryptoData>(initialData);
  const [filterValue, setFilterValue] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [apiError, setApiError] = useState<boolean>(false);

  // Apply saved order on initial load (client-side only) - runs only once
  useEffect(() => {
    const orderedCryptos = applySavedOrder(initialData.cryptocurrencies);
    setCryptoData(prev => ({
      ...prev,
      cryptocurrencies: orderedCryptos
    }));

    // Initialize smart cache with initial data
    smartCache.updateBaseCache(
      initialData.cryptocurrencies,
      initialData.isLiveData,
      initialData.totalAvailable
    );

    // Clear API error state if we have initial data, or set it if we have an error
    if (initialData.error) {
      setApiError(true);
    } else {
      setApiError(false);
    }

    // Empty dependency array - runs only once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Smart search function that uses caching
  const performSmartSearch = useCallback(async (query: string): Promise<SearchResult> => {
    return await smartCache.smartSearch(query, async (searchQuery: string) => {
      const response = await fetch(`/api/crypto?search=${encodeURIComponent(searchQuery)}&limit=20`);
      if (!response.ok) {
        throw new Error('Failed to search cryptocurrencies');
      }
      return await response.json();
    });
  }, []);

  // Handle search with smart caching
  const handleSearch = useCallback(async (query: string) => {
    setIsSearching(true);
    try {
      const result = await performSmartSearch(query);

      // Clear any previous API errors on successful search
      setApiError(false);

      // Apply saved order to search results
      const orderedCryptos = applySavedOrder(result.cryptocurrencies);

      setCryptoData({
        cryptocurrencies: orderedCryptos,
        totalAvailable: result.totalAvailable,
        isLiveData: result.isLiveData,
        lastUpdated: result.lastUpdated,
        isSearchResult: true,
        searchQuery: result.searchQuery,
        fromCache: result.fromCache,
        hasMoreResults: result.hasMoreResults,
      });
    } catch (error) {
      console.error('Smart search failed:', error);

      // Determine if this is an API connectivity issue
      const isApiDown = error instanceof TypeError && error.message.includes('fetch') ||
        (error instanceof Error && (
          error.message.includes('Failed to search cryptocurrencies') ||
          error.message.includes('Failed to fetch') ||
          error.message.includes('NetworkError')
        ));

      if (isApiDown) {
        // Set API error state
        setApiError(true);
        setCryptoData(prev => ({
          ...prev,
          isLiveData: false,
          error: 'Search API is currently unavailable'
        }));
      }

      // Keep current data on search failure
    } finally {
      setIsSearching(false);
    }
  }, [performSmartSearch]);

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (filterValue.trim()) {
        handleSearch(filterValue);
      } else {
        // Reset to base data when filter is cleared
        setCryptoData(prev => {
          if (prev.isSearchResult) {
            return {
              ...initialData,
              cryptocurrencies: applySavedOrder(initialData.cryptocurrencies),
            };
          }
          return prev;
        });
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
    // Removed cryptoData.isSearchResult and initialData dependencies since this creates a loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterValue, handleSearch]);

  // All cryptocurrencies are already filtered by the smart search
  const filteredCryptocurrencies = cryptoData.cryptocurrencies;

  // Client-side refresh function
  const handleRefresh = useCallback(async () => {
    try {
      let response;

      if (cryptoData.isSearchResult && cryptoData.searchQuery) {
        // Refresh search results
        response = await fetch(`/api/crypto?search=${encodeURIComponent(cryptoData.searchQuery)}&limit=20`);
      } else {
        // Refresh base data
        response = await fetch('/api/crypto');
      }

      if (!response.ok) {
        // Handle different HTTP error statuses
        if (response.status >= 500) {
          // Server errors indicate API is down
          throw new Error(`API server error: ${response.status}`);
        } else if (response.status === 429) {
          // Rate limiting
          throw new Error('Rate limit exceeded');
        } else {
          // Other client errors
          throw new Error(`Request failed: ${response.status}`);
        }
      }

      const newData = await response.json();

      // Clear any previous API errors on successful response
      setApiError(false);

      // Update smart cache with fresh data
      if (!newData.isSearchResult) {
        smartCache.updateBaseCache(newData.cryptocurrencies, newData.isLiveData, newData.totalAvailable);
      } else {
        smartCache.updateSearchCache(newData.searchQuery, newData.cryptocurrencies, newData.isLiveData);
      }

      // Apply saved order to refreshed data
      const orderedCryptos = applySavedOrder(newData.cryptocurrencies);
      setCryptoData({
        ...newData,
        cryptocurrencies: orderedCryptos
      });
    } catch (error) {
      console.error('Failed to refresh data:', error);

      // Determine if this is an API connectivity issue
      const isApiDown = error instanceof TypeError && error.message.includes('fetch') ||
        (error instanceof Error && (
          error.message.includes('API server error') ||
          error.message.includes('Failed to fetch') ||
          error.message.includes('NetworkError')
        ));

      if (isApiDown) {
        // Set API error state and update crypto data to reflect API down status
        setApiError(true);
        setCryptoData(prev => ({
          ...prev,
          isLiveData: false,
          error: 'API is currently unavailable'
        }));
      }

      // Optionally show an error message to the user
      // For now, the error state will be shown via the status indicator
    }
  }, [cryptoData.isSearchResult, cryptoData.searchQuery]);

  // Handle card reordering
  const handleReorder = useCallback((reorderedCryptos: CryptoCurrency[]) => {
    // Update local state
    setCryptoData(prev => ({
      ...prev,
      cryptocurrencies: reorderedCryptos
    }));

    // Save order to localStorage
    const orderMapping = generateOrderMapping(reorderedCryptos);
    saveCryptoOrder(orderMapping);
  }, []);

  // Handle filter change
  const handleFilterChange = useCallback((value: string) => {
    setFilterValue(value);
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

            {/* ActionBar Component - unified control panel */}
            <ActionBar
              onRefresh={handleRefresh}
              lastUpdated={lastUpdated}
              isLiveData={isLiveData}
              apiError={apiError}
              filterValue={filterValue}
              onFilterChange={handleFilterChange}
              isSearching={isSearching}
              searchResultsInfo={cryptoData.isSearchResult ? {
                fromCache: cryptoData.fromCache || false,
                hasMoreResults: cryptoData.hasMoreResults || false,
                totalFound: cryptocurrencies.length,
              } : undefined}
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

        {/* Sortable Crypto Cards Grid */}
        {filteredCryptocurrencies.length > 0 ? (
          <SortableCryptoGrid
            cryptocurrencies={filteredCryptocurrencies}
            onReorder={handleReorder}
            filterValue={filterValue}
          />
        ) : filterValue.trim() ? (
          <div className="text-center py-12">
            <div className="mx-auto h-16 w-16 text-gray-400 mb-4">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No cards found</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              No cryptocurrency cards match your search for &quot;<span className="font-medium">{filterValue}</span>&quot;
            </p>
            <button
              onClick={() => setFilterValue('')}
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Clear filter
            </button>
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
