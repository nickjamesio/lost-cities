const URL = "http://lostcities.local";

async function login(username, password) {
  const response = await fetch("http://localhost:5000/login", {
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
    const response = await fetch("http://localhost:5000/register", {
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
