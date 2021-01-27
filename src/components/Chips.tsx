import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import { ApiInputType } from '../model/api.model';
import { useDispatch, useSelector } from 'react-redux';
import { getSearchType, setSearchType } from '../store/reducers/searchInput';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            alignSelf: 'flex-start',
            margin: '0px 20px 20px 20px',
            '& > *': {
                margin: theme.spacing(0.5),
            },
        },
    })
);

interface Props {
    className: string;
}

export const Chips = ({ className }: Props) => {
    const classes = useStyles();
    const dispatch = useDispatch();

    const query = useSelector(getSearchType);

    const chipsArray: JSX.Element[] = useMemo(() => {
        let chips = [];
        for (let i = 0; i < Object.values(ApiInputType).length; i++) {
            chips.push(
                <Chip
                    key={i}
                    label={Object.keys(ApiInputType)[i]}
                    clickable
                    color={Object.values(ApiInputType)[i] === query ? 'primary' : 'default'}
                    onClick={() => dispatch(setSearchType(Object.values(ApiInputType)[i]))}
                />
            );
        }
        return chips;
    }, [dispatch, query]);

    return <div className={`${classes.root} ${className}`}>{chipsArray}</div>;
};

Chips.propTypes = {
    className: PropTypes.string,
};
