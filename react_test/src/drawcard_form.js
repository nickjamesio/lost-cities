import React, { useState } from "react";

function DrawCardForm(props) {
  const {socket, gameId } = props;

  function submit(event) {
    socket.emit("draw_card", {gameId});
    event.preventDefault();
  }

  return (
    <form id="draw_card" onSubmit={submit}>
      <h5>Draw card</h5>
      <input type="submit" />
    </form>
  );
}

export default DrawCardForm;
