import { tConditionalEntry } from "../types";

const BASE_URL = import.meta.env.VITE_BASE_URL || "http://192.168.2.205:8000/api";

export async function fetchAccountId(): Promise<void> {
    if (localStorage.getItem("accountId")) return;

    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
    const res = await fetch(`${BASE_URL}/accounts/${username}/`, {
        method: "GET",
        headers: {
            authorization: `Token ${token}`,
        },
    });
    if (!res.ok) throw new Error(`Server error - status ${res.status}`);
    const data = await res.json();
    return localStorage.setItem("accountId", data[0].id);
}

/**************************************************** SEARCH ****************************************************/
/****************************************************************************************************************/

export async function fetchSearchResults(
    checkedWorkout: boolean,
    checkedRecord: boolean,
    query: string,
): Promise<tConditionalEntry[]> {
    if (!checkedWorkout && !checkedRecord) return [];

    const token = localStorage.getItem("token");
    const id = localStorage.getItem("accountId");
    const results = [];

    if (checkedWorkout) {
        const workoutURL = new URL(`${BASE_URL}/${id}/workouts/search/`);
        workoutURL.searchParams.set("q", query);

        const resWorkout = await fetch(workoutURL.toString(), {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                authorization: `Token ${token}`,
            },
        });
        if (!resWorkout.ok) throw new Error(`Server error - status ${resWorkout.status}`);
        const dataWorkout = await resWorkout.json();
        results.push(...dataWorkout);
    }

    if (checkedRecord) {
        const recordURL = new URL(`${BASE_URL}/${id}/records/search/`);
        recordURL.searchParams.set("q", query);

        const resRecord = await fetch(recordURL.toString(), {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                authorization: `Token ${token}`,
            },
        });
        if (!resRecord.ok) throw new Error(`Server error - status ${resRecord.status}`);
        const dataRecord = await resRecord.json();
        results.push(...dataRecord);
    }
    return results;
}

/*************************************************** WORKOUTS ***************************************************/
/****************************************************************************************************************/

export async function fetchMonthData(monthToFetch: string, abortCont: { signal: any }): Promise<Record<string, any>[]> {
    const token = localStorage.getItem("token");
    const id = localStorage.getItem("accountId");
    const signal = abortCont === null ? null : abortCont.signal;

    const res = await fetch(`${BASE_URL}/${id}/cal/${monthToFetch}/`, {
        method: "GET",
        signal: signal,
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            authorization: `Token ${token}`,
        },
    });
    if (!res.ok) throw new Error(`Server error - status ${res.status}`);
    return await res.json();
}

export async function fetchYearData(yearToFetch: string, abortCont: { signal: any }): Promise<void> {
    const token = localStorage.getItem("token");
    const id = localStorage.getItem("accountId");
    const signal = abortCont === null ? null : abortCont.signal;

    const res = await fetch(`${BASE_URL}/${id}/workouts/${yearToFetch}/`, {
        method: "GET",
        signal: signal,
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            authorization: `Token ${token}`,
        },
    });
    if (!res.ok) throw new Error(`Server error - status ${res.status}`);
    return await res.json();
}

export async function fetchYearlyCount(abortCont: { signal: any }): Promise<void> {
    const token = localStorage.getItem("token");
    const id = localStorage.getItem("accountId");
    const signal = abortCont === null ? null : abortCont.signal;

    const res = await fetch(`${BASE_URL}/${id}/workouts/total-per-year/`, {
        method: "GET",
        signal: signal,
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            authorization: `Token ${token}`,
        },
    });
    if (!res.ok) throw new Error(`Server error - status ${res.status}`);
    return await res.json();
}

export async function fetchWorkout(params: Record<string, any>, abortCont: { signal: any }): Promise<void> {
    const workout_id = params.workoutId;
    const token = localStorage.getItem("token");
    const accountId = localStorage.getItem("accountId");
    const signal = abortCont === null ? null : abortCont.signal;

    const res = await fetch(`${BASE_URL}/${accountId}/workouts/${workout_id}/`, {
        method: "GET",
        signal: signal,
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            authorization: `Token ${token}`,
        },
    });
    if (!res.ok) throw new Error(`Server error - status ${res.status}`);
    return await res.json();
}

export async function updateWorkout(
    workout_id: string,
    date: string,
    time: string,
    workout_body: string,
): Promise<void> {
    const token = localStorage.getItem("token");
    const accountId = localStorage.getItem("accountId");

    const res = await fetch(`${BASE_URL}/${accountId}/workouts/${workout_id}/`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            authorization: `Token ${token}`,
        },
        body: JSON.stringify({ date, time, workout_body }),
    });
    if (!res.ok) throw new Error(`Server error - status ${res.status}`);
    return await res.json();
}

