import { validatePasswordChange } from "../index";

describe("validatePasswordChange", () => {
    it("[1] Should return false for 2 mismatched passwords", () => {
        const result = validatePasswordChange("pass123", "pass456");
        expect(result).toBe(false);
    });

    it("[2] Should return true for 2 matching passwords", () => {
        const result = validatePasswordChange("pass1234", "pass1234");
        expect(result).toBe(true);
    });

    it("[3] Should return true for 2 matching passwords of too short of length", () => {
        const result = validatePasswordChange("pass123", "pass456");
        expect(result).toBe(false);
    });

    it("[4] Should return false for 2 matching passwords of all numbers", () => {
        const result = validatePasswordChange("12345678", "12345678");
        expect(result).toBe(false);
    });
});
