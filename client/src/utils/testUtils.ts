import { months } from "../lib/months";

/**
 * This helper function builds the next or previous month's title.
 * Example: "June 2022"
 * @param month current month
 * @param option paramter to determine which month to get
 * @param year current year
 * @returns month title as a string
 */
export function getNextPrevMonth(month: string, option: string, year: string): string {
    if (option === "prev") {
        if (month === "1") {
            return `December ${Number(year) - 1}`;
        } else {
            return `${months[String(Number(month) - 1).padStart(2, "0")]} ${year}`;
        }
    } else {
        if (month === "12") {
            return `January ${Number(year) + 1}`;
        } else {
            return `${months[String(Number(month) + 1).padStart(2, "0")]} ${year}`;
        }
    }
}
