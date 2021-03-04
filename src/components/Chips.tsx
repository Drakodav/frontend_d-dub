import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import { ApiDef } from '../model/api.model';
import { KeyboardArrowUp } from '@material-ui/icons';
import { useDispatch, useSelector } from 'react-redux';
import {
    getDirection,
    getML,
    getSearchType,
    setSearchType,
    setSelectedStop,
    switchDirection,
    switchML,
} from '../store/reducers/searchInput';
import { TRANSITION_DURATION } from '../model/constants';

const useStyles = (state: { direction: number }) =>
    makeStyles(({ shadows, spacing }) => ({
        root: {
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            alignSelf: 'flex-start',
            margin: '5px 20px ',
            '& > *': {
                margin: spacing(0.5),
            },
        },
        chip: {
            boxShadow: shadows[4],
        },
        direction: {
            boxShadow: shadows[4],
            display: 'flex',
            flex: '1',
            flexDirection: 'row-reverse',
            '& span': {
                paddingRight: '0px',
            },
            paddingRight: '8px',
        },
        arrow: {
            margin: '0px',
            padding: '0px',
            transform: state.direction === 0 ? 'rotate(540deg)' : 'none',
            transition: `transform ${TRANSITION_DURATION}ms`,
        },
    }));

interface Props {
    className?: string;
}

export const Chips = ({ className }: Props) => {
    className = className ?? '';
    const dispatch = useDispatch();

    const searchType = useSelector(getSearchType);
    const direction = useSelector(getDirection);
    const ml = useSelector(getML);

    const classes = useStyles({ direction })();

    const chipsArray: JSX.Element[] = useMemo(() => {
        return ApiDef.map((item, i) => (
            <Chip
                key={i}
                label={item.name}
                clickable
                className={classes.chip}
                color={item.name === searchType ? 'primary' : 'default'}
                onClick={() => item.name !== searchType && dispatch(setSearchType(item.name))}
            />
        )).concat([
            <div style={{ alignSelf: 'flex-end' }}>
                <Chip
                    icon={<KeyboardArrowUp className={classes.arrow} />}
                    key={'direction'}
                    label={'direction'}
                    clickable
                    className={classes.direction}
                    color='default'
                    onClick={() => {
                        dispatch(switchDirection());
                        dispatch(setSelectedStop({} as any));
                    }}
                />
            </div>,
            <div style={{ alignSelf: 'flex-end' }}>
                <Chip
                    key={'prediction'}
                    label={'ml'}
                    clickable
                    className={classes.chip}
                    color={ml ? 'primary' : 'default'}
                    onClick={() => {
                        dispatch(switchML());
                    }}
                />
            </div>,
        ]);
    }, [dispatch, searchType, classes, ml]);

    return <div className={`${classes.root} ${className}`}>{chipsArray}</div>;
};

Chips.propTypes = {
    className: PropTypes.string,
};
