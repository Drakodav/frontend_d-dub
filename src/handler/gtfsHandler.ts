import { ApiInputType, ApiResult, GtfsApiRoute } from '../model/api.model';
import { levenshtein } from '../util/util';

export type SelectOptions = { value: string; label: string };

export class GtfsHandler {
    query: string;
    selector: keyof ApiResult;

    constructor(query: string) {
        this.query = query;
        this.selector = this.getUrlSearchParam(this.query);
    }

    private getUrlSearchParam = (url: string): keyof ApiResult => {
        const token = url.split('/')[1];
        const match = token.match(/([^?][^\s][^=]+)/g);
        return (match?.length ? match[0] : '') as keyof ApiResult;
    };

    private currLabel = (record: ApiResult): string => {
        switch (this.query) {
            case ApiInputType.route:
                return record.long_name
                    ? (`${record[this.selector]} ${record['long_name']}` as string)
                    : (record[this.selector] as string);

            case ApiInputType.stop:
            default:
                return record[this.selector] as string;
        }
    };

    private currentValue = (record: ApiResult): string => {
        let currValue = record[this.selector] as string;
        if (this.query === ApiInputType.stop && !!currValue) {
            currValue = currValue.split(',')[1]?.replace('stop ', '');
        }
        return currValue;
    };

    fetchApiResults = async (value: string): Promise<ApiResult[]> => {
        const response = (await fetch(`${GtfsApiRoute}${this.query}${value}`)).json();
        const results: ApiResult[] = ((await response) as any).results as [];
        if (results.length > 0) {
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
}
