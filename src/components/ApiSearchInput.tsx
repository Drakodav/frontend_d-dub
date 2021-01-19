import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import AsyncSelect from 'react-select/async';
import { OptionTypeBase, ValueType } from 'react-select/src/types';
import { ApiResult } from '../model/api.model';
import { setApiQuery } from '../store/reducers/apiQuery';
import { GtfsHandler } from '../handler/gtfsHandler';

type Props = {
    heading: string;
    query: string;
};

export const ApiSearchInput = ({ heading, query }: Props) => {
    const [inputValue, setInputValue] = useState<string>('');
    const [apiResults, setApiResults] = useState<ApiResult[]>([]);
    const [defaultOptions, setDefaultOptions] = useState<{}[]>();
    const dipatch = useDispatch();

    const gtfsHandler = new GtfsHandler(query);

    const setResultToMap = (value: string) => {
        const result = gtfsHandler.getSingleApiResult(apiResults, value);
        result && dipatch(setApiQuery(result));
    };

    const loadOptions = (value: string) =>
        new Promise(async (resolve) => {
            let newApiResults = apiResults;
            if (gtfsHandler.getSingleApiResult(apiResults, value) === undefined) {
                newApiResults = await gtfsHandler.fetchApiResults(value);
                setApiResults([...apiResults, ...(await gtfsHandler.fetchApiResults(value))]);
            }
            const options = gtfsHandler.getResultOptions(newApiResults, value);

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

    const customStyles = {
        option: (provided: any, state: { isSelected: any }) => ({
            ...provided,
            borderBottom: '1px dotted pink',
            color: 'blue',
            padding: 20,
        }),
        singleValue: (provided: any, state: { isDisabled: any }) => {
            const opacity = state.isDisabled ? 0.5 : 1;
            const transition = 'opacity 300ms';
            return { ...provided, opacity, transition };
        },
    };

    return (
        <div style={{ width: '200px', alignSelf: 'center', textAlign: 'center', margin: '20px' }}>
            <label>{heading}</label>
            <AsyncSelect
                inputValue={inputValue}
                styles={customStyles}
                cacheOptions={false}
                defaultOptions={defaultOptions}
                loadOptions={loadOptions}
                onInputChange={onInputChange}
                onChange={handleChange}
                inputMode='numeric'
                pattern='[0-9]*'
                isSearchable
                isClearable
            />
        </div>
    );
};

ApiSearchInput.propTypes = {
    heading: PropTypes.string,
    query: PropTypes.string,
};
