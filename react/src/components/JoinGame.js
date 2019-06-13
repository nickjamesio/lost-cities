import React from 'react'
import { Grid, TextField, Button, withStyles } from '@material-ui/core';

const styles = {

};

const JoinGame = (props) => {
  const { name, handleJoinGame, handleUpdateJoinName } = props;
  
  return (
    <Grid>
      <TextField
        margin="dense"
        name="join_name"
        label="Name"
        type="text"
        value={name}
        onChange={handleUpdateJoinName}
      />
      <Button onClick={handleJoinGame}>
        Join Game
      </Button>

    </Grid>
  );
};

export default withStyles(styles)(JoinGame);