import { GeoJSONGeometry, GeoJSONLineString, GeoJSONPoint } from 'ol/format/GeoJSON';

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
    queries?: ApiInfoExtra[];
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
        queries: [
            {
                selector: 'id',
                query: 'query/route_trip/?route_id=',
                type: 'trips',
                direction: true,
            },
            {
                selector: 'id',
                query: 'query/trip_stops/?trip_id=',
                type: 'stops',
                direction: false,
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
        queries: [
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
};

export interface ApiStop extends ApiResult {
    id: number;
    stop_id: string;
    name: string;
    point: GeoJSONPoint;
    stop_sequence: number;
}

export interface ApiTrip extends ApiResult {
    id: number;
    trip_id: string;
    headsign: string;
    short_name?: string;
    direction: number;
    geometry: GeoJSONLineString;
    wheelchair_accessible?: string;
    bikes_allowed?: string;
    route_id: number;
    sevice_id: number;
    shape_id: number;
}

export interface ApiDeparture extends ApiResult {
    departure_time: string;
    direction: string;
    stop_sequence: number;
    geometry: GeoJSONLineString;
    headsign: string;
    id: number;
    short_name: string;
    trip_id: string;
    time_delta?: { arrival: number; departure: number };
}
