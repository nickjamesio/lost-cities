import React from "react";
import { makeStyles } from "@material-ui/core";
import PropTypes from "prop-types";
import classnames from "classnames";
import { useDrop } from "react-dnd";

import { HAND } from "./Card";
import { PLAY_CARD } from "../socket";
import Overlay from "./Overlay";
import { useGameState, useGameSocket } from "../context/GameContext";
import { ItemTypes } from "../util/constants";

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: "rgba(0,0,0,0.4)",
    width: "90%",
    minHeight: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative"
  },
  opponent: {
    backgroundColor: "rgba(0,0,0,0)",
    transform: "rotate(180deg)"
  }
}));

function PlaySquare(props) {
  const { children, opponent, color } = props;
  const socket = useGameSocket();
  const state = useGameState();
  const classes = useStyles();
  const rootStyles = classnames(
    classes.root,
    opponent ? classes.opponent : null
  );
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: ItemTypes.FACE_UP,
    drop: (item, monitor) => {
      socket.emit(PLAY_CARD, {
        gameId: state.gameId,
        cardIndex: item.position
      });
    },
    canDrop: (item, monitor) => {
      return (
        item.color == color &&
        state.currentPlayer == state.position &&
        item.location === HAND
      );
    },
    collect: monitor => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop()
    })
  });

  return (
    <div className={rootStyles} ref={drop}>
      {children}
      {!isOver && canDrop && <Overlay color="black" />}
      {isOver && canDrop && <Overlay color={color} />}
    </div>
  );
}

PlaySquare.defaultProps = {
  opponent: false,
  color: "rgba(0,0,0,0)"
};

PlaySquare.propTypes = {
  opponent: PropTypes.bool,
  color: PropTypes.string
};

export default PlaySquare;
