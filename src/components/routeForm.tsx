import React, { useState } from 'react';
// import PropTypes from 'prop-types';
import { Box, Button, Form, FormField, TextInput } from 'grommet';

type myForm = {
  busRoute: string;
};

const RouteForm = (props: any) => {
  const [value, setValue] = useState<myForm>({ busRoute: '' });

  const getBusRoutes = async (route: string) => {
    const response = (
      await fetch(`http://127.0.0.1:8001/api/gtfs/route/?short_name=${route}`)
    ).json();

    const results = ((await response) as any).results as [];
    // console.log(response);
    if (results.length > 0) {
      console.log(results);
      // use geodjango to display results on map
    }
  };

  return (
    <Form
      value={value}
      onChange={(nextValue) => {
        setValue(nextValue as myForm);
      }}
      onReset={() => setValue({ busRoute: '' })}
      onSubmit={async ({ value }) => {
        const busRoute = (value as myForm).busRoute;
        await getBusRoutes(busRoute);
      }}
    >
      <FormField name='name' htmlFor='text-input-id' label='Bus Route'>
        <TextInput id='text-input-id' name='busRoute' />
      </FormField>
      <Box direction='row' gap='medium'>
        <Button type='submit' primary label='Submit' />
      </Box>
    </Form>
  );
};

// RouteForm.propTypes = {};

export default RouteForm;
