import { Button, Card, IconButton, makeStyles } from '@material-ui/core';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MapHandler } from '../handler/mapHandler';
import { ApiResult } from '../model/api.model';
import { getSearchResults } from '../store/reducers/searchInput';
import { getControlsVisible, getMapDimensions, getWindowDimensions, setWindowDimensions } from '../store/reducers/map';
import { TRANSITION_DURATION } from '../model/constants';
import { GpsFixedRounded, GpsOffRounded, GpsNotFixedRounded, ExploreRounded } from '@material-ui/icons';
import AlertDialog from './AlertDialog';

interface StyleProps {
    windowWidth: number;
    windowHeight: number;
    visible: boolean;
    rotated: boolean;
    location: string;
    offset: number;
}

const makeGpsIcon = (truthy: boolean) => ({
    opacity: truthy ? '1' : '0',
    transform: truthy ? 'rotate(180deg)' : 'rotate(0deg)',
    width: truthy ? '80%' : '0',
    height: truthy ? '80%' : '0',
    transition: `all ${TRANSITION_DURATION}ms`,
});

const useStyles = (props: StyleProps) =>
    makeStyles(({ palette, shadows }) => ({
        map: {
            width: `${props.windowWidth}px`,
            height: `${props.windowHeight}px`,
        },
        gps: {
            right: 15,
            bottom: props.offset + 75,
            opacity: props.visible ? '1' : '0',
            visibility: props.visible ? 'visible' : 'hidden',
        },
        rotation: {
            right: 15,
            bottom: props.offset + 145,
            opacity: props.visible && props.rotated ? '1' : '0',
            visibility: props.visible && props.rotated ? 'visible' : 'hidden',

            '& span svg': {
                width: '80%',
                height: '80%',
                transition: `all ${TRANSITION_DURATION}ms`,
            },
        },
        iconButton: {
            width: '50px',
            height: '50px',
            zIndex: 1,
            position: 'fixed',
            borderRadius: '50%',
            color: palette.primary.dark,
            backgroundColor: palette.common.white,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            padding: '8px',
            boxShadow: shadows[4],
            alignItems: 'center',
            transition: `all ${TRANSITION_DURATION}ms`,
            '&:hover': {
                backgroundColor: palette.common.white,
            },
        },
        gpsGranted: makeGpsIcon(props.location === 'granted'),
        gpsPrompted: makeGpsIcon(props.location === 'prompt'),
        gpsDenied: makeGpsIcon(props.location === 'denied'),
        popup: {
            display: 'flex',
            flex: '1',
            padding: '5px',
            flexDirection: 'row',
            fontSize: '12px',
            maxWidth: `${props.windowWidth / 3}px`,
        },
        close_button: {
            alignSelf: 'flex-start',
            padding: '0px 5px',
            justifyContent: 'flex-start',
            minWidth: 'auto',
        },
    }));

export const MapWrapper = () => {
    const dispatch = useDispatch();
    const windowDim = useSelector(getWindowDimensions);
    const visible = useSelector(getControlsVisible);
    const mapDim = useSelector(getMapDimensions);

    const [rotated, setRotation] = useState(false);
    const [locationPermission, setLocationPermission] = useState('denied');
    const [alertOpen, setAlertOpen] = useState(false);

    const offset = windowDim.windowHeight - mapDim.height;
    const classes = useStyles({ ...windowDim, visible, rotated, location: locationPermission, offset })();

    const mapElement = useRef() as React.MutableRefObject<HTMLDivElement>;
    const mapPopup = useRef() as React.MutableRefObject<HTMLDivElement>;

    const mapHandler: MapHandler = useMemo(() => {
        return MapHandler.getInstance();
    }, []);

    // run once, init ol map
    useEffect(() => {
        const mapCallbacks = {
            setRotation: setRotation,
            setLocation: setLocationPermission,
            dispatch: dispatch,
        };
        mapHandler.init(mapElement, mapPopup, mapCallbacks);
    }, [mapHandler, dispatch]);

    // resize map every time the window size changes
    useEffect(() => {
        mapHandler.setSize(mapDim.width, mapDim.height);
    }, [mapDim, mapHandler]);

    useEffect(() => {
        if (locationPermission === 'granted') {
            mapHandler.enableLocation();
        } else {
            mapHandler.disableLocation();
        }

        return mapHandler.disableLocation;
    }, [mapHandler, locationPermission]);

    // If there is no apiResult then there should also be no features displayed on the map
    const apiResult: ApiResult = useSelector(getSearchResults);
    useEffect(() => {
        if (!Object.keys(apiResult).length) {
            mapHandler.resetFeaturesLayer();
            return;
        }
    }, [apiResult, mapHandler]);

    // used for dynamic map width and height resizing
    useEffect(() => {
        let timer: number | null;
        const handleResize = () => {
            timer && window.clearTimeout(timer);
            timer = window.setTimeout(() => {
                timer = null;
                dispatch(setWindowDimensions());
            }, 100);
        };
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    });

    const gpsClick = async () => {
        const permission = await navigator?.permissions
            ?.query({ name: 'geolocation' })
            .then((result: PermissionStatus) => result.state);

        if (!!permission) {
            setLocationPermission(permission);
            mapHandler.gotoCurrentPosition();
            if (permission !== 'granted') setAlertOpen(true);
        } else {
            mapHandler.getCurrentPosition(undefined, () => locationPermission !== 'granted' && setAlertOpen(true));
        }
    };

    return (
        <>
            <IconButton className={`${classes.iconButton} ${classes.rotation}`} onClick={mapHandler.resetRotation}>
                <ExploreRounded />
            </IconButton>

            <IconButton className={`${classes.iconButton} ${classes.gps}`} onClick={gpsClick}>
                <GpsFixedRounded className={classes.gpsGranted} />
                <GpsNotFixedRounded className={classes.gpsPrompted} />
                <GpsOffRounded className={classes.gpsDenied} />
            </IconButton>

            <AlertDialog
                open={alertOpen}
                handleClose={() => {
                    setAlertOpen(false);
                    setTimeout(() => {
                        mapHandler.enableLocation();
                        mapHandler.getCurrentPosition();
                    }, 500);
                }}
            />

            <div ref={mapElement} className={classes.map} />
            <Card ref={mapPopup} className={classes.popup}>
                <Button id='popup-content' style={{ fontSize: '12px' }}>
                    Stop
                </Button>
                <Button id='popup-close' className={classes.close_button}>
                    X
                </Button>
            </Card>
        </>
    );
};
