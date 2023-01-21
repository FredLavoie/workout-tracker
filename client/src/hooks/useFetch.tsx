import { useEffect, useState } from "react";
import { tFetchFunction } from "../types";

export function useFetch(fetchFunction: tFetchFunction, params: Record<string, any>, skip: boolean) {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    if (skip) return { data, isLoading, error };

    useEffect(() => {
        const abortCont = new AbortController();
        try {
            setIsLoading(true);
            fetchFunction(params, abortCont).then((responseData) => {
                setData(responseData);
                setIsLoading(false);
            });
        } catch (error) {
            setError(error.message);
            setIsLoading(false);
        }
        return () => abortCont.abort();
    }, []);

    return { data, isLoading, error };
}
