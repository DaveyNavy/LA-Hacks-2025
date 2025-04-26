import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Avatar, List, ListItem, ListItemAvatar, ListItemText, Paper } from '@mui/material';

// Mock Data
const allUsers = [
    { username: 'Kennedy', profilePic: 'https://via.placeholder.com/40' },
    { username: 'Aaron', profilePic: 'https://via.placeholder.com/40' },
    { username: 'Joanna', profilePic: 'https://via.placeholder.com/40' },
    { username: 'Jomnaq', profilePic: 'https://via.placeholder.com/40' },
];

// Incoming requests mock
const initialIncomingRequests = [
    { username: 'David', profilePic: 'https://via.placeholder.com/40' },
    { username: 'Zavid', profilePic: 'https://via.placeholder.com/40' },
];

const Tab2 = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [outgoingRequests, setOutgoingRequests] = useState([]);
    const [incomingRequests, setIncomingRequests] = useState(initialIncomingRequests);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSendRequest = (user) => {
        setOutgoingRequests((prev) => [...prev, user]);
        setSearchTerm(''); // clear search
    };

    const handleAddBack = (username) => {
        setIncomingRequests((prev) => prev.filter((user) => user.username !== username));
        // TO DO: add code to actually add the friend to your friend list
    };

    // Filter users for search
    const filteredUsers = allUsers.filter(
        (user) =>
            user.username.toLowerCase().includes(searchTerm.toLowerCase()) &&
            !outgoingRequests.some((req) => req.username === user.username)
    );

    return (
        <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
            {/* Top Half */}
            <Box sx={{ flex: 1, position: 'relative', padding: 2, borderBottom: '1px solid #ccc' }}>
                <Typography variant="h6" sx={{ marginBottom: 2 }}>
                    Add Friends
                </Typography>

                {/* Search Bar */}
                <Box sx={{ position: 'relative' }}>
                    <TextField
                        fullWidth
                        label="Search users"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        variant="outlined"
                    />

                    {/* Search Results Dropdown */}
                    {searchTerm && filteredUsers.length > 0 && (
                        <Paper
                            sx={{
                                position: 'absolute',
                                top: '100%',
                                left: 0,
                                right: 0,
                                maxHeight: 200,
                                overflowY: 'auto',
                                zIndex: 10,
                            }}
                        >
                            <List>
                                {filteredUsers.map((user, index) => (
                                    <ListItem
                                        key={index}
                                        secondaryAction={
                                            <Button variant="contained" onClick={() => handleSendRequest(user)}>
                                                Send Request
                                            </Button>
                                        }
                                    >
                                        <ListItemAvatar>
                                            <Avatar src={user.profilePic} alt={user.username} />
                                        </ListItemAvatar>
                                        <ListItemText primary={user.username} />
                                    </ListItem>
                                ))}
                            </List>
                        </Paper>
                    )}
                </Box>

                {/* Pending Outgoing Requests */}
                <Box
                    sx={{
                        marginTop: 2,
                        height: 'calc(100% - 100px)', // adjust to leave space for search bar
                        overflowY: 'auto',
                        paddingRight: 1,
                    }}
                >
                    {outgoingRequests.length > 0 && (
                        <>
                            <Typography variant="subtitle1" sx={{ marginBottom: 1 }}>
                                Pending Requests
                            </Typography>
                            <List>
                                {outgoingRequests.map((user, index) => (
                                    <ListItem key={index}>
                                        <ListItemAvatar>
                                            <Avatar src={user.profilePic} alt={user.username} />
                                        </ListItemAvatar>
                                        <ListItemText primary={user.username} />
                                        <Typography variant="body2" sx={{ color: 'gray' }}>
                                            Pending
                                        </Typography>
                                    </ListItem>
                                ))}
                            </List>
                        </>
                    )}
                </Box>
            </Box>

            {/* Bottom Half */}
            <Box sx={{ flex: 1, padding: 2, overflowY: 'auto' }}>
                <Typography variant="h6" sx={{ marginBottom: 2 }}>
                    Incoming Friend Requests
                </Typography>

                <List>
                    {incomingRequests.map((user, index) => (
                        <ListItem
                            key={index}
                            secondaryAction={
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => handleAddBack(user.username)}
                                >
                                    Add Back
                                </Button>
                            }
                        >
                            <ListItemAvatar>
                                <Avatar src={user.profilePic} alt={user.username} />
                            </ListItemAvatar>
                            <ListItemText primary={user.username} />
                        </ListItem>
                    ))}
                </List>
            </Box>
        </Box>
    );
};

export default Tab2;
