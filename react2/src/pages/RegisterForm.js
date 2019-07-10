import React from "react";

function RegisterForm(props) {
  const { username, changeUsername } = useFormField();
  const { password, changePassword } = useFormField();

  function submit(event) {
    event.preventDefault();
    console.log("submitted");
  }

  return (
    <>
      <h1>Register</h1>
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

export default RegisterForm;
