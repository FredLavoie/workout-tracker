import { convertTime } from "../index";

describe("convertTime", () => {
    it("[1] Get hour with minutes set to 15", () => {
        const result = convertTime(["13", "13"]);
        expect(result).toEqual("13:15");
    });
    it("[2] Get hour with minutes set to 30", () => {
        const result = convertTime(["13", "15"]);
        expect(result).toEqual("13:30");
    });
    it("[3] Get hour with minutes set to 30", () => {
        const result = convertTime(["13", "28"]);
        expect(result).toEqual("13:30");
    });
    it("[4] Get hour with minutes set to 45", () => {
        const result = convertTime(["13", "43"]);
        expect(result).toEqual("13:45");
    });
    it("[5] Get hour with minutes set to 00", () => {
        const result = convertTime(["13", "45"]);
        expect(result).toEqual("14:00");
    });
    it("[6] Get hour with minutes set to 00", () => {
        const result = convertTime(["13", "46"]);
        expect(result).toEqual("14:00");
    });
});
