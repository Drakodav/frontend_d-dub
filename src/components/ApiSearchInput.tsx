import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import AsyncSelect from 'react-select/async';
import { OptionsType, OptionTypeBase, ValueType } from 'react-select/src/types';
import { ApiResult } from '../model/api.model';
import { setApiQuery } from '../store/reducers/apiQuery';
import { filterApiReq, getApiResults, getSingleApiResult } from '../util/api.util';

type Props = {
    heading: string;
    query: string;
};

export const ApiSearchInput = ({ heading, query }: Props) => {
    const [inputValue, setInputValue] = useState<string>('');
    const [apiResults, setApiResults] = useState<ApiResult[]>([]);
    const [defaultOptions, setDefaultOptions] = useState<{}[]>();
    const dipatch = useDispatch();

    const setResultToMap = (value: string) => {
        const result = getSingleApiResult(apiResults, query, value);
        result && dipatch(setApiQuery(result));
    };

    useEffect(() => {
        !!defaultOptions && setDefaultOptions(defaultOptions);
    }, [defaultOptions, apiResults]);

    const loadOptions = async (input: string, callback: (options: OptionsType<OptionTypeBase>) => void) => {
        const newApiResults = await getApiResults(input, query);
        setApiResults(newApiResults);
        const filteredRes = filterApiReq(newApiResults, query);

        const options = filteredRes.map((r) => {
            return { value: r, label: r };
        });
        setDefaultOptions(options);
        callback(options);
    };

    const handleInputChange = (newValue: string) => {
        !!newValue && setInputValue(newValue);
    };

    const handleChange = (selectedOption: ValueType<OptionTypeBase, false>) => {
        if (!!selectedOption?.value) {
            setInputValue(selectedOption.value);
            selectedOption.value !== inputValue && setResultToMap(selectedOption.value);
        }
    };

    return (
        <div style={{ width: '200px', alignSelf: 'center', textAlign: 'center', margin: '20px' }}>
            <label>{heading}</label>
            <AsyncSelect
                cacheOptions={true}
                defaultOptions={defaultOptions}
                loadOptions={loadOptions}
                onInputChange={handleInputChange}
                onChange={handleChange}
                inputMode='numeric'
                pattern='[0-9]*'
            />
        </div>
    );
};

ApiSearchInput.propTypes = {
    heading: PropTypes.string,
    query: PropTypes.string,
};
