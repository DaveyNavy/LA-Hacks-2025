import React, { useState } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import { Globaler, host_url } from "./global";
import { useNavigate } from "react-router-dom";

async function getToken(user, pass) {
  console.log(`${host_url}/api/users/login`);
  const data = await fetch(`${host_url}/api/users/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    mode: "cors",
    body: JSON.stringify({ username: user, password: pass }),
  });

  if (!data.ok) {
    // Handle the error if the response is not OK
    throw new Error("Login failed");
  }

  const response = await data.json();
  return response["token"];
}

function Login() {
  const [user, setUsername] = useState("");
  const [pass, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (user && pass) {
      try {
        const token = await getToken(user, pass);

        // Login:
        Globaler.login(user, token);
        navigate("/app");

        // Reset any error messages
        setError("");
      } catch (err) {
        // Handle login failure
        setError("Login failed. Please check your credentials.");
        console.log(err);
      }
    } else {
      setError("Please enter both username and password");
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <Typography variant="h4" gutterBottom>
        Login
      </Typography>
      {error && (
        <Typography color="error" sx={{ marginBottom: 2 }}>
          {error}
        </Typography>
      )}
      <TextField
        label="Username"
        variant="outlined"
        value={user}
        onChange={(e) => setUsername(e.target.value)}
        sx={{ marginBottom: 2, width: "300px" }}
      />
      <TextField
        label="Password"
        variant="outlined"
        type="password"
        value={pass}
        onChange={(e) => setPassword(e.target.value)}
        sx={{ marginBottom: 2, width: "300px" }}
      />
      <Button variant="contained" color="primary" onClick={handleLogin}>
        <b>Login</b>
      </Button>
      <Button
        variant="text"
        color="primary"
        onClick={() => navigate("/register")}
        sx={{ marginTop: 2 }}
      >
        <b>Register</b>
      </Button>
      <Button
        variant="text"
        color="primary"
        onClick={() => navigate("/")}
        sx={{ marginTop: 1 }}
      >
        <b>Back to Homepage</b>
      </Button>
    </Box>
  );
}

export default Login;
