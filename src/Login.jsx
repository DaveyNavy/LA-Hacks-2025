import React, { useState } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';

function Login({ onLoginSuccess }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        if (username && password) {
            onLoginSuccess(username); // pass the username back!
        } else {
            alert('Please enter both username and password');
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
            <TextField
                label="Username"
                variant="outlined"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                sx={{ marginBottom: 2, width: '300px' }}
            />
            <TextField
                label="Password"
                variant="outlined"
                type="password"
                value={password}
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
