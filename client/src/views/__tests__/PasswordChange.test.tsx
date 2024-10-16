import React from "react";
import { MemoryRouter } from "react-router-dom";
import { render, cleanup, screen, fireEvent } from "@testing-library/react";
import { Password } from "../PasswordChange";

afterEach(cleanup);

describe("passwordChange", () => {
    const MockedPasswordChange = (): JSX.Element => {
        return (
            <MemoryRouter initialEntries={[{ pathname: "/password-change" }]}>
                <Password />
            </MemoryRouter>
        );
    };

    it("renders the password change view without crashing", () => {
        render(<MockedPasswordChange />);
        // check that there are two password inputs
        const inputFields = screen.getAllByTestId("password");
        expect(inputFields.length).toBe(2);
    });

    it("renders password change view and successfully saves the updated password", async () => {
        // @ts-ignore
        global.fetch = vi.fn(() => {
            return Promise.resolve({
                json: () => Promise.resolve(),
                status: 200,
                ok: true,
            });
        });

        const newPassword = "qwerty123";

        render(<MockedPasswordChange />);
        // enter in the new password in the two inputs
        fireEvent.change(screen.getByPlaceholderText("New password"), { target: { value: newPassword } });
        fireEvent.change(screen.getByPlaceholderText("New password (again)"), { target: { value: newPassword } });
        // find and click the submit button
        const submitButton = screen.getByText("Change Password");
        fireEvent.click(submitButton);
    });

    it("renders password change view and fails to update due to mismatched password", async () => {
        // @ts-ignore
        global.fetch = vi.fn(() => {
            return Promise.resolve({
                json: () => Promise.resolve(),
                status: 200,
                ok: true,
            });
        });

        const newPassword = "qwerty123";
        const newPassword2 = "qwerty1234";

        render(<MockedPasswordChange />);
        // enter in the new password in the two inputs
        fireEvent.change(screen.getByPlaceholderText("New password"), { target: { value: newPassword } });
        fireEvent.change(screen.getByPlaceholderText("New password (again)"), { target: { value: newPassword2 } });
        // find and click the submit button
        const submitButton = screen.getByText("Change Password");
        fireEvent.click(submitButton);
        // the mismatched password make the submission fail
        const successToastMessage = await screen.findByText(
            "The two passwords do not match or don't meet the requirements.",
        );
        expect(successToastMessage).toBeInTheDocument();
    });
});
