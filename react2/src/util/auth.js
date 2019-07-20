const URL = "http://localhost:5000";

async function login(form) {
  const response = await fetch(`${URL}/login`, {
    method: "post",
    headers: {
      "Content-type": "application/json"
    },
    credentials: "include",
    body: JSON.stringify({
      username: form.username,
      password: form.password
    })
  });
  const data = await response.json();
  return { code: response.status, data };
}

async function register(form) {
  const response = await fetch(`${URL}/register`, {
    method: "post",
    headers: {
      "Content-type": "application/json"
    },
    credentials: "include",
    body: JSON.stringify({
      username: form.username,
      email: form.email,
      password: form.password
    })
  });
  const data = await response.json();
  return { code: response.status, data };
}

async function logout() {
  const response = await fetch(`${URL}/logout`, {
    method: "get",
    credentials: "include",
  });
  const data = await response.json();
  return { code: response.status, data };
}

async function me(form) {
  const response = await fetch(`${URL}/me`, {
    method: "get",
    credentials: "include",
  });
  const data = await response.json();
  return { code: response.status, data };    
}

export { login, logout, register, me };
