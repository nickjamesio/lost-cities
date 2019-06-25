import React, { useState } from "react";

function RegisterForm(props) {
  const [formFields, setFormFields] = useState({
    'username': 'blah',
    'password': ''
  });

  function setFormField(event) {
    setFormFields({
      ...formFields,
      [event.target.name]: event.target.value,
    });
  }

  function submit(event) {
    fetch("http://localhost:5000/register", {
      method: "post",
      headers: {
        "Content-type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify(formFields)
    });
    event.preventDefault()
  }

  return (
    <form onSubmit={submit}>
      <h5>Register form</h5>
      <label htmlFor="username">Username </label>
      <input
        type="text"
        name="username"
        value={formFields["username"]}
        onChange={setFormField}
      />
      <label htmlFor="password">Password </label>
      <input
        type="password"
        name="password"
        value={formFields["password"]}
        onChange={setFormField}
      />
      <input type="submit" />
    </form>
  );
}

export default RegisterForm;
