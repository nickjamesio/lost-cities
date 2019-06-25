import React, { useState } from "react";

function NewGameForm(props) {
  const { socket } = props;
  const [position, setPosition] = useState(1);

  function submit(event) {
    socket.emit("new_game", { position });
    event.preventDefault();
  }

  return (
    <form id="new_game" onSubmit={submit}>
      <h5>New game</h5>
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

export default NewGameForm;
