import { GeoJSONGeometry } from 'ol/format/GeoJSON';

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
    infoView?: ApiInfoExtra;
};

export type ApiInfoExtra = {
    query: string;
    selector: keyof ApiResult;
    type: string;
};

export const ApiDef: ApiType[] = [
    {
        name: ApiNaming.route,
        query: 'route/?short_name=',
        selector: 'short_name',
        infoView: {
            selector: 'id',
            query: 'route/stops/?route_id=',
            type: 'stops',
        },
    },
    {
        name: ApiNaming.stop,
        query: 'stop/?name=',
        selector: 'name',
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
