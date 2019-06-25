import React, { useState } from "react";

function JoinGameForm(props) {
  const {socket, setGameId } = props;
  const [position, setPosition] = useState(1);
  const [gameId, setId] = useState(0);

  function submit(event) {
    setGameId(gameId);
    socket.emit("join_game", { position, gameId });
    event.preventDefault();
  }

  return (
    <form id="join_game" onSubmit={submit}>
      <h5>Join game</h5>
      <input
        type="text"
        name="game_id"
        value={gameId}
        onChange={(event) => setId(event.target.value)}
      />
      <input
        type="radio"
        name="player_position"
        value={1}
        onChange={() => setPosition(1)}
        checked={position === 1}
      />{" "}
      First
      <input
        type="radio"
        name="player_position"
        value={2}
        onChange={() => setPosition(2)}
        checked={position === 2}
      />{" "}
      Second
      <input type="submit" />
    </form>
  );
}

export default JoinGameForm;
