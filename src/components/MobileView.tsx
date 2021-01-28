import React, { useEffect, useRef, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Container, IconButton, Typography } from '@material-ui/core';
import { KeyboardArrowUp } from '@material-ui/icons';
import { ApiSearchInput } from './ApiSearchInput';
import { getWindowDimensions, updateControlsVisible, updateMapHeight } from '../store/reducers/map';
import { useDispatch, useSelector } from 'react-redux';
import { TRANSITION_DURATION } from '../model/constants';
import { Chips } from './Chips';
import { InfoListView } from './InfoListView';
import { ApiResult } from '../model/api.model';
import { selectSearchResults } from '../store/reducers/searchInput';

const useStyles = (state: typeof initState) =>
    makeStyles(({ palette, shadows }) => ({
        container: {
            overflowY: state.height > state.breakpoints.mid ? 'auto' : 'unset',
            position: 'fixed',
            backgroundColor: palette.common.white,
            padding: '0px 10px',
            bottom: 0,
            left: 0,
            zIndex: 10,
            borderRadius: '10px 10px 0px 0px',
            display: 'flex',
            flex: 2,
            alignItems: 'center',
            justifyContent: 'flex-start',
            touchAction: 'none',
            boxShadow: shadows[4],
            height: state.height,
            flexDirection: 'column',
            transition: `height ${state.tranistionSpeed}ms`,
        },
        arrow: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            transform: state.open ? 'rotate(540deg)' : 'none',
            transition: `transform ${TRANSITION_DURATION}ms`,
        },
        hideClose: {
            opacity: state.open ? '1' : '0',
            transition: `opacity ${TRANSITION_DURATION}ms`,
        },
        bottomText: {
            opacity: !state.open ? '1' : '0',
            visibility: !state.open ? 'visible' : 'hidden',
            height: !state.open ? '100%' : '0px',
            width: !state.open ? '100%' : '0px',
            transition: `opacity ${TRANSITION_DURATION}ms ${TRANSITION_DURATION}ms`,
        },
    }));

const initBreakpoints = {
    min: 65 as number,
    mid: 350 as number,
    max: 600 as number,
    step: 50 as number,
} as const;

const initState = {
    open: false as boolean,
    height: initBreakpoints.min as number,
    prevState: initBreakpoints.min as number,
    prevY: 0 as number,
    direction: 0 as number,
    initY: 0 as number,
    diffHeight: 0 as number,
    tranistionSpeed: TRANSITION_DURATION as number,
    breakpoints: initBreakpoints as typeof initBreakpoints,
} as const;

type State = typeof initState | { [key: string]: unknown };

export function MobileView() {
    const dispatch = useDispatch();
    const ref = useRef<HTMLDivElement>(null);

    const [state, setDummyState] = useState(initState);
    const setState = (val: State) => setDummyState({ ...state, ...val });
    const classes = useStyles(state)();

    //component will mount
    useEffect(() => {
        setDummyState((s) => ({ ...s, open: true, height: s.breakpoints.mid, prevState: s.breakpoints.mid }));
    }, []);

    // componentWillUnmount
    useEffect(() => {
        return () => {
            dispatch(updateMapHeight({ hDisplacement: 0 }));
        };
    }, [dispatch]);

    // update map height based on if open or not, also use timeout to fix visual bug
    const updateHeightOfMap = (open: boolean, newHeight: number) => {
        const { step, mid } = state.breakpoints;
        open
            ? setTimeout(() => dispatch(updateMapHeight({ hDisplacement: newHeight - step })), TRANSITION_DURATION)
            : dispatch(updateMapHeight({ hDisplacement: newHeight - step }));
        dispatch(updateControlsVisible(newHeight <= mid ? true : false));
    };

    // track where the first touch was and the height difference to the bar
    const onTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
        const initY = e.touches[0].clientY;
        const diffHeight = window.innerHeight - initY - state.height;
        setState({ initY, diffHeight });
    };

    const onTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
        if (!!e && e.touches[0]) {
            const curr = e.touches[0].clientY;
            const { prevY, diffHeight, height, breakpoints } = state;
            if (!state.prevY) {
                // there needs to be a prev Y value in order to calculate direction
                setState({ prevY: curr, tranistionSpeed: 0 });
                return;
            }
            let prevState = state.prevState;
            let open = height > breakpoints.min + breakpoints.step;

            const direction = curr < prevY ? 1 : -1;
            const newHeight = window.innerHeight - curr - diffHeight;

            // if curr touch passes through middle then we can reach the further breakpoint
            if (newHeight > breakpoints.mid - breakpoints.step && newHeight < breakpoints.mid + breakpoints.step)
                prevState = breakpoints.mid;

            // set the new height if it is within the boundary
            if (newHeight >= breakpoints.min - breakpoints.step && newHeight <= breakpoints.max + breakpoints.step)
                setState({ height: newHeight, prevY: curr, direction, open, prevState });
        }
    };

    const onTouchEnd = () => {
        // if there is no previous Y touch then it was just a tap/click, dont switch
        if (!state.prevY) return;

        const { prevState, direction, breakpoints } = state;

        let height = prevState;
        let open = true;

        const breakpointsArr = [breakpoints.min, breakpoints.mid, breakpoints.max];
        const currIdx = breakpointsArr.findIndex((value) => value === prevState);
        const nextIdx = currIdx + direction;

        // used to calculate whether the movement was far enough to justify switching breakpoint
        const barrier = prevState + breakpoints.step * direction;
        const min = Math.min(prevState, barrier);
        const max = Math.max(prevState, barrier);
        const withinBarrier = state.height > min && state.height < max;

        // if a breakpoint is available and we dragged enough to not be a misclick
        if (nextIdx >= 0 && nextIdx < breakpointsArr.length && !withinBarrier) {
            height = breakpointsArr[nextIdx];
        }

        // if height is on min then bar is closed
        if (height === breakpoints.min) open = false;

        // set the state of the bar, where it is, and transition speed
        setState({ prevY: 0, open, height, prevState: height, initY: 0, tranistionSpeed: TRANSITION_DURATION });

        // update the map height along with the bar height
        updateHeightOfMap(direction > 0 ?? false, height);
    };

    // switcheroo on the menu tap icon
    const openCloseMenu = () => {
        const { open, breakpoints } = state;
        const newHeight = !open ? breakpoints.mid : breakpoints.min;

        setState({
            open: !open,
            height: newHeight,
            prevY: 0,
            prevState: newHeight,
        });

        updateHeightOfMap(!open, newHeight);
    };

    const { windowHeight } = useSelector(getWindowDimensions);
    useEffect(() => {
        const fraction = windowHeight / 10;
        const breakpoints = { mid: fraction * 4, max: fraction * 7 };
        setDummyState((s) => ({
            ...s,
            breakpoints: { ...s.breakpoints, ...breakpoints },
        }));
    }, [windowHeight]);

    const apiResult: ApiResult = useSelector(selectSearchResults);

    return (
        <Container
            ref={ref}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            maxWidth='sm'
            className={classes.container}
        >
            <IconButton color='default' onClick={openCloseMenu}>
                <KeyboardArrowUp className={classes.arrow} />
                <Typography className={classes.bottomText} variant='subtitle2'>
                    Tap to Expand
                </Typography>
            </IconButton>

            <ApiSearchInput className={classes.hideClose} />
            <Chips className={classes.hideClose} />

            <br />

            {!!Object.keys(apiResult).length && <InfoListView />}
        </Container>
    );
}
