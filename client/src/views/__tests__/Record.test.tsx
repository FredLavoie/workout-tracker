import React from "react";
import { MemoryRouter } from "react-router-dom";
import { render, cleanup, screen, fireEvent } from "@testing-library/react";

import { recordList } from "../../lib/recordList";
import { Record } from "../Record";

afterEach(cleanup);

describe("Record view - new", () => {
    const MockedNewRecord = () => {
        return (
            <MemoryRouter initialEntries={[{ pathname: "/records/new" }]}>
                <Record />
            </MemoryRouter>
        );
    };

    it("renders new Record view without crashing", async () => {
        const today = new Date().toLocaleDateString("en-US").split("/");
        const todayFormatted = `${today[2]}-${today[0]?.padStart(2, "0")}-${today[1]?.padStart(2, "0")}`;

        // @ts-ignore
        global.fetch = vi.fn(() => {
            return Promise.resolve({
                json: () => Promise.resolve(recordList),
                status: 200,
                ok: true,
            });
        });

        render(<MockedNewRecord />);
        // check that todays date is automatically set in the date input
        const dateValue = await screen.findByDisplayValue(todayFormatted);
        expect(dateValue).toBeInTheDocument();
    });

    it("renders Record view and successfully saves a new record", async () => {
        localStorage.setItem("token", "asdf");
        localStorage.setItem("accountId", "1");

        // @ts-ignore
        global.fetch = vi.fn(() => {
            return Promise.resolve({
                json: () => Promise.resolve(recordList),
                status: 200,
                ok: true,
            });
        });

        render(<MockedNewRecord />);
        // select the event type
        const enduranceEventType = await screen.findByText("Endurance");
        fireEvent.click(enduranceEventType);
        // select the event dropdown and click it
        const eventDropdown = await screen.findByRole("combobox", { expanded: false });
        // select the event to choose and click it
        fireEvent.select(eventDropdown, "Row 500m");
        // enter in the score value
        fireEvent.change(screen.getByPlaceholderText("Score"), { target: { value: "1:22" } });
        // find and click the submit button
        const submitButton = screen.getByText("Save");
        fireEvent.click(submitButton);
        // clean up local storage
        localStorage.clear();
    });
});

describe("Record view - existing", () => {
    const MockedExistingRecord = () => {
        return (
            <MemoryRouter initialEntries={[{ pathname: "/records/qwerty123456" }]}>
                <Record />
            </MemoryRouter>
        );
    };
    // existing record data
    const recordDate = "2022-02-25";
    const recordType = "wod";
    const recordEvent = "Fran";
    const recordScore = "3:22";

    it("renders existing Record view without crashing", async () => {
        localStorage.setItem("token", "asdf");
        localStorage.setItem("accountId", "1");

        // @ts-ignore
        global.fetch = vi.fn((url, type) => {
            if (type.method === "GET" && url === "https://workouttracker.ca/api/1/records/qwerty123456/") {
                return Promise.resolve({
                    json: () =>
                        Promise.resolve({
                            date: recordDate,
                            type: recordType,
                            event: recordEvent,
                            score: recordScore,
                        }),
                    status: 200,
                    ok: true,
                });
            }

            if (url === "https://workouttracker.ca/api/records/event-list/") {
                return Promise.resolve({
                    json: () => Promise.resolve(recordList),
                    status: 200,
                    ok: true,
                });
            }
        });

        render(<MockedExistingRecord />);
        // find the record date, type, event and score
        const dateValue = await screen.findByDisplayValue(recordDate);
        const typeValue = await screen.findByDisplayValue(recordType);
        const eventValue = await screen.findByText(recordEvent);
        const scoreValue = await screen.findByText(recordEvent);
        // assert that the record data is in rendered component
        expect(dateValue).toBeInTheDocument();
        expect(typeValue).toBeInTheDocument();
        expect(eventValue).toBeInTheDocument();
        expect(scoreValue).toBeInTheDocument();
        // clean up local storage
        localStorage.clear();
    });

    it("deletes existing record", async () => {
        localStorage.setItem("token", "asdf");
        localStorage.setItem("accountId", "1");

        // @ts-ignore
        global.fetch = vi.fn((url, type) => {
            if (type.method === "DELETE" && url === "https://workouttracker.ca/api/1/records/qwerty123456/") {
                return Promise.resolve({
                    status: 200,
                    ok: true,
                });
            }
            if (type.method === "GET" && url === "https://workouttracker.ca/api/1/records/qwerty123456/") {
                return Promise.resolve({
                    json: () =>
                        Promise.resolve({
                            date: recordDate,
                            type: recordType,
                            event: recordEvent,
                            score: recordScore,
                        }),
                    status: 200,
                    ok: true,
                });
            }
            if (url === "https://workouttracker.ca/api/records/event-list/") {
                return Promise.resolve({
                    json: () => Promise.resolve(recordList),
                    status: 200,
                    ok: true,
                });
            }
        });

        render(<MockedExistingRecord />);
        // find the record date, type, event and score
        const dateValue = await screen.findByDisplayValue(recordDate);
        const typeValue = await screen.findByDisplayValue(recordType);
        const eventValue = await screen.findByText(recordEvent);
        const scoreValue = await screen.findByText(recordEvent);
        // assert that the record data is in rendered component
        expect(dateValue).toBeInTheDocument();
        expect(typeValue).toBeInTheDocument();
        expect(eventValue).toBeInTheDocument();
        expect(scoreValue).toBeInTheDocument();
        // find and click the delete button
        const submitButton = screen.getByText("Delete");
        fireEvent.click(submitButton);
        // clean up local storage
        localStorage.clear();
    });

    it("updates existing record", async () => {
        localStorage.setItem("token", "asdf");
        localStorage.setItem("accountId", "1");

        const updatedScore = "3:00";

        // @ts-ignore
        global.fetch = vi.fn((url, type) => {
            if (type.method === "PATCH" && url === "https://workouttracker.ca/api/1/records/qwerty123456/") {
                return Promise.resolve({
                    json: () =>
                        Promise.resolve({
                            date: recordDate,
                            type: recordType,
                            event: recordEvent,
                            score: updatedScore,
                        }),
                    status: 200,
                    ok: true,
                });
            }
            if (type.method === "GET" && url === "https://workouttracker.ca/api/1/records/qwerty123456/") {
                return Promise.resolve({
                    json: () =>
                        Promise.resolve({
                            date: recordDate,
                            type: recordType,
                            event: recordEvent,
                            score: recordScore,
                        }),
                    status: 200,
                    ok: true,
                });
            }
            if (url === "https://workouttracker.ca/api/records/event-list/") {
                return Promise.resolve({
                    json: () => Promise.resolve(recordList),
                    status: 200,
                    ok: true,
                });
            }
        });

        render(<MockedExistingRecord />);
        // enter in a new record score
        fireEvent.change(await screen.findByPlaceholderText("Score"), { target: { value: updatedScore } });
        // find and click the submit button
        const submitButton = screen.getByText("Save");
        fireEvent.click(submitButton);
        // clean up local storage
        localStorage.clear();
    });
});
