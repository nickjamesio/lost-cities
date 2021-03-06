import { API_URL } from "./constants";

export async function login(form) {
  const response = await fetch(`${API_URL}/login`, {
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

export async function register(form) {
  const response = await fetch(`${API_URL}/register`, {
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

export async function logout() {
  const response = await fetch(`${API_URL}/logout`, {
    method: "get",
    credentials: "include"
  });
  const data = await response.json();
  return { code: response.status, data };
}

export async function me(form) {
  const response = await fetch(`${API_URL}/me`, {
    method: "get",
    credentials: "include"
  });
  const data = await response.json();
  return { code: response.status, data };
}
