import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Button, Box } from '@mui/material';
import Tasks from './Tasks.jsx';
import TabSelector from './TabSelector.jsx';
import Login from './login.jsx'; // idk why but this has to be lowercase or it mf explodes

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');
    const [currency, setCurrency] = useState(1000); // example currency amount

    const handleLoginSuccess = (enteredUsername) => {
        setUsername(enteredUsername);
        setIsLoggedIn(true);
    };

    const handleLogout = () => {
        setUsername('');
        setIsLoggedIn(false);
    };

    const handleProfileClick = () => {
        console.log('Profile clicked');
    };

    return (
        <div>
            {!isLoggedIn ? (
                <Login onLoginSuccess={handleLoginSuccess} />
            ) : (
                <>
                    <AppBar position="static">
                        <Toolbar sx={{ justifyContent: 'space-between' }}>
                            {/* LEFT side */}
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <IconButton onClick={handleProfileClick} sx={{ p: 0 }}>
                                    <img 
                                        src='https://via.placeholder.com/40'
                                        alt="Profile" 
                                        style={{ width: 40, height: 40, borderRadius: '50%' }}
                                    />
                                </IconButton>
                                <Typography variant="h6" sx={{ ml: 2 }}>
                                    Welcome back{username ? `, ${username}!` : '!'}
                                </Typography>
                            </Box>

                            {/* RIGHT side */}
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Typography variant="h6" sx={{ mr: 1 }}>
                                    {currency}
                                </Typography>
                                <img 
                                    src="https://via.placeholder.com/20" // placeholder coin image
                                    alt="Currency" 
                                    style={{ width: 30, height: 30 }}
                                />
                                <Button color="inherit" onClick={handleLogout} sx={{ ml: 2 }}>
                                    Logout
                                </Button>
                            </Box>
                        </Toolbar>
                    </AppBar>

                    {/* Main Content */}
                    <div style={{ display: 'flex', marginTop: '16px' }}>
                        <div style={{ flex: 1, marginRight: '8px' }}>
                            <Tasks />
                        </div>
                        <div style={{ flex: 1, marginLeft: '8px' }}>
                            <TabSelector />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default App;
