import React from "react";
import { makeStyles } from "@material-ui/core";
import PropTypes from "prop-types";
import classnames from "classnames";

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: "rgba(0,0,0,0.4)",
    width: "90%",
    minHeight: "200px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative"
  },
  opponent: {
    backgroundColor: "rgba(0,0,0,0)",
    transform: "rotate(180deg)"
  },
  highlight: {
    backgroundColor: "rgba(0,255,0,0.3)"
  }
}));

function PlaySquare(props) {
  const { highlight, children, opponent } = props;
  const classes = useStyles();
  const rootStyles = classnames(
    classes.root,
    opponent ? classes.opponent : null,
    highlight ? classes.highlight : null
  );

  return <div className={rootStyles}>{children}</div>;
}

PlaySquare.defaultProps = {
  highlight: false
};

PlaySquare.propTypes = {
  highlight: PropTypes.bool
};

export default PlaySquare;
