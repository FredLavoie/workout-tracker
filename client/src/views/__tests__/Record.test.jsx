import React from "react";
import { MemoryRouter } from "react-router-dom";
import { render, cleanup, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { server, rest } from "../../mockServer";
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
        const today = new Date().toISOString().split("T")[0];

        render(<MockedNewRecord />);
        // check that todays date is automatically set in the date input
        const dateValue = await screen.findByDisplayValue(today);
        expect(dateValue).toBeInTheDocument();
    });

    it("renders Record view and successfully saves a new record", async () => {
        localStorage.setItem("token", "asdf");
        localStorage.setItem("accountId", "1");
        server.use(
            rest.post("*/1/records", (req, res, context) => {
                return res(context.status(200), context.json({ ok: true }));
            })
        );

        render(<MockedNewRecord />);
        // select the event type
        const enduranceEventType = await screen.findByText("Endurance");
        fireEvent.click(enduranceEventType);
        // select the event dropdown and click it
        const eventDropdown = await screen.findByRole("button", { expanded: false });
        userEvent.click(eventDropdown);
        // select the event to choose and click it
        const selectedEvent = screen.getByText("Row 500m");
        userEvent.click(selectedEvent);
        // enter in the score value
        fireEvent.change(screen.getByPlaceholderText("Score"), { target: { value: "1:22" } });
        // find and click the submit button
        const submitButton = screen.getByText("Save");
        fireEvent.click(submitButton);
        // clean up local storage
        localStorage.clear();
    });


    it("renders Record view and fails form validation", async () => {
        localStorage.setItem("token", "asdf");
        localStorage.setItem("accountId", "1");
        server.use(
            rest.post("*/1/records", (req, res, context) => {
                return res(context.status(200), context.json({ ok: true }));
            })
        );

        const invalidDate = "202-02-1";

        render(<MockedNewRecord />);
        // enter in invalid date
        fireEvent.change(screen.getByPlaceholderText("Date"), { target: { value: invalidDate } });
        // select the event type
        const enduranceEventType = await screen.findByText("Endurance");
        fireEvent.click(enduranceEventType);
        // select the event dropdown and click it
        const eventDropdown = await screen.findByRole("button", { expanded: false });
        userEvent.click(eventDropdown);
        // select the event to choose and click it
        const selectedEvent = screen.getByText("Row 500m");
        userEvent.click(selectedEvent);
        // enter in the score value
        fireEvent.change(screen.getByPlaceholderText("Score"), { target: { value: "1:22" } });
        // find and click the submit button
        const submitButton = screen.getByText("Save");
        fireEvent.click(submitButton);
        // submitting the record with invalid data should render the failure toast message
        const failedToastMessage = await screen.findByText("One or more inputted values is invalid.");
        expect(failedToastMessage).toBeInTheDocument();
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

        server.use(
            rest.get("*/1/records/qwerty123456", (req, res, context) => {
                return res(context.status(200), context.json({
                    ok: true,
                    date: recordDate,
                    type: recordType,
                    event: recordEvent,
                    score: recordScore
                }));
            })
        );

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

        server.use(
            rest.get("*/1/records/qwerty123456", (req, res, context) => {
                return res(context.status(200), context.json({
                    ok: true,
                    date: recordDate,
                    type: recordType,
                    event: recordEvent,
                    score: recordScore
                }));
            }),
            rest.delete("*/1/records/qwerty123456", (req, res, context) => {
                return res(context.status(200), context.json({ ok: true }));
            })
        );

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

        server.use(
            rest.get("*/1/records/qwerty123456", (req, res, context) => {
                return res(context.status(200), context.json({
                    ok: true,
                    date: recordDate,
                    type: recordType,
                    event: recordEvent,
                    score: recordScore
                }));
            }),
            rest.patch("*/1/records/qwerty123456", (req, res, context) => {
                return res(context.status(200), context.json({
                    ok: true,
                    date: recordDate,
                    type: recordType,
                    event: recordEvent,
                    score: updatedScore
                }));
            })
        );

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
