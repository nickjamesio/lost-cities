import React from "react";
import { makeStyles } from "@material-ui/core";
import classnames from 'classnames';

import YellowDiscard from "../images/yellow_discard.png";
import BlueDiscard from "../images/blue_discard.png";
import WhiteDiscard from "../images/white_discard.png";
import GreenDiscard from "../images/green_discard.png";
import RedDiscard from "../images/red_discard.png";

const useStyles = makeStyles(theme => ({
  discardItem: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    width: "100%",
  },
  discardItemImage: {
    height: "100%"
  }
}));

export default function DiscardPile(props) {
  const { color, children, className: classNameProp } = props;
  const classes = useStyles();
  let imgSrc;

  switch (color) {
    case "red":
      imgSrc = RedDiscard;
      break;
    case "white":
      imgSrc = WhiteDiscard;
      break;
    case "yellow":
      imgSrc = YellowDiscard;
      break;
    case "green":
      imgSrc = GreenDiscard;
      break;
    case "blue":
      imgSrc = BlueDiscard;
      break;
    default:
      imgSrc = ""
  }

  return (
    <div className={classnames(classes.discardItem, classNameProp)}>
      <img
        src={imgSrc}
        className={classes.discardItemImage}
        alt={`${color} discard pile`}
      />
      {children}
    </div>
  );
}
