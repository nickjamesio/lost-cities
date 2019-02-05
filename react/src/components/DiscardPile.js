import React from "react";
import { withStyles } from "@material-ui/core";
import classNames from "classnames";

import RedDiscard from "../images/red_discard.jpg";
import GreenDiscard from "../images/green_discard.jpg";
import YellowDiscard from "../images/yellow_discard.jpg";
import WhiteDiscard from "../images/white_discard.jpg";
import BlueDiscard from "../images/blue_discard.jpg";
import Card from "../components/Card";
import CardCount from "../components/CardCount";

const styles = {
  discard: {
    width: "6rem",
    height: "8rem",
    "&.red": {
      backgroundImage: `url(${RedDiscard})`
    },
    "&.blue": {
      backgroundImage: `url(${BlueDiscard})`
    },
    "&.green": {
      backgroundImage: `url(${GreenDiscard})`
    },
    "&.yellow": {
      backgroundImage: `url(${YellowDiscard})`
    },
    "&.white": {
      backgroundImage: `url(${WhiteDiscard})`
    }
  },
  overlay: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
    "&.red": {
      backgroundColor: "rgba(255,0,0,0.3)"
    },
    "&.blue": {
      backgroundColor: "rgba(0, 0, 255, 0.3)"
    },
    "&.green": {
      backgroundColor: "rgba(0, 255, 0, 0.3)"
    },
    "&.yellow": {
      backgroundColor: "rgba(255, 255, 0, 0.3)"
    },
    "&.white": {
      backgroundColor: "rgba(255, 255, 255, 0.5)"
    }
  }
};

const DiscardPile = props => {
  const { classes, cards, color } = props;
  const discardClasses = classNames(classes.discard, color);
  const overlayClasses = classNames(classes.overlay, color);
  const card = cards.length > 0 ? cards[cards.length - 1] : null;

  return (
    <div className={discardClasses}>
      <div className={overlayClasses}>
        {card ? (
          <CardCount cards={cards}>
            {() => (<Card type={color} value={card} />)}
          </CardCount>
        ) : null}
      </div>
    </div>
  );
};

export default withStyles(styles)(DiscardPile);
