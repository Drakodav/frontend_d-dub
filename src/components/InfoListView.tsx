import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Card } from '@material-ui/core';
import { TRANSITION_DURATION } from '../model/constants';

const useStyles = (state: {}) =>
    makeStyles(({ palette, shadows }) => ({
        card: {
            overflow: 'visible',
            backgroundColor: palette.common.white,
            margin: '0px 20px',
            padding: '5px 5px',
            borderRadius: '10px',
            display: 'flex',
            flex: 2,
            alignItems: 'center',
            justifyContent: 'flex-start',
            touchAction: 'none',
            boxShadow: shadows[4],
            height: '600px',
            width: '100%',
            flexDirection: 'column',
            transition: `height ${TRANSITION_DURATION}ms`,
        },
    }));

interface Props {}

export const InfoListView = (props: Props) => {
    const classes = useStyles({})();

    const list = ['item', 'item', 'item', 'item', 'item', 'item', 'item', 'item', 'item', 'item'];

    return (
        //
        <Card className={classes.card}>
            {list.map((item, i) => (
                <div style={{ width: '100%', height: '60px' }}>
                    {item} {i}
                </div>
            ))}
        </Card>
    );
};
