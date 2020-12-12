import React from 'react';
import { Box, Grommet, ResponsiveContext } from 'grommet';
import './App.css';
import { MapWrapper } from './components/MapWrapper';
import { ApiSearchInput } from './components/ApiSearchInput';
import { ApiInputType } from './model/api.model';

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
            <MapWrapper />
            <ApiSearchInput heading={'Bus Route'} query={ApiInputType.route} />
            <ApiSearchInput heading={'Bus Stop'} query={ApiInputType.stop} />
          </Box>
        )}
      </ResponsiveContext.Consumer>
    </Grommet>
  );
}

export default App;
