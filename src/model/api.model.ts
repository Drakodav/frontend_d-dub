import { GeoJSONGeometry } from 'ol/format/GeoJSON';
import LineString from 'ol/geom/LineString';
import Point from 'ol/geom/Point';

export const GtfsApiRoute = 'https://api.thev-lad.com/api/gtfs/';
// process.env.NODE_ENV === 'production' ? 'https://api.thev-lad.com/api/gtfs/' : 'http://127.0.0.1:8000/api/gtfs/';

export enum ApiNaming {
    route = 'route',
    stop = 'stop',
}

export type ApiType = {
    name: ApiNaming;
    query: string;
    selector: keyof ApiResult;
    infoView?: ApiInfoExtra[];
};

export type ApiInfoExtra = {
    query: string;
    selector: keyof ApiResult;
    type: string;
    direction: boolean;
};

export const ApiDef: ApiType[] = [
    {
        name: ApiNaming.route,
        query: 'route/?short_name=',
        selector: 'short_name',
        infoView: [
            {
                selector: 'id',
                query: 'query/route_trip/?route_id=',
                type: 'trips',
                direction: true,
            },
            {
                selector: 'id',
                query: 'query/trip_stops/?route_id=',
                type: 'stops',
                direction: true,
            },
            {
                selector: 'id',
                query: 'query/stop_departures/?stop_id=',
                type: 'trips',
                direction: false,
            },
        ],
    },
    {
        name: ApiNaming.stop,
        query: 'stop/?name=',
        selector: 'name',
        infoView: [
            {
                selector: 'id',
                query: 'query/stop_departures/?stop_id=',
                type: 'trips',
                direction: false,
            },
        ],
    },
];

export type ApiResult = {
    geometry?: GeoJSONGeometry;
    point?: GeoJSONGeometry;
    id?: number;
    short_name?: string;
    long_name?: string;
    name?: string;
    stop_sequence?: string;
};

export type ApiStop = {
    id: number;
    stop_id: string;
    name: string;
    point: Point;
    stop_sequence: number;
};

export type ApiDepartures = {
    departure_time: string;
    direction: string;
    geometry: LineString;
    headsign: string;
    id: number;
    short_name: string;
    trip_id: string;
};
