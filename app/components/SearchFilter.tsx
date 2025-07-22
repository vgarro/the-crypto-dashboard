interface SearchFilterProps {
    filterValue: string;
    onFilterChange: (value: string) => void;
    isSearching?: boolean;
    searchResultsInfo?: {
        fromCache: boolean;
        hasMoreResults: boolean;
        totalFound: number;
    };
}

export default function SearchFilter({
    filterValue,
    onFilterChange,
    isSearching = false
}: SearchFilterProps) {
    const handleSearch = () => {
        // Trigger search action - could be used for future enhancements
        // For now, just focus the input if it's empty
        if (!filterValue.trim()) {
            const input = document.querySelector('input[type="text"]') as HTMLInputElement;
            input?.focus();
        }
    };

    return (
        <div className="w-full">
            <div className="relative lg:max-w-lg lg:mx-auto">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                <input
                    type="text"
                    value={filterValue}
                    onChange={(e) => onFilterChange(e.target.value)}
                    placeholder="Search by name or symbol..."
                    disabled={isSearching}
                    className={`block w-full pl-10 pr-16 lg:pr-20 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-colors duration-200 ${isSearching ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
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
                        disabled={isSearching}
                        className={`mr-2 px-2 py-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-xs font-medium rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${isSearching ? 'cursor-not-allowed' : ''
                            }`}
                        title={isSearching ? "Searching..." : "Search"}
                    >
                        {isSearching ? (
                            <svg className="w-3 h-3 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                        ) : (
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}