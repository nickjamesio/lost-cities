import React from "react";
import './gamedata.css'

function GameData(props) {
  const {
    gameId,
    playerHand,
    playedCards,
    drawPile,
    discardPile,
    currentPlayer
  } = props;

  return (
    <>
      <h5>Game data</h5>
      <section className="game container col">
        <div className="container row">
          <div>
            <span>Game id</span>
            <input type="text" readOnly value={gameId} />
          </div>
          <div>
            <span>Current player</span>
            <input type="text" readOnly value={currentPlayer} />
          </div>
        </div>
        <div className="container row">
          <div>
            <p>Player hand</p>
            <textarea
              readOnly
              id="played"
              rows="5"
              cols="40"
              value={JSON.stringify(playerHand)}
            />
          </div>
          <div>
            <p>Played cards</p>
            <textarea
              readOnly
              id="played"
              rows="5"
              cols="40"
              value={JSON.stringify(playedCards)}
            />
          </div>
        </div>
        <div className="container row">
          <div>
            <p>Draw Pile</p>
            <textarea
              readOnly
              id="played"
              rows="5"
              cols="40"
              value={JSON.stringify(drawPile)}
            />
          </div>
          <div>
            <p>Discard pile</p>
            <textarea
              readOnly
              id="played"
              rows="5"
              cols="40"
              value={JSON.stringify(discardPile)}
            />
          </div>
        </div>
      </section>
    </>
  );
}

export default GameData;
