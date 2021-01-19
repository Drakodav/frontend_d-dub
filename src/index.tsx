import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { createMuiTheme, ThemeProvider } from '@material-ui/core';

// adds window information to reducer
import { WindowUtil } from './util/window.util';

const theme = createMuiTheme({
    palette: {
        common: { black: '#000', white: '#fff' },
        background: { paper: '#fff', default: '#fafafa' },
        primary: {
            light: 'rgba(182, 227, 255, 1)',
            main: 'rgba(130, 177, 255, 1)',
            dark: 'rgba(77, 130, 203, 1)',
            contrastText: '#fff',
        },
        secondary: {
            light: 'rgba(215, 255, 217, 1)',
            main: 'rgba(165, 214, 167, 1)',
            dark: 'rgba(117, 164, 120, 1)',
            contrastText: '#fff',
        },
        error: { light: '#e57373', main: '#f44336', dark: '#d32f2f', contrastText: '#fff' },
        text: {
            primary: 'rgba(0, 0, 0, 0.87)',
            secondary: 'rgba(0, 0, 0, 0.54)',
            disabled: 'rgba(0, 0, 0, 0.38)',
            hint: 'rgba(0, 0, 0, 0.38)',
        },
    },
});

ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <ThemeProvider theme={theme}>
                <WindowUtil />
                <App />
            </ThemeProvider>
        </Provider>
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
