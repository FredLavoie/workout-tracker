import React, { useReducer, useState } from "react";

import {
    Box,
    Button,
    Checkbox,
    CircularProgress,
    FormGroup,
    FormControlLabel,
    Grid,
    TextField,
    Typography,
} from "@mui/material";

import { SearchResultCard } from "../components/SearchResultCard";
import { ServerError } from "../components/ServerError";
import { fetchSearchResults } from "../services/fetchData";
import { tConditionalEntry } from "../types";

type tSearchQueryState = {
    searchQuery?: string;
    checkedWorkout?: boolean;
    checkedRecord?: boolean;
};

export function Search() {
    const [searchResults, setSearchResults] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const [searchQueryState, updateSearchQueryState] = useReducer(
        (prev: tSearchQueryState, next: tSearchQueryState) => {
            return { ...prev, ...next };
        },
        { checkedWorkout: true, checkedRecord: false, searchQuery: "" },
    );

    function handleClear(): void {
        updateSearchQueryState({ searchQuery: "" });
        setSearchResults(null);
        setError(null);
    }

    function handleTextInput(value: React.SetStateAction<string>): void {
        updateSearchQueryState({ searchQuery: String(value) });
        if (value === "") {
            setSearchResults(null);
        }
    }

    async function handleSubmit(event: { preventDefault: () => void }): Promise<void> {
        event.preventDefault();
        setIsLoading(true);
        try {
            const results = await fetchSearchResults(
                searchQueryState.checkedWorkout,
                searchQueryState.checkedRecord,
                searchQueryState.searchQuery,
            );
            const sortedResults = results.sort((a: tConditionalEntry, b: tConditionalEntry) => {
                const aSeconds = new Date(a.date).getTime();
                const bSeconds = new Date(b.date).getTime();
                if (bSeconds > aSeconds) return 1;
                if (bSeconds < aSeconds) return -1;
                return 0;
            });
            setSearchResults(sortedResults);
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            setSearchResults(null);
            setError(error.message);
            return;
        }
    }

    return (
        <Grid container direction="column" alignItems="center" sx={style.root}>
            <Typography variant="h4" sx={style.title}>
                Search
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={style.formElement}>
                <TextField
                    onChange={(e) => handleTextInput(e.target.value)}
                    sx={style.searchBox}
                    id="record-score"
                    placeholder="Search workouts/records..."
                    value={searchQueryState.searchQuery}
                />
                <FormGroup row sx={style.checkboxes}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={searchQueryState.checkedWorkout}
                                onChange={(e) => updateSearchQueryState({ checkedWorkout: e.target.checked })}
                                name="checkedWorkout"
                                color="primary"
                            />
                        }
                        label="Workouts"
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={searchQueryState.checkedRecord}
                                onChange={(e) => updateSearchQueryState({ checkedRecord: e.target.checked })}
                                name="checkedRecord"
                                color="primary"
                                data-testid="checkedRecord"
                            />
                        }
                        label="PRs"
                    />
                </FormGroup>
                <Box sx={style.buttonContainer}>
                    <Button
                        type={"submit"}
                        sx={style.elementMargin}
                        color="primary"
                        variant="contained"
                        data-testid="submit-search"
                        key={`${searchQueryState.searchQuery === "" ? true : false}`}
                        disabled={searchQueryState.searchQuery === "" ? true : false}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={handleClear}
                        sx={style.elementMargin}
                        color="primary"
                        variant="outlined"
                        data-testid="clear-search"
                    >
                        Clear
                    </Button>
                </Box>
            </Box>
            {error && <ServerError errorMessage={error} />}
            {isLoading && (
                <Box sx={style.loading}>
                    <CircularProgress />
                </Box>
            )}
            {searchResults && searchResults.length > 0 ? (
                <Typography color="primary">( Number of results found: {searchResults.length} )</Typography>
            ) : (
                ""
            )}
            {searchResults && searchResults.length > 0 ? (
                <SearchResultCard content={searchResults} searchQuery={searchQueryState.searchQuery} />
            ) : (
                <></>
            )}
        </Grid>
    );
}

const style = {
    root: {
        marginBottom: "32px",
        marginTop: "16px",
    },
    title: {
        marginBottom: "16px",
    },
    searchBox: {
        marginTop: "16px",
        width: "272px",
    },
    elementMargin: {
        marginTop: "16px",
    },
    checkboxes: {
        marginTop: "16px",
        marginLeft: "16px",
        width: "208px",
        display: "flex",
        justifyContent: "center",
    },
    formElement: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        flexWrap: "wrap",
        width: "100%",
        marginBottom: "16px",
    },
    buttonContainer: {
        width: "208px",
        display: "flex",
        justifyContent: "space-around",
    },
    loading: {
        display: "flex",
        justifyContent: "center",
        marginTop: "10%",
    },
};
