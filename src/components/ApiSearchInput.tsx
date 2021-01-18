import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import AsyncSelect from 'react-select/async';
import { OptionTypeBase, ValueType } from 'react-select/src/types';
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

    const loadOptions = (inputValue: string) =>
        new Promise(async (resolve) => {
            const newApiResults = [...apiResults, ...(await getApiResults(inputValue, query))];
            setApiResults(newApiResults);

            const filteredRes = filterApiReq(newApiResults, query);
            const options = filteredRes.map((r) => {
                return { value: r, label: r };
            });
            if (!!options) {
                setDefaultOptions(options);
                resolve(options);
            }
        });

    const onInputChange = (value: string, { action }: any) => {
        switch (action) {
            case 'input-change':
                setInputValue(value);
                return;
            default:
                return;
        }
    };

    const handleChange = (selectedOption: ValueType<OptionTypeBase, false>, { action }: any) => {
        switch (action) {
            case 'select-option':
                if (!!selectedOption?.value) {
                    setInputValue(selectedOption.value);
                    setResultToMap(selectedOption.value);
                }
                return;
            case 'clear':
                setInputValue('');
                return;
            default:
                return;
        }
    };

    return (
        <div style={{ width: '200px', alignSelf: 'center', textAlign: 'center', margin: '20px' }}>
            <label>{heading}</label>
            <AsyncSelect
                inputValue={inputValue}
                isSearchable
                isClearable
                cacheOptions
                defaultOptions={defaultOptions}
                loadOptions={loadOptions}
                onInputChange={onInputChange}
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
