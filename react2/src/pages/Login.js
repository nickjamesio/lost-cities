import React from "react";

import { useFormFields } from "../hooks/forms";
import { login } from "../api/auth";

function Login(props) {
  const { fields, handleChange } = useFormFields({
      username: "",
      password: ""
  });

  const submit = (event) => {
    event.preventDefault();
    const result = login(fields.username, fields.password);
  }

  return (
    <>
      <h1>Log in</h1>
      <form onSubmit={submit}>
        <label>Username</label>
        <input
          type="text"
          name="username"
          value={fields.username}
          onChange={handleChange}
          required
        />
        <label>Password</label>
        <input
          type="password"
          name="password"
          value={fields.password}
          onChange={handleChange}
          required
        />
        <input type="submit" />
      </form>
    </>
  );
}

export default Login;
