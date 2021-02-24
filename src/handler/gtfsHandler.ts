import { Dispatch } from 'react';
import { ApiDef, ApiNaming, ApiResult, ApiStop, ApiTrip, ApiType, GtfsApiRoute } from '../model/api.model';
import { MapFeatureTypes } from '../model/constants';
import { setSearchResults, setSelectedStop, setSelectedTrip } from '../store/reducers/searchInput';
import { getGeoObjFeature } from '../util/geo.util';
import { levenshtein } from '../util/util';
import { MapHandler } from './mapHandler';

export type SelectOptions = { value: string; label: string };

export class GtfsHandler {
    obj: ApiType;

    constructor(name: string) {
        const obj = ApiDef.find((item) => item.name === name);
        if (!obj) throw Error('Wrong gtfsHandler name obj type');

        this.obj = obj;
    }

    private currLabel = (record: ApiResult): string => {
        const { name, selector } = this.obj;
        switch (name) {
            case ApiNaming.route:
                return record.long_name
                    ? (`${record[selector]} ${record['long_name']}` as string)
                    : (record[selector] as string);

            case ApiNaming.stop:
            default:
                return record[selector] as string;
        }
    };

    private currentValue = (record: ApiResult): string => {
        let currValue = record[this.obj.selector] as string;
        if (this.obj.name === ApiNaming.stop && !!currValue) {
            currValue = currValue.split(',')[1]?.replace('stop ', '');
        }
        return currValue;
    };

    fetchApiResults = async (
        value: string,
        query: string = this.obj.query,
        direction?: number
    ): Promise<ApiResult[]> => {
        const dir = direction ? `&direction=${direction}` : '';

        const response = (await fetch(`${GtfsApiRoute}${query}${value}${dir}`)).json();
        const results: ApiResult[] = ((await response) as any).results as [];
        if (results?.length > 0) {
            return results;
        }
        return [];
    };

    getSingleApiResult = (apiResults: ApiResult[], value: string): ApiResult | undefined => {
        const result = apiResults.find((r) => {
            const currValue = this.currentValue(r);
            return currValue.toLocaleLowerCase() === value.toLocaleLowerCase();
        });

        return result;
    };

    getResultOptions = (apiRes: ApiResult[], inputValue: string): SelectOptions[] => {
        inputValue = inputValue.toLowerCase();

        let options: SelectOptions[] = apiRes.map((r) => {
            return { value: this.currentValue(r), label: this.currLabel(r) };
        });
        const values = options.map((record) => record.value);

        // remove duplicates and empty items
        // sort values based on closeness to inputted value
        return options
            .filter((item, i) => values.indexOf(item.value) === i && !!item)
            .sort(
                (a, b) =>
                    levenshtein(a.value.toLowerCase(), inputValue) - levenshtein(b.value.toLowerCase(), inputValue)
            );
    };

    setSearchInputResults = async (
        dispatch: Dispatch<any>,
        result: ApiResult,
        busDirection: number,
        mapHandler: MapHandler
    ) => {
        dispatch(setSearchResults(result));
        switch (this.obj.name) {
            case ApiNaming.route:
                const { queries } = this.obj;
                const trips = (await this.fetchApiResults(
                    result[queries![0].selector] as string,
                    queries![0].query,
                    busDirection
                )) as ApiTrip[];

                if (trips.length) {
                    const trip = trips[0];
                    dispatch(setSelectedTrip(trip));

                    const newFeature = getGeoObjFeature(trip);
                    mapHandler.setFeature(newFeature, MapFeatureTypes.TripFeature);
                }
                break;

            case ApiNaming.stop:
                dispatch(setSelectedStop((result as unknown) as ApiStop));

                const newFeature = getGeoObjFeature(result);
                newFeature?.setProperties({ stops: [result] });
                mapHandler.setFeature(newFeature, MapFeatureTypes.StopFeature);
                break;
        }
    };

    getObj = (): ApiType => this.obj;
}
