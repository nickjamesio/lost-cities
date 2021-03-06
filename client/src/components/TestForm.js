import React from "react";

import { useFormFields } from "../hooks/forms";
import {
  Input,
  Paper,
  Typography,
  TextField,
  makeStyles
} from "@material-ui/core";
import { useGameState } from "../context/GameStateProvider";
import {
  playCard,
  drawCard,
  drawDiscard,
  discardCard,
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
  const [play, handlePlay] = useFormFields({ position: 0 });
  const [discard, handleDiscard] = useFormFields({ position: 0 });
  const [discardDraw, handleDiscardDraw] = useFormFields({ color: "" });
  const state = useGameState();

  function handlePlaySubmit(e) {
    e.preventDefault();
    playCard(state.gameId, play.position);
  }
  function handleDiscardSubmit(e) {
    e.preventDefault();
    discardCard(state.gameId, discard.position);
  }
  function handleDrawSubmit(e) {
    e.preventDefault();
    drawCard(state.gameId);
  }
  function handleDiscardDrawSubmit(e) {
    e.preventDefault();
    drawDiscard(state.gameId, discardDraw.color);
  }

  return (
    <Paper className={classes.root}>
      <form className={classes.form} onSubmit={handlePlaySubmit}>
        <Typography variant="h5">Play a card</Typography>
        <TextField
          label="Index"
          name="position"
          className={classes.textField}
          value={play.position}
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
          value={discard.position}
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
