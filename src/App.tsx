import React from 'react';
import {
  Box,
  Button,
  Form,
  FormField,
  Grommet,
  ResponsiveContext,
  TextInput,
} from 'grommet';
import './App.css';
import { Counter } from './features/counter/Counter';
import { MapWrapper } from './components/map';
import RouteForm from './components/routeForm';

const theme = {
  global: {
    colors: {
      brand: '#228BE6',
    },
    font: {
      family: 'Roboto',
      size: '18px',
      height: '20px',
    },
  },
};

const AppBar = (props: any) => (
  <Box
    tag='header'
    direction='row'
    align='center'
    justify='between'
    background='brand'
    pad={{ left: 'medium', right: 'small', vertical: 'small' }}
    elevation='medium'
    style={{ zIndex: '1' }}
    {...props}
  />
);

function App() {
  return (
    <Grommet theme={theme}>
      <ResponsiveContext.Consumer>
        {(size) => (
          <Box>
            <AppBar>Dynamo Dublin</AppBar>
            <div>
              <RouteForm />
            </div>
            <MapWrapper features={[]} />
            <Counter />
          </Box>
        )}
      </ResponsiveContext.Consumer>
    </Grommet>
  );
}

export default App;
