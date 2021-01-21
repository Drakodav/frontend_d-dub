import React, { useEffect, useRef, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Container } from '@material-ui/core';
import { KeyboardArrowUp } from '@material-ui/icons';
import { ApiSearchInput } from './ApiSearchInput';
import { ApiInputType } from '../model/api.model';
import { updateMapHeight } from '../store/reducers/map';
import { useDispatch } from 'react-redux';
import { TRANSITION_DURATION } from '../model/constants';

const useStyles = (state: typeof initState) =>
    makeStyles(({ palette }) => ({
        container: {
            position: 'fixed',
            backgroundColor: palette.common.white,
            padding: '10px',
            bottom: 0,
            left: 0,
            zIndex: 1,
            borderRadius: '10px',
            display: 'flex',
            flex: 2,
            alignItems: 'center',
            justifyContent: 'flex-start',
            touchAction: 'none',
            height: state.height,
            flexDirection: !state.open ? 'column' : 'column',
            transition: `height ${state.tranistionSpeed}ms`,
        },
        arrow: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            transform: state.open ? 'rotateX(540deg)' : 'none',
            transition: `transform ${TRANSITION_DURATION}ms`,
        },
    }));

const heights = {
    min: 60 as number,
    mid: 350 as number,
    max: 600 as number,
    step: 50 as number,
} as const;

const initState = {
    open: false as boolean,
    height: heights.min as number,
    prevState: heights.min as number,
    prevY: 0 as number,
    direction: 0 as number,
    initY: 0 as number,
    diffHeight: 0 as number,
    tranistionSpeed: TRANSITION_DURATION as number,
} as const;

type State = typeof initState | { [key: string]: unknown };

export function MobileView() {
    const dispatch = useDispatch();
    const ref = useRef<HTMLDivElement>(null);

    const [state, tempState] = useState(initState);
    const setState = (val: State) => tempState({ ...state, ...val });

    const classes = useStyles(state)();

    // componentWillUnmount
    useEffect(() => {
        return () => {
            dispatch(updateMapHeight({ hDisplacement: 0 }));
        };
    }, [dispatch]);

    // track where the first touch was and the height difference to the bar
    const onTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
        const initY = e.touches[0].clientY;
        const diffHeight = window.innerHeight - initY - state.height;
        setState({ initY, diffHeight });
    };

    const onTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
        if (!!e && e.touches[0] && ref?.current === e.target) {
            const curr = e.touches[0].clientY;
            if (!state.prevY) {
                // there needs to be a prev Y value in order to calculate direction
                setState({ prevY: curr, tranistionSpeed: 0 });
                return;
            }
            let prevState = state.prevState;
            let open = state.height > heights.min + heights.step;

            const direction = curr < state.prevY ? 1 : -1;
            const newHeight = window.innerHeight - curr - state.diffHeight;

            // if curr touch passes through middle then we can reach the further breakpoint
            if (newHeight > heights.mid - heights.step && newHeight < heights.mid + heights.step)
                prevState = heights.mid;

            // set the new height if it is within the boundary
            if (newHeight >= heights.min - heights.step && newHeight <= heights.max + heights.step)
                setState({ height: newHeight, prevY: curr, direction, open, prevState });
        }
    };

    const onTouchEnd = () => {
        // if there is no previous Y touch then it was just a tap/click, dont switch
        if (!state.prevY) return;

        let height = state.prevState;
        let open = true;

        const breakpoints = [heights.min, heights.mid, heights.max];
        const currIdx = breakpoints.findIndex((value) => value === state.prevState);
        const nextIdx = currIdx + state.direction;

        // used to calculate whether the movement was far enough to justify switching breakpoint
        const barrier = state.prevState + heights.step * state.direction;
        const min = Math.min(state.prevState, barrier);
        const max = Math.max(state.prevState, barrier);
        const withinBarrier = state.height > min && state.height < max;

        // if a breakpoint is available and we dragged enough to not be a misclick
        if (nextIdx >= 0 && nextIdx < breakpoints.length && !withinBarrier) {
            height = breakpoints[nextIdx];
        }

        // if height is on min then bar is closed
        if (height === heights.min) open = false;

        // set the state of the bar, where it is, and transition speed
        setState({ prevY: 0, open, height, prevState: height, initY: 0, tranistionSpeed: initState.tranistionSpeed });

        // update the map height along with the bar height
        dispatch(updateMapHeight({ hDisplacement: height - heights.step }));
    };

    // switcheroo on the menu tap icon
    const openCloseMenu = () => {
        const newHeight = !state.open ? heights.max : heights.min;
        setState({ open: !state.open, height: newHeight, prevY: 0, prevState: newHeight });
        dispatch(updateMapHeight({ hDisplacement: newHeight - heights.step }));
    };

    return (
        <Container
            ref={ref}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            maxWidth='sm'
            className={classes.container}
        >
            <KeyboardArrowUp onClick={openCloseMenu} className={classes.arrow} />
            <ApiSearchInput disabled={!state.open} heading={'Bus Route'} query={ApiInputType.route} />
            <ApiSearchInput disabled={!state.open} heading={'Bus Stop'} query={ApiInputType.stop} />
        </Container>
    );
}
