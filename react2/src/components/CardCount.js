import React from "react";

import { makeStyles, Typography } from "@material-ui/core";
import classnames from "classnames";

const useStyles = makeStyles(theme => ({
  root: {
    position: "relative"
  },
  count: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#b79060",
    height: "2.5rem",
    width: "2.5rem",
    borderRadius: "50%",
    border: ".3rem solid black",
    position: "absolute"
  },
  position: {
    top: "-1.2rem",
    right: "-1.2rem"
  },
  drawPile: {
    top: "-1.2rem",
    left: "-1.2rem",
    transform: "rotate(-90deg)"
  }
}));

function CardCount({ children, count, drawPile }) {
  const classes = useStyles();
  const countStyles = classnames(
    classes.count,
    drawPile ? classes.drawPile : classes.position
  );

  return (
    <div className={classes.root}>
      <div className={countStyles}>
        <Typography variant="h6">{count}</Typography>
      </div>
      {children}
    </div>
  );
}

export default CardCount;
