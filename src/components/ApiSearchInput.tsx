import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AsyncSelect from 'react-select/async';
import { OptionTypeBase, ValueType } from 'react-select/src/types';
import { ApiResult } from '../model/api.model';
import { getSearchType, setSearchResults } from '../store/reducers/searchInput';
import { GtfsHandler } from '../handler/gtfsHandler';
import { makeStyles } from '@material-ui/styles';

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
    useEffect(() => {
        setApiResults(() => []);
        setDefaultOptions(() => []);
        setSearch(() => []);
        setInputValue(null as any);
        dispatch(setSearchResults({}));
    }, [searchType, dispatch]);

    const gtfsHandler = new GtfsHandler(searchType);

    // uppercase heading
    const heading = searchType.charAt(0).toUpperCase() + searchType.slice(1);

    const setResultToMap = (value: string) => {
        const result = gtfsHandler.getSingleApiResult(apiResults, value);
        result && dispatch(setSearchResults(result));
    };

    const loadOptions = (value: string) =>
        new Promise(async (resolve) => {
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
                resolve(options);
            }
        });

    const handleChange = (selectedOption: ValueType<OptionTypeBase, false>, { action }: any) => {
        switch (action) {
            case 'select-option':
                if (!!selectedOption?.value) {
                    setInputValue({ ...(selectedOption as any) });
                    setResultToMap(selectedOption.value);
                }
                break;
            case 'clear':
                setInputValue(null as any);
                dispatch(setSearchResults({}));
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
                loadOptions={loadOptions}
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
