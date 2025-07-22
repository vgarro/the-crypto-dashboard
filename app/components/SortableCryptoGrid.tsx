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

export default function SortableCryptoGrid({
    cryptocurrencies,
    onReorder
}: SortableCryptoGridProps) {
    const [activeId, setActiveId] = React.useState<number | null>(null);
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

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
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
                        <SortableCryptoCard crypto={activeCrypto} />
                    </div>
                ) : null}
            </DragOverlay>
        </DndContext>
    );
}