import { useEffect } from 'react';

const activeCursors = new Set();
let previousCursor = '';

export function useRoomCursor(active) {
    useEffect(() => {
        if (!active) return undefined;

        const token = {};
        if (activeCursors.size === 0) {
            previousCursor = document.body.style.cursor;
        }
        activeCursors.add(token);
        document.body.style.cursor = 'pointer';

        return () => {
            activeCursors.delete(token);
            if (activeCursors.size === 0) {
                document.body.style.cursor = previousCursor;
            }
        };
    }, [active]);
}
