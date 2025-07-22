import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { coinbaseService } from "~/services/coinbase.server";
import { INITIAL_CRYPTO_DISPLAY_LIMIT } from "~/constants";

// Resource route for client-side data fetching with search support
export const loader = async ({ request }: LoaderFunctionArgs) => {
    const url = new URL(request.url);
    const searchQuery = url.searchParams.get('search') || '';
    const limitParam = url.searchParams.get('limit');
    const limit = limitParam ? parseInt(limitParam, 10) : INITIAL_CRYPTO_DISPLAY_LIMIT;

    try {
        let result;

        if (searchQuery.trim()) {
            // Use search functionality
            console.log(`🔍 API search request: "${searchQuery}" (limit: ${limit})`);
            result = await coinbaseService.searchCryptocurrencies(searchQuery, limit);

            // Ensure each crypto has an order field (index-based)
            const cryptoWithOrder = result.data.map((crypto, index) => ({
                ...crypto,
                order: crypto.order !== undefined ? crypto.order : index
            }));

            return json({
                cryptocurrencies: cryptoWithOrder,
                totalAvailable: cryptoWithOrder.length,
                isLiveData: result.isLiveData,
                lastUpdated: result.lastUpdated,
                searchQuery: result.searchQuery,
                isSearchResult: true,
            });
        } else {
            // Regular fetch
            result = await coinbaseService.getCryptocurrencies(limit);

            // Ensure each crypto has an order field (index-based)
            const cryptoWithOrder = result.data.map((crypto, index) => ({
                ...crypto,
                order: crypto.order !== undefined ? crypto.order : index
            }));

            return json({
                cryptocurrencies: cryptoWithOrder,
                totalAvailable: result.totalAvailable,
                isLiveData: result.isLiveData,
                lastUpdated: result.lastUpdated,
                isSearchResult: false,
            });
        }
    } catch (error) {
        // If everything fails, return empty array with error status
        console.error("Failed to load cryptocurrency data:", error);
        return json({
            cryptocurrencies: [],
            totalAvailable: 0,
            isLiveData: false,
            lastUpdated: new Date().toISOString(),
            error: "Failed to load cryptocurrency data",
            searchQuery: searchQuery,
            isSearchResult: !!searchQuery.trim(),
        }, { status: 500 });
    }
};