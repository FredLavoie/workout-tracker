import React from "react";
import { useHistory } from "react-router-dom";

import { Box, Typography } from "@mui/material";

import DoneOutlineIcon from "@mui/icons-material/DoneOutline";

import { tWorkout } from "../types";

type propTypes = {
    year: string;
    month: string;
    workouts: tWorkout[];
};

export function CalendarGrid(props: propTypes) {
    const history = useHistory();

    // The day of the week that the fist day of the month lands on.
    // 0 = Sunday, 7 = Saturday
    const firstMonthDay = new Date(`${props.year}/${props.month}/01`).getDay();
    const numDaysInMonth = new Date(Number(props.year), Number(props.month), 0).getDate();
    const currentDate = new Date().toLocaleDateString("en-US");
    const contentArray = generateContentArray(
        firstMonthDay,
        numDaysInMonth,
        currentDate,
        props.workouts,
        props.year,
        props.month,
    );

    function handleClickActive(id: string, dayNum: number) {
        if (dayNum === 0) return;
        if (!id) {
            history.push(`/workouts/new/${props.year}-${props.month}-${String(dayNum).padStart(2, "0")}`);
        } else {
            history.push(`/workouts/${id}`);
        }
    }

    const mode = localStorage.getItem("userTheme") ?? "light";
    const dayOfMonthStyle = mode === "light" ? style.dayOfMonthLight : style.dayOfMonthDark;
    const activeStyle = mode === "light" ? style.activeLight : style.activeDark;
    style.container.border = mode === "light" ? "1.5px solid #d9d9d9" : "1.5px solid divider";
    style.daySquare.border = mode === "light" ? "1.5px solid #d9d9d9" : "1.5px solid rgba(255, 255, 255, 0.12)";
    style.today.backgroundColor = mode === "light" ? "primary.main" : "secondary.main";
    style.today.color = mode === "light" ? "#fff" : "#212121";

    return (
        <Box sx={style.container}>
            {contentArray.map((ea: any, index: number) => (
                <Box
                    key={index}
                    id={ea.workoutId ? ea.workoutId : ""}
                    onClick={(e) => handleClickActive(e.currentTarget.id, ea.dayNumber)}
                    sx={{
                        ...style.daySquare,
                        ...(ea.active ? activeStyle : ea.dayNumber > 0 ? dayOfMonthStyle : style.notDayOfMonth),
                    }}
                >
                    {ea.dayNumber !== 0 ? (
                        <Typography
                            variant="body2"
                            data-testid="calendar-day"
                            id={ea.workoutId ? ea.workoutId : ""}
                            sx={{ ...style.innerText, ...(ea.today && style.today) }}
                        >
                            {ea.dayNumber}
                        </Typography>
                    ) : (
                        ""
                    )}
                    {ea.workoutId && <DoneOutlineIcon sx={style.checkmark} />}
                </Box>
            ))}
        </Box>
    );
}

type tContentArray = {
    active: boolean;
    dayNumber: number;
    workoutId?: string;
};

/**
 * Generates an array of objects, one for each square in a calendar (35 or 42)
 *
 * Returns an array of object used in the Calendar view component
 * dayNumber - gets assigned a value of 0 for squares that are before and after
 * today - is a boolean that is true if this square is represents todays date
 * active - is a boolean that is true for days that have a workout
 * workoutId - has the id of the workout for the given day
 *
 * @param firstMonthDay
 * @param numDaysInMonth
 * @param currentDate
 * @param workouts
 * @param year
 * @param month
 * @returns {tContentArray[]}
 */
function generateContentArray(
    firstMonthDay: number,
    numDaysInMonth: number,
    currentDate: string,
    workouts: tWorkout[],
    year: string,
    month: string,
): tContentArray[] {
    const contentArray = [];
    let dayOfTheMonth = 0;
    for (let i = 0; i < 42; i++) {
        const obj = { dayNumber: 0, today: false };
        if (i === firstMonthDay) {
            dayOfTheMonth += 1;
        }
        if (dayOfTheMonth > 0 && dayOfTheMonth <= numDaysInMonth) {
            obj.dayNumber = dayOfTheMonth;
            dayOfTheMonth += 1;
        }
        if (
            Number(currentDate.split("/")[1]) + 1 === dayOfTheMonth &&
            currentDate.split("/")[0].padStart(2, "0") === month &&
            currentDate.split("/")[2] === year
        ) {
            obj.today = true;
        }
        if (dayOfTheMonth > numDaysInMonth && i === 34) {
            contentArray.push(obj);
            break;
        }
        contentArray.push(obj);
    }

    for (const ea of contentArray) {
        for (const workout of workouts) {
            if (ea.dayNumber === Number(workout.date.split("-")[2])) {
                ea.active = true;
                ea.workoutId = workout.id;
            }
        }
    }

    return contentArray;
}

const style = {
    container: {
        width: "100%",
        display: "flex",
        flexGrow: "1",
        justifyContent: "center",
        flexWrap: "wrap",
        flexBasis: "10%",
        border: "none",
    },
    daySquare: {
        width: "13%",
        display: "flex",
        flexDirection: "column",
        flexGrow: "1",
        border: "none",
    },
    activeLight: {
        paddingBottom: "6%",
        backgroundColor: "secondary.main",
        cursor: "pointer",
    },
    activeDark: {
        paddingBottom: "6%",
        backgroundColor: "primary.main",
        cursor: "pointer",
    },
    dayOfMonthLight: {
        paddingBottom: "8.8%",
        backgroundColor: "#ede7f6",
        cursor: "pointer",
    },
    dayOfMonthDark: {
        paddingBottom: "8.8%",
        backgroundColor: "#353535",
        cursor: "pointer",
    },
    notDayOfMonth: {
        backgroundColor: "primary",
    },
    innerText: {
        padding: "4px",
        alignSelf: "flex-end",
    },
    checkmark: {
        alignSelf: "center",
        width: { lg: "32px", md: "24px", xs: "16px" },
        height: { lg: "32px", md: "24px", xs: "16px" },
    },
    today: {
        borderRadius: "4px",
        padding: "2px 4px",
        backgroundColor: "none",
        color: "none",
    },
};
