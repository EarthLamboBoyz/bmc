import { useMemo, useState } from 'react';
import Fuse from 'fuse.js';

export interface SearchableItem {
    id: string;
    [key: string]: any;
}

interface UseSearchOptions<T> {
    items: T[];
    searchKeys: string[];
    threshold?: number;
}

export function useSearch<T extends SearchableItem>({
    items,
    searchKeys,
    threshold = 0.3,
}: UseSearchOptions<T>) {
    const [searchQuery, setSearchQuery] = useState('');

    const fuse = useMemo(
        () =>
            new Fuse(items, {
                keys: searchKeys,
                threshold, // 0.0 = perfect match, 1.0 = match anything
                includeScore: true,
                minMatchCharLength: 2,
            }),
        [items, searchKeys, threshold]
    );

    const searchResults = useMemo(() => {
        if (!searchQuery.trim()) {
            return items;
        }

        const results = fuse.search(searchQuery);
        return results.map((result) => result.item);
    }, [searchQuery, fuse, items]);

    return {
        searchQuery,
        setSearchQuery,
        searchResults,
        hasQuery: searchQuery.trim().length > 0,
    };
}
