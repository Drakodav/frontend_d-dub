import { GeoJSONGeometry } from 'ol/format/GeoJSON';

export const GtfsApiRoute = 'http://127.0.0.1:8001/api/gtfs/';

export enum ApiInputType {
    route = 'route/?short_name=',
    stop = 'stop/?name=%2C+stop+',
}

export type ApiResult = {
    geometry?: GeoJSONGeometry;
    point?: GeoJSONGeometry;
    id?: number;
    short_name?: string;
    name?: string;
};
