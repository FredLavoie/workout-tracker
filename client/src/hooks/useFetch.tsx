import { useEffect, useReducer } from "react";
import { tCombinedEntry, tFetchFunction } from "../types";

type tUseFetch = {
    data?: tCombinedEntry & tCombinedEntry[];
    isLoading?: boolean;
    error?: string;
};

/**
 * Custom hook for fetching data.
 *
 * @param fetchFunction reference to the fetch function to be called to fetch the data
 * @param params parameters required to make the fetch call
 * @param skip sometimes the function call needs to be skiped, but the hook is
 * required to be called by the component
 * @returns object containing the fetched data, isLoading boolean and an error message
 */
export function useFetch(fetchFunction: tFetchFunction, params: Record<string, any> | null, skip: boolean): tUseFetch {
    const [responseState, updateResponseState] = useReducer(
        (prev: tUseFetch, next: tUseFetch) => {
            return { ...prev, ...next };
        },
        { data: null, isLoading: false, error: null },
    );

    useEffect(() => {
        const abortCont = new AbortController();
        if (!skip) {
            updateResponseState({ isLoading: true });
            fetchFunction(params, abortCont)
                .then((responseData) => {
                    updateResponseState({ data: responseData, isLoading: false });
                })
                .catch((error) => {
                    updateResponseState({ error: error.message, isLoading: false });
                });
        }
        return () => abortCont.abort();
    }, []);
    return responseState;
}
