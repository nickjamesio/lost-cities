const URL = "http://lostcities.local:5000";

async function login(username, password) {
  const response = await fetch(`${URL}/login`, {
    method: "post",
    headers: {
      "Content-type": "application/json"
    },
    credentials: "include",
    body: JSON.stringify({
      username,
      password
    })
  });
  const data = await response.json();
  return data;
}

async function register(username, password) {
    const response = await fetch(`${URL}/register`, {
      method: "post",
      headers: {
        "Content-type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify({
        username,
        password
      })
    });
    const data = await response.json();
    return data;
  }

export { login, register };
