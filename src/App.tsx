import React from 'react';
import './App.css';
import { AppBar, Paper, Typography } from '@material-ui/core';
import { MapWrapper } from './components/MapWrapper';
import { ApiSearchInput } from './components/ApiSearchInput';
import { ApiInputType } from './model/api.model';
import { Toolbar } from '@material-ui/core';

function App() {
    return (
        <div>
            <Paper>
                <MapWrapper />
            </Paper>
            <AppBar position='fixed' color='primary'>
                <Toolbar>
                    <Typography variant='h6'>Dynamo Dublin</Typography>
                    <ApiSearchInput heading={'Bus Route'} query={ApiInputType.route} />
                    <ApiSearchInput heading={'Bus Stop'} query={ApiInputType.stop} />
                </Toolbar>
            </AppBar>
        </div>
    );
}

export default App;
