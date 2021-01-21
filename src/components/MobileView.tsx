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

    // update map height based on if open or not, also use timeout to fix visual bug
    const updateHeightOfMap = (newHeight: number) =>
        state.open
            ? dispatch(updateMapHeight({ hDisplacement: newHeight - heights.step }))
            : setTimeout(
                  () => dispatch(updateMapHeight({ hDisplacement: newHeight - heights.step })),
                  TRANSITION_DURATION
              );

    // track where the first touch was and the height difference to the bar
    const onTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
        const initY = e.touches[0].clientY;
        const diffHeight = window.innerHeight - initY - state.height;
        setState({ initY, diffHeight });
    };

    const onTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
        if (!!e && e.touches[0]) {
            const curr = e.touches[0].clientY;
            const { prevY, diffHeight, height } = state;
            if (!state.prevY) {
                // there needs to be a prev Y value in order to calculate direction
                setState({ prevY: curr, tranistionSpeed: 0 });
                return;
            }
            let prevState = state.prevState;
            let open = height > heights.min + heights.step;

            const direction = curr < prevY ? 1 : -1;
            const newHeight = window.innerHeight - curr - diffHeight;

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

        const { prevState, direction } = state;

        let height = prevState;
        let open = true;

        const breakpoints = [heights.min, heights.mid, heights.max];
        const currIdx = breakpoints.findIndex((value) => value === prevState);
        const nextIdx = currIdx + direction;

        // used to calculate whether the movement was far enough to justify switching breakpoint
        const barrier = prevState + heights.step * direction;
        const min = Math.min(prevState, barrier);
        const max = Math.max(prevState, barrier);
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
        if (height <= heights.mid) updateHeightOfMap(height);
    };

    // switcheroo on the menu tap icon
    const openCloseMenu = () => {
        const { open } = state;
        const newHeight = !open ? heights.max : heights.min;

        setState({
            open: !open,
            height: newHeight,
            prevY: 0,
            prevState: newHeight,
        });

        updateHeightOfMap(newHeight);
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
