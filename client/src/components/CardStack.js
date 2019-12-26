import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core";
import { useDrop } from "react-dnd";

import Overlay from "./Overlay";
import Card, { PLAYED } from "./Card";
import { HAND } from "./Card";
import { playCard } from "../socket";
import { useGameState } from "../context/GameStateProvider";
import { ItemTypes } from "../util/constants";

const useStyles = makeStyles(theme => ({
  cardStack: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  card: {
    position: "absolute",
    "&:not(:first-child)": {}
  }
}));

function CardStack(props) {
  const { cards, color, opponent } = props;
  const classes = useStyles();
  const state = useGameState();
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: ItemTypes.FACE_UP,
    drop: item => {
      playCard(state.gameId, item.position);
    },
    canDrop: item => {
      const lastCard = cards.length > 0 ? cards[cards.length - 1] : {val: 0};
      const itemValue = item.value === 'h' ? 1 : parseInt(item.value);
      const lastCardValue = lastCard.val === 'h' ? 1 : parseInt(lastCard.val);
      console.log({lastCard, itemValue, lastCardValue, item, color, currentPlayer: state.currentPlayer, position: state.position});

      return (
        item.color === color &&
        state.currentPlayer === state.position &&
        item.location === HAND &&
        itemValue >= lastCardValue &&
        !opponent
      );
    },
    collect: monitor => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop()
    })
  });

  console.log({isOver, canDrop});
  return (
    <div className={classes.cardStack} ref={drop}>
      {cards.map((card, index) => (
        <div
          key={`${card.typ}${index}`}
          className={classes.card}
          style={{ top: index * 21 }}
        >
          <Card type={card.typ} value={card.val} location={PLAYED} />
        </div>
      ))}
      {!isOver && canDrop && <Overlay color="black" />}
      {isOver && canDrop && <Overlay color={color} />}
    </div>
  );
}

CardStack.defaultProps = {
  opponent: false,
};

CardStack.propTypes = {
  opponent: PropTypes.bool,
  color: PropTypes.string.isRequired
};

export default CardStack;
