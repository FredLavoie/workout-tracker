import { useEffect, useState } from "react";
import { tFetchFunction } from "../types";

/**
 * Custom hook for fetching data.
 *
 * @param {tFetchFunction} fetchFunction reference to the fetch function to be called to fetch the data
 * @param {Record<string, any> | null} params parameters required to make the fetch call
 * @param {boolean} skip sometimes the function call needs to be skiped, but the hook is
 * required to be called by the component
 * @returns {object}
 */
export function useFetch(fetchFunction: tFetchFunction, params: Record<string, any> | null, skip: boolean) {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    if (skip) return { data, isLoading, error };

    useEffect(() => {
        const abortCont = new AbortController();

        setIsLoading(true);
        fetchFunction(params, abortCont)
            .then((responseData) => {
                setData(responseData);
                setIsLoading(false);
            })
            .catch((error) => {
                setError(error.message);
                setIsLoading(false);
            });

        return () => abortCont.abort();
    }, []);

    return { data, isLoading, error };
}
