import React from 'react';
import { Button, AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import TabSelector from './TabSelector.jsx';
import Tasks from './Tasks.jsx';

function App() {
    return (
        <div>
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu">
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        My MUI App
                    </Typography>
                    <Button color="inherit">Login</Button>
                </Toolbar>
            </AppBar>
            <div style={{ display: 'flex', marginTop: '16px' }}>
                <div style={{ flex: 1, marginRight: '8px' }}>
                    <Tasks />
                </div>
                <div style={{ flex: 1, marginLeft: '8px' }}>
                    <TabSelector />
                </div>
            </div>
        </div>
    );
}

export default App;