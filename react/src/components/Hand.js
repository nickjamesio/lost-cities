import React from "react";
import { Grid, withStyles } from "@material-ui/core";
import classNames from "classnames";

import Card from "../components/Card";

const styles = {
  root: {
    display: "flex",
    flexDirection: "column",
    marginLeft: "4rem",
    maxWidth: "32rem"
  },
  cardWrapper: {
    margin: "1rem",
    cursor: "pointer"
  },
  clicked: {
    opacity: ".6"
  }
};

const Hand = props => {
  const { cards, classes, handleClick, selectedCard } = props;

  return (
    <div className={classes.root}>
      <Grid container>
        {cards.map((card, index) => (
          <div
            className={classNames(
              classes.cardWrapper,
              index === selectedCard ? classes.clicked : null
            )}
            onClick={e => handleClick(e, index)}
          >
            <Card
              key={index}
              clickable
              type={card.type}
              value={card.value}
              clickHandler={handleClick}
            />
          </div>
        ))}
      </Grid>
    </div>
  );
};

export default withStyles(styles)(Hand);
