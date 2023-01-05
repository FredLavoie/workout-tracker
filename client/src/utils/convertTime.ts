/**
 * Take a time array and return the time to the closest 15 min interval, rounding up.
 * 
 * Example: ["9", "13"] => "09:15"
 * Example: ["13", "13"] => "13:15"
 * Example: ["13", "16"] => "13:30"
 * Example: ["13", "35"] => "13:45"
 * Example: ["13", "47"] => "14:00"
 * 
 * @param timeArr array of current time
 * @return time in 24h format
 */
export function convertTime(timeArr: string[]): string {
    const minutes = Number(timeArr[1]);
    const hour = timeArr[0].padStart(2, "0");
    const nextHour = String(Number(timeArr[0]) + 1).padStart(2, "0");

    if (minutes < 15) return `${hour}:15`;
    else if (minutes < 30) return `${hour}:30`;
    else if (minutes < 45) return `${hour}:45`;
    else if (nextHour === "24") return "23:45";
    else return `${nextHour}:00`;
}
