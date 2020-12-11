import { Form, FormField, TextInput } from 'grommet';
import PropTypes from 'prop-types';
import React, { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { ApiResult } from '../model/api.model';
import { setApiQuery } from '../store/reducers/apiQuery';
import { filterApiReq, getApiResults, getSingleApiResult } from '../util/api.util';

type FormType = {
    value: string;
};

type Props = {
    heading: string;
    query: string;
};

export const ApiSearchInput = ({ heading, query }: Props) => {
    const [formData, setFormData] = useState<FormType>({ value: '' });
    const [suggestions, setSuggestions] = useState<JSX.Element>();
    const [apiResults, setApiResults] = useState<ApiResult[]>([]);
    const dipatch = useDispatch();
    const datalistRef = useRef() as React.MutableRefObject<HTMLDataListElement>;

    const getSuggestionComponents = (apiRes: ApiResult[], disable: boolean = false): JSX.Element => {
        if (disable === true && !apiRes.length) return <></>;
        let suggestionsListComponent: JSX.Element = <></>;

        const filteredRes = filterApiReq(apiRes, query);

        if (filteredRes.length) {
            suggestionsListComponent = (
                <datalist ref={datalistRef} id="suggestions_list">
                    <select name="suggestion">
                        {filteredRes.map((suggestion, index) => (
                            <option key={`${suggestion}${index}`} value={suggestion}></option>
                        ))}
                    </select>
                </datalist>
            );
        } else if (!disable) {
            suggestionsListComponent = <div>Not Found</div>;
        }
        return suggestionsListComponent;
    };

    const setResultToMap = (value: string) => {
        const result = getSingleApiResult(apiResults, query, value);
        result && dipatch(setApiQuery(result));
        setSuggestions(getSuggestionComponents([], true));
    };

    const handleSubmit = async () => {
        const input = (formData as FormType).value;
        if (!!input) {
            setSuggestions(getSuggestionComponents([], true));
            setResultToMap(input);
        }
    };

    return (
        <div style={{ width: '200px', alignSelf: 'center', textAlign: 'center' }}>
            <Form
                value={formData}
                onChange={async (nextValue) => {
                    const input = (nextValue as FormType).value;
                    if (nextValue === formData || input.length > 5) return;
                    setFormData(nextValue as FormType);

                    // set the autocomplete values
                    const newApiResults = await getApiResults(input, query);
                    newApiResults.length && setApiResults(newApiResults);

                    // set the suggestions component list
                    const suggestionCompList = getSuggestionComponents(newApiResults);

                    setSuggestions(suggestionCompList);
                }}
                onFocus={(e) => {
                    !!e.target.value && setSuggestions(getSuggestionComponents(apiResults));
                }}
                validate="blur"
                onValidate={handleSubmit}
                onSubmit={handleSubmit}
            >
                <FormField name="value" htmlFor="text-input-id" label={heading}>
                    <TextInput type="text" name="value" id="text-input-id" list="suggestions_list" />
                    {suggestions}
                </FormField>
            </Form>
        </div>
    );
};

ApiSearchInput.propTypes = {
    heading: PropTypes.string,
    query: PropTypes.string,
};
