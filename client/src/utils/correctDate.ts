/**
 * Utility function that takes an invalid date array and corrects it for errors with either the year, month and/or day.
 * This function is used in the Week view when a user clicks next or prev. The calling function takes the current date
 * and adds or subtracts 7 days. This means that in some cases, you can have a day number that is > 31 or < 1. This utility
 * function will then correct the date.
 * 
 * Example:  ["1", "-5", "2022"] => ["12", "26", "2021"]
 * 
 * @param dateArr a simple date array containing a month, day and year respectively
 * @return  a valid date array
 */
export function correctDate(dateArr: string[]): string[] {
    const numDaysInMonth = new Date(Number(dateArr[2]), Number(dateArr[0]), 0).getDate();
    let numDaysPrevMonth = null;
    if (dateArr[0] === "1") {
    // Current month is Jan, therefore the previous month is Dec and it has 31 days
        numDaysPrevMonth = 31;
    } else {
    // setting the day = 0 and calling the .getDate() method returns the number of days
    // in the previous month. The month in the dateArr is the actual month number, therefore
    // we need to subtract 1 to get the index of the current month
        numDaysPrevMonth = new Date(Number(dateArr[2]), Number(dateArr[0]) - 1, 0).getDate();
    }

    let dayOfTheWeek = Number(new Date().getDay().toLocaleString());
    if (dayOfTheWeek === 7) dayOfTheWeek = 0;

    let day = Number(dateArr[1]);
    let month = Number(dateArr[0]);
    let year = Number(dateArr[2]);

    if (day > numDaysInMonth) {
        if (month === 12) {
            day = day - numDaysInMonth;
            month = 1;
            year++;
        } else {
            day = day - numDaysInMonth;
            month++;
        }
    } else if (day < 1) {
        if (month === 1) {
            day = numDaysPrevMonth + day;
            month = 12;
            year--;
        } else {
            day = numDaysPrevMonth + day;
            month--;
        }
    }
    return [String(month), String(day), String(year)];
}
