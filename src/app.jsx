import React, { useEffect, useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  IconButton, 
  Button, 
  Box,
  useTheme,
} from '@mui/material'; 
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import Tasks from './Tasks.jsx';
import TabSelector from './TabSelector.jsx';
import { Globaler, host_url } from './global.jsx';
import { useNavigate } from 'react-router-dom';
import { useColorMode } from './theme.jsx'; 
import '@fontsource/poppins'; // Defaults to weight 400

import coin from "../public/betcoin.png";


const refreshUserInfo = async () => {
    const response = await fetch(`${host_url}/api/users/${Globaler.username}/info`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem('token')}`
        },
    });

    if (response.ok) {
        const data = await response.json();
        console.log(data);
        console.log(data[0].currency);
        Globaler.setCurrency(parseInt(data[0].currency, 10)); // Update currency as integer
        localStorage.setItem("currency", data[0].currency); // Persist in localStorage
    } else {
        console.error("Failed to refresh user info");
    }
}


function App() {
    const { toggleColorMode } = useColorMode(); 
    const theme = useTheme(); 

    const [currency, setCurrency] = useState(Globaler.currency);
    Globaler.setCurrency = setCurrency; // Set the currency state in Globaler

    // Login routing:
    const navigate = useNavigate();
    const goToLogin = () => {
        navigate('/login');
    };
    React.useEffect(() => {
        if (!Globaler.isLoggedIn) {
            goToLogin();
        }
        else {
            refreshUserInfo();
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
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          minHeight: '100vh',
          bgcolor: 'background.default',
          color: 'text.primary'
        }}>
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
                     <img
                          src={coin}
                          alt="Currency"
                          style={{ width: 30, height: 30 }}
                      />
                     <Typography variant="h6" sx={{ mr: 4, ml: 2 }}>
                            {currency}
                      </Typography>
                      <IconButton onClick={toggleColorMode} color="inherit">
                          {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                      </IconButton>
                      <Button color="inherit" onClick={handleLogout} sx={{ ml: 2 }}>
                          Logout
                      </Button>
                  </Box>
              </Toolbar>
          </AppBar>

          {/* Main Content */}
          <Box 
            component="main" 
            sx={{ 
              display: 'flex', 
              p: 2, 
              flexGrow: 1,
              bgcolor: 'background.default',
            }}
          >
            <Box sx={{ flex: 1, mr: 1 }}>
                <Tasks />
            </Box>
            <Box sx={{ flex: 1, ml: 1 }}>
                <TabSelector />
            </Box>
          </Box>
        </Box>
    );
}

export default App;
