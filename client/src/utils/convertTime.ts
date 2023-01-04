/**
 * Take a time array and return the time to the closest 15 min interval, rounding up.
 * 
 * Example: ["13", "13"] => "13:15"
 * Example: ["13", "16"] => "13:30"
 * Example: ["13", "35"] => "13:45"
 * Example: ["13", "47"] => "14:00"
 * 
 * @param timeArr array of current time
 * @return time in 24h format
 */
export function convertTime(timeArr: string[]): string {
    const hour = Number(timeArr[0]);
    const minutes = Number(timeArr[1]);

    if (minutes < 15) return `${hour}:15`;
    else if (minutes < 30) return `${hour}:30`;
    else if (minutes < 45) return `${hour}:45`;
    else return `${hour + 1}:00`;
}
