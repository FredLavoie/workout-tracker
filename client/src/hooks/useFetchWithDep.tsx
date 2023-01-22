import { useEffect, useState } from "react";
import { tFetchFunction } from "../types";

export function useFetchWithDep(fetchFunction: tFetchFunction, params: Record<string, any>, dependency: string[]) {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

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
    }, dependency);

    return { data, isLoading, error };
}
