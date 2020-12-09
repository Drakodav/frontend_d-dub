import React from 'react';
import './App.css';
import { Counter } from './features/counter/Counter';
import { MapWrapper } from './components/map';

function App() {
  return (
    <div className='App'>
      <MapWrapper features={[]} />
      <Counter />
    </div>
  );
}

export default App;
