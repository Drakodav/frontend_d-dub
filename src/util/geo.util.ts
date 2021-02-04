import { GeoJSONMultiLineString, GeoJSONPoint, GeoJSONLineString } from 'ol/format/GeoJSON';
import Geometry from 'ol/geom/Geometry';
import { Point, MultiLineString, LineString, MultiPoint } from 'ol/geom';
import { ApiResult } from '../model/api.model';
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style';
import { Options as FillOptions } from 'ol/style/Fill';
import { Options as StrokeOptions } from 'ol/style/Stroke';
import GeometryLayout from 'ol/geom/GeometryLayout';
import { ThemeConfiguration } from '../model/theme';

export const getGeoObjFeature = (apiResult: ApiResult): Geometry | undefined => {
    if (!Object.keys(apiResult).length) return;
    let geometry: Geometry = (undefined as unknown) as Geometry;

    if (apiResult?.geometry?.type === 'MultiLineString') {
        geometry = new MultiLineString((apiResult.geometry as GeoJSONMultiLineString).coordinates).transform(
            'EPSG:4326',
            'EPSG:3857'
        );
    } else if (apiResult?.geometry?.type === 'LineString') {
        geometry = new LineString((apiResult.geometry as GeoJSONLineString).coordinates).transform(
            'EPSG:4326',
            'EPSG:3857'
        );
    } else if (apiResult?.point?.type === 'Point') {
        geometry = new Point((apiResult?.point as GeoJSONPoint).coordinates).transform('EPSG:4326', 'EPSG:3857');
    }

    if (!!geometry) {
        return geometry;
    }
};

export const getStopPointsFeature = (stops: ApiResult[]): Geometry | undefined => {
    if (!stops.length) return;

    const points = stops.map((stop) => (stop.point as GeoJSONPoint).coordinates);
    return new MultiPoint(points, GeometryLayout.XY).transform('EPSG:4326', 'EPSG:3857');
};

export const positionFeatureStyle = (): Style =>
    new Style({
        image: new CircleStyle({
            radius: 6,
            fill: new Fill({
                color: '#3399CC',
            }),
            stroke: new Stroke({
                color: '#fff',
                width: 2,
            }),
        }),
    });

export const apiFeatureStyle = (): Style =>
    new Style({
        ...defaultStyles(undefined, { width: 2 }),
    });

export const extraFeatureStyle = (): Style =>
    new Style({
        ...defaultStyles(undefined, { width: 2, color: ThemeConfiguration.secondary.dark }),
    });

const defaultStyles = (_fill?: FillOptions, _stroke?: StrokeOptions) => {
    const fill = new Fill({
        color: 'rgba(255,255,255,0.4)',
        ..._fill,
    });
    const stroke = new Stroke({
        color: '#3399CC',
        width: 1.25,
        ..._stroke,
    });
    const styleObj = {
        image: new CircleStyle({
            fill: fill,
            stroke: stroke,
            radius: 5,
        }),
        fill: fill,
        stroke: stroke,
    } as const;

    return styleObj;
};
