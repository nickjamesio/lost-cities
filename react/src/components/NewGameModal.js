import React from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  withStyles,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  FormControl
} from "@material-ui/core";

const styles = {
  root: {}
};

const NewGameModal = props => {
  const {
    open,
    handleSubmit,
    handleClose,
    formData,
    handleUpdateModalForm,
  } = props;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">New Game</DialogTitle>
      <DialogContent>
        <DialogContentText>
          To create a new game, please enter the names of both players and pick
          the first player.
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          name="me"
          label="Player 1"
          type="text"
          value={formData.me}
          onChange={handleUpdateModalForm}
          fullWidth
        />
        <TextField
          margin="dense"
          name="opponent"
          label="Player 2"
          type="text"
          value={formData.opponent}
          onChange={handleUpdateModalForm}
          fullWidth
        />
      </DialogContent>
      <FormControl>
        <FormLabel>First Player</FormLabel>
        <RadioGroup
          value={formData.firstPlayer}
          onChange={ handleUpdateModalForm }
          name="firstPlayer"
        >
          <FormControlLabel
            value="me"
            control={<Radio color="primary" />}
            label="Me"
            labelPlacement="start"
          />
          <FormControlLabel
            value="opponent"
            control={<Radio color="primary" />}
            label="Opponenet"
            labelPlacement="start"
          />
        </RadioGroup>
      </FormControl>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default withStyles(styles)(NewGameModal);
