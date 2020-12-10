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

  // useEffect(() => {
  //   const results = apiResults
  //     .map((r) => r?.short_name)
  //     .filter((s) => !!s) as string[];

  //   setSuggestions(results);
  // }, [apiResults]);

  const getSuggestionComponents = (results: string[]): JSX.Element => {
    let suggestionsListComponent: JSX.Element;
    if (results.length) {
      suggestionsListComponent = (
        <ul className='suggestions'>
          {results.map((suggestion, index) => {
            let className;

            // // Flag the active suggestion with a class
            // if (index === activeSuggestion) {
            //   className = "suggestion-active";
            // }

            return (
              <li
                className={className}
                key={`${suggestion}${index}`}
                onClick={() => {}}
              >
                {suggestion}
              </li>
            );
          })}
        </ul>
      );
    } else {
      suggestionsListComponent = (
        <div className='no-suggestions'>
          <em>No suggestions, you're on your own!</em>
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
          if (nextValue === value) return;
          if (input.length > 5) {
            console.log('User Input is too long'); // @TODO: proper user error message
            return;
          }
          setValue(nextValue as FormType);

          // set the autocomplete values now
          let results: string[] = (await getBusRoutes(input))
            .map((r) => r?.short_name)
            .filter((item) => !!item) as string[];
          results = results.filter((item, i) => results.indexOf(item) === i); // remove any duplicate values

          const suggestionCompList = getSuggestionComponents(results);
          setSuggestions(suggestionCompList);
        }}
        validate='blur'
        onValidate={async () => {
          const input = (value as FormType).value;
          if (!!input) {
            const results = await getBusRoutes(input);
            const result = results.find((r) => r.short_name === input);
            result && dipatch(setApiQuery(result));
          }
        }}
      >
        <FormField name='name' htmlFor='text-input-id' label={heading}>
          <TextInput id='text-input-id' name='value' />
          {suggestions}
        </FormField>
      </Form>
    </div>
  );
};

RouteInput.propTypes = {
  heading: PropTypes.string,
};
