import './App.css';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { MapWrapper } from './components/MapWrapper';
import { MobileView } from './components/MobileView';
import { getWindowDimensions } from './store/reducers/map';
import { useTheme } from '@material-ui/core/styles';
import { DesktopView } from './components/DesktopView';

function App() {
    const [view, setView] = useState(0);

    const theme = useTheme();
    const { windowWidth } = useSelector(getWindowDimensions);
    useEffect(() => {
        if (windowWidth <= theme.breakpoints.width('sm')) {
            setView(-1);
        } else {
            setView(1);
        }
    }, [windowWidth, theme.breakpoints]);

    const dynComponent: JSX.Element = view === -1 ? <MobileView /> : <DesktopView />;

    return (
        <div>
            {dynComponent}
            <MapWrapper />
        </div>
    );
}

export default App;
