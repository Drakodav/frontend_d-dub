import { ApiDeparture } from '../model/api.model';

// compares the distance from string a to b
// useful for better string matching and sorting
export const levenshtein = (a: string, b: string): number => {
    const an = a ? a.length : 0;
    const bn = b ? b.length : 0;
    if (an === 0) {
        return bn;
    }
    if (bn === 0) {
        return an;
    }
    const matrix = new Array<number[]>(bn + 1);
    for (let i = 0; i <= bn; ++i) {
        let row = (matrix[i] = new Array<number>(an + 1));
        row[0] = i;
    }
    const firstRow = matrix[0];
    for (let j = 1; j <= an; ++j) {
        firstRow[j] = j;
    }
    for (let i = 1; i <= bn; ++i) {
        for (let j = 1; j <= an; ++j) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] =
                    Math.min(
                        matrix[i - 1][j - 1], // substitution
                        matrix[i][j - 1], // insertion
                        matrix[i - 1][j] // deletion
                    ) + 1;
            }
        }
    }
    return matrix[bn][an];
};

export const getHeadsign = (headsign: string, direction: string) => headsign.split(' - ')[direction === '0' ? 1 : 0];

const getDateFromHours = (time: string) => {
    const times = time.split(':').map((i) => parseInt(i));
    let now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate(), ...times);
};

const getDepartureTime = (departure_time: string, time_delta?: number): Date => {
    const departureTime = getDateFromHours(departure_time);

    if (time_delta) {
        const delta = time_delta / 60;
        departureTime.setMinutes(departureTime.getMinutes() + delta);
    }
    return departureTime;
};

export const departureFormatting = (item: ApiDeparture): string => {
    const { departure_time, time_delta } = item;
    const time = getDepartureTime(departure_time, time_delta?.arrival);

    const newTime = `${time.getHours() < 10 ? '0'.concat(time.getHours().toString()) : time.getHours()}:${
        time.getMinutes() < 10 ? '0'.concat(time.getMinutes().toString()) : time.getMinutes()
    }:${time.getSeconds() < 10 ? '0'.concat(time.getSeconds().toString()) : time.getSeconds()}`;

    return newTime;
};

export const predictedFormatting = (item: ApiDeparture): string | undefined => {
    const { departure_time, p_time_delta } = item;
    if (!p_time_delta || (p_time_delta as any) === '') return undefined;

    const time = getDepartureTime(departure_time, p_time_delta);

    const newTime = `${time.getHours() < 10 ? '0'.concat(time.getHours().toString()) : time.getHours()}:${
        time.getMinutes() < 10 ? '0'.concat(time.getMinutes().toString()) : time.getMinutes()
    }:${time.getSeconds() < 10 ? '0'.concat(time.getSeconds().toString()) : time.getSeconds()}`;

    return newTime;
};

export const showDepartureRow = (item: ApiDeparture): boolean => {
    const { departure_time, time_delta } = item;
    const departureTime = getDepartureTime(departure_time, time_delta?.arrival);

    if (new Date() > departureTime) {
        return false;
    }

    return true;
};

export function sortDepartures(a: ApiDeparture, b: ApiDeparture): number {
    const x = getDepartureTime(a.departure_time, a.time_delta?.arrival);
    const y = getDepartureTime(b.departure_time, b.time_delta?.arrival);
    return x < y ? -1 : x > y ? 1 : 0;
}
