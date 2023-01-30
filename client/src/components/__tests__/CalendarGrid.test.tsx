import React from "react";
import { render, cleanup, screen } from "@testing-library/react";
import { CalendarGrid } from "../CalendarGrid";
import { tWorkout } from "../../types";

afterEach(cleanup);

describe("CalendarGrid", () => {
    const year = "2022";
    const month = "05";
    const workouts: tWorkout[] = [
        { id: "123", author: "1", date: "2022-05-04", time: "12:00", workout_body: "Workout1" },
        { id: "456", author: "1", date: "2022-05-12", time: "12:00", workout_body: "Workout2" },
        { id: "789", author: "1", date: "2022-05-28", time: "12:00", workout_body: "Workout3" },
    ];

    it("renders calendarGrid without crashing", () => {
        render(<CalendarGrid year={year} month={month} workouts={workouts} />);
    });

    it("renders the calendarGrid with 31 days and the workout IDs assigned to the day id", () => {
        render(<CalendarGrid year={year} month={month} workouts={workouts} />);
        // confirm that there are 31 calendar days rendered
        const calendarDays = screen.getAllByTestId("calendar-day");
        expect(calendarDays).toHaveLength(31);
        // confirm that the day with a specific workout has the workout id as its id
        const firstWorkoutDayId = screen.getByText("28").getAttribute("id");
        expect(firstWorkoutDayId).toBe("789");
    });
});
