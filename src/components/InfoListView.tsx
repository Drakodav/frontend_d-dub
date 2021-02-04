import React, { useEffect, useMemo, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { Button, Card } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { getSearchType, getSearchResults, setSelectedStop, getSelectedStop } from '../store/reducers/searchInput';
import { GtfsHandler } from '../handler/gtfsHandler';
import { ApiDepartures, ApiResult, ApiStop } from '../model/api.model';
import { MapHandler } from '../handler/mapHandler';
import { getGeoObjFeature, getStopPointsFeature } from '../util/geo.util';

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
        },
        row: {
            borderRadius: '2px',
            width: '100%',
            height: '50px',
            textAlign: 'left',
            padding: '0px 20px 0px 20px',
            boxShadow: shadows[1],
            display: 'flex',
            placeContent: 'space-between',
        },
    }));

interface Props {
    className?: string;
}

export const InfoListView = (props: Props) => {
    const { className } = props;

    const classes = useStyles({})();
    const dispatch = useDispatch();

    const searchType = useSelector(getSearchType);
    const apiResult = useSelector(getSearchResults);
    const selectedStop = useSelector(getSelectedStop);

    const [infoList, setInfoList] = useState<ApiResult[]>([]);
    const [departureList, setDepartureList] = useState<ApiResult[]>([]);

    const gtfsHandler = useMemo(() => new GtfsHandler(searchType), [searchType]);

    const mapHandler = MapHandler.getInstance();
    const { infoView } = gtfsHandler.getObj();

    useEffect(() => {
        async function fetchRes() {
            if (infoView) {
                const value = apiResult[infoView[0].selector] as string;
                const infoResults = await gtfsHandler.fetchApiResults(value, infoView[0].query);
                setInfoList(() => infoResults);
                const newFeature = getStopPointsFeature(infoResults);
                mapHandler.setStopsFeature(newFeature);
            }
        }

        fetchRes();
    }, [apiResult, gtfsHandler, infoView, mapHandler]);

    useEffect(() => {
        async function fetchRes() {
            if (infoView && !!selectedStop) {
                const value = (selectedStop as any)[(infoView[1].selector as unknown) as any] as string;
                const departureResults = await gtfsHandler.fetchApiResults(value, infoView[1].query);
                setDepartureList(() => departureResults);
                console.log(departureResults);
            }
        }

        fetchRes();
    }, [selectedStop, gtfsHandler, infoView, mapHandler]);

    const onTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
        e.stopPropagation();
    };

    const handleItemClick = (stop: ApiStop) => {
        dispatch(setSelectedStop(stop));
    };

    const infoListElements = useMemo(
        () =>
            ((infoList as unknown) as ApiStop[]).map((item, i) => (
                <Button onClick={() => handleItemClick(item)} key={i}>
                    <Card className={classes.row}>
                        <p>{item.name}</p>
                        <p>{item.stop_sequence}</p>
                    </Card>
                </Button>
            )),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [infoList, classes.row]
    );

    const departureListElements = useMemo(
        () =>
            ((departureList as unknown) as ApiDepartures[]).map((item, i) => (
                <Button
                    key={i}
                    onClick={() => {
                        const newFeature = getGeoObjFeature((item as unknown) as any);
                        mapHandler.setStopsFeature(newFeature);
                    }}
                >
                    <Card className={classes.row}>
                        <p>{item.short_name}</p>
                        <p>{item.departure_time}</p>
                    </Card>
                </Button>
            )),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [departureList, classes.row]
    );

    return !!Object.keys(selectedStop).length ? (
        <>
            <Card className={`${classes.card} ${className}`} onTouchMove={onTouchMove}>
                {departureListElements}
            </Card>
            <Button
                variant='contained'
                color='primary'
                style={{ alignSelf: 'flex-end', width: '100%', borderRadius: '0px' }}
                onClick={() => dispatch(setSelectedStop({} as any))}
            >
                Back
            </Button>
        </>
    ) : (
        <Card className={`${classes.card} ${className}`} onTouchMove={onTouchMove}>
            {infoListElements}
        </Card>
    );
};

InfoListView.propTypes = {
    className: PropTypes.string,
};
