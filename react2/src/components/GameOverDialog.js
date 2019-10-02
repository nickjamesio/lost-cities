import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Dialog from '@material-ui/core/Dialog';

const useStyles = makeStyles({
  avatar: {
    
  },
});

export default function GameOverDialog(props) {
  const { isOver } = props;
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(isOver)
  }, [isOver]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = value => {
    setOpen(false);
  };

  return (
    <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
      <DialogTitle id="simple-dialog-title">GAME OVER</DialogTitle>
      <DialogContent>
          Some content
      </DialogContent>
    </Dialog>
  );
}

GameOverDialog.propTypes = {
  isOver: PropTypes.bool.isRequired
};