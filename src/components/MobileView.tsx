import React, { useRef, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Container } from '@material-ui/core';
import { KeyboardArrowDown, KeyboardArrowUp } from '@material-ui/icons';
import { ApiSearchInput } from './ApiSearchInput';
import { ApiInputType } from '../model/api.model';
import { moveMap } from '../store/reducers/map';
import { useDispatch } from 'react-redux';
import { TRANSITION_DURATION } from '../model/constants';

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
        touchAction: 'none',
        [breakpoints.up('sm')]: {
            top: 0,
            left: 0,
            margin: '15px',
            width: '400px',
        },
    },
    pair: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
}));

const heights = {
    min: 60,
    mid: 350,
    max: 600,
    step: 50,
};

const initState = {
    open: false,
    height: heights.min,
    prevState: heights.min,
    prevY: 0,
    direction: 0,
    initY: 0,
    diffHeight: 0,
    tranistionSpeed: TRANSITION_DURATION,
};

type State = typeof initState | { [key: string]: unknown };

export function MobileView() {
    const dispatch = useDispatch();
    const classes = useStyles();
    const ref = useRef<HTMLDivElement>(null);

    const [state, tempState] = useState(initState);
    const setState = (val: State) => tempState({ ...state, ...val });

    const onTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
        const initY = e.touches[0].clientY;
        const diffHeight = window.innerHeight - initY - state.height;

        setState({ initY, diffHeight });
    };

    const onTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
        if (!!e && e.touches[0]) {
            const curr = e.touches[0].clientY;
            if (!state.prevY) {
                // there needs to be a prev Y value in order to calculate direction
                setState({ prevY: curr, tranistionSpeed: 0 });
                return;
            }
            let open = state.height > heights.min + heights.step;

            const direction = curr < state.prevY ? 1 : -1;
            const newHeight = window.innerHeight - curr - state.diffHeight;

            if (newHeight >= heights.min - heights.step && newHeight <= heights.max + heights.step)
                setState({ height: newHeight, prevY: curr, direction, open });
        }
    };

    const onTouchEnd = () => {
        // if there is no previous Y touch then it was just a tap/click, dont switch
        if (!state.prevY) return;

        let height = state.prevState;

        const breakpoints = [heights.min, heights.mid, heights.max];
        const currIdx = breakpoints.findIndex((value) => value === state.prevState);
        const nextIdx = currIdx + state.direction;

        // used to calculate whether the movement was far enough to justify switching breakpoint
        const barrier = state.prevState + heights.step * state.direction;
        const min = Math.min(state.prevState, barrier);
        const max = Math.max(state.prevState, barrier);
        const withinBarrier = state.height > min && state.height < max;

        if (nextIdx >= 0 && nextIdx < breakpoints.length && !withinBarrier) {
            height = breakpoints[nextIdx];
        }

        let open = true;
        if (height <= heights.min + 5) open = false;

        setState({ prevY: 0, open, height, prevState: height, initY: 0, tranistionSpeed: initState.tranistionSpeed });

        if (height === heights.mid || height === heights.min) dispatch(moveMap({ barHeight: height - heights.step }));
    };

    const openCloseMenu = () => {
        const newHeight = !state.open ? heights.max : heights.min;
        setState({ open: !state.open, height: newHeight, prevY: 0, prevState: newHeight });
    };

    return (
        <Container
            ref={ref}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            maxWidth='sm'
            className={classes.container}
            style={{
                height: state.height,
                flexDirection: !state.open ? 'row' : 'column',
                transition: `height ${state.tranistionSpeed}ms`,
            }}
        >
            <div className={classes.pair}>
                {!state.open ? (
                    <KeyboardArrowUp onClick={openCloseMenu} />
                ) : (
                    <KeyboardArrowDown onClick={openCloseMenu} />
                )}
                <p> click to expand </p>
            </div>
            <ApiSearchInput disabled={!state.open} heading={'Bus Route'} query={ApiInputType.route} />
            <ApiSearchInput disabled={!state.open} heading={'Bus Stop'} query={ApiInputType.stop} />
        </Container>
    );
}