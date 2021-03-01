import { GeoJSONMultiLineString, GeoJSONPoint, GeoJSONLineString } from 'ol/format/GeoJSON';
import Geometry from 'ol/geom/Geometry';
import { Point, MultiLineString, LineString, MultiPoint } from 'ol/geom';
import { ApiResult, ApiStop } from '../model/api.model';
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style';
import { Options as FillOptions } from 'ol/style/Fill';
import { Options as StrokeOptions } from 'ol/style/Stroke';
import GeometryLayout from 'ol/geom/GeometryLayout';
import { ThemeConfiguration } from '../model/theme';
import { sourceProjection, destinationProjection } from '../model/constants';

export const getGeoObjFeature = (apiResult: ApiResult): Geometry | undefined => {
    if (!Object.keys(apiResult).length) return;
    let geometry: Geometry = (undefined as unknown) as Geometry;

    if (apiResult?.geometry?.type === 'MultiLineString') {
        geometry = new MultiLineString(
            (apiResult.geometry as GeoJSONMultiLineString).coordinates,
            GeometryLayout.XY
        ).transform(sourceProjection, destinationProjection);
    } else if (apiResult?.geometry?.type === 'LineString') {
        geometry = new LineString((apiResult.geometry as GeoJSONLineString).coordinates, GeometryLayout.XY).transform(
            sourceProjection,
            destinationProjection
        );
    } else if (apiResult?.point?.type === 'Point') {
        geometry = new Point((apiResult?.point as GeoJSONPoint).coordinates, GeometryLayout.XY).transform(
            sourceProjection,
            destinationProjection
        );
    }

    if (!!geometry) {
        return geometry;
    }
};

export const getStopPointsFeature = (stops: ApiStop[]): Geometry | undefined => {
    if (!stops.length) return;

    const points = stops.map((stop) => (stop.point as GeoJSONPoint).coordinates);
    const newFeature = new MultiPoint(points, GeometryLayout.XY).transform(sourceProjection, destinationProjection);
    newFeature.setProperties({ stops });

    return newFeature;
};

export const positionFeatureStyle = (): Style =>
    new Style({
        image: new CircleStyle({
            radius: 6,
            fill: new Fill({
                color: ThemeConfiguration.primary.main,
            }),
            stroke: new Stroke({
                color: ThemeConfiguration.common.white,
                width: 2,
            }),
        }),
    });

export const tripFeatureStyle = (): Style =>
    new Style({
        ...defaultStyles(undefined, { width: 2, color: ThemeConfiguration.primary.main }),
    });

export const stopFeatureStyle = (): Style =>
    new Style({
        ...defaultStyles(undefined, { width: 2, color: ThemeConfiguration.secondary.main }),
    });

export const extraTripFeatureStyle = (): Style =>
    new Style({
        ...defaultStyles(undefined, { width: 2, color: ThemeConfiguration.secondary.main }),
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
