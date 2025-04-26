async function getToken() {
  const data = await fetch("http://localhost:3000/api/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    mode: "cors",
    body: JSON.stringify({ username: "admin", password: "123" }),
  });
  const response = await data.json();
  return response["token"];
}
