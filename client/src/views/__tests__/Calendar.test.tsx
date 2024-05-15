import React from "react";
import { MemoryRouter } from "react-router-dom";
import { render, cleanup, screen, fireEvent } from "@testing-library/react";
import { months } from "../../lib/months";
import { getNextPrevMonth } from "../../utils/testUtils";
import { Calendar } from "../Calendar";

afterEach(cleanup);

const dateArray = new Date().toLocaleDateString("en-US").split("/");
const calPath = `/cal/${dateArray[2]}-${dateArray[0].padStart(2, "0")}`;
const currentMonthTitle = `${months[dateArray[0].padStart(2, "0")]} ${dateArray[2]}`;
const prevMonthTitle = getNextPrevMonth(dateArray[0], "prev", dateArray[2]);
const NextMonthTitle = getNextPrevMonth(dateArray[0], "next", dateArray[2]);

describe("Calendar view", () => {
    localStorage.setItem("token", "asdf");
    localStorage.setItem("accountId", "1");
    // @ts-ignore
    global.fetch = vi.fn(() => {
        return Promise.resolve({
            json: () => Promise.resolve([]),
            status: 200,
            ok: true,
        });
    });

    const MockedCalendar = (): JSX.Element => {
        return (
            <MemoryRouter initialEntries={[{ pathname: calPath }]}>
                <Calendar />
            </MemoryRouter>
        );
    };

    it("renders the Calendar view without crashing", async () => {
        render(<MockedCalendar />);
        // assert that the title is the current month and year
        const title = await screen.findByText(currentMonthTitle);
        expect(title).toBeInTheDocument();
    });

    it("renders the Calendar view and navigate to previous month", async () => {
        render(<MockedCalendar />);
        // find the PREV button and click it
        const prevButton = await screen.findByText("Prev");
        fireEvent.click(prevButton);
        // assert that the title is the current month and year
        const title = await screen.findByText(prevMonthTitle);
        expect(title).toBeInTheDocument();
    });

    it("renders the Calendar view and navigate to next month", async () => {
        render(<MockedCalendar />);
        // find the NEXT button and click it
        const nextButton = await screen.findByText("Next");
        fireEvent.click(nextButton);
        // assert that the title is the current month and year
        const title = await screen.findByText(NextMonthTitle);
        expect(title).toBeInTheDocument();
    });
});
