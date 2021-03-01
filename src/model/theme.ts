import createMuiTheme from '@material-ui/core/styles/createMuiTheme';

export const ThemeConfiguration = {
    common: { black: '#000', white: '#fff' },
    background: { paper: '#fff', default: '#fafafa' },
    primary: {
        light: '#5e92f3',
        main: '#1565c0',
        dark: '#003c8f',
        contrastText: '#fff',
    },
    secondary: {
        light: '#60ad5e',
        main: '#2e7d32',
        dark: '#005005',
        contrastText: '#fff',
    },
    error: { light: '#e57373', main: '#f44336', dark: '#d32f2f', contrastText: '#fff' },
    text: {
        primary: 'rgba(0, 0, 0, 0.87)',
        secondary: 'rgba(0, 0, 0, 0.54)',
        disabled: 'rgba(0, 0, 0, 0.38)',
        hint: 'rgba(0, 0, 0, 0.38)',
    },
};

export const MyTheme = createMuiTheme({
    palette: ThemeConfiguration,
});
