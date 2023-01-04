import React from "react";
import { useHistory } from "react-router-dom";

import { Box, Typography } from "@mui/material";

import { tWorkout } from "../types";

type propTypes = {
  year: string
  month: string
  workouts: tWorkout[]
}

export function CalendarGrid(props: propTypes) {
    const history = useHistory();

    const weekDayFirstMonthDay = new Date(`${props.year}/${props.month}/01`).getDay();
    const numberOfDaysInMonth = new Date(Number(props.year), Number(props.month), 0).getDate();
    const currentDate = new Date().toLocaleDateString("en-US");

    const contentArray = [];
    let dayOfTheMonth = 0;
    for (let i = 0; i < 42; i++) {
        const obj = { dayNumber: 0, today: false };
        if (i === weekDayFirstMonthDay) {
            dayOfTheMonth += 1;
        }
        if (dayOfTheMonth > 0 && dayOfTheMonth <= numberOfDaysInMonth) {
            obj.dayNumber = dayOfTheMonth;
            dayOfTheMonth += 1;
        }
        if (Number(currentDate.split("/")[1]) + 1 === dayOfTheMonth
      && currentDate.split("/")[0].padStart(2, "0") === props.month
      && currentDate.split("/")[2] === props.year) {
            obj.today = true;
        }
        if (dayOfTheMonth > numberOfDaysInMonth && i === 34) {
            contentArray.push(obj);
            break;
        }
        contentArray.push(obj);
    }

    for (const ea of contentArray) {
        for (const workout of props.workouts) {
            if (ea.dayNumber === Number(workout.date.split("-")[2])) {
                ea.active = true;
                ea.workoutId = workout.id;
            }
        }
    }

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
                    sx={{ ...style.daySquare, ...(ea.active ? activeStyle : ea.dayNumber > 0 ? dayOfMonthStyle : style.notDayOfMonth) }}
                >
                    {ea.dayNumber !== 0
                        ?
                        <Typography
                            variant="body2"
                            data-testid="calendar-day"
                            id={ea.workoutId ? ea.workoutId : ""}
                            sx={{ ...style.innerText, ...(ea.today && style.today) }}
                        >
                            {ea.dayNumber}
                        </Typography>
                        :
                        ""
                    }
                </Box>
            ))
            }
        </Box >
    );
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
        paddingBottom: "8%",
        display: "flex",
        flexGrow: "1",
        justifyContent: "right",  // check this on Safari
        border: "none",
    },
    activeLight: {
        backgroundColor: "secondary.main",
        cursor: "pointer",
    },
    activeDark: {
        backgroundColor: "primary.main",
        cursor: "pointer",
    },
    dayOfMonthLight: {
        backgroundColor: "#ede7f6",
        cursor: "pointer",
    },
    dayOfMonthDark: {
        backgroundColor: "#353535",
        cursor: "pointer",
    },
    notDayOfMonth: {
        backgroundColor: "primary",
    },
    innerText: {
        padding: "4px",
    },
    today: {
        borderRadius: "4px",
        padding: "4px 6px",
        backgroundColor: "none",
        color: "none",
    }
};
