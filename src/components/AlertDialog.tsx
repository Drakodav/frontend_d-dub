import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

interface Props {
    open: boolean;
    handleClose: () => void;
}

export default function AlertDialog(props: Props) {
    const { open, handleClose } = props;
    const onCloseHandler = () => handleClose();

    return (
        <div>
            <Dialog
                open={open}
                onClose={onCloseHandler}
                aria-labelledby='alert-dialog-title'
                aria-describedby='alert-dialog-description'
            >
                <DialogTitle id='alert-dialog-title'>{'Enable location service?'}</DialogTitle>
                <DialogContent>
                    <DialogContentText id='alert-dialog-description'>
                        In order to use this feature you must first enable location services.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onCloseHandler} color='primary'>
                        Disagree
                    </Button>
                    <Button onClick={onCloseHandler} color='primary' autoFocus>
                        Agree
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
