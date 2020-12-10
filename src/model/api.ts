import { GeoJSONGeometry } from 'ol/format/GeoJSON';

export type ApiResult = {
  geometry: GeoJSONGeometry;
  id?: number;
  short_name?: string;
};
