import { ApiDef, ApiNaming, ApiResult, ApiType, GtfsApiRoute } from '../model/api.model';
import { levenshtein } from '../util/util';

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

    fetchApiResults = async (value: string, query: string = this.obj.query): Promise<ApiResult[]> => {
        const response = (await fetch(`${GtfsApiRoute}${query}${value}`)).json();
        const results: ApiResult[] = (((await response) as any).results as []) ?? ((await response) as []);
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

    getObj = (): ApiType => this.obj;
}
