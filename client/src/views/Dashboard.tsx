import React, { useState, useEffect } from "react";

import { Box, Card, CardHeader, CardContent, CircularProgress, Grid, Typography } from "@mui/material";

import { fetchYearData, fetchRecords, fetchYearlyCount } from "../services/fetchData";
import { months } from "../lib/months";
import { RecordTable } from "../components/RecordTable";
import { ServerError } from "../components/ServerError";
import { tWorkout } from "../types";

const currentDate = new Date().toLocaleDateString("en-US").split("/");
const currentYear = currentDate[2];
const monthNumbersArr = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];

export function Dashboard(): JSX.Element {
    // fetch data to be displayed on the Dashboard page
    const { data, isLoading, error } = useFetchDashboardData(currentYear);

    const records = data?.recordData ?? [];
    const yearWorkouts = data?.yearData ?? [];
    const yearCounts = data?.yearlyCountData ?? [];

    // return the number of workouts for each month
    function filterWorkoutsForMonth(workouts: tWorkout[], monthNumber: string): string {
        const numberOfWorkouts = workouts.filter((ea) => {
            return ea.date.split("-")[1] === monthNumber;
        });
        return String(numberOfWorkouts.length).padStart(2, "0");
    }

    return (
        <Grid container direction="column" alignItems="center" sx={style.root}>
            <Typography variant="h4" sx={style.title}>
                Dashboard
            </Typography>
            {error && <ServerError errorMessage={error} />}
            {isLoading && <CircularProgress />}
            {!error && !isLoading && (
                <Box sx={style.dashboardContainer}>
                    {/**************************************** MONTH SUMMARY **************************************/}
                    <Card elevation={3} sx={style.cardStyle}>
                        <CardHeader title="Monthly Summary" sx={style.header} />
                        <CardContent sx={style.content}>
                            {monthNumbersArr.map((ea, index) => (
                                <Typography key={index} sx={style.textCol}>
                                    <Box component="span" sx={style.centerText}>
                                        {months[ea]}
                                    </Box>
                                    <Box component="span" sx={style.dataBackground}>
                                        {filterWorkoutsForMonth(yearWorkouts, ea)}
                                    </Box>
                                </Typography>
                            ))}
                        </CardContent>
                    </Card>
                    {/**************************************** YEAR SUMMARY ***************************************/}
                    <Card elevation={3} sx={style.cardStyle}>
                        <CardHeader title="Yearly Summary" sx={style.header} />
                        <CardContent sx={style.content}>
                            {yearCounts.map((ea, index) => (
                                <Typography key={index} sx={style.textCol}>
                                    <Box component="span" sx={style.centerText}>
                                        {ea.year}
                                    </Box>
                                    <Box component="span" sx={style.dataBackground}>
                                        {String(ea.count).padStart(3, "0")}
                                    </Box>
                                </Typography>
                            ))}
                        </CardContent>
                    </Card>
                    {/**************************************** STRENGTH PRs ***************************************/}
                    <Card elevation={3} sx={style.cardStyle}>
                        <CardHeader title="Strength PRs" sx={style.header} />
                        <RecordTable type={"strength"} records={records.filter((ea) => ea.type === "strength")} />
                    </Card>
                    {/**************************************** ENDURANCE PRs **************************************/}
                    <Card elevation={3} sx={style.cardStyle}>
                        <CardHeader title="Endurance PRs" sx={style.header} />
                        <RecordTable type={"endurance"} records={records.filter((ea) => ea.type === "endurance")} />
                    </Card>
                    {/******************************************* WOD PRs *****************************************/}
                    <Card elevation={3} sx={style.cardStyle}>
                        <CardHeader title="WOD PRs" sx={style.header} />
                        <RecordTable type={"wod"} records={records.filter((ea) => ea.type === "wod")} />
                    </Card>
                </Box>
            )}
        </Grid>
    );
}

/**
 * Custom hook to abstract the data fetching for the Dashboard view
 *
 * @param currentYear a date string to fetch all workouts for the current year
 * @returns {object}
 */
function useFetchDashboardData(currentYear: string): Record<string, any> {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const abortCont = new AbortController();
        const setupPage = async (): Promise<void> => {
            try {
                setIsLoading(true);

                const recordData = await fetchRecords(abortCont);
                const yearData = await fetchYearData(currentYear, abortCont);
                const yearlyCountData = await fetchYearlyCount(abortCont);

                setData({ recordData, yearData, yearlyCountData });
                setIsLoading(false);
            } catch (error) {
                if (error.name === "AbortError") return;
                setIsLoading(false);
                setError(error.message);
            }
        };
        setupPage();
        return () => abortCont.abort();
    }, []);

    return { data, isLoading, error };
}

const style = {
    root: {
        marginBottom: "32px",
        marginTop: "16px",
        width: "100%",
        display: "flex",
        justifyContent: "flex-start",
        flexWrap: "wrap",
    },
    title: {
        marginBottom: "16px",
    },
    dashboardContainer: {
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap",
    },
    cardStyle: {
        width: "360px",
        margin: { sm: "0px 16px 16px 8px", xs: "0px auto 16px auto" },
    },
    header: {
        padding: "32px",
    },
    content: {
        padding: "0 32px 32px 32px",
    },
    textCol: {
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "8px",
    },
    dataBackground: {
        backgroundColor: "secondary.main",
        padding: "2px 4px",
        borderRadius: "6px",
        textAlign: "center",
        color: "#212121",
    },
    centerText: {
        paddingTop: "2px",
    },
};
