import React, { useEffect, useMemo, useRef, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { Button, Card } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { getSearchType, getSearchResults, setSelectedStop, getSelectedStop } from '../store/reducers/searchInput';
import { GtfsHandler } from '../handler/gtfsHandler';
import { ApiResult, ApiStop } from '../model/api.model';
import { MapHandler } from '../handler/mapHandler';
import { getStopPointsFeature } from '../util/geo.util';

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
            padding: '10px 0px 0px 20px',
            boxShadow: shadows[1],
        },
    }));

interface Props {
    className?: string;
}

export const InfoListView = (props: Props) => {
    const { className } = props;

    const classes = useStyles({})();
    const dispatch = useDispatch();
    const ref = useRef<HTMLDivElement>(null);

    const searchType = useSelector(getSearchType);
    const apiResult = useSelector(getSearchResults);
    const selectedStop = useSelector(getSelectedStop);

    const [infoList, setInfoList] = useState<ApiResult[]>([]);

    const gtfsHandler = useMemo(() => new GtfsHandler(searchType), [searchType]);

    const mapHandler = MapHandler.getInstance();
    const { infoView } = gtfsHandler.getObj();

    useEffect(() => {
        async function fetchRes() {
            if (infoView) {
                const value = apiResult[infoView.selector] as string;
                const infoResults = await gtfsHandler.fetchApiResults(value, infoView.query);
                setInfoList(() => infoResults);
                const newFeature = getStopPointsFeature(infoResults);
                mapHandler.setStopsFeature(newFeature);
            }
        }

        fetchRes();
    }, [apiResult, gtfsHandler, infoView, mapHandler]);

    const onTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
        e.stopPropagation();
    };

    const handleItemClick = (stop: ApiStop) => {
        dispatch(setSelectedStop(stop));
    };

    const infoListElements = useMemo(
        () =>
            ((infoList as unknown) as ApiStop[]).map((item, i) => (
                <Button onClick={() => handleItemClick(item)}>
                    <Card className={classes.row} key={i}>
                        {item.stop_sequence} {item.name}
                    </Card>
                </Button>
            )),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [infoList, classes.row]
    );

    return !!Object.keys(selectedStop).length ? (
        <Card ref={ref} className={`${classes.card} ${className}`} onTouchMove={onTouchMove}>
            <Button onClick={() => dispatch(setSelectedStop(undefined as any))}>back</Button>
            {selectedStop.name}
        </Card>
    ) : (
        <Card ref={ref} className={`${classes.card} ${className}`} onTouchMove={onTouchMove}>
            {infoListElements}
        </Card>
    );
};

InfoListView.propTypes = {
    className: PropTypes.string,
};
