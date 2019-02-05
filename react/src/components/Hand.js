import React from "react";
import { Grid, withStyles, Button } from "@material-ui/core";
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
  const {
    cards,
    classes,
    handleClickCard,
    handleClickPlay,
    handleClickDiscard,
    selectedCard
  } = props;

  return (
    <div className={classes.root}>
      <Grid container>
        {cards.map((card, index) => (
          <div
            className={classNames(
              classes.cardWrapper,
              index === selectedCard ? classes.clicked : null
            )}
            onClick={e => handleClickCard(e, index)}
          >
            <Card
              key={index}
              clickable
              type={card.type}
              value={card.value}
            />
          </div>
        ))}
      </Grid>
      <Grid container>
        <Button variant="contained" onClick={handleClickPlay}>
          Play
        </Button>
        <Button variant="contained" onClick={handleClickDiscard}>Discard</Button>
      </Grid>
    </div>
  );
};

export default withStyles(styles)(Hand);
