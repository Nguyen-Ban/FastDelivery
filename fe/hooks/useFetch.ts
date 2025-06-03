// hooks/useFetch.ts
import { useEffect, useState } from 'react';

export function useFetch<T>(fetcher: () => Promise<T>) {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        const run = async () => {
            try {
                const result = await fetcher();
                if (isMounted) {
                    setData(result);
                    setLoading(false);
                }
            } catch (err: any) {
                if (isMounted) {
                    setError(err.message);
                    setLoading(false);
                }
            }
        };

        run();
        return () => { isMounted = false; };
    }, [fetcher]); // nhớ memo fetcher để tránh gọi lại liên tục

    return { data, loading, error };
}
