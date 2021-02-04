import React, { useEffect, useMemo, useRef, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { Card } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { getSearchType, selectSearchResults } from '../store/reducers/searchInput';
import { GtfsHandler } from '../handler/gtfsHandler';
import { ApiResult } from '../model/api.model';

const useStyles = (state: {}) =>
    makeStyles(({ palette, shadows }) => ({
        card: {
            overflow: 'auto',
            WebkitOverflowScrolling: 'touch',
            msTouchAction: 'auto',
            touchAction: 'auto',
            backgroundColor: palette.common.white,
            padding: '5px 5px',
            borderRadius: '2px 2px 0px 0px',
            alignItems: 'center',
            borderTopStyle: 'solid',
            borderTopColor: palette.secondary.dark,
            height: '100%',
            width: '100%',
            display: 'grid',
        },
        row: {
            margin: '2px auto',
            borderRadius: '2px',
            width: '95%',
            height: '60px',
            padding: '10px 0px 0px 5px',
            boxShadow: shadows[1],
        },
    }));

interface Props {
    className?: string;
}

export const InfoListView = (props: Props) => {
    const { className } = props;
    const classes = useStyles({})();

    const [infoList, setInfoList] = useState<ApiResult[]>([]);

    const ref = useRef<HTMLDivElement>(null);
    const searchType = useSelector(getSearchType);
    const gtfsHandler = useMemo(() => new GtfsHandler(searchType), [searchType]);

    const { infoView } = gtfsHandler.getObj();

    const apiResult: ApiResult = useSelector(selectSearchResults);

    useEffect(() => {
        async function fetchRes() {
            if (infoView) {
                const value = apiResult[infoView.selector] as string;
                const infoResults = await gtfsHandler.fetchApiResults(value, infoView.query);
                setInfoList(() => infoResults);
            }
        }

        fetchRes();
    }, [apiResult, gtfsHandler, infoView]);

    const infoListElements = useMemo(
        () =>
            infoList.map((item, i) => (
                <Card className={classes.row} key={i}>
                    {item?.stop_sequence} {item?.name}
                </Card>
            )),
        [infoList, classes.row]
    );

    const onTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
        e.stopPropagation();
    };

    return (
        <Card ref={ref} className={`${classes.card} ${className}`} onTouchMove={onTouchMove}>
            {infoListElements}
        </Card>
    );
};

InfoListView.propTypes = {
    className: PropTypes.string,
};
