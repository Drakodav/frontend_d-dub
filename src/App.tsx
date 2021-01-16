import React from 'react';
import './App.css';
import { MapWrapper } from './components/MapWrapper';
import { ApiSearchInput } from './components/ApiSearchInput';
import { ApiInputType } from './model/api.model';

function App() {
    return (
        <div>
            <MapWrapper />
            <ApiSearchInput heading={'Bus Route'} query={ApiInputType.route} />
            <ApiSearchInput heading={'Bus Stop'} query={ApiInputType.stop} />
        </div>
    );
}

export default App;
