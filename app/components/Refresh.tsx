import { useState, useEffect, useCallback } from "react";

interface RefreshProps {
    onRefresh: () => void;
    lastUpdated: string;
    isLiveData: boolean;
}

// Client-side constant for refresh rate (1 minute default)
const REFRESH_RATE_MINUTES = 1;
const REFRESH_RATE_MS = REFRESH_RATE_MINUTES * 60 * 1000;

export default function Refresh({ onRefresh, lastUpdated, isLiveData }: RefreshProps) {
    const [autoRefresh, setAutoRefresh] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Format the last updated time
    const formatLastUpdated = (timestamp: string) => {
        return new Date(timestamp).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    // Auto-refresh functionality
    useEffect(() => {
        if (!autoRefresh) return;

        const interval = setInterval(() => {
            handleRefresh();
        }, REFRESH_RATE_MS);

        return () => clearInterval(interval);
    }, [autoRefresh, onRefresh]);

    const handleRefresh = useCallback(async () => {
        setIsRefreshing(true);
        try {
            await onRefresh();
        } finally {
            setIsRefreshing(false);
        }
    }, [onRefresh]);

    const handleToggleAutoRefresh = () => {
        setAutoRefresh(!autoRefresh);
    };

    return (
        <div className="flex items-center justify-center space-x-4">
            {/* Live Data Status */}
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${isLiveData
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                : 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                }`}>
                <div className={`w-2 h-2 rounded-full mr-2 ${isLiveData ? 'bg-green-500' : 'bg-orange-500'}`}></div>
                {isLiveData ? 'Live Data' : 'Fallback Data'}
            </div>

            {/* Last Updated */}
            <div className="inline-flex items-center px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-xs text-gray-600 dark:text-gray-400">
                Updated: {formatLastUpdated(lastUpdated)}
            </div>

            {/* Auto Refresh Controls */}
            <div className="flex items-center space-x-3">
                {/* Auto Refresh Toggle */}
                <div className="flex items-center space-x-2">
                    <label htmlFor="auto-refresh" className="text-xs font-medium text-gray-600 dark:text-gray-400">
                        Auto Refresh
                    </label>
                    <button
                        id="auto-refresh"
                        type="button"
                        onClick={handleToggleAutoRefresh}
                        className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 dark:focus:ring-offset-gray-900 ${autoRefresh ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                            }`}
                    >
                        <span
                            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${autoRefresh ? 'translate-x-4' : 'translate-x-0'
                                }`}
                        />
                    </button>
                </div>

                {/* Manual Refresh Button */}
                <button
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    className="inline-flex items-center px-3 py-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-xs font-medium rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                    title="Refresh data manually"
                >
                    <svg
                        className={`w-3 h-3 mr-1 ${isRefreshing ? 'animate-spin' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                    </svg>
                    {isRefreshing ? 'Refreshing...' : 'Refresh'}
                </button>
            </div>
        </div>
    );
}