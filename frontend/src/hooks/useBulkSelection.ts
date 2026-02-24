import { useState, useCallback } from 'react';

export interface UseBulkSelectionOptions {
    items: Array<{ id: string }>;
}

export function useBulkSelection({ items }: UseBulkSelectionOptions) {
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [lastSelectedIndex, setLastSelectedIndex] = useState<number | null>(null);

    const toggleSelection = useCallback(
        (id: string, index: number, shiftKey: boolean = false) => {
            setSelectedIds((prev) => {
                const newSet = new Set(prev);

                // Shift+Click: Select range
                if (shiftKey && lastSelectedIndex !== null) {
                    const start = Math.min(lastSelectedIndex, index);
                    const end = Math.max(lastSelectedIndex, index);

                    for (let i = start; i <= end; i++) {
                        if (items[i]) {
                            newSet.add(items[i].id);
                        }
                    }
                } else {
                    // Regular click: Toggle single item
                    if (newSet.has(id)) {
                        newSet.delete(id);
                    } else {
                        newSet.add(id);
                    }
                }

                return newSet;
            });

            setLastSelectedIndex(index);
        },
        [items, lastSelectedIndex]
    );

    const selectAll = useCallback(() => {
        setSelectedIds(new Set(items.map((item) => item.id)));
    }, [items]);

    const deselectAll = useCallback(() => {
        setSelectedIds(new Set());
        setLastSelectedIndex(null);
    }, []);

    const isSelected = useCallback(
        (id: string) => selectedIds.has(id),
        [selectedIds]
    );

    const isAllSelected = items.length > 0 && selectedIds.size === items.length;
    const isSomeSelected = selectedIds.size > 0 && selectedIds.size < items.length;

    return {
        selectedIds,
        selectedCount: selectedIds.size,
        toggleSelection,
        selectAll,
        deselectAll,
        isSelected,
        isAllSelected,
        isSomeSelected,
    };
}
