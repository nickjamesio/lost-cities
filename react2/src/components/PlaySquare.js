import React from "react";
import { makeStyles } from "@material-ui/core";
import PropTypes from "prop-types";
import classnames from "classnames";

const useStyles = makeStyles(theme => ({
  root: {
    width: "90%",
    minHeight: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0)",
    position: "relative"
  },
  opponent: {
    transform: "rotate(180deg)"
  }
}));

function PlaySquare(props) {
  const { children, opponent } = props;
  
  const classes = useStyles();
  const rootStyles = classnames(
    classes.root,
    opponent ? classes.opponent : null
  );

  return (
    <div className={rootStyles}>
      {children}
    </div>
  );
}

PlaySquare.defaultProps = {
  opponent: false,
};

PlaySquare.propTypes = {
  opponent: PropTypes.bool,
  color: PropTypes.string
};

export default PlaySquare;
