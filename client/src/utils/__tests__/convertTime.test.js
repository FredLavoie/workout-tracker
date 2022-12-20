import { convertTime } from "../index";

describe("convertTime", () => {
    it("[1] Get hour with minutes set to 00", () => {
        const result = convertTime(["13", "43"]);
        expect(result).toEqual("13:00");
    });
});
