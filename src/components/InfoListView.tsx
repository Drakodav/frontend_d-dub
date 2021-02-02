import React, { useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { Card } from '@material-ui/core';
// import { useSelector } from 'react-redux';
// import { getSearchType, selectSearchResults } from '../store/reducers/searchInput';
// import { GtfsHandler } from '../handler/gtfsHandler';
// import { ApiResult } from '../model/api.model';

const useStyles = (state: {}) =>
    makeStyles(({ palette, shadows }) => ({
        card: {
            overflow: 'auto',
            WebkitOverflowScrolling: 'touch',
            msTouchAction: 'auto',
            touchAction: 'auto',
            backgroundColor: palette.common.white,
            margin: '0px 20px',
            padding: '5px 5px',
            borderRadius: '2px 2px 0px 0px',
            alignItems: 'center',
            boxShadow: shadows[4],
            height: '100%',
            width: '100%',
            flexDirection: 'column',
        },
    }));

interface Props {
    className?: string;
}

export const InfoListView = (props: Props) => {
    const { className } = props;
    const classes = useStyles({})();

    const ref = useRef<HTMLDivElement>(null);
    // const searchType = useSelector(getSearchType);
    // const gtfsHandler = useMemo(() => new GtfsHandler(searchType), [searchType]);

    // const { infoView } = gtfsHandler.getObj();

    // const apiResult: ApiResult = useSelector(selectSearchResults);

    // useEffect(() => {
    //     const fetchRes = async (val: string, query: string) => await gtfsHandler.fetchApiResults(val, query);

    //     if (infoView) {
    //         const value = apiResult[infoView.selector] as string;
    //         const infoResults = fetchRes(value, infoView.query);
    //         console.log(infoResults);
    //     }
    // }, [apiResult, gtfsHandler, infoView]);

    let list = [];
    for (let index = 0; index < 20; index++) {
        list.push('item');
    }

    const onTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
        e.stopPropagation();
    };

    return (
        <Card ref={ref} className={`${classes.card} ${className}`} onTouchMove={onTouchMove}>
            {list.map((item, i) => (
                <div style={{ width: '100%', height: '60px' }} key={i}>
                    {item} {i}
                </div>
            ))}
        </Card>
    );
};

InfoListView.propTypes = {
    className: PropTypes.string,
};
