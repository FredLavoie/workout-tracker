import React from "react";
import { useHistory } from "react-router-dom";

import { Box, CardContent, Typography } from "@mui/material";

import { tRecord } from "../types";

export function RecordTable({ type, eventList, records }): JSX.Element {
    const history = useHistory();
    const filteredEventList = eventList[type].filter((ea: string) => records.find((rec: tRecord) => rec.event === ea));

    function handleClickActive(target: Element): void {
        const encodedString = target.id.toLowerCase().replace(/ /g, "-");
        history.push(`/records/event/${encodedString}`);
    }

    return (
        <CardContent sx={style.content}>
            {filteredEventList.map((event: string, index: number) => (
                <Box
                    key={index}
                    id={event}
                    sx={style.eventContainer}
                    onClick={(e) => handleClickActive(e.currentTarget)}
                >
                    <Typography variant={"subtitle1"}>{event}</Typography>

                    {[records.find((ea: { event: string }) => ea.event === event)].map((ea) => {
                        return (
                            <Box key={ea.id} id={ea.event} data-testid="recordItem">
                                <Typography variant={"body2"} sx={style.score}>
                                    {ea.score}
                                </Typography>
                            </Box>
                        );
                    })}
                </Box>
            ))}
        </CardContent>
    );
}

const style = {
    content: {
        padding: "0 32px 32px 32px",
    },
    eventContainer: {
        marginBottom: "8px",
        display: "flex",
        justifyContent: "space-between",
        cursor: "pointer",
    },
    score: {
        backgroundColor: "secondary.main",
        padding: "2px 4px",
        borderRadius: "6px",
        margin: "2px 0",
        color: "#212121",
    },
};
