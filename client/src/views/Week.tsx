import React, { useState, useEffect } from "react";

import { Box, Button, Card, CardContent, CircularProgress, Grid, Typography } from "@mui/material";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

import { ServerError } from "../components/ServerError";
import { months } from "../lib/months";
import { weekdayNames } from "../lib/weekdayNames";
import { fetchMonthData } from "../services/fetchData";
import { calculateWeek, correctDate, determineNextMonth } from "../utils";

export function Week() {
    // newDate example: Jan 31, 2020 -> ["1", "31", "2020"]
    const newDate = new Date().toLocaleDateString("en-US").split("/");
    const [dateArr, setDateArr] = useState(newDate);
    const [currentMonthToFetch, setCurrentMonthToFetch] = useState(`${dateArr[2]}-${dateArr[0].padStart(2, "0")}`);
    const [nextMonthToFetch, setNextMonthToFetch] = useState(
        `${dateArr[2]}-${String(Number(dateArr[0]) - 1).padStart(2, "0")}`,
    );
    const weekArr = calculateWeek(dateArr);

    // fetch data to be displayed on the Dashboard page
    const { data, isLoading, error } = useFetchWeekData(currentMonthToFetch, nextMonthToFetch, dateArr);
    const workouts = data ?? [];

    function handleNavigate(direction: string): void {
        const dateOfWeekToFetch = dateArr.map((ea, index) => {
            if (direction === "prev") {
                if (index === 1) return String(Number(ea) - 7);
                else return ea;
            } else if (direction === "next") {
                if (index === 1) return String(Number(ea) + 7);
                else return ea;
            }
        });
        const correctedDate = correctDate(dateOfWeekToFetch);
        const nextMonthToFetch = determineNextMonth(correctedDate);
        setCurrentMonthToFetch(`${correctedDate[2]}-${correctedDate[0].padStart(2, "0")}`);
        setNextMonthToFetch(`${nextMonthToFetch[0]}-${nextMonthToFetch[1].padStart(2, "0")}`);
        setDateArr(correctedDate);
    }

    return (
        <Grid container direction="column" alignItems="center" sx={style.root}>
            {error && <ServerError errorMessage={error} />}
            {isLoading && <CircularProgress />}
            {workouts && !isLoading && (
                <Box>
                    <Box sx={style.weekNav}>
                        <Button
                            onClick={() => handleNavigate("prev")}
                            sx={style.navLink}
                            color="primary"
                            size="small"
                            startIcon={<NavigateBeforeIcon />}
                        >
                            Prev
                        </Button>
                        <Box sx={style.titleContainer}>
                            <Typography variant="h5" gutterBottom>
                                Week of
                            </Typography>
                            <Typography variant="h5" gutterBottom>
                                {`${months[weekArr[0].split("-")[1]].substring(0, 3)} ${weekArr[0].split("-")[2]}, ${
                                    weekArr[0].split("-")[0]
                                }`}
                            </Typography>
                        </Box>
                        <Button
                            onClick={() => handleNavigate("next")}
                            sx={style.navLink}
                            color="primary"
                            size="small"
                            endIcon={<NavigateNextIcon />}
                        >
                            Next
                        </Button>
                    </Box>
                    <Box sx={style.weekContainer}>
                        {weekArr.map((day, index) => (
                            <Card elevation={2} sx={style.cardStyle} key={index}>
                                <Typography variant="body1" color="textSecondary" sx={style.header}>
                                    {`${weekdayNames[index]}, ${months[day.split("-")[1]]} ${day.split("-")[2]}`}
                                </Typography>
                                <CardContent sx={style.content}>
                                    <Typography component="div">
                                        <Typography component="pre" sx={style.bodyText}>
                                            {workouts.find((ea: { date: string }) => ea.date === day)?.workout_body ||
                                                "Rest"}
                                        </Typography>
                                    </Typography>
                                </CardContent>
                            </Card>
                        ))}
                    </Box>
                </Box>
            )}
        </Grid>
    );
}

/**
 * Custom hook to abstract the data fetching for the Week view
 * @param currentMonth
 * @param nextMonth
 * @param dateArr
 * @returns {object}
 */
function useFetchWeekData(currentMonth: string, nextMonth: string, dateArr: string[]): Record<string, any> {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        setIsLoading(true);
        const abortCont = new AbortController();
        const setupPage = async (): Promise<void> => {
            try {
                const currentMonthData = await fetchMonthData(currentMonth, abortCont);
                const nextMonthData = await fetchMonthData(nextMonth, abortCont);
                const workouts = [...currentMonthData, ...nextMonthData];
                setData(workouts);
                setIsLoading(false);
            } catch (error) {
                if (error.name === "AbortError") return;
                setIsLoading(false);
                setError(error.message);
            }
        };
        setupPage();
        return () => abortCont.abort();
    }, [dateArr]);

    return { data, isLoading, error };
}

const style = {
    root: {
        marginBottom: "32px",
        marginTop: "16px",
        width: "100%",
    },
    header: {
        paddingLeft: "16px",
        paddingBottom: "8px",
        paddingTop: "8px",
    },
    content: {
        padding: "0 16px 16px 16px",
    },
    bodyText: {
        font: "inherit",
        margin: "0px",
        whiteSpace: "pre-wrap",
        wordBreak: "break-all",
    },
    titleContainer: {
        display: "flex",
        flexDirection: "Column",
        width: "30%",
        minWidth: "240px",
        textAlign: "center",
    },
    navLink: {
        minWidth: "70px",
        height: "50px",
        margin: "auto",
    },
    weekNav: {
        width: { sm: "65vw", sx: "100%" },
        margin: "16px auto",
        display: "flex",
        justifyContent: "space-around",
    },
    weekContainer: {
        width: { sm: "65vw", sx: "100%" },
        margin: "16px auto",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
    },
    cardStyle: {
        width: { sm: "100%", xs: "95%" },
        margin: { md: "0px auto 16px auto", xs: "8px 0 4px 0" },
    },
};
