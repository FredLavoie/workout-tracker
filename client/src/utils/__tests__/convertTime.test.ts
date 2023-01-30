import { convertTime } from "../index";

describe("convertTime", () => {
    it("[1] Get hour with minutes set to 15", () => {
        const result = convertTime(["3", "13"]);
        expect(result).toEqual("03:15");
    });
    it("[2] Get hour with minutes set to 30", () => {
        const result = convertTime(["3", "15"]);
        expect(result).toEqual("03:30");
    });
    it("[3] Get hour with minutes set to 30", () => {
        const result = convertTime(["3", "28"]);
        expect(result).toEqual("03:30");
    });
    it("[4] Get hour with minutes set to 45", () => {
        const result = convertTime(["3", "43"]);
        expect(result).toEqual("03:45");
    });
    it("[5] Get hour with minutes set to 00", () => {
        const result = convertTime(["3", "45"]);
        expect(result).toEqual("04:00");
    });
    it("[6] Get hour with minutes set to 00", () => {
        const result = convertTime(["3", "46"]);
        expect(result).toEqual("04:00");
    });
    it("[7] Confirm that next hour is 24 hour format", () => {
        const result = convertTime(["12", "46"]);
        expect(result).toEqual("13:00");
    });
    it("[8] Confirm that if it's currently 23:45 or later, that the current hour is returned instead of the next day", () => {
        const result = convertTime(["23", "56"]);
        expect(result).toEqual("23:45");
    });
});
