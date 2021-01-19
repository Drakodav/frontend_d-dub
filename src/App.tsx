import React from 'react';
import './App.css';
import { makeStyles } from '@material-ui/core/styles';
import { Container } from '@material-ui/core';
import { MapWrapper } from './components/MapWrapper';

import { KeyboardArrowUp, GpsFixedRounded } from '@material-ui/icons';

const useStyles = makeStyles(({ palette, breakpoints }) => ({
    container: {
        position: 'fixed',
        backgroundColor: palette.common.white,
        padding: '10px',
        bottom: 0,
        left: 0,
        zIndex: 1,
        borderRadius: '5px',
        display: 'flex',
        flex: 2,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        maxHeight: '50px',
        [breakpoints.up('sm')]: {
            top: 0,
            left: 0,
            margin: '15px',
            width: '400px',
        },
    },
}));

function App() {
    const classes = useStyles();

    return (
        <div>
            {/* <ApiSearchInput heading={'Bus Route'} query={ApiInputType.route} />
            <ApiSearchInput heading={'Bus Stop'} query={ApiInputType.stop} /> */}

            <Container maxWidth='sm' className={classes.container}>
                <KeyboardArrowUp />
                <p>hello</p>
                <GpsFixedRounded />
            </Container>

            <MapWrapper />
        </div>
    );
}

export default App;
