import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Form, FormField, TextInput } from 'grommet';
import { getBusRoutes } from '../util/api.util';
import { ApiResult } from '../model/api';
import { useDispatch } from 'react-redux';
import { setApiQuery } from '../store/reducers/apiQuery';

type FormType = {
  value: string;
};

type Props = {
  heading: string;
};

export const RouteInput = ({ heading }: Props) => {
  const [value, setValue] = useState<FormType>({ value: '' });
  const dipatch = useDispatch();

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
          // const results: ApiResult[] = await getBusRoutes(input);
        }}
        validate='blur'
        onValidate={async () => {
          const input = (value as FormType).value;
          if (!!input) {
            const results = await getBusRoutes(input);
            dipatch(setApiQuery(results));
          }
        }}
      >
        <FormField name='name' htmlFor='text-input-id' label={heading}>
          <TextInput id='text-input-id' name='value' />
        </FormField>
      </Form>
    </div>
  );
};

RouteInput.propTypes = {
  heading: PropTypes.string,
};
