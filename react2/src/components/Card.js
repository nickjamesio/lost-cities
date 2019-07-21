import { makeStyles } from "@material-ui/core";

import React from "react";
import BlueCard from "../images/blue_card.jpg";
import RedCard from "../images/red_card.jpg";
import WhiteCard from "../images/white_card.jpg";
import YellowCard from "../images/yellow_card.jpg";
import GreenCard from "../images/green_card.jpg";
import BackCard from "../images/back_card.jpg";

const useStyles = makeStyles(theme => ({
  card: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignContent: "center",
    height: "200px",
    backgroundColor: "black",
    padding: "0.5rem",
  },
  img: {
    height: "calc(100% - 1.4rem)"
  },
  valueContainer: {
    fontWeight: "bold",
    lineHeight: "1",
    fontSize: "1.4rem",
    display: "flex",
    justifyContent: "space-between",
    color: "white",
    paddingBottom: ".2rem"
  }
}));

function Card(props) {
  const { color, value } = props;
  const classes = useStyles()
  let imgSrc = "";

  switch (color) {
    case "red":
      imgSrc = RedCard;
      break;
    case "white":
      imgSrc = WhiteCard;
      break;
    case "yellow":
      imgSrc = YellowCard;
      break;
    case "green":
      imgSrc = GreenCard;
      break;
    case "blue":
      imgSrc = BlueCard;
      break;
    default:
      imgSrc = BackCard;
  }

  return (
    <div className={classes.card} >
      <div className={classes.valueContainer}>
        <span>{value}</span>
        <span>{value}</span>
      </div>
     <img src={imgSrc} className={classes.img} alt={`${color} card`} />
    </div>
  );
}

export default Card;