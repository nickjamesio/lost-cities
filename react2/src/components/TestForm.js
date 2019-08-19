import React from "react";

import { useFormFields } from "../hooks/forms";
import {
  Input,
  Paper,
  Typography,
  TextField,
  makeStyles
} from "@material-ui/core";
import { useGameSocket, useGameState } from "../context/GameContext";
import {
  PLAY_CARD,
  DRAW_CARD,
  DISCARD_CARD,
  DISCARD_DRAW,
} from "../socket";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    justifyContent: "space-around"
  },
  form: {
    display: "flex",
    flexDirection: "column"
  },
  submit: {
    backgroundColor: theme.palette.secondary.main,
    color: "white"
  },
  pointer: {
    cursor: "pointer"
  }
}));

function TestForm(props) {
  const classes = useStyles();
  const [playCard, handlePlay] = useFormFields({ position: 0 });
  const [discardCard, handleDiscard] = useFormFields({ position: 0 });
  const [discardDraw, handleDiscardDraw] = useFormFields({ color: "" });
  const socket = useGameSocket();
  const state = useGameState();

  function handlePlaySubmit(e) {
    e.preventDefault();
    socket.emit(PLAY_CARD, {
      gameId: state.gameId,
      cardIndex: playCard.position
    });
  }
  function handleDiscardSubmit(e) {
    e.preventDefault();
    socket.emit(DISCARD_CARD, {
      gameId: state.gameId,
      cardIndex: discardCard.position
    });
  }
  function handleDrawSubmit(e) {
    e.preventDefault();
    socket.emit(DRAW_CARD, {
      gameId: state.gameId
    });
  }
  function handleDiscardDrawSubmit(e) {
    e.preventDefault();
    socket.emit(DISCARD_DRAW, {
      gameId: state.gameId,
      color: discardDraw.color,
    });
  }

  return (
    <Paper className={classes.root}>
      <form className={classes.form} onSubmit={handlePlaySubmit}>
        <Typography variant="h5">Play a card</Typography>
        <TextField
          label="Index"
          name="position"
          className={classes.textField}
          value={playCard.position}
          onChange={handlePlay}
          margin="normal"
          variant="outlined"
        />
        <Input
          disableUnderline
          type="submit"
          className={classes.submit}
          value="Play card"
          classes={{ input: classes.pointer }}
        />
      </form>
      <form className={classes.form} onSubmit={handleDiscardSubmit}>
        <Typography variant="h5">Discard a card</Typography>
        <TextField
          label="Index"
          name="position"
          className={classes.textField}
          value={discardCard.position}
          onChange={handleDiscard}
          margin="normal"
          variant="outlined"
        />
        <Input
          disableUnderline
          type="submit"
          className={classes.submit}
          value="Discard Card"
          classes={{ input: classes.pointer }}
        />
      </form>
      <form className={classes.form} onSubmit={handleDiscardDrawSubmit}>
        <Typography variant="h5">Draw from discard</Typography>
        <TextField
          label="Color"
          name="color"
          className={classes.textField}
          value={discardDraw.color}
          onChange={handleDiscardDraw}
          margin="normal"
          variant="outlined"
        />
        <Input
          disableUnderline
          type="submit"
          className={classes.submit}
          value="Draw Card"
          classes={{ input: classes.pointer }}
        />
      </form>
      <form className={classes.form} onSubmit={handleDrawSubmit}>
        <Typography variant="h5">Draw a card</Typography>
        <Input
          disableUnderline
          type="submit"
          className={classes.submit}
          value="Draw Card"
          classes={{ input: classes.pointer }}
        />
      </form>
    </Paper>
  );
}

export default TestForm;
