import { ApiDeparture } from '../../model/api.model';
import {
    getHeadsign,
    levenshtein,
    departureFormatting,
    predictedFormatting,
    showDepartureRow,
    sortDepartures,
} from '../../util/util';

const item: ApiDeparture = {
    departure_time: '18:11:53',
    short_name: '46A',
    stop_sequence: 13,
    id: 105960,
    trip_id: '19548.y1003.60-46A-b12-1.259.O',
    headsign: 'Phoenix Park Gate - University College Dublin',
    direction: '0',
    geometry: {
        type: 'LineString',
        coordinates: [[-6.29753273479497, 53.3516170365228]],
    },
    time_delta: {
        arrival: 0,
        departure: 0,
    },
    p_time_delta: 0,
};

describe('utils testing', () => {
    it('levenshtein', () => {
        const inputValue = '27';
        const options = ['2', '150', '27', '270', '0'];

        const sortedOptions = [...options].sort(
            (a, b) => levenshtein(a.toLowerCase(), inputValue) - levenshtein(b.toLowerCase(), inputValue)
        );

        expect(sortedOptions).toEqual(['27', '2', '270', '0', '150']);
    });

    it('getHeadsign', () => {
        const headsign = 'Edenderry - University College Dublin';
        expect(getHeadsign(headsign, '0')).toBe('University College Dublin');
        expect(getHeadsign(headsign, '1')).toBe('Edenderry');
    });

    it('departureFormatting', () => {
        expect(departureFormatting(item)).toEqual('18:11:53');

        expect(
            departureFormatting({
                ...item,
                time_delta: {
                    arrival: 60,
                    departure: 60,
                },
            })
        ).toEqual('18:12:53');
    });

    it('departureFormatting', () => {
        expect(predictedFormatting(item)).toEqual('18:11:53');

        expect(
            predictedFormatting({
                ...item,
                p_time_delta: 60,
            })
        ).toEqual('18:12:53');
    });

    // it('showDepartureRow', () => {
    //     const showRow = showDepartureRow(item);

    //     new Date().getTime() > new Date(0, 0, 0, ...item.departure_time.split(':').map((i) => parseInt(i))).getTime()
    //         ? expect(showRow).toBeFalsy()
    //         : expect(showRow).toBeFalsy();
    // });

    it('sortDepartures', () => {
        const deps = [
            {
                ...item,
                trip_id: 'my_trip',
                departure_time: '18:17:53',
                time_delta: {
                    arrival: 0,
                    departure: 0,
                },
            },
            item,
        ];

        const sortedDeps = [...deps].sort(sortDepartures);

        expect(sortedDeps[0]).toBe(deps[1]);
    });
});
