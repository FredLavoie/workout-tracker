import { validateRecord } from "../index";

describe("validateRecord", () => {
    it("[1] Should return true given valid data", () => {
        const result = validateRecord("2022-04-06", "strength", "Press", "155");
        expect(result).toBe(true);
    });

    it("[2] Should return false with a type that does not exist in recordList", () => {
        const result = validateRecord("2022-04-06", "banana", "Press", "155");
        expect(result).toBe(false);
    });

    it("[3] Should return false with an event that does not exist in the recordList", () => {
        const result = validateRecord("2022-04-06", "strength", "banana", "155");
        expect(result).toBe(false);
    });

    it("[4] Should return false with an empty score", () => {
        const result = validateRecord("2022-04-06", "strength", "Press", "");
        expect(result).toBe(false);
    });

    it("[5] Should return false with null date", () => {
        const result = validateRecord(null, "strength", "Press", "155");
        expect(result).toBe(false);
    });

    it("[6] Should return false with null type", () => {
        const result = validateRecord("2022-04-06", null, "Press", "155");
        expect(result).toBe(false);
    });

    it("[7] Should return false with null event", () => {
        const result = validateRecord("2022-04-06", "strength", null, "155");
        expect(result).toBe(false);
    });

    it("[8] Should return false with null score", () => {
        const result = validateRecord("2022-04-06", "strength", "Press", null);
        expect(result).toBe(false);
    });

    it("[9] Should return false with date: slashes instead of dashes", () => {
        const result = validateRecord("2022/04/06", "strength", "Press", "155");
        expect(result).toBe(false);
    });

    it("[10] Should return false with date: single digits in month and day", () => {
        const result = validateRecord("2022-4-6", "strength", "Press", "155");
        expect(result).toBe(false);
    });

    it("[11] Should return false with date: invalid month number", () => {
        const result = validateRecord("2022-13-06", "strength", "Press", "155");
        expect(result).toBe(false);
    });

    it("[12] Should return false with date: invalid day number", () => {
        const result = validateRecord("2022-05-45", "strength", "Press", "155");
        expect(result).toBe(false);
    });

    it("[13] Should return false with date: invalid year number", () => {
        const result = validateRecord("202-05-15", "strength", "Press", "155");
        expect(result).toBe(false);
    });
});
