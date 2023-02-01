import React from "react";

import { Typography } from "@mui/material";

type tProps = {
    body: string;
    searchQuery: string;
};

export function SearchResultBody(props: tProps) {
    const { body, searchQuery } = props;

    const textArr = body.split("\n");
    const lowerCaseSearchQuery = searchQuery.toLowerCase();
    const lowerCaseSearchQueryArr = searchQuery.toLowerCase().split(" ");

    return (
        <Typography component="pre" sx={style.bodyText}>
            {textArr.map((subString: string, index: number) => {
                const lowerCaseSubString = subString.toLowerCase();
                return lowerCaseSubString.includes(lowerCaseSearchQuery) && lowerCaseSearchQuery !== "" ? (
                    <div key={`${subString}-${index}`}>
                        <span>
                            {subString.split(" ").map((subSubString: string, index2: number) => {
                                const lowerCaseSubSubString = subSubString.toLowerCase();
                                const isQueryInSubSubString = queryIsInSubSubString(
                                    lowerCaseSubSubString,
                                    lowerCaseSearchQuery,
                                    lowerCaseSearchQueryArr,
                                );
                                const htmlWithHighlight = (
                                    <span key={`${lowerCaseSubSubString}-${index2}`}>
                                        <mark>{subSubString}</mark>{" "}
                                    </span>
                                );
                                const htmlWithoutHighlight = (
                                    <span key={`${lowerCaseSubSubString}-${index2}`}>{subSubString}</span>
                                );

                                return isQueryInSubSubString ? htmlWithHighlight : htmlWithoutHighlight;
                            })}
                        </span>
                        <br />
                    </div>
                ) : (
                    <>
                        <span key={`${subString}-${index}`}>{subString}</span>
                        <br />
                    </>
                );
            })}
        </Typography>
    );
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
 * @returns {boolean}
 */
function queryIsInSubSubString(subString: string, searchQuery: string, searchQueryArr: string[]): boolean {
    return subString.includes(searchQuery) || !!searchQueryArr.find((ea) => ea === subString);
}

const style = {
    bodyText: {
        font: "inherit",
        margin: "0px",
    },
} as const;
