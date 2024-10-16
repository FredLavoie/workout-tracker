import React from "react";
import { MemoryRouter } from "react-router-dom";
import { render, cleanup, screen, fireEvent } from "@testing-library/react";
import { calculateWeek, correctDate } from "../../utils";
import { months } from "../../lib/months";
import { Week } from "../Week";

afterEach(cleanup);

const currentWeekArr = new Date().toLocaleDateString("en-US").split("/");
const prevWeekArr = correctDate(
    currentWeekArr.map((ea, index) => {
        if (index === 1) return String(Number(ea) - 7);
        else return ea;
    }),
);
const nextWeekArr = correctDate(
    currentWeekArr.map((ea, index) => {
        if (index === 1) return String(Number(ea) + 7);
        else return ea;
    }),
);

const currentWeekArrDays = calculateWeek(currentWeekArr);
const prevWeekArrDays = calculateWeek(prevWeekArr);
const nextWeekArrDays = calculateWeek(nextWeekArr);

describe("Week view", () => {
    localStorage.setItem("token", "asdf");
    localStorage.setItem("accountId", "1");

    const MockedWeek = (): JSX.Element => {
        return (
            <MemoryRouter initialEntries={[{ pathname: "/week" }]}>
                <Week />
            </MemoryRouter>
        );
    };

    it("renders the Week view without crashing", async () => {
        // @ts-ignore
        global.fetch = vi.fn(() => {
            return Promise.resolve({
                json: () => Promise.resolve([]),
                status: 200,
                ok: true,
            });
        });
        render(<MockedWeek />);
        // find all the rest days and assert that there are 7 rest days
        const searchBox = await screen.findAllByText("Rest");
        expect(searchBox.length).toBe(7);
        // find current week title and assert it exists
        const weekTitle =
            `${months[currentWeekArrDays[0].split("-")[1]].substring(0, 3)} ` +
            `${currentWeekArrDays[0].split("-")[2]}, ${currentWeekArrDays[0].split("-")[0]}`;
        expect(await screen.findByText(weekTitle)).toBeInTheDocument();
    });

    it("renders the Week view and navigates back successfully", async () => {
        // @ts-ignore
        global.fetch = vi.fn(() => {
            return Promise.resolve({
                json: () => Promise.resolve([]),
                status: 200,
                ok: true,
            });
        });
        render(<MockedWeek />);
        // find current week title and assert it exists
        const weekTitle =
            `${months[currentWeekArrDays[0].split("-")[1]].substring(0, 3)} ` +
            `${currentWeekArrDays[0].split("-")[2]}, ${currentWeekArrDays[0].split("-")[0]}`;
        expect(await screen.findByText(weekTitle)).toBeInTheDocument();
        // find and click the PREV button
        const prevButton = await screen.findByText("Prev");
        fireEvent.click(prevButton);
        // assert that it shows the previous week
        const prevWeekTitle =
            `${months[prevWeekArrDays[0].split("-")[1]].substring(0, 3)} ` +
            `${prevWeekArrDays[0].split("-")[2]}, ${prevWeekArrDays[0].split("-")[0]}`;
        expect(await screen.findByText(prevWeekTitle)).toBeInTheDocument();
    });

    it("renders the Week view and navigates forwrard successfully", async () => {
        // @ts-ignore
        global.fetch = vi.fn(() => {
            return Promise.resolve({
                json: () => Promise.resolve([]),
                status: 200,
                ok: true,
            });
        });
        render(<MockedWeek />);
        // find current week title and assert it exists
        const weekTitle =
            `${months[currentWeekArrDays[0].split("-")[1]].substring(0, 3)} ` +
            `${currentWeekArrDays[0].split("-")[2]}, ${currentWeekArrDays[0].split("-")[0]}`;
        expect(await screen.findByText(weekTitle)).toBeInTheDocument();
        // find and click the NEXT button
        const nextButton = await screen.findByText("Next");
        fireEvent.click(nextButton);
        // assert that it shows the next week
        const nextWeekTitle =
            `${months[nextWeekArrDays[0].split("-")[1]].substring(0, 3)} ` +
            `${nextWeekArrDays[0].split("-")[2]}, ${nextWeekArrDays[0].split("-")[0]}`;
        expect(await screen.findByText(nextWeekTitle)).toBeInTheDocument();
    });
});
