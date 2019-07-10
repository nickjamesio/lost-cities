import React from "react";

import { useFormField } from "../hooks/forms";
import { login } from "../api/auth";

function Login(props) {
  const { field: username, handleChange: changeUsername } = useFormField();
  const { field: password, handleChange: changePassword } = useFormField();

  const submit = (event) => {
    const x = 1;
    event.preventDefault();
    const result = login(username, password);
  }
  console.log(username);
  return (
    <>
      <h1>Log in</h1>
      <form onSubmit={submit}>
        <label>Username</label>
        <input
          type="text"
          name="username"
          value={username}
          onChange={changeUsername}
          required
        />
        <label>Password</label>
        <input
          type="password"
          name="password"
          value={password}
          onChange={changePassword}
          required
        />
        <input type="submit" />
      </form>
    </>
  );
}

export default Login;
