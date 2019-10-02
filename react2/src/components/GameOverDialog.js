import React from 'react';
import PropTypes from 'prop-types';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Dialog from '@material-ui/core/Dialog';
import { Typography } from '@material-ui/core';


export default function GameOverDialog(props) {
  const { isOver, players } = props;
  const p1 = players["1"];
  const p2 = players["2"];
  const p1Name = p1.username ? p1.username : "";
  const p2Name = p1.username ? p2.username : "";
  let winner = "Tie game!";

  if (p1.score && p2.score && p1.score > p2.score) {
    winner = `Winner: ${p1Name}`;
  }
  else if (p1.score && p2.score && p2.score > p1.score) {
    winner = `Winner: ${p2Name}`;
  }

  return (
    <Dialog aria-labelledby="simple-dialog-title" open={isOver}>
      <DialogTitle id="simple-dialog-title">GAME OVER</DialogTitle>
      <DialogContent>
        <Typography>{winner}</Typography>
      </DialogContent>
    </Dialog>
  );
}

GameOverDialog.propTypes = {
  isOver: PropTypes.bool.isRequired
};