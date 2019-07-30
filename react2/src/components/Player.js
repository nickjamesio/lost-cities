import React from "react";
import PropTypes from "prop-types";

import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableRow,
  makeStyles
} from "@material-ui/core";
import { AccountCircle } from "@material-ui/icons";
import classnames from "classnames";

const useStyles = makeStyles(theme => ({
  player: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1)
  },
  playerData: {
    width: "50%"
  },
  avatar: {
    fontSize: "70px"
  },
  avatarWrapper: {
    backgroundColor: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
    "&.active" :{
      backgroundColor: theme.palette.secondary.main
    }
  }
}));

function Player({ player: { username, score }, active}) {
  const classes = useStyles();
  const avatarStyles = classnames(classes.avatarWrapper, active ? "active" : null);

  return (
    <div className={classes.player}>
      <div className={avatarStyles}>
        <AccountCircle className={classes.avatar} />
      </div>
      <Paper className={classes.playerData}>
        <Table size="small">
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

Player.defaultProps = {
  active: false,
};

Player.propTypes = {
  active: PropTypes.bool,
  player: PropTypes.object.isRequired
};

export default Player;
