import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import Input from "@material-ui/core/Input";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import { navigate } from "@reach/router";

import { useFormFields } from "../hooks/forms";
import { useGameSocket } from "../context/GameContext";
import { NEW_GAME, JOIN_GAME } from "../socket";

const useNewStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(5),
    display: "inline-block"
  },
  formControl: {
    margin: theme.spacing(3)
  },
  group: {
    margin: theme.spacing(1, 0)
  },
  form: {
    display: "flex",
    flexDirection: "column"
  }
}));

function NewGame(props) {
  const socket = useGameSocket();
  const classes = useNewStyles();
  const [form, handleChange] = useFormFields({ position: "1" });

  function handleSubmit(e) {
    e.preventDefault();
    socket.emit(NEW_GAME, { position: form.position });
  }

  return (
    <Paper className={classes.root}>
      <form className={classes.form} onSubmit={handleSubmit}>
      <Typography variant="h4">New Game</Typography>
      <FormControl component="fieldset" className={classes.formControl}>
        <FormLabel component="legend">Player position</FormLabel>
        <RadioGroup
          aria-label="Player position"
          name="position"
          className={classes.group}
          value={form.position}
          onChange={handleChange}
        >
          <FormControlLabel value="1" control={<Radio />} label="First" />
          <FormControlLabel value="2" control={<Radio />} label="Second" />
        </RadioGroup>
      </FormControl>
      <Input type="submit" value="Create Game" />
      </form>
    </Paper>
  );
}

const useJoinStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(5),
    display: "inline-block"
  },
  formControl: {
    margin: theme.spacing(3)
  },
  group: {
    margin: theme.spacing(1, 0)
  },
  form: {
    display: "flex",
    flexDirection: "column"
  }
}));

function JoinGame(props) {
  const classes = useJoinStyles();
  const socket = useGameSocket();
  const [form, handleChange] = useFormFields({ gameid: "", position: "1" });

  function handleSubmit(e) {
    e.preventDefault();
    socket.emit(JOIN_GAME, { gameId: form.gameid, position: form.position });
    navigate(`/game/${form.gameid}`);
  }

  return (
    <Paper className={classes.root}>
      <Typography variant="h4">Join Game</Typography>
      <form className={classes.form} onSubmit={handleSubmit}>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="gameid"
          label="Game id"
          name="gameid"
          value={form.gameid}
          onChange={handleChange}
        />
        <FormControl component="fieldset" className={classes.formControl}>
          <RadioGroup
            aria-label="Player position"
            name="position"
            className={classes.group}
            value={form.position}
            onChange={handleChange}
          >
            <FormControlLabel
              value="1"
              control={<Radio />}
              label="First player"
            />
            <FormControlLabel
              value="2"
              control={<Radio />}
              label="Second player"
            />
          </RadioGroup>
        </FormControl>
        <Input type="submit" value="Join Game"/>
      </form>
    </Paper>
  );
}

const useManageStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "90vh"
  },
  wrapper: {
    display: "flex"
  }
}));

function ManageGame(props) {
  const classes = useManageStyles();

  return (
    <div className={classes.root}>
      <div className={classes.wrapper}>
        <NewGame />
        <JoinGame />
      </div>
    </div>
  );
}

export default ManageGame;
