import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import AsyncSelect from 'react-select/async';
import { OptionTypeBase, ValueType } from 'react-select/src/types';
import { ApiResult } from '../model/api.model';
import { setApiQuery } from '../store/reducers/apiQuery';
import { GtfsHandler } from '../handler/gtfsHandler';
import { makeStyles } from '@material-ui/styles';
import { Fade } from '@material-ui/core';
import { TRANSITION_DURATION } from '../model/constants';

type Props = {
    heading: string;
    query: string;
    disabled: boolean;
};

const useStyles = (props: Props) =>
    makeStyles({
        search: {
            width: '90%',
            alignSelf: 'center',
            textAlign: 'center',
            margin: '20px',
            display: props.disabled ? 'none' : 'inline',
        },
    });

export const ApiSearchInput = (props: Props) => {
    const { heading, query, disabled } = props;
    const classes = useStyles(props)();
    const dipatch = useDispatch();

    const [apiResults, setApiResults] = useState<ApiResult[]>([]);
    const [defaultOptions, setDefaultOptions] = useState<{}[]>();
    const [search, setSearch] = useState<string[]>([]);

    const gtfsHandler = new GtfsHandler(query);

    const setResultToMap = (value: string) => {
        const result = gtfsHandler.getSingleApiResult(apiResults, value);
        result && dipatch(setApiQuery(result));
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
                    setResultToMap(selectedOption.value);
                }
                return;
        }
    };

    const customStyles = {
        // option: (provided: any) => ({
        //     ...provided,
        //     borderBottom: '1px dotted pink',
        //     color: 'blue',
        //     padding: 20,
        // }),
        // singleValue: (provided: any, state: { isDisabled: any }) => {
        //     const opacity = state.isDisabled ? 0.5 : 1;
        //     const transition = `opacity ${TRANSITION_DURATION}ms`;
        //     return { ...provided, opacity, transition };
        // },
    };

    return (
        <Fade in={!disabled} timeout={TRANSITION_DURATION}>
            <div className={classes.search}>
                <AsyncSelect
                    styles={customStyles}
                    cacheOptions={false}
                    defaultOptions={defaultOptions}
                    loadOptions={loadOptions}
                    onChange={handleChange}
                    inputMode='numeric'
                    pattern='[0-9]*'
                    placeholder={heading}
                    isSearchable
                    isClearable
                />
            </div>
        </Fade>
    );
};

ApiSearchInput.propTypes = {
    heading: PropTypes.string,
    query: PropTypes.string,
    disabled: PropTypes.bool,
};
