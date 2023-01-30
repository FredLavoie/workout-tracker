import React from "react";
import { render, cleanup, screen } from "@testing-library/react";
import { RecordTable } from "../RecordTable";

afterEach(cleanup);

describe("RecordTable", () => {
    const type = "strength";
    const records =
    [
        { id: 456789, date: "2020-12-22", type: "strength", event: "Back Squat", score: 300 },
        { id: 456756, date: "2021-02-30", type: "strength", event: "Bench Press", score: 200 },
        { id: 190229, date: "2022-08-14", type: "strength", event: "Deadlift", score: 400 },
    ];


    it("renders RecordTable without crashing", () => {
        render(<RecordTable type={type} records={records} />);
    });

    it("renders the correct number of records", () => {
        render(<RecordTable type={type} records={records} />);
        const numberOfRows = screen.getAllByTestId("recordItem");
        expect(numberOfRows.length).toBe(3);
    });
});
