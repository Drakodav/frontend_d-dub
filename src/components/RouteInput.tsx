import { Form, FormField, TextInput } from 'grommet';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setApiQuery } from '../store/reducers/apiQuery';
import { getBusRoutes } from '../util/api.util';

type FormType = {
  value: string;
};

type Props = {
  heading: string;
};

export const RouteInput = ({ heading }: Props) => {
  const [value, setValue] = useState<FormType>({ value: '' });
  const [suggestions, setSuggestions] = useState<JSX.Element>();
  const dipatch = useDispatch();

  const getSuggestionComponents = (
    results: string[],
    disable?: boolean
  ): JSX.Element => {
    if (disable === true) return <></>;
    let suggestionsListComponent: JSX.Element;
    if (results.length) {
      suggestionsListComponent = (
        <datalist id='suggestions'>
          {results.map((suggestion, index) => (
            <option
              key={`${suggestion}${index}`}
              value={suggestion}
              onClick={() => {}}
            ></option>
          ))}
        </datalist>
      );
    } else {
      suggestionsListComponent = (
        <div className='no-suggestions'>
          <em>Result Not Found</em>
        </div>
      );
    }
    return suggestionsListComponent;
  };

  return (
    <div style={{ width: '80%', alignSelf: 'center', textAlign: 'center' }}>
      <Form
        value={value}
        onChange={async (nextValue) => {
          const input = (nextValue as FormType).value;
          if (nextValue === value || input.length > 5) return;

          setValue(nextValue as FormType);

          // set the autocomplete values
          let results: string[] = (await getBusRoutes(input))
            .map((r) => r?.short_name)
            .filter((item) => !!item) as string[];
          results = results.filter((item, i) => results.indexOf(item) === i); // remove any duplicate values

          const suggestionCompList = getSuggestionComponents(results);
          setSuggestions(suggestionCompList);
        }}
        onFocus={() => setSuggestions(suggestions)}
        validate='blur'
        onValidate={async () => {
          const input = (value as FormType).value;
          if (!!input) {
            const results = await getBusRoutes(input);
            const result = results.find((r) => r.short_name === input);
            result && dipatch(setApiQuery(result));
            setSuggestions(getSuggestionComponents([], true));
          }
        }}
      >
        <FormField name='name' htmlFor='text-input-id' label={heading}>
          <TextInput id='text-input-id' name='value' list='suggestions' />
          {suggestions}
        </FormField>
      </Form>
    </div>
  );
};

RouteInput.propTypes = {
  heading: PropTypes.string,
};
