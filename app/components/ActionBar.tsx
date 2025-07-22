import { useState, useEffect, useCallback } from "react";

interface ActionBarProps {
    onRefresh: () => void;
    lastUpdated: string;
    isLiveData: boolean;
    filterValue: string;
    onFilterChange: (value: string) => void;
}

// Client-side constant for refresh rate (1 minute default)
const REFRESH_RATE_MINUTES = 1;
const REFRESH_RATE_MS = REFRESH_RATE_MINUTES * 60 * 1000;

export default function ActionBar({
    onRefresh,
    lastUpdated,
    isLiveData,
    filterValue,
    onFilterChange
}: ActionBarProps) {
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

    const handleSearch = () => {
        // Trigger search action - could be used for future enhancements
        // For now, just focus the input if it's empty
        if (!filterValue.trim()) {
            const input = document.querySelector('input[type="text"]') as HTMLInputElement;
            input?.focus();
        }
    };

    return (
        <div className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm">
            <div className="grid grid-cols-12 gap-4 items-center">
                {/* Left Column: Live Data Status & Updated Time (3 columns) */}
                <div className="col-span-3 flex flex-col space-y-2">
                    {/* Live Data Status */}
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium w-fit ${isLiveData
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                        }`}>
                        <div className={`w-2 h-2 rounded-full mr-2 ${isLiveData ? 'bg-green-500' : 'bg-orange-500'}`}></div>
                        {isLiveData ? 'Live Data' : 'Fallback Data'}
                    </div>

                    {/* Last Updated */}
                    <div className="inline-flex items-center px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-xs text-gray-600 dark:text-gray-400 w-fit">
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Updated: {formatLastUpdated(lastUpdated)}
                    </div>
                </div>

                {/* Center Column: Filter Input (6 columns - bigger) */}
                <div className="col-span-6">
                    <div className="relative max-w-lg mx-auto">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            value={filterValue}
                            onChange={(e) => onFilterChange(e.target.value)}
                            placeholder="Filter by name or symbol..."
                            className="block w-full pl-10 pr-20 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-colors duration-200"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center">
                            {filterValue && (
                                <button
                                    onClick={() => onFilterChange('')}
                                    className="mr-1 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
                                    title="Clear filter"
                                >
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            )}
                            <button
                                onClick={handleSearch}
                                className="mr-2 px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                title="Search"
                            >
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Column: Auto Refresh Controls (3 columns) */}
                <div className="col-span-3 flex flex-col space-y-2 items-end">
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
                        className="inline-flex items-center px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-xs font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
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
        </div>
    );
}