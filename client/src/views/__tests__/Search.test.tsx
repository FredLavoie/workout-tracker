import React from "react";
import { MemoryRouter } from "react-router-dom";
import { render, cleanup, screen, fireEvent } from "@testing-library/react";
import { Search } from "../Search";

afterEach(cleanup);

describe("Search view", () => {
    const MockedSearch = (): JSX.Element => {
        return (
            <MemoryRouter initialEntries={[{ pathname: "/search" }]}>
                <Search />
            </MemoryRouter>
        );
    };

    it("renders the Search view without crashing", () => {
        render(<MockedSearch />);
        // find the record date, type, event and score
        const searchBox = screen.getByPlaceholderText("Search workouts/records...");
        // assert that the record data is in rendered component
        expect(searchBox).toBeInTheDocument();
    });

    it("renders record and workout related to the search term", async () => {
        localStorage.setItem("token", "asdf");
        localStorage.setItem("accountId", "1");
        const searchTerm = "squat";

        // @ts-ignore
        global.fetch = vi.fn((url) => {
            if (url === "http://localhost:8000/api/api/1/records/search/?q=squat") {
                return Promise.resolve({
                    json: () =>
                        Promise.resolve([
                            {
                                date: "2021-04-25",
                                type: "strength",
                                event: "squat",
                                score: "300",
                            },
                        ]),
                    status: 200,
                    ok: true,
                });
            }
            if (url === "http://localhost:8000/api/api/1/workouts/search/?q=squat") {
                return Promise.resolve({
                    json: () =>
                        Promise.resolve([
                            {
                                date: "2022-05-20",
                                time: "13:30:00",
                                workout_body: "squat 5x5 @225",
                            },
                        ]),
                    status: 200,
                    ok: true,
                });
            }
        });

        render(<MockedSearch />);
        // find and check the PRs checkbox
        const PRCheckbox = screen.getByTestId("checkedRecord");
        fireEvent.click(PRCheckbox);
        // find the input box and enter the search term
        const searchBox = screen.getByPlaceholderText("Search workouts/records...");
        fireEvent.change(searchBox, { target: { value: searchTerm } });
        // find and click the search button
        const searchButton = screen.getByTestId("submit-search");
        fireEvent.click(searchButton);
        // assert that the text stating number of results found is on screen
        const numberOfResults = await screen.findByText("( Number of results found: 2 )");
        expect(numberOfResults).toBeInTheDocument();
        // assert that the two search results are in the view
        const workoutDate = screen.getByText("2021-04-25");
        const recordDate = screen.getByText("2022-05-20");
        expect(workoutDate).toBeInTheDocument();
        expect(recordDate).toBeInTheDocument();
        // clear the search results
        const clearButton = screen.getByTestId("clear-search");
        fireEvent.click(clearButton);
        // assert that the reults are cleared
        expect(numberOfResults).not.toBeInTheDocument();
        // clean up local storage
        localStorage.clear();
    });
});
