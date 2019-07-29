import React from "react";

import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableRow,
  makeStyles
} from "@material-ui/core";
import { AccountCircle } from "@material-ui/icons";

const useStyles = makeStyles(theme => ({
  player: {
    display: "flex",
    alignItems: "center",
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit
  },
  playerData: {
    width: "50%"
  },
  avatar: {
    fontSize: "100px"
  }
}));

function Player({ player: { username, score } }) {
  const classes = useStyles();

  return (
    <div className={classes.player}>
      <AccountCircle className={classes.avatar} />
      <Paper className={classes.playerData}>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>{username ? username : "None"}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>{score ? `Score: ${score}` : "Score: 0"}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Paper>
    </div>
  );
}

export default Player;
