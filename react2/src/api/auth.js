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
  console.log(data);
  return data;
}

function register(username, password) {
  fetch("http://localhost:5000/register", {
    method: "post",
    headers: {
      "Content-type": "application/json"
    },
    credentials: "include",
    body: JSON.stringify({
      username,
      password
    })
  }).then(function(response) {
    return response.json();
  });
}

export { login, register };
