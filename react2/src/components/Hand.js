import React from "react";
import { makeStyles } from "@material-ui/core";
import { useDrop } from "react-dnd";

import Card, { HAND, DECK, DISCARD } from "../components/Card";
import { ItemTypes } from "../util/constants";
import { DRAW_CARD, DISCARD_DRAW } from "../socket";
import { useGameSocket } from "../context/GameSocketProvider";
import { useGameState } from "../context/GameStateProvider";
import Overlay from "./Overlay";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexDirection: "column"
  },
  row: {
    display: "flex",
    justifyContent: "center",
    height: "200px",
    "&:nth-child(2)": {
      marginTop: "-130px"
    }
  },
  cardWrapperFull: {
    "&:nth-child(1)": {
      transform: "rotate(-18deg)",
      marginRight: "-40px",
      marginTop: "30px"
    },
    "&:nth-child(2)": {
      transform: "rotate(-9deg)",
      marginRight: "-50px",
      marginTop: "15px"
    },
    "&:nth-child(3)": {
      transform: "rotate(9deg)",
      marginRight: "-40px",
      marginTop: "15px"
    },
    "&:nth-child(4)": {
      transform: "rotate(18deg)",
      marginTop: "30px"
    }
  },
  cardWrapperNotFull: {
    "&:nth-child(1)": {
      transform: "rotate(-9deg)",
      marginRight: "-40px",
      marginTop: "30px"
    },
    "&:nth-child(2)": {
      // Not sure why but had to add transform so middle card has correct overlap
      // and z-index
      transform: "rotate(0deg)",
      marginRight: "-50px",
      marginTop: "15px"
    },
    "&:nth-child(3)": {
      transform: "rotate(9deg)",
      marginTop: "30px"
    }
  }
}));

function Hand(props) {
  const { cards } = props;
  const classes = useStyles();
  const socket = useGameSocket();
  const state = useGameState();
  const rowOne = [];
  const rowTwo = [];

  // Hacky way to figure out which hand is the opponent's
  const isOpponent = cards[0] && cards[0].typ === "facedown";
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: [ItemTypes.FACE_DOWN, ItemTypes.FACE_UP],
    drop: (item, monitor) => {
      if (item.location === DECK) {
        socket.emit(DRAW_CARD, {
          gameId: state.gameId
        });
      }
      if (item.location === DISCARD) {
        socket.emit(DISCARD_DRAW, {
          gameId: state.gameId,
          color: item.color
        });
      }
    },
    canDrop: (item, monitor) => {
      return (
        state.currentPlayer == state.position &&
        (item.location === DISCARD || item.location === DECK)
      );
    },
    collect: monitor => {
      return {
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop()
      };
    }
  });

  cards.forEach((card, index) => {
    if (index < 4) {
      rowOne.push(<Card type={card.typ} value={card.val} position={index} location={HAND} />);
    } else {
      rowTwo.push(<Card type={card.typ} value={card.val} position={index} location={HAND} />);
    }
  });

  return (
    <div className={classes.root} ref={drop}>
      <div className={classes.row}>
        {rowOne.map((Card, index) => (
          <div key={`${index}`} className={classes.cardWrapperFull}>
            {Card}
          </div>
        ))}
      </div>
      <div className={classes.row}>
        {rowTwo.map((Card, index) => (
          <div
            key={`${index}`}
            className={
              cards.length === 8
                ? classes.cardWrapperFull
                : classes.cardWrapperNotFull
            }
          >
            {Card}
          </div>
        ))}
      </div>
      {!isOpponent && !isOver && canDrop && <Overlay color="black" />}
      {!isOpponent && isOver && canDrop && <Overlay color="green" />}
    </div>
  );
}

export default Hand;
