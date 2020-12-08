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
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <Counter />
        <a
          className='App-link'
          href='https://reactjs.org'
          target='_blank'
          rel='noopener noreferrer'
        >
          Learn React
        </a>
      </header>
      <PublicMap />
    </div>
  );
}

export default App;
