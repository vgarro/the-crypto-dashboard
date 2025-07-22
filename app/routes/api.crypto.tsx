import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { coinbaseService } from "~/services/coinbase.server";

// Resource route for client-side data fetching
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