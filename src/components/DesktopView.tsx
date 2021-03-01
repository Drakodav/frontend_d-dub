import { Container } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
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
            maxHeight: `${900 < window.innerHeight ? 900 : window.innerHeight - 40}px`,
            height: state.open ? 'auto' : '35px',
            width: state.open ? '430px' : '400px',
            backgroundColor: palette.common.white,
            marginLeft: !state.open ? '15px' : '0px',
            marginTop: !state.open ? '15px' : '0px',
            zIndex: 10,
            padding: '0px',
            borderRadius: '10px 10px 0px 0px',
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
            marginTop: state.open ? '15px' : '0px',
            width: '400px !important',
            transition: `all ${TRANSITION_DURATION}ms`,
        },
    }));

const initState = {
    open: false as boolean,
} as const;

export function DesktopView() {
    const ref = useRef<HTMLDivElement>(null);

    const [state, setState] = useState(initState);
    const classes = useStyles(state)();

    const apiResult: ApiResult = useSelector(getSearchResults);
    const isResult = !!Object.keys(apiResult).length;
    useEffect(() => {
        setState({
            open: isResult,
        });
    }, [isResult]);

    return (
        <Container ref={ref} maxWidth='sm' className={classes.container}>
            <ApiSearchInput className={classes.search} />
            <Chips className={''} />

            {isResult && <InfoListView />}
        </Container>
    );
}
