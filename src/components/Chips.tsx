import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import { ApiDef } from '../model/api.model';
import { useDispatch, useSelector } from 'react-redux';
import { getSearchType, setSearchType } from '../store/reducers/searchInput';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            alignSelf: 'flex-start',
            margin: '5px 20px ',
            '& > *': {
                margin: theme.spacing(0.5),
            },
        },
        chip: {
            boxShadow: theme.shadows[4],
        },
    })
);

interface Props {
    className: string;
}

export const Chips = ({ className }: Props) => {
    const classes = useStyles();
    const dispatch = useDispatch();

    const searchType = useSelector(getSearchType);

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
        ));
    }, [dispatch, searchType, classes.chip]);

    return <div className={`${classes.root} ${className}`}>{chipsArray}</div>;
};

Chips.propTypes = {
    className: PropTypes.string,
};
