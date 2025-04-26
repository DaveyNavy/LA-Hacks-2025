async function getToken(user, pass) {
  const data = await fetch("http://localhost:3000/api/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    mode: "cors",
    body: JSON.stringify({ username: user, password: pass}),
  });
  const response = await data.json();
  return response["token"];
}
