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

async function getData() {
  const data = await fetch("http://localhost:3000/api/tasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJuYW1lIjoidGVzdCIsInBhc3N3b3JkIjoiJDJiJDEwJENVWC91NEd4akRHaHFlNFhwNVU1UC4xTXBOYURNc3BQb3p1NEJrQU9JamlFeXZrZnF6V0hhIiwiY3VycmVuY3kiOjB9LCJpYXQiOjE3NDU2OTM0NjZ9.AUpWkFMkSNsUkcCp_Z-BZi3Zh5AZpyKiS2h5NPphjSU",
    },
    mode: "cors",
    body: JSON.stringify({ desc: "admin", date: "2022-12-03" }),
  });
  console.log("Done");
}

await getData();
