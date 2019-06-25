import React, { useState } from "react";

function PlayCardForm(props) {
  const { gameId, socket } = props;
  const [cardIndex, setCardIndex] = useState("");

  function submit(event) {
    event.preventDefault();
    socket.emit("play_card", {
      gameId,
      cardIndex
    });
  }

  return (
    <>
      <h5>Play Card</h5>
      <form id="play_card" onSubmit={submit}>
        <label>Index</label>
        <input type="text" name="card_index" value={cardIndex} onChange={(e) => setCardIndex(e.target.value)} />
        <input type="submit" />
      </form>
    </>
  );
}

export default PlayCardForm;
