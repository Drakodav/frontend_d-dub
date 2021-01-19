import React from 'react';
import './App.css';
import { MapWrapper } from './components/MapWrapper';
import { UIWrapper } from './components/UIWrapper';

function App() {
    return (
        <div>
            {/* <ApiSearchInput heading={'Bus Route'} query={ApiInputType.route} />
            <ApiSearchInput heading={'Bus Stop'} query={ApiInputType.stop} /> */}

            <UIWrapper />
            <MapWrapper />
        </div>
    );
}

export default App;