export async function postWorkout(date: string, time: string, workout_body: string): Promise<void> {
    const token = localStorage.getItem("token");
    const accountId = localStorage.getItem("accountId");

    const res = await fetch(`${BASE_URL}/${accountId}/workouts/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            authorization: `Token ${token}`,
        },
        body: JSON.stringify({ author: accountId, date, time, workout_body }),
    });
    if (!res.ok && res.status === 400) throw new Error("A workout already exists for this day");
    else if (!res.ok) throw new Error(`Server error - status ${res.status}`);
    return await res.json();
}

export async function deleteWorkout(workout_id: string): Promise<void> {
    const token = localStorage.getItem("token");
    const accountId = localStorage.getItem("accountId");

    const res = await fetch(`${BASE_URL}/${accountId}/workouts/${workout_id}/`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            authorization: `Token ${token}`,
        },
    });
    if (!res.ok) throw new Error(`Server error - status ${res.status}`);
    return;
}

/**************************************************** RECORDS ***************************************************/
/****************************************************************************************************************/

export async function fetchRecord(recordId: string, abortCont: { signal: any }): Promise<void> {
    const token = localStorage.getItem("token");
    const accountId = localStorage.getItem("accountId");
    const signal = abortCont === null ? null : abortCont.signal;

    const res = await fetch(`${BASE_URL}/${accountId}/records/${recordId}/`, {
        method: "GET",
        signal: signal,
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            authorization: `Token ${token}`,
        },
    });
    if (!res.ok) throw new Error(`Server error - status ${res.status}`);
    return await res.json();
}

export async function fetchRecords(abortCont: { signal: any }): Promise<void> {
    const token = localStorage.getItem("token");
    const accountId = localStorage.getItem("accountId");
    const signal = abortCont === null ? null : abortCont.signal;

    const res = await fetch(`${BASE_URL}/${accountId}/records/`, {
        method: "GET",
        signal: signal,
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            authorization: `Token ${token}`,
        },
    });
    if (!res.ok) throw new Error(`Server error - status ${res.status}`);
    return await res.json();
}

export async function updateRecord(
    record_id: string,
    date: string,
    type: string,
    event: string,
    score: string,
): Promise<void> {
    const token = localStorage.getItem("token");
    const accountId = localStorage.getItem("accountId");

    const res = await fetch(`${BASE_URL}/${accountId}/records/${record_id}/`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            authorization: `Token ${token}`,
        },
        body: JSON.stringify({ date, type, event, score }),
    });
    if (!res.ok) throw new Error(`Server error - status ${res.status}`);
    return await res.json();
}

export async function postRecord(date: string, type: string, event: string, score: string): Promise<void> {
    const token = localStorage.getItem("token");
    const accountId = localStorage.getItem("accountId");

    const res = await fetch(`${BASE_URL}/${accountId}/records/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            authorization: `Token ${token}`,
        },
        body: JSON.stringify({ author: accountId, date, type, event, score }),
    });
    if (!res.ok) throw new Error(`Server error - status ${res.status}`);
    return await res.json();
}

export async function deleteRecord(record_id: string): Promise<void> {
    const token = localStorage.getItem("token");
    const accountId = localStorage.getItem("accountId");

    const res = await fetch(`${BASE_URL}/${accountId}/records/${record_id}/`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            authorization: `Token ${token}`,
        },
    });
    if (!res.ok) throw new Error(`Server error - status ${res.status}`);
    return;
}

export async function fetchEventRecords(params: Record<string, any>, abortCont: { signal: any }): Promise<void> {
    const event = params.eventToFetch;
    const token = localStorage.getItem("token");
    const accountId = localStorage.getItem("accountId");
    const signal = abortCont === null ? null : abortCont.signal;

    const res = await fetch(`${BASE_URL}/${accountId}/records/event/${event}/`, {
        method: "GET",
        signal: signal,
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            authorization: `Token ${token}`,
        },
    });
    if (!res.ok) throw new Error(`Server error - status ${res.status}`);
    return await res.json();
}

export async function fetchRecordList(abortCont: { signal: any }): Promise<void> {
    const token = localStorage.getItem("token");
    const signal = abortCont === null ? null : abortCont.signal;

    const res = await fetch(`${BASE_URL}/records/event-list/`, {
        method: "GET",
        signal: signal,
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            authorization: `Token ${token}`,
        },
    });
    if (!res.ok) throw new Error(`Server error - status ${res.status}`);
    return await res.json();
}
