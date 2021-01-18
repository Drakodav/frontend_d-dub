import { GeoJSONGeometry } from 'ol/format/GeoJSON';

export const GtfsApiRoute = 'https://api.thev-lad.com/api/gtfs/';
// process.env.NODE_ENV === 'production'
//   ? 'https://api.thev-lad.com/api/gtfs/'
//   : 'http://127.0.0.1:8001/api/gtfs/';

export enum ApiInputType {
    route = 'route/?short_name=',
    stop = 'stop/?name=',
}

export type ApiResult = {
    geometry?: GeoJSONGeometry;
    point?: GeoJSONGeometry;
    id?: number;
    short_name?: string;
    long_name?: string;
    name?: string;
};
