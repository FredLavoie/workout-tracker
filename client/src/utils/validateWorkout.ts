/**
 * Utility function that validates a workout entry ensuring that the date and time are formatted correctly, as well
 * as ensuring that the body is not empty.
 *
 * @param date date of the workout, ex: 2022-04-06
 * @param time time of day in 24h time format 24:00
 * @param body the content of the workout
 * @return if the data is valid, return true, else return false
 */
export function validateWorkout(date: string, time: string, body: string): boolean {
    // validate date
    if (date === "" || !date.includes("-")) return false;
    const dateArr = date.split("-");
    if (dateArr.length !== 3) return false;
    if (dateArr[0].length !== 4 || Number(dateArr[0]) % 1 !== 0) return false;
    if (dateArr[1].length !== 2 || Number(dateArr[1]) % 1 !== 0) return false;
    if (dateArr[2].length !== 2 || Number(dateArr[2]) % 1 !== 0) return false;
    if (Number(dateArr[1]) > 12) return false;
    if (Number(dateArr[2]) > 31) return false;

    // validate time
    if (time === "" || !time.includes(":")) return false;
    const timeArr = time.split(":");
    if (timeArr.length !== 2) return false;
    if (timeArr[0].length !== 2 || Number(timeArr[0]) < 0 || Number(timeArr[0]) > 23 || Number(timeArr[0]) % 1 !== 0)
        return false;
    if (timeArr[1].length !== 2 || Number(timeArr[1]) < 0 || Number(timeArr[1]) > 59 || Number(timeArr[1]) % 1 !== 0)
        return false;

    // validate body
    if (body === "") return false;
    if (typeof body === "number") return false;

    return true;
}
