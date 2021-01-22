import { IconButton, makeStyles } from '@material-ui/core';
import React, { useEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MapHandler } from '../handler/mapHandler';
import { ApiResult } from '../model/api.model';
import { selectApiResults } from '../store/reducers/apiQuery';
import { getMapDimensions, getWindowDimensions, setWindowDimensions } from '../store/reducers/map';
import { getGeoObjFeature } from '../util/geo.util';
import { TRANSITION_DURATION } from '../model/constants';
import GpsNotFixedRoundedIcon from '@material-ui/icons/GpsNotFixedRounded';

interface StyleProps {
    windowWidth: number;
    windowHeight: number;
}

const useStyles = (props: StyleProps) =>
    makeStyles(({ palette }) => ({
        map: {
            width: `${props.windowWidth}px`,
            height: `${props.windowHeight}px`,
        },
        iconButton: {
            width: '45px',
            height: '45px',
            zIndex: 1,
            position: 'fixed',
            right: 15,
            bottom: 75,
            borderRadius: '50%',
            backgroundColor: palette.common.white,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            transition: `auto ${TRANSITION_DURATION}ms`,
            '&:hover': {
                backgroundColor: palette.common.white,
            },
        },
    }));

export const MapWrapper = () => {
    const dispatch = useDispatch();
    const windowDim = useSelector(getWindowDimensions);
    const classes = useStyles({ ...windowDim })();
    const mapElement = useRef() as React.MutableRefObject<HTMLDivElement>;
    const mapHandler = useMemo(() => new MapHandler(mapElement), []);

    // run once, init ol map
    useEffect(() => {
        mapHandler.init();
    }, [mapHandler]);

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

    return (
        <>
            <IconButton className={classes.iconButton} onClick={gpsClick}>
                <GpsNotFixedRoundedIcon />
            </IconButton>
            <div ref={mapElement} className={classes.map} />
        </>
    );
};
