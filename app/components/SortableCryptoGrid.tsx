import React from 'react';
import {
    DndContext,
    DragEndEvent,
    DragOverlay,
    DragStartEvent,
    PointerSensor,
    useSensor,
    useSensors,
    closestCenter,
} from '@dnd-kit/core';
import {
    SortableContext,
    rectSortingStrategy,
    arrayMove,
} from '@dnd-kit/sortable';
import { type CryptoCurrency } from '~/services/coinbase.server';
import SortableCryptoCard from './SortableCryptoCard';

interface SortableCryptoGridProps {
    cryptocurrencies: CryptoCurrency[];
    onReorder: (reorderedCryptos: CryptoCurrency[]) => void;
}

// Non-draggable fallback card component
function StaticCryptoCard({ crypto }: { crypto: CryptoCurrency }) {
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

export default function SortableCryptoGrid({
    cryptocurrencies,
    onReorder
}: SortableCryptoGridProps) {
    const [activeId, setActiveId] = React.useState<number | null>(null);
    const [isClient, setIsClient] = React.useState(false);

    // Ensure component only renders drag functionality on client side
    React.useEffect(() => {
        setIsClient(true);
    }, []);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as number);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = cryptocurrencies.findIndex((crypto) => crypto.id === active.id);
            const newIndex = cryptocurrencies.findIndex((crypto) => crypto.id === over.id);

            const reorderedCryptos = arrayMove(cryptocurrencies, oldIndex, newIndex);

            // Update order values to match new positions
            const cryptosWithUpdatedOrder = reorderedCryptos.map((crypto, index) => ({
                ...crypto,
                order: index,
            }));

            onReorder(cryptosWithUpdatedOrder);
        }

        setActiveId(null);
    };

    const handleDragCancel = () => {
        setActiveId(null);
    };

    // Find the active crypto for drag overlay
    const activeCrypto = activeId ? cryptocurrencies.find(crypto => crypto.id === activeId) : null;

    // Render static grid during SSR and until client hydration
    if (!isClient) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
                {cryptocurrencies.map((crypto) => (
                    <StaticCryptoCard key={crypto.id} crypto={crypto} />
                ))}
            </div>
        );
    }

    // Render draggable grid on client side
    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
            id="crypto-dnd-context"
        >
            <SortableContext
                items={cryptocurrencies.map(crypto => crypto.id)}
                strategy={rectSortingStrategy}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
                    {cryptocurrencies.map((crypto) => (
                        <SortableCryptoCard key={crypto.id} crypto={crypto} />
                    ))}
                </div>
            </SortableContext>

            <DragOverlay>
                {activeCrypto ? (
                    <div className="rotate-6 transform scale-105">
                        <StaticCryptoCard crypto={activeCrypto} />
                    </div>
                ) : null}
            </DragOverlay>
        </DndContext>
    );
}