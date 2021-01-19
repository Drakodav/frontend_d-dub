import React, { useRef, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Container } from '@material-ui/core';
import { KeyboardArrowUp } from '@material-ui/icons';
import { ApiSearchInput } from './ApiSearchInput';
import { ApiInputType } from '../model/api.model';

const useStyles = makeStyles(({ palette, breakpoints }) => ({
    container: {
        position: 'fixed',
        backgroundColor: palette.common.white,
        padding: '10px',
        bottom: 0,
        left: 0,
        zIndex: 1,
        borderRadius: '5px',
        display: 'flex',
        flex: 2,
        alignItems: 'center',
        justifyContent: 'flex-start',
        [breakpoints.up('sm')]: {
            top: 0,
            left: 0,
            margin: '15px',
            width: '400px',
        },
    },
}));

const heights = {
    min: 60,
    mid: 350,
    max: 600,
};

const initState = {
    open: false,
    height: heights.min,
    prevState: heights.min,
    prevY: 0,
    direction: 0,
};

type State = typeof initState | { [key: string]: unknown };

export function UIWrapper() {
    const classes = useStyles();
    const ref = useRef<HTMLDivElement>(null);

    const [state, tempState] = useState(initState);
    const setState = (val: State) => tempState({ ...state, ...val });

    const onTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
        if (!!e && e.touches[0]) {
            const curr = e.touches[0].pageY;
            if (!state.prevY) {
                setState({ prevY: curr });
                return;
            }

            const direction = curr < state.prevY ? 1 : -1;
            const newHieght = state.height + 2 * direction;

            if (newHieght >= heights.min && newHieght <= heights.max)
                setState({ height: newHieght, prevY: curr, direction });
        }
    };

    const onTouchEnd = () => {
        if (!state.prevY) return;

        const breakpoints = [heights.min, heights.mid, heights.max];

        const currIdx = breakpoints.findIndex((value) => value === state.prevState);
        let nextIdx = currIdx + state.direction;
        let height = state.height;
        if (nextIdx >= 0 && nextIdx < breakpoints.length) {
            height = breakpoints[nextIdx];
        }

        let open = true;
        if (height <= heights.min + 5) open = false;

        setState({ prevY: 0, open, height, prevState: height });
    };

    return (
        <Container
            ref={ref}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            maxWidth='sm'
            className={classes.container}
            style={{ height: state.height, flexDirection: !state.open ? 'row' : 'column' }}
        >
            {!state.open ? (
                <>
                    <KeyboardArrowUp
                        onClick={() => setState({ open: true, height: heights.max, prevY: 0, prevState: heights.max })}
                    />
                    <p> click to expand </p>
                </>
            ) : (
                <>
                    <ApiSearchInput heading={'Bus Route'} query={ApiInputType.route} />
                    <ApiSearchInput heading={'Bus Stop'} query={ApiInputType.stop} />
                </>
            )}
        </Container>
    );
}
