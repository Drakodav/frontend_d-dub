import { Container, IconButton, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { KeyboardArrowUp } from '@material-ui/icons';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { ApiResult } from '../model/api.model';
import { TRANSITION_DURATION } from '../model/constants';
import { getSearchResults } from '../store/reducers/searchInput';
import { ApiSearchInput } from './ApiSearchInput';
import { Chips } from './Chips';
import { InfoListView } from './InfoListView';

const useStyles = (state: typeof initState) =>
    makeStyles(({ palette, shadows }) => ({
        container: {
            position: 'absolute',
            maxHeight: `${700 < window.innerHeight ? 700 : window.innerHeight - 40}px`,
            height: state.menuHide ? 'auto' : '35px',
            width: state.menuHide ? '430px' : '403px',
            backgroundColor: palette.common.white,
            marginLeft: !state.menuHide ? '15px' : '0px',
            marginTop: !state.menuHide ? '15px' : '0px',
            zIndex: 10,
            padding: '0px',
            borderRadius: state.menuHide ? '0px 0px 10px 0px' : '10px 10px 0px 0px',
            display: 'flex',
            flex: 2,
            alignItems: 'center',
            justifyContent: 'flex-start',
            touchAction: 'none',
            boxShadow: shadows[4],
            flexDirection: 'column',
            transition: `all ${TRANSITION_DURATION}ms`,
        },
        search: {
            marginTop: state.menuHide ? '15px' : '0px',
            width: state.menuHide ? '' : '100% !important',
            transition: `all ${TRANSITION_DURATION}ms`,
        },
        arrow: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            transform: !state.menuHide ? 'rotate(540deg)' : 'none',
            transition: `transform ${TRANSITION_DURATION}ms`,
        },
        hideClose: {
            opacity: !state.menuHide ? '1' : '0',
            visibility: !state.menuHide ? 'visible' : 'hidden',
            transition: `opacity ${TRANSITION_DURATION}ms`,
        },
        bottomText: {
            opacity: state.menuHide ? '1' : '0',
            display: state.menuHide ? 'block' : 'none',
            transition: state.menuHide ? `opacity ${TRANSITION_DURATION}ms ${TRANSITION_DURATION}ms` : 'none',
        },
        chips: {
            backgroundColor: !state.menuHide && state.open ? palette.common.white : 'none',
            width: '99.7%',
            display: 'flex',
            borderRadius: '0px',
        },
        bottomBar: {
            backgroundColor: palette.common.white,
            width: '99.7%',
            height: '50px',
            boxShadow: shadows[1],
            textAlign: 'center',
            borderRadius: state.menuHide ? '0px 0px 10px 0px' : '0px 0px 10px 10px',
        },
    }));
// false false,
// true, true
const initState = {
    open: false as boolean,
    menuHide: false as boolean,
} as const;

export function DesktopView() {
    const ref = useRef<HTMLDivElement>(null);

    const [state, setState] = useState(initState);
    const classes = useStyles(state)();

    const apiResult: ApiResult = useSelector(getSearchResults);
    const isResult = !!Object.keys(apiResult).length;
    useEffect(() => {
        setState({
            menuHide: isResult,
            open: isResult,
        });
        // eslint-disable-next-line
    }, [isResult]);

    // switcheroo on the menu tap icon
    const openCloseMenu = () => {
        setState({
            ...state,
            menuHide: !state.menuHide,
        });
    };

    return (
        <Container ref={ref} maxWidth='sm' className={classes.container}>
            <ApiSearchInput className={classes.search} />
            <div className={classes.chips}>
                <Chips />
            </div>

            {isResult && (
                <>
                    <InfoListView />
                    <div className={classes.bottomBar}>
                        <IconButton color='default' onClick={openCloseMenu}>
                            <KeyboardArrowUp className={classes.arrow} />
                            <Typography className={classes.bottomText} variant='subtitle2'>
                                Tap To Hide
                            </Typography>
                        </IconButton>
                    </div>
                </>
            )}
        </Container>
    );
}
