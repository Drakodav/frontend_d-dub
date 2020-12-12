import { GeoJSONMultiLineString, GeoJSONPoint } from 'ol/format/GeoJSON';
import { Feature } from 'ol';
import Geometry from 'ol/geom/Geometry';
import MultiLineString from 'ol/geom/MultiLineString';
import Point from 'ol/geom/Point';
import { ApiInputType, ApiResult, GtfsApiRoute } from '../model/api.model';

export const getUrlParamFirst = (url: string) => url.split('/')[0] || '';

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

export const getUrlSearchType = (url: string): string => {
    const token = url.split('/')[1];
    const match = token.match(/([^?][^\s][^=]+)/g);
    return match?.length ? match[0] : '';
};

export const getApiObjSelector = (query: string): { objSelector: string; objValue: string } => {
    const type = getUrlParamFirst(query);
    const keyIdx = Object.keys(ApiInputType).findIndex((k) => k === type);
    const value = Object.values(ApiInputType)[keyIdx];
    const objSelector = getUrlSearchType(value);
    return { objSelector: objSelector, objValue: value };
};

export const apiTypeArrayValue = (r: ApiResult, query: string): string => {
    const { objSelector, objValue } = getApiObjSelector(query);

    const keyIdx = Object.keys(r).findIndex((k) => k === objSelector);
    let currValue = Object.values(r)[keyIdx] as string;
    if (objValue === ApiInputType.stop && !!currValue) {
        currValue = currValue.split(',')[1]?.replace('stop ', '');
    }
    return currValue;
};

export const filterApiReq = (apiRes: ApiResult[], query: string): string[] => {
    let filteredRes: string[] = apiRes.map((r) => apiTypeArrayValue(r, query)).filter((item) => !!item) as string[];
    filteredRes = filteredRes.filter((item, i) => filteredRes.indexOf(item) === i); // remove any duplicate values
    filteredRes = filteredRes.sort((a, b) => parseInt(a) - parseInt(b));
    return filteredRes;
};

export const getApiResults = async (value: string, type: string): Promise<ApiResult[]> => {
    const response = (await fetch(`${GtfsApiRoute}${type}${value}`)).json();
    const results: ApiResult[] = ((await response) as any).results as [];
    if (results.length > 0) {
        return results;
    }
    return [];
};

export const getSingleApiResult = (apiResults: ApiResult[], query: string, value: string): ApiResult | undefined => {
    const result = apiResults.find((r) => {
        const currValue = apiTypeArrayValue(r, query);
        return currValue.toLocaleLowerCase() === value.toLocaleLowerCase();
    });

    return result;
};
