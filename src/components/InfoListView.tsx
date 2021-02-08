import React, { useEffect, useMemo, useState, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { Button, Card, Fade } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { getSearchType, setSelectedStop, getSelectedStop, getSelectedTrip } from '../store/reducers/searchInput';
import { GtfsHandler } from '../handler/gtfsHandler';
import { ApiDeparture, ApiNaming, ApiResult, ApiStop } from '../model/api.model';
import { MapHandler } from '../handler/mapHandler';
import { getGeoObjFeature, getStopPointsFeature } from '../util/geo.util';
import { MapFeatureTypes } from '../model/constants';

const useStyles = (state: {}) =>
    makeStyles(({ palette, shadows }) => ({
        card: {
            overflow: 'auto',
            WebkitOverflowScrolling: 'touch',
            msTouchAction: 'auto',
            touchAction: 'auto',
            backgroundColor: palette.common.white,
            borderRadius: '2px 2px 0px 0px',
            alignItems: 'center',
            borderTopStyle: 'solid',
            borderTopColor: palette.secondary.dark,
            height: '100%',
            width: '100%',
            display: 'grid',
            alignContent: ' flex-start',
        },
        row: {
            width: '100%',
            height: '50px',
            textAlign: 'left',
            padding: '0px 20px 0px 20px',
            border: 'none',
            borderRadius: '0px',
            boxShadow: shadows[1],
            display: 'flex',
            placeContent: 'space-between',
        },
        rowButton: {
            border: 'none',
            borderRadius: '0px',
            padding: '0.4px 0px',
        },
    }));

interface Props {
    className?: string;
}

export const InfoListView = (props: Props) => {
    const { className } = props;

    const dispatch = useDispatch();
    const ref = useRef() as React.MutableRefObject<HTMLDivElement>;

    const searchType = useSelector(getSearchType);
    const selectedTrip = useSelector(getSelectedTrip);
    const selectedStop = useSelector(getSelectedStop);

    const classes = useStyles({})();
    const [infoList, setInfoList] = useState<ApiStop[]>([]);
    const [departureList, setDepartureList] = useState<ApiDeparture[]>([]);

    const gtfsHandler = useMemo(() => new GtfsHandler(searchType), [searchType]);

    const mapHandler = MapHandler.getInstance();
    const { queries } = gtfsHandler.getObj();

    useEffect(() => {
        async function fetchRes() {
            if (queries && Object.keys(selectedTrip).length && searchType === ApiNaming.route) {
                const value = selectedTrip[queries[1].selector] as string;
                const stopsList = (await gtfsHandler.fetchApiResults(value, queries[1].query)) as ApiStop[];
                setInfoList(() => stopsList);
                const newFeature = getStopPointsFeature(stopsList);
                mapHandler.setFeature(newFeature, MapFeatureTypes.StopsFeature);
            }
        }
        fetchRes();
    }, [selectedTrip, gtfsHandler, queries, mapHandler, searchType]);

    useEffect(() => {
        async function fetchRes() {
            if (queries && Object.keys(selectedStop).length) {
                const id = searchType === ApiNaming.route ? 2 : 0;
                const value = (selectedStop as ApiResult)[queries[id].selector] as string;
                const departureResults = await gtfsHandler.fetchApiResults(value, queries[id].query);
                setDepartureList(() => departureResults as ApiDeparture[]);
            }
        }
        fetchRes();

        const interval = setInterval(() => {
            fetchRes();
        }, 1000 * 30);

        return () => clearInterval(interval);
    }, [selectedStop, gtfsHandler, queries, mapHandler, searchType]);

    const onTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
        e.stopPropagation();
    };

    const handleItemClick = (stop: ApiStop) => {
        dispatch(setSelectedStop(stop));
        ref.current?.scroll({ top: 0 });
    };

    const infoListElements = useMemo(
        () =>
            infoList.map((item, i) => (
                <Button className={classes.rowButton} onClick={() => handleItemClick(item)} key={i}>
                    <Card className={classes.row}>
                        <p>{item.name}</p>
                        <p>{i + 1}</p>
                    </Card>
                </Button>
            )),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [infoList, classes.row]
    );

    const departureListElements = useMemo(
        () =>
            departureList.map((item, i) => (
                <Button
                    key={i}
                    className={classes.rowButton}
                    onClick={() => {
                        const newFeature = getGeoObjFeature((item as unknown) as any);
                        mapHandler.setFeature(newFeature, MapFeatureTypes.ExtraTripFeature);
                    }}
                >
                    <Card className={classes.row}>
                        <p>{item.short_name}</p>
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                placeContent: 'space-around',
                                lineHeight: '0px',
                            }}
                        >
                            <p>due in {item.departure_time}</p>
                            {item.time_delta && (
                                <p style={{ fontSize: '8px' }}>realtime {item.time_delta.arrival / 60}</p>
                            )}
                        </div>
                    </Card>
                </Button>
            )),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [departureList, classes.row]
    );

    let component: JSX.Element;
    const departureView: boolean = !!Object.keys(selectedStop).length;
    switch (searchType) {
        case ApiNaming.route:
            component = (
                <>
                    <Fade in={departureView} mountOnEnter unmountOnExit>
                        <>
                            <Card ref={ref} className={`${classes.card} ${className}`} onTouchMove={onTouchMove}>
                                <Button className={classes.rowButton} key={-1}>
                                    <Card className={classes.row} style={{ placeContent: 'center' }}>
                                        <p>{selectedStop.name}</p>
                                    </Card>
                                </Button>
                                {departureListElements ?? <p>No Live Departures available</p>}
                            </Card>
                            <Button
                                variant='contained'
                                color='primary'
                                style={{ alignSelf: 'flex-end', width: '100%', borderRadius: '0px', height: '60px' }}
                                onClick={() => dispatch(setSelectedStop({} as any))}
                            >
                                Back
                            </Button>
                        </>
                    </Fade>
                    <Fade in={!departureView} mountOnEnter unmountOnExit>
                        <Card ref={ref} className={`${classes.card} ${className}`} onTouchMove={onTouchMove}>
                            {infoListElements}
                        </Card>
                    </Fade>
                </>
            );

            break;

        case ApiNaming.stop:
            component = (
                <Fade in={departureView} mountOnEnter unmountOnExit>
                    <Card ref={ref} className={`${classes.card} ${className}`} onTouchMove={onTouchMove}>
                        <Button className={classes.rowButton} key={-1}>
                            <Card className={classes.row} style={{ placeContent: 'center' }}>
                                <p>{selectedStop.name}</p>
                            </Card>
                        </Button>
                        {departureListElements ?? <p>No Live Departures available</p>}
                    </Card>
                </Fade>
            );
            break;
    }

    return component;
};

InfoListView.propTypes = {
    className: PropTypes.string,
};
