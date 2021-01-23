import { IconButton, makeStyles } from '@material-ui/core';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MapHandler } from '../handler/mapHandler';
import { ApiResult } from '../model/api.model';
import { selectApiResults } from '../store/reducers/apiQuery';
import { getControlsVisible, getMapDimensions, getWindowDimensions, setWindowDimensions } from '../store/reducers/map';
import { getGeoObjFeature } from '../util/geo.util';
import { TRANSITION_DURATION } from '../model/constants';
import GpsNotFixedRoundedIcon from '@material-ui/icons/GpsNotFixedRounded';
import ExploreRoundedIcon from '@material-ui/icons/ExploreRounded';
import { ObjectEvent } from 'ol/Object';
import View from 'ol/View';

interface StyleProps {
    windowWidth: number;
    windowHeight: number;
    visible: boolean;
    rotated: boolean;
}

const useStyles = (props: StyleProps) =>
    makeStyles(({ palette }) => ({
        map: {
            width: `${props.windowWidth}px`,
            height: `${props.windowHeight}px`,
        },
        gps: {
            right: 15,
            bottom: 75,
            opacity: props.visible ? '1' : '0',
        },
        rotation: {
            right: 15,
            bottom: 145,
            opacity: props.visible && props.rotated ? '1' : '0',
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
            alignItems: 'center',
            transition: `opacity ${TRANSITION_DURATION}ms`,
            '&:hover': {
                backgroundColor: palette.common.white,
            },
            '& span svg': {
                width: '100%',
                height: '100%',
            },
        },
    }));

export const MapWrapper = () => {
    const dispatch = useDispatch();
    const windowDim = useSelector(getWindowDimensions);
    const visible = useSelector(getControlsVisible);
    const [rotated, setRotation] = useState(false);

    const mapElement = useRef() as React.MutableRefObject<HTMLDivElement>;
    const mapHandler = useMemo(() => new MapHandler(mapElement), []);

    const classes = useStyles({ ...windowDim, visible, rotated })();

    // run once, init ol map
    useEffect(() => {
        mapHandler.init();
    }, [mapHandler]);

    // define callbacks that require react state to take action upon
    useEffect(() => {
        const mapCallbacks = {
            rotation: (e: ObjectEvent) => {
                const mapRotated = (e.target as View).getRotation() === 0 ? false : true;
                if (rotated !== mapRotated) setRotation(() => mapRotated);
            },
        };
        mapHandler.setMapCallbacks(mapCallbacks);
    }, [mapHandler, rotated]);

    // update whats displayed on the map when a new apiResult comes in
    const apiResult: ApiResult = useSelector(selectApiResults);
    useEffect(() => {
        const newFeature = !!apiResult && getGeoObjFeature(apiResult);
        if (newFeature) mapHandler.setApiFeature(newFeature);
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

    // resize map every time the window size changes
    const mapDim = useSelector(getMapDimensions);
    useEffect(() => {
        mapHandler.setSize(mapDim.width, mapDim.height);
    }, [mapDim, mapHandler]);

    const gpsClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        mapHandler.gpsClick();
    };

    const rotationClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        mapHandler.resetRotation();
    };

    return (
        <>
            <IconButton className={`${classes.iconButton} ${classes.rotation}`} onClick={rotationClick}>
                <ExploreRoundedIcon />
            </IconButton>

            <IconButton className={`${classes.iconButton} ${classes.gps}`} onClick={gpsClick}>
                <GpsNotFixedRoundedIcon />
            </IconButton>

            <div ref={mapElement} className={classes.map} />
        </>
    );
};
