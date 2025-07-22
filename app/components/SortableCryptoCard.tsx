import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { type CryptoCurrency } from '~/services/coinbase.server';

interface SortableCryptoCardProps {
    crypto: CryptoCurrency;
}

function CryptoCard({ crypto }: { crypto: CryptoCurrency }) {
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

            {/* Drag Handle Indicator */}
            <div className="absolute top-2 right-2 opacity-30 hover:opacity-70 transition-opacity">
                <svg
                    className="w-5 h-5 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                >
                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
            </div>
        </div>
    );
}

export default function SortableCryptoCard({ crypto }: SortableCryptoCardProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: crypto.id,
        data: {
            type: 'crypto',
            crypto,
        },
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`relative cursor-grab active:cursor-grabbing ${isDragging ? 'z-50 opacity-50' : ''
                }`}
            {...attributes}
            {...listeners}
        >
            <CryptoCard crypto={crypto} />
        </div>
    );
}