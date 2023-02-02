import React, { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";

import { Box, Button, CircularProgress, Paper, Typography } from "@mui/material";

import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

import { CalendarGrid } from "../components/CalendarGrid";
import { ServerError } from "../components/ServerError";
import { fetchMonthData } from "../services/fetchData";
import { calculateMonth } from "../utils";
import { months } from "../lib/months";

export function Calendar(): JSX.Element {
    const history = useHistory();
    const location = useLocation();
    const [workouts, setWorkouts] = useState(null);

    const monthToFetch = location.pathname.split("/")[2]; // ex: 2021-05
    const currentMonthString = months[monthToFetch.split("-")[1]]; // May
    const currentMonth = monthToFetch.split("-")[1]; // 05
    const currentYear = monthToFetch.split("-")[0]; // 2021
    if (!currentMonthString || Number(currentYear) % 1 !== 0) {
        history.push("/");
        history.push("/404");
    }
    const prevMonth = calculateMonth(currentMonth, currentYear, "prev");
    const nextMonth = calculateMonth(currentMonth, currentYear, "next");

    const { data, isLoading, error } = useFetchCalendarData(monthToFetch);

    useEffect(() => {
        if (data) {
            setWorkouts(data);
        }
    }, [data]);

    function handleClickPrevious(): void {
        setWorkouts(null);
        history.push(`/cal/${prevMonth}`);
    }

    function handleClickNext(): void {
        setWorkouts(null);
        history.push(`/cal/${nextMonth}`);
    }

    function handleReturnToCurrent(): void {
        const currentDate = new Date().toLocaleDateString("en-US").split("/");
        const currentDateString = `${currentDate[2]}-${currentDate[0].padStart(2, "0")}`;
        const pathDateString = location.pathname.split("/")[2];
        if (currentDateString !== pathDateString) {
            setWorkouts(null);
            history.push(`/cal/${currentDateString}`);
        }
    }

    return (
        <Paper elevation={0}>
            {error && <ServerError errorMessage={error} />}
            {isLoading && (
                <Box sx={style.loading}>
                    <CircularProgress />
                </Box>
            )}
            {workouts && !isLoading && (
                <Box sx={style.calendarContainer}>
                    <Box sx={style.monthNav}>
                        <Button
                            onClick={handleClickPrevious}
                            sx={style.navLink}
                            color="primary"
                            size="small"
                            startIcon={<NavigateBeforeIcon />}
                        >
                            Prev
                        </Button>
                        <Typography onClick={handleReturnToCurrent} variant="h5" gutterBottom sx={style.monthTitle}>
                            {`${currentMonthString} ${currentYear}`}
                        </Typography>
                        <Button
                            onClick={handleClickNext}
                            sx={style.navLink}
                            color="primary"
                            size="small"
                            endIcon={<NavigateNextIcon />}
                        >
                            Next
                        </Button>
                    </Box>
                    <Box sx={style.outline}>
                        <Box sx={style.weekNames}>
                            <Typography>SUN</Typography>
                            <Typography>MON</Typography>
                            <Typography>TUE</Typography>
                            <Typography>WED</Typography>
                            <Typography>THU</Typography>
                            <Typography>FRI</Typography>
                            <Typography>SAT</Typography>
                        </Box>
                        <CalendarGrid workouts={workouts} month={currentMonth} year={currentYear} />
                    </Box>
                </Box>
            )}
        </Paper>
    );
}

/**
 * Custom hook to abstract the data fetching for the Calendar view
 *
 * @param monthToFetch the month to fetch the data for
 * @returns {object}
 */
function useFetchCalendarData(monthToFetch: string): Record<string, any> {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const abortCont = new AbortController();

        setIsLoading(true);
        fetchMonthData(monthToFetch, abortCont)
            .then((responseData) => {
                setData(responseData);
                setIsLoading(false);
            })
            .catch((error) => {
                setError(error.message);
                setIsLoading(false);
            });

        return () => abortCont.abort();
    }, [monthToFetch]);

    return { data, isLoading, error };
}

const style = {
    calendarContainer: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        margin: { sm: "16px 8px 0 16px", xs: "0 8px 0 4px" },
    },
    outline: {
        display: "flex",
        flexDirection: "column",
        width: { md: "65vw", sm: "100%" },
    },
    monthNav: {
        width: { md: "65vw", sm: "100%" },
        display: "flex",
        justifyContent: "space-around",
        marginTop: "16px",
    },
    monthTitle: {
        width: "30%",
        minWidth: "200px",
        textAlign: "center",
        cursor: "pointer",
    },
    weekNames: {
        display: "flex",
        justifyContent: "space-around",
        marginTop: "16px",
    },
    loading: {
        display: "flex",
        justifyContent: "center",
        marginTop: "10%",
    },
    navLink: {
        minWidth: "80px",
    },
} as const;
