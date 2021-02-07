import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AsyncSelect from 'react-select/async';
import { OptionsType, OptionTypeBase, ValueType } from 'react-select/src/types';
import { ApiNaming, ApiResult } from '../model/api.model';
import { getDirection, getSearchType, resetSearchInput } from '../store/reducers/searchInput';
import { GtfsHandler } from '../handler/gtfsHandler';
import { makeStyles } from '@material-ui/styles';
import { MapHandler } from '../handler/mapHandler';
import { getGeoObjFeature } from '../util/geo.util';
import { MapFeatureTypes } from '../model/constants';
import debounce from 'debounce-promise';

type Props = {
    className: string;
};

const useStyles = (props: Props) =>
    makeStyles({
        search: {
            width: '90%',
            alignSelf: 'center',
            textAlign: 'center',
        },
        input: {
            WebkitUserSelect: 'auto',
            userSelect: 'auto',
        },
    });

export const ApiSearchInput = (props: Props) => {
    const { className } = props;
    const classes = useStyles(props)();
    const dispatch = useDispatch();

    const [apiResults, setApiResults] = useState<ApiResult[]>([]);
    const [defaultOptions, setDefaultOptions] = useState<{}[]>();
    const [search, setSearch] = useState<string[]>([]);
    const [inputValue, setInputValue] = useState({ value: null, label: null });

    const searchType = useSelector(getSearchType);
    const busDirection = useSelector(getDirection);

    const resetState = useCallback(() => {
        setApiResults(() => []);
        setDefaultOptions(() => []);
        setSearch(() => []);
        setInputValue(() => null as any);
        dispatch(resetSearchInput());
    }, [dispatch]);

    useEffect(() => {
        resetState();
    }, [searchType, resetState]);

    const gtfsHandler = new GtfsHandler(searchType);
    const mapHandler = MapHandler.getInstance();

    // uppercase heading
    const heading = searchType.charAt(0).toUpperCase() + searchType.slice(1);

    const setResultToMap = async (value: string) => {
        const result = gtfsHandler.getSingleApiResult(apiResults, value);
        if (result) {
            let newResult = result;

            if (searchType === ApiNaming.route) {
                const { queries } = gtfsHandler.getObj();
                const trips = (await gtfsHandler.fetchApiResults(
                    result[queries![0].selector] as string,
                    queries![0].query,
                    busDirection
                )) as ApiResult[];
                trips.length && (newResult = trips[0]);
            }

            gtfsHandler.setResults(dispatch, result);

            const newFeature = getGeoObjFeature(newResult);
            mapHandler.setFeature(newFeature, MapFeatureTypes.ApiFeature);
        }
    };

    const loadOptions = async (value: string, callback: (options: OptionsType<{}>) => void) => {
        let newApiResults = apiResults;
        if (!(value in search)) {
            const mergedArray = [...apiResults, ...(await gtfsHandler.fetchApiResults(value))];
            // mergedArray have duplicates, lets remove the duplicates using Set
            let set = new Set();
            newApiResults = mergedArray.filter((item) => {
                if (!set.has(item.id)) {
                    set.add(item.id);
                    return true;
                }
                return false;
            }, set);
            setApiResults(newApiResults);
            if (search.indexOf(value) === -1) setSearch([...search, value]);
        }
        const options = gtfsHandler.getResultOptions(newApiResults, value);

        if (!!options) {
            setDefaultOptions(options);
            return callback(options);
        }
    };
    const debouncedSearch = debounce(loadOptions, 800, { leading: false });

    const handleChange = (selectedOption: ValueType<OptionTypeBase, false>, { action }: any) => {
        switch (action) {
            case 'select-option':
                if (!!selectedOption?.value) {
                    setInputValue({ ...(selectedOption as any) });
                    setResultToMap(selectedOption.value);
                }
                break;
            case 'clear':
                resetState();
                break;
        }
    };

    return (
        <div className={`${className} ${classes.search}`}>
            <AsyncSelect
                value={inputValue}
                className={classes.input}
                cacheOptions={false}
                defaultOptions={defaultOptions}
                loadOptions={debouncedSearch}
                onChange={handleChange}
                inputMode='numeric'
                pattern='[0-9]*'
                placeholder={`Bus ${heading}`}
                isClearable
            />
        </div>
    );
};

ApiSearchInput.propTypes = {
    className: PropTypes.string,
};
