import React from "react";
import { render, cleanup, screen } from "@testing-library/react";
import { SearchResultCard } from "../SearchResultCard";

afterEach(cleanup);

describe("SearchResultCard", () => {
    const props = [
        { id: 123456, date: "2022-04-04", workout_body: "Sample workout body" },
        { id: 456789, date: "2021-02-22", type: "strength", event: "Back Squat", score: 250 },
    ];

    it("renders a record card and a workout card without crashing", () => {
        render(<SearchResultCard content={props} searchQuery="body" />);
    });

    it("renders 2 cards with the correct text found", () => {
        render(<SearchResultCard content={props} searchQuery="body" />);
        const card1 = screen.getByText("Workout");
        const workoutDate = screen.getByText("2022-04-04");
        const card2 = screen.getByText("Personal Record");
        expect(card1).toBeInTheDocument();
        expect(workoutDate).toBeInTheDocument();
        expect(card2).toBeInTheDocument();
    });
});
