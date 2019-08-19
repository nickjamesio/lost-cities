import React from "react";

import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  overlay: props => ({
    position: "absolute",
    top: 0,
    left: 0,
    height: "100%",
    width: "100%",
    zIndex: 1,
    opacity: 0.5,
    backgroundColor: props.backgroundColor
  })
}));

export default function Overlay({ color }) {
  const classes = useStyles({ backgroundColor: color });

  return <div className={classes.overlay} />;
}
