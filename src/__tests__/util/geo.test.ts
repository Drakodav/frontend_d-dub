import { defaultStyles } from 'react-select/src/styles';
import { ApiResult, ApiStop } from '../../model/api.model';
import {
    extraTripFeatureStyle,
    getGeoObjFeature,
    getStopPointsFeature,
    positionFeatureStyle,
    stopFeatureStyle,
    stopsFeatureStyle,
    tripFeatureStyle,
} from '../../util/geo.util';
import 'jest-canvas-mock';

describe('geo utility testing', () => {
    it('geoObjFeature', () => {
        let apiResult: ApiResult = {
            geometry: {
                type: 'LineString',
                coordinates: [[-7.31786633503889, 54.9966287583879]],
            },
        };
        let geoObj = getGeoObjFeature(apiResult);
        expect(geoObj).toBeDefined();

        apiResult = {
            geometry: {
                type: 'MultiLineString',
                coordinates: [[[-7.31786633503889, 54.9966287583879]]],
            },
        };
        geoObj = getGeoObjFeature(apiResult);
        expect(geoObj).toBeDefined();

        apiResult = {
            point: {
                type: 'Point',
                coordinates: [-7.31786633503889, 54.9966287583879],
            },
        };
        geoObj = getGeoObjFeature(apiResult);
        expect(geoObj).toBeDefined();

        geoObj = getGeoObjFeature({});
        expect(geoObj).toBeUndefined();
    });

    it('stopPointsFeature', () => {
        let stop: ApiStop = {
            id: 77010,
            stop_id: '7000B158131',
            name: 'Ulsterbus Depot, stop 158131',
            point: {
                type: 'Point',
                coordinates: [-7.31786633503889, 54.9966287583879],
            },
            stop_sequence: 1,
        };
        let geoObj = getStopPointsFeature([stop]);
        expect(geoObj).toBeDefined();

        geoObj = getStopPointsFeature([]);
        expect(geoObj).toBeUndefined();
    });

    it('styles', () => {
        // // cannot test these due to openlayers and jest not getting along
        // expect(positionFeatureStyle()).toBeDefined();
        // expect(tripFeatureStyle()).toBeDefined();
        // expect(stopFeatureStyle()).toBeDefined();
        // expect(stopsFeatureStyle()).toBeDefined();
        // expect(extraTripFeatureStyle()).toBeDefined();
    });
});
