interface StatusIndicatorProps {
    isLiveData: boolean;
    lastUpdated: string;
    filterValue: string;
    apiError?: boolean;
    searchResultsInfo?: {
        fromCache: boolean;
        hasMoreResults: boolean;
        totalFound: number;
    };
}

export default function StatusIndicator({
    isLiveData,
    lastUpdated,
    filterValue,
    apiError = false,
    searchResultsInfo
}: StatusIndicatorProps) {
    // Format the last updated time
    const formatLastUpdated = (timestamp: string) => {
        return new Date(timestamp).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    // Determine status display based on API error and live data state
    const getStatusConfig = () => {
        if (apiError) {
            return {
                bgColor: 'bg-red-100 dark:bg-red-900',
                textColor: 'text-red-800 dark:text-red-200',
                dotColor: 'bg-red-500',
                label: 'API Down'
            };
        } else if (isLiveData) {
            return {
                bgColor: 'bg-green-100 dark:bg-green-900',
                textColor: 'text-green-800 dark:text-green-200',
                dotColor: 'bg-green-500',
                label: 'Live Data'
            };
        } else {
            return {
                bgColor: 'bg-orange-100 dark:bg-orange-900',
                textColor: 'text-orange-800 dark:text-orange-200',
                dotColor: 'bg-orange-500',
                label: 'Fallback Data'
            };
        }
    };

    const statusConfig = getStatusConfig();

    return (
        <div className="flex flex-col space-y-2">
            {/* Live Data Status */}
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium w-fit ${statusConfig.bgColor} ${statusConfig.textColor}`}>
                <div className={`w-2 h-2 rounded-full mr-2 ${statusConfig.dotColor}`}></div>
                {statusConfig.label}
            </div>

            {/* Last Updated */}
            <div className="inline-flex items-center px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-xs text-gray-600 dark:text-gray-400 w-fit">
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Updated: {formatLastUpdated(lastUpdated)}
            </div>

            {/* Search Results Info */}
            {searchResultsInfo && filterValue.trim() && (
                <div className="inline-flex items-center px-3 py-1 bg-blue-100 dark:bg-blue-900 rounded-full text-xs text-blue-800 dark:text-blue-200 w-fit">
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {searchResultsInfo.totalFound} found • {searchResultsInfo.fromCache ? 'Cached' : 'Live'}
                </div>
            )}
        </div>
    );
}