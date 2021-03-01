import { applyTransform, Extent } from 'ol/extent';
import proj4 from 'proj4';
import { register } from 'ol/proj/proj4';
import { get as getProjection, getTransform, ProjectionLike } from 'ol/proj';
import Projection from 'ol/proj/Projection';

// meant to represent duration in milliseconds
export const TRANSITION_DURATION: number = 300 as const;

// MapHandler Constants
export const CENTER_LOCATION: number[] = [715374.38, 733957.98];
export const MAP_TRANSITION = TRANSITION_DURATION * 2;
export const MaxZoom: number = 14;
export const MinZoom: number = 4;
export const Padding: number[] = [20, 20, 20, 20];
export const GeoOptions = {
    enableHighAccuracy: true,
    timeout: 2000,
    maximumAge: 1000,
};

export const sourceProjection: ProjectionLike = 'EPSG:4326';
export const destinationProjection: ProjectionLike = 'EPSG:2157';

// code inspired from https://openlayers.org/en/latest/examples/reprojection-by-code.html
export const getIrelandProjection = (): { proj: Projection; extent: Extent } => {
    var newProjCode = 'EPSG:2157';
    proj4.defs(
        newProjCode,
        '+proj=tmerc +lat_0=53.5 +lon_0=-8 +k=0.99982 +x_0=600000 +y_0=750000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs'
    );
    register(proj4);
    const newProj = getProjection(newProjCode);
    const fromLonLat = getTransform('EPSG:4326', newProj);

    const bbox = [55.43, -10.56, 51.39, -5.34];
    let worldExtent: Extent = [bbox[1], bbox[2], bbox[3], bbox[0]];
    newProj.setWorldExtent(worldExtent);

    if (bbox[1] > bbox[3]) {
        worldExtent = [bbox[1], bbox[2], bbox[3] + 360, bbox[0]];
    }
    const extent = applyTransform(worldExtent, fromLonLat, undefined, 8);
    newProj.setExtent(extent);

    return { proj: newProj, extent };
};

export enum MapFeatureTypes {
    TripFeature,
    StopFeature,
    StopsFeature,
    ExtraTripFeature,
    AccuracyFeature,
    PositionFeature,
}
