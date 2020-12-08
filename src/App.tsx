import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Counter } from './features/counter/Counter';
import { PublicMap } from './components/map';

function App() {
  return (
    <div className='App'>
      <header className='App-header'>
        <img src={logo} className='App-logo' alt='logo' />
        <Counter />
      </header>
      <PublicMap />
    </div>
  );
}

export default App;
