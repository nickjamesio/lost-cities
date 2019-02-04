import React from "react";
import { withStyles, Grid, Typography } from "@material-ui/core";
import PropTypes from "prop-types";
import classNames from "classnames";

// Card images
import RedCardImage from "../images/red_card.jpg";
import GreenCardImage from "../images/green_card.jpg";
import YellowCardImage from "../images/yellow_card.jpg";
import WhiteCardImage from "../images/white_card.jpg";
import BlueCardImage from "../images/blue_card.jpg";
import BackCardImage from "../images/back_card.jpg";

const styles = {
  border: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "6rem",
    height: "7rem",
    backgroundColor: "black",
    "&.covered": {
      height: "2rem"
    }
  },
  image: {
    width: "5rem",
    height: "4rem",
    margin: "0.5rem"
  },
  imageBack: {
    width: "5rem",
    height: "6rem"
  },
  redBg: {
    backgroundColor: "red"
  },
  greenBg: {
    backgroundColor: "green"
  },
  blueBg: {
    backgroundColor: "#6262ff"
  },
  yellowBg: {
    backgroundColor: "yellow"
  },
  whiteBg: {
    backgroundColor: "white"
  },
  backBg: {
    backgroundImage: `url(${BackCardImage})`
  },
  redText: {
    color: "red"
  },
  greenText: {
    color: "green"
  },
  blueText: {
    color: "#6262ff"
  },
  yellowText: {
    color: "yellow"
  },
  whiteText: {
    color: "white"
  },
};

const Card = props => {
  const {
    classes,
    covered,
    type,
    value,
    className: classNameProp,
  } = props;
  const image = classNames(
    classes[`${type}Bg`],
    type == "back" ? classes.imageBack : classes.image
  );
  const textColor = classes[`${type}Text`];
  const className = classNames(
    classes.border,
    classNameProp,
  );

  return (
    <div className={className}>
      {type != "back" ? (
        <>
          <Grid container justify="space-around">
            <Typography variant="h6" className={textColor}>
              {value}
            </Typography>
            <Typography variant="h6" className={textColor}>
              {value}
            </Typography>
          </Grid>
        </>
      ) : null}

      {covered == false ? <div className={image} /> : null}
    </div>
  );
};

Card.defaultProps = {
  value: "",
  covered: false
};

Card.propTypes = {
  type: PropTypes.oneOf(["red", "blue", "white", "green", "yellow", "back"])
    .isRequired,
  covered: PropTypes.bool
};

export default withStyles(styles)(Card);
