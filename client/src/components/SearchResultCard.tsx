import React from "react";
import { useHistory } from "react-router-dom";

import {
    Card,
    CardHeader,
    CardContent,
    Grid,
    Typography
} from "@mui/material";

import { tCombinedEntry } from "../types";


export function SearchResultCard({ content, searchQuery }) {
    const history = useHistory();

    function handleClickActive(target: Element, isWorkoutContent: boolean) {
        if (isWorkoutContent) {
            history.push(`/workouts/${target.id}`);
        } else {
            history.push(`/records/${target.id}`);
        }
    }

    /**
     * Given the sub string under consideration, the function looks to see if the sub string contains
     * the search query, and if so, returns true.
     * If the search query is multiple words long, the function will return true if the search query
     * array contains the sub string.
     * 
     * @param subString 
     * @param searchQuery 
     * @param searchQueryArr 
     * @returns boolean
     */
    function queryInSubSubString(subString: string, searchQuery: string, searchQueryArr: string[]): boolean {
        return subString.includes(searchQuery) || !!searchQueryArr.find((ea) => ea === subString);
    }

    /**
     * Process the workout body and highlight the search term in the returned
     * JSX element
     *
     * @param text workout body text for a single search result
     * @returns JSX.Element
   */
    function processBodyText(text: string) {
        const textArr = text.split("\n");
        const lowerCaseSearchQuery = searchQuery.toLowerCase();
        const lowerCaseSearchQueryArr = searchQuery.toLowerCase().split(" ");
        console.log("*** lowerCaseSearchQueryArr: ", lowerCaseSearchQueryArr);

        return (
            <Typography component="pre" sx={style.bodyText}>
                {textArr.map((subString: string, index: number) => {
                    const lowerCaseSubString = subString.toLowerCase();
                    return lowerCaseSubString.includes(lowerCaseSearchQuery) && lowerCaseSearchQuery !== "" ?
                        (<div key={`${subString}-${index}`}>
                            <span>
                                {subString.split(" ").map((subSubString: string, index2: number) => {
                                    const lowerCaseSubSubString = subSubString.toLowerCase();
                                    return queryInSubSubString(lowerCaseSubSubString, lowerCaseSearchQuery, lowerCaseSearchQueryArr) ?
                                        (<span key={`${lowerCaseSubSubString}-${index2}`}><mark>{subSubString}</mark> </span>)
                                        :
                                        (<span key={`${lowerCaseSubSubString}-${index2}`}>{subSubString} </span>);
                                })}
                            </span>
                            <br />
                        </div>)
                        :
                        (<><span key={`${subString}-${index}`}>{subString}</span><br /></>);
                })}
            </Typography>
        );
    }

    return (
        <Grid sx={style.root1}>
            {content.map((ea: tCombinedEntry, index: number) => (
                <Card
                    elevation={2}
                    key={`${ea.id}-${index}`}
                    id={ea.id}
                    sx={style.cardStyle}
                    onClick={(e) => handleClickActive(e.currentTarget, !!ea.workout_body)}
                >
                    <CardHeader
                        title={ea.workout_body ? "Workout" : "Personal Record"}
                        subheader={ea.date}
                        sx={style.header}
                    />
                    {ea.workout_body
                        ?
                        <CardContent>
                            <Typography component="div" variant="body2" color="textSecondary">
                                {processBodyText(ea.workout_body)}
                            </Typography>
                        </CardContent>
                        :
                        <CardContent>
                            <Typography variant="body2" color="textSecondary">
                                {`${ea.type} - ${ea.event}`}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                {ea.score}
                            </Typography>
                        </CardContent>
                    }
                </Card>
            ))
            }
        </Grid >
    );
}

const style = {
    root1: {
        marginBottom: "32px",
        marginTop: "16px",
        width: { md: "100%", sm: "90%" },
        display: "flex",
        justifyContent: "space-evenly",
        flexWrap: "wrap"
    },
    cardStyle: {
        width: "256px",
        margin: "0px 8px 16px 8px",
        cursor: "pointer",
    },
    header: {
        paddingBottom: "0px",
    },
    detail: {
        pading: "none",
    },
    bodyText: {
        font: "inherit",
        margin: "0px",
    }
} as const;
