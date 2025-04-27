import React, { useState, useEffect } from 'react';
import { Box, Typography, Avatar, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import "dotenv/config";

// Mapping backend fields to friendly names
const FIELD_MAPPING = {
    currency: 'curr',
    tasks: 'numTasks',
    username: 'username',
};

const Tab3 = () => {
    const [friends, setFriends] = useState([]);
    const [sortBy, setSortBy] = useState('currency');

    useEffect(() => {
        const fetchFriends = async () => {
            try {
                const response = await fetch(`${host_url}/api/friends`, {
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token'),
                    },
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                const mappedData = data.map(friend => ({
                    username: friend.username,
                    curr: friend.currency,
                    numTasks: friend.numoftaskscompleted,
                }));
                setFriends(mappedData);
            } catch (error) {
                console.error('Error fetching friends:', error);
            }
        };
        

        fetchFriends();
    }, []);

    const handleChange = (event) => {
        setSortBy(event.target.value);
    };

    // Sort friends based on selected sortBy
    const sortedFriends = [...friends].sort((a, b) => {
        const field = FIELD_MAPPING[sortBy];
        if (field === 'username') {
            return a[field].localeCompare(b[field]);
        }
        return b[field] - a[field];
    });

    return (
        <Box sx={{ padding: 2 }}>
            {/* Dropdown for selecting sort criteria */}
            <FormControl fullWidth sx={{ marginBottom: 3 }}>
                <InputLabel>Sort By</InputLabel>
                <Select value={sortBy} label="Sort By" onChange={handleChange}>
                    <MenuItem value="currency">BetCoin</MenuItem>
                    <MenuItem value="tasks">Tasks Completed</MenuItem>
                    <MenuItem value="username">Username (A-Z)</MenuItem>
                </Select>
            </FormControl>

            {/* Conditional rendering */}
            {sortedFriends.length === 0 ? (
                <Typography variant="body1" align="center" color="text.secondary">
                    No friends added yet
                </Typography>
            ) : (
                sortedFriends.map((friend, index) => (
                    <Box
                        key={index}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: 2,
                            marginBottom: 2,
                            border: '1px solid #ddd',
                            borderRadius: '12px',
                            backgroundColor: '#fafafa',
                        }}
                    >
                        {/* Left side: Avatar + Username */}
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar
                                src={`https://ui-avatars.com/api/?name=${friend.username}`}
                                alt={friend.username}
                                sx={{ width: 40, height: 40, marginRight: 2 }}
                            />
                            <Typography variant="body1">{friend.username}</Typography>
                        </Box>

                        {/* Right side: Currency or Tasks */}
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {sortBy === 'currency' ? (
                                <>
                                    <Typography variant="body1" sx={{ marginRight: 1 }}>
                                        {friend.curr}
                                    </Typography>
                                    <img
                                        src="/src/assets/betcoin.png"
                                        alt="Coin"
                                        style={{ width: 20, height: 20 }}
                                    />
                                </>
                            ) : sortBy === 'tasks' ? (
                                <Typography variant="body1">
                                    {friend.numTasks} tasks
                                </Typography>
                            ) : null}
                        </Box>
                    </Box>
                ))
            )}
        </Box>
    );
};

export default Tab3;
