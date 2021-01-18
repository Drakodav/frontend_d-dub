import { GeoJSONMultiLineString, GeoJSONPoint } from 'ol/format/GeoJSON';
import { Feature } from 'ol';
import Geometry from 'ol/geom/Geometry';
import MultiLineString from 'ol/geom/MultiLineString';
import Point from 'ol/geom/Point';
import { ApiResult } from '../model/api.model';

export const getGeoObjFeature = (apiResult: ApiResult): Feature<Geometry> | undefined => {
    if (!Object.keys(apiResult).length) return;
    let geometry: Geometry = (undefined as unknown) as Geometry;

    if (apiResult?.geometry?.type === 'MultiLineString') {
        geometry = new MultiLineString((apiResult.geometry as GeoJSONMultiLineString).coordinates).transform(
            'EPSG:4326',
            'EPSG:3857'
        );
    } else if (apiResult?.point?.type === 'Point') {
        geometry = new Point((apiResult?.point as GeoJSONPoint).coordinates).transform('EPSG:4326', 'EPSG:3857');
    }

    if (!!geometry) {
        const feature = new Feature({
            geometry,
        });
        return feature;
    }
};
