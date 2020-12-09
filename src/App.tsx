import React from 'react';
import './App.css';
import { Counter } from './features/counter/Counter';
import { PublicMap } from './components/map';

function App() {
  return (
    <div className='App'>
      <PublicMap />
      <Counter />
    </div>
  );
}

export default App;
