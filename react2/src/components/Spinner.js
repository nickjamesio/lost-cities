import React from "react";

import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
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

  return <div className={classes.loader} />;
}

export default Spinner;
