import React, { useState } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';

async function getToken(user, pass) {
    const data = await fetch("http://localhost:3000/api/users/login", {
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

function Login({ onLoginSuccess }) {
    const [user, setUsername] = useState('');
    const [pass, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async () => {
        if (user && pass) {
            try {
                const token = await getToken(user, pass);
                
                // Save the token in localStorage or sessionStorage
                localStorage.setItem("token", token);

                // Call the parent function to indicate successful login
                onLoginSuccess(user);

                // Reset any error messages
                setError('');
            } catch (err) {
                // Handle login failure
                setError('Login failed. Please check your credentials.');
            }
        } else {
            setError('Please enter both username and password');
        }
    };

    return (
        <Box
            sx={{
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
            }}
        >
            <Typography variant="h4" gutterBottom>Login</Typography>
            {error && <Typography color="error" sx={{ marginBottom: 2 }}>{error}</Typography>}
            <TextField
                label="Username"
                variant="outlined"
                value={user}
                onChange={(e) => setUsername(e.target.value)}
                sx={{ marginBottom: 2, width: '300px' }}
            />
            <TextField
                label="Password"
                variant="outlined"
                type="password"
                value={pass}
                onChange={(e) => setPassword(e.target.value)}
                sx={{ marginBottom: 2, width: '300px' }}
            />
            <Button variant="contained" color="primary" onClick={handleLogin}>
                Login
            </Button>
        </Box>
    );
}

export default Login;
