import React from "react";

import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  overlay: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    zIndex: "2",
    width: "100%",
    height: "100%",
    backgroundColor: "white"
  },
  "@keyframes spin": {
    from: { transform: "rotate(0deg)" },
    to: { transform: "rotate(360deg)" }
  },
  loader: {
    border: "16px solid #f3f3f3" /* Light grey */,
    borderTop: "16px solid #3498db" /* Blue */,
    borderRadius: "50%",
    width: "120px",
    height: "120px",
    animation: "$spin 2s linear infinite"
  }
}));

function Spinner(props) {
  const classes = useStyles();

  return (
    <div className={classes.overlay}>
      <div className={classes.loader} />
    </div>
  );
}

export default Spinner;
