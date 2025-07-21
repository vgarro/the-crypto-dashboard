import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "Crypto Dashboard" },
    { name: "description", content: "Cryptocurrency Dashboard with Real-time Rates" },
  ];
};

// Crypto currency data array (20 items, displaying first 10)
const cryptocurrencies = [
  { id: 1, name: "Bitcoin", symbol: "BTC", exchangeRate: 43520.75, exchangeRateInBTC: 1.0 },
  { id: 2, name: "Ethereum", symbol: "ETH", exchangeRate: 2678.32, exchangeRateInBTC: 0.0615 },
  { id: 3, name: "Cardano", symbol: "ADA", exchangeRate: 0.4521, exchangeRateInBTC: 0.0000104 },
  { id: 4, name: "Polkadot", symbol: "DOT", exchangeRate: 5.83, exchangeRateInBTC: 0.000134 },
  { id: 5, name: "Chainlink", symbol: "LINK", exchangeRate: 14.72, exchangeRateInBTC: 0.000338 },
  { id: 6, name: "Litecoin", symbol: "LTC", exchangeRate: 73.15, exchangeRateInBTC: 0.00168 },
  { id: 7, name: "Bitcoin Cash", symbol: "BCH", exchangeRate: 234.67, exchangeRateInBTC: 0.00539 },
  { id: 8, name: "Stellar", symbol: "XLM", exchangeRate: 0.1289, exchangeRateInBTC: 0.00000296 },
  { id: 9, name: "VeChain", symbol: "VET", exchangeRate: 0.0275, exchangeRateInBTC: 0.00000063 },
  { id: 10, name: "Dogecoin", symbol: "DOGE", exchangeRate: 0.0821, exchangeRateInBTC: 0.00000189 },
  { id: 11, name: "Solana", symbol: "SOL", exchangeRate: 102.45, exchangeRateInBTC: 0.00235 },
  { id: 12, name: "Avalanche", symbol: "AVAX", exchangeRate: 36.78, exchangeRateInBTC: 0.000845 },
  { id: 13, name: "Polygon", symbol: "MATIC", exchangeRate: 0.7892, exchangeRateInBTC: 0.0000181 },
  { id: 14, name: "Cosmos", symbol: "ATOM", exchangeRate: 9.67, exchangeRateInBTC: 0.000222 },
  { id: 15, name: "Algorand", symbol: "ALGO", exchangeRate: 0.1634, exchangeRateInBTC: 0.00000375 },
  { id: 16, name: "Tezos", symbol: "XTZ", exchangeRate: 0.9123, exchangeRateInBTC: 0.0000210 },
  { id: 17, name: "Internet Computer", symbol: "ICP", exchangeRate: 4.78, exchangeRateInBTC: 0.000110 },
  { id: 18, name: "NEAR Protocol", symbol: "NEAR", exchangeRate: 1.89, exchangeRateInBTC: 0.0000434 },
  { id: 19, name: "Flow", symbol: "FLOW", exchangeRate: 0.6745, exchangeRateInBTC: 0.0000155 },
  { id: 20, name: "Hedera", symbol: "HBAR", exchangeRate: 0.0567, exchangeRateInBTC: 0.00000130 }
];

// Display only the first 10 cryptocurrencies
const displayedCrypto = cryptocurrencies.slice(0, 10);

interface CryptoCardProps {
  crypto: {
    id: number;
    name: string;
    symbol: string;
    exchangeRate: number;
    exchangeRateInBTC: number;
  };
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
          <div className="mt-4 inline-flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-900 rounded-full">
            <span className="text-blue-800 dark:text-blue-200 text-sm font-medium">
              Displaying {displayedCrypto.length} of {cryptocurrencies.length} currencies
            </span>
          </div>
        </header>

        {/* Crypto Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
          {displayedCrypto.map((crypto) => (
            <CryptoCard key={crypto.id} crypto={crypto} />
          ))}
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Built with Remix • Styled with Tailwind CSS
          </p>
        </footer>
      </div>
    </div>
  );
}
