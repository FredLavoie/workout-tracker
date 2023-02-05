import { recordListTypes } from "../types";

/**
 * Utility function that validates a record, ensuring that fields are not empty and that
 * the date is properly formatted.
 *
 * @param date date of the workout, ex: 2022-04-06
 * @param type an enum of the type of event
 * @param event an enum of events
 * @param score weight lifted, time, number of reps or distance
 * @param eventList dictionary of record types and events
 * @return if the data is valid, return true, else return false
 */
export function validateRecord(
    date: string,
    type: string,
    event: string,
    score: string,
    eventList: recordListTypes,
): boolean {
    if (date === "" || date === null || date === undefined) return false;
    if (type === "" || type === null || type === undefined) return false;
    if (event === "" || event === null || event === undefined) return false;
    if (score === "" || score === null || score === undefined) return false;

    // validate type
    if (!Object.keys(eventList).includes(type)) return false;

    // validate event
    if (!eventList[type].includes(event)) return false;

    // validate date
    const dateArr = date.split("-");
    if (dateArr.length !== 3) return false;
    if (dateArr[0].length !== 4 || Number(dateArr[0]) % 1 !== 0) return false;
    if (dateArr[1].length !== 2 || Number(dateArr[1]) % 1 !== 0) return false;
    if (dateArr[2].length !== 2 || Number(dateArr[2]) % 1 !== 0) return false;
    if (Number(dateArr[1]) > 12) return false;
    if (Number(dateArr[2]) > 31) return false;

    return true;
}
