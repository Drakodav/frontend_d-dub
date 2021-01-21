import { makeStyles } from '@material-ui/core';
import React, { useEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MapHandler } from '../handler/mapHandler';
import { ApiResult } from '../model/api.model';
import { selectApiResults } from '../store/reducers/apiQuery';
import { getMapDimensions, setMapDimensions } from '../store/reducers/map';
import { getGeoObjFeature } from '../util/geo.util';

interface StyleProps {
    height: number;
    width: number;
}

const useStyles = (props: StyleProps) =>
    makeStyles({
        map: {
            width: `${props.width}px`,
            height: `${props.height}px`,
        },
    });

export const MapWrapper = () => {
    const dispatch = useDispatch();
    const dim = useSelector(getMapDimensions);
    const classes = useStyles({ ...dim })();
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
        if (newFeature) mapHandler.setFeature(newFeature);
    }, [apiResult, mapHandler]);

    // used for dynamic map width and height resizing
    useEffect(() => {
        let timer: number | null;
        const handleResize = () => {
            timer && window.clearTimeout(timer);
            timer = window.setTimeout(() => {
                timer = null;
                dispatch(setMapDimensions());
            }, 100);
        };
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    });

    // resize map every time the window size changes
    useMemo(() => {
        mapHandler.setSize(dim.width, dim.height);
    }, [dim, mapHandler]);

    return <div ref={mapElement} className={classes.map}></div>;
};
