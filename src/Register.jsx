import React, { useState } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';
import { Globaler, host_url } from './global';
import { useNavigate } from 'react-router-dom';

async function tryRegister(user, pass) {
    const data = await fetch(`${host_url}/api/users/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        mode: "cors",
        body: JSON.stringify({ username: user, password: pass, confirmPassword: pass }),
    });

    if (!data.ok) {
        // Handle the error if the response is not OK
        throw new Error("Register failed");
    }
}

function Register() {
    const [user, setUsername] = useState('');
    const [pass, setPassword] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        if (user && pass && confirmPass && pass == confirmPass) {
            try {
                await tryRegister(user, pass);
                
                navigate('/login');                

                // Reset any error messages
                setError('');
            } catch (err) {
                // Handle login failure
                setError('Register failed. Please try again later.');
                console.log(err);
            }
        } else {
            setError('Please make sure passwords match. ');
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
            <Typography variant="h4" gutterBottom>Register</Typography>
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
            <TextField
                label="Confirm Password"
                variant="outlined"
                type="password"
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
                sx={{ marginBottom: 2, width: '300px' }}
            />

            <Button variant="contained" color="primary" onClick={handleLogin}>
                Continue
            </Button>
            <Button variant="text" color="secondary" onClick={() => navigate('/login')} sx={{ marginTop: 2 }}>
                Back to login
            </Button>
            <Button variant="text" color="secondary" onClick={() => navigate('/')} sx={{ marginTop: 2 }}>
                Back to Homepage
            </Button>
        </Box>
    );
}

export default Register;
