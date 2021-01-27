import React, { useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { Card } from '@material-ui/core';

const useStyles = (state: {}) =>
    makeStyles(({ palette, shadows }) => ({
        card: {
            overflowY: 'auto',
            WebkitOverflowScrolling: 'touch',
            backgroundColor: palette.common.white,
            margin: '0px 20px',
            padding: '5px 5px',
            borderRadius: '10px 10px 0px 0px',
            alignItems: 'center',
            touchAction: 'none',
            boxShadow: shadows[4],
            height: '1600px',
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

    let list = [];
    for (let index = 0; index < 20; index++) {
        list.push('item');
    }

    const onTouchMove = (e: any) => {
        console.log(e);
        if (ref?.current) {
            ref.current.scrollBy({ top: 5 });
        }
    };

    const onScroll = (e: any) => {
        console.log(e);
    };

    return (
        //
        <Card ref={ref} className={`${classes.card} ${className}`} onTouchMove={onTouchMove} onScroll={onScroll}>
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
