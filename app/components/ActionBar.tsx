import SearchFilter from "./SearchFilter";
import StatusIndicator from "./StatusIndicator";
import RefreshControls from "./RefreshControls";

interface ActionBarProps {
    onRefresh: () => void;
    lastUpdated: string;
    isLiveData: boolean;
    apiError?: boolean;
    filterValue: string;
    onFilterChange: (value: string) => void;
    isSearching?: boolean;
    searchResultsInfo?: {
        fromCache: boolean;
        hasMoreResults: boolean;
        totalFound: number;
    };
}

export default function ActionBar({
    onRefresh,
    lastUpdated,
    isLiveData,
    apiError = false,
    filterValue,
    onFilterChange,
    isSearching = false,
    searchResultsInfo
}: ActionBarProps) {

    return (
        <div className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-3 sm:p-4 shadow-sm">
            {/* Mobile Layout: Stack vertically */}
            <div className="block lg:hidden space-y-3">
                {/* Search Input - Full width on mobile */}
                <SearchFilter
                    filterValue={filterValue}
                    onFilterChange={onFilterChange}
                    isSearching={isSearching}
                    searchResultsInfo={searchResultsInfo}
                />

                {/* Status and Controls - Responsive grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Status Information */}
                    <StatusIndicator
                        isLiveData={isLiveData}
                        apiError={apiError}
                        lastUpdated={lastUpdated}
                        filterValue={filterValue}
                        searchResultsInfo={searchResultsInfo}
                    />

                    {/* Refresh Controls */}
                    <RefreshControls onRefresh={onRefresh} />
                </div>
            </div>

            {/* Desktop Layout: 3-column grid with components */}
            <div className="hidden lg:block">
                <div className="grid grid-cols-12 gap-4 items-center">
                    {/* Left Column: Status Information (3 columns) */}
                    <div className="col-span-3">
                        <StatusIndicator
                            isLiveData={isLiveData}
                            apiError={apiError}
                            lastUpdated={lastUpdated}
                            filterValue={filterValue}
                            searchResultsInfo={searchResultsInfo}
                        />
                    </div>

                    {/* Center Column: Search Filter (6 columns) */}
                    <div className="col-span-6">
                        <SearchFilter
                            filterValue={filterValue}
                            onFilterChange={onFilterChange}
                            isSearching={isSearching}
                            searchResultsInfo={searchResultsInfo}
                        />
                    </div>

                    {/* Right Column: Refresh Controls (3 columns) */}
                    <div className="col-span-3">
                        <RefreshControls onRefresh={onRefresh} className="items-end" />
                    </div>
                </div>
            </div>
        </div>
    );
}