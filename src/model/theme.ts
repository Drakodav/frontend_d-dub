import createMuiTheme from '@material-ui/core/styles/createMuiTheme';

export const ThemeConfiguration = {
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
};

export const MyTheme = createMuiTheme({
    palette: ThemeConfiguration,
});
