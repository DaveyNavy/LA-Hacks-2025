import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Button, Box } from '@mui/material';
import Tasks from './Tasks.jsx';
import TabSelector from './TabSelector.jsx';
import { Globaler, host_url } from './global.jsx';
import { useNavigate } from 'react-router-dom';


function App() {
    // Login routing:
    const navigate = useNavigate();
    const goToLogin = () => {
        navigate('/login');
    };
    React.useEffect(() => {
        if (!Globaler.isLoggedIn) {
            goToLogin();
        }
    }, []);
    const handleLogout = () => {
        Globaler.logout();
        goToLogin();
    };
    // Profile routing:
    const handleProfileClick = () => {
        console.log('Profile clicked');
    };

    return (
        <>
            <AppBar position="static">
                <Toolbar sx={{ justifyContent: 'space-between' }}>
                    {/* LEFT side */}
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton onClick={handleProfileClick} sx={{ p: 0 }}>
                            <img
                                src={`https://ui-avatars.com/api/?name=${Globaler.username}`}
                                alt="Profile"
                                style={{ width: 40, height: 40, borderRadius: '50%' }}
                            />
                        </IconButton>
                        <Typography variant="h6" sx={{ ml: 2 }}>
                            Welcome back{Globaler.username ? `, ${Globaler.username}!` : '!'}
                        </Typography>
                    </Box>

                    {/* RIGHT side */}
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="h6" sx={{ mr: 1 }}>
                            {Globaler.currency}
                        </Typography>
                        <img
                            src="src/assets/betcoin.png" // placeholder coin image
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
    );
}

export default App;
