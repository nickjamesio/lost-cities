import React from "react";
import { Typography, withStyles } from "@material-ui/core";
import classNames from "classnames";

const Count = withStyles({
  root: {
    width: "2rem",
    height: "2rem",
    borderRadius: "50%",
    border: ".3rem solid black",
    backgroundColor: "#C79921",
    position: "absolute",
    top: "-1rem",
    right: "5rem",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  }
})(props => {
  const { classes, count } = props;

  return (
    <div className={classes.root}>
      <Typography variant="h6">{count}</Typography>
    </div>
  );
});

const styles = {
  root: {
      position: 'relative',
      cursor: 'pointer'
  }
};

const CardCount = props => {
  const { cards, children, classes, className: classNameProp } = props;
  const className = classNames(classes.root, classNameProp);

  return (
    <div className={className}>
      <Count count={cards.length} />
      {children()}
    </div>
  );
};

export default withStyles(styles)(CardCount);
