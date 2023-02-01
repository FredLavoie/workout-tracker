import React from "react";
import { useHistory } from "react-router-dom";

import { Card, CardHeader, CardContent, Grid, Typography } from "@mui/material";

import { SearchResultBody } from "./SearchResultBody";

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
                    {ea.workout_body ? (
                        <CardContent>
                            <Typography component="div" variant="body2" color="textSecondary">
                                <SearchResultBody body={ea.workout_body} searchQuery={searchQuery} />
                            </Typography>
                        </CardContent>
                    ) : (
                        <CardContent>
                            <Typography variant="body2" color="textSecondary">
                                {`${ea.type} - ${ea.event}`}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                {ea.score}
                            </Typography>
                        </CardContent>
                    )}
                </Card>
            ))}
        </Grid>
    );
}

const style = {
    root1: {
        marginBottom: "32px",
        marginTop: "16px",
        width: { md: "100%", sm: "90%" },
        display: "flex",
        justifyContent: "space-evenly",
        flexWrap: "wrap",
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
    },
} as const;
