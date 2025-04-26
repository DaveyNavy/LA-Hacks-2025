import React, { useState } from 'react';
import { Box, Typography, Avatar, MenuItem, Select, FormControl, InputLabel } from '@mui/material';

// Temporary mock data
const friends = [
    { username: 'Friend1', curr: 1000, numTasks: 12 },
    { username: 'Friend2', curr: 850, numTasks: 15 },
    { username: 'Friend3', curr: 720, numTasks: 8 },
];

// Mapping backend fields to friendly names
const FIELD_MAPPING = {
    currency: 'curr',
    tasks: 'numTasks',
};

const Tab3 = () => {
    const [sortBy, setSortBy] = useState('currency');

    const handleChange = (event) => {
        setSortBy(event.target.value);
    };

    // Sort friends based on selected sortBy
    const sortedFriends = [...friends].sort((a, b) => {
        const field = FIELD_MAPPING[sortBy];
        return b[field] - a[field];
    });

    return (
        <Box sx={{ padding: 2 }}>
            {/* Dropdown for selecting sort criteria */}
            <FormControl fullWidth sx={{ marginBottom: 3 }}>
                <InputLabel>Sort By</InputLabel>
                <Select value={sortBy} label="Sort By" onChange={handleChange}>
                    <MenuItem value="currency">Currency</MenuItem>
                    <MenuItem value="tasks">Tasks Completed</MenuItem>
                </Select>
            </FormControl>

            {/* Friend rows */}
            {sortedFriends.map((friend, index) => (
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
                            src="https://via.placeholder.com/40" // placeholder image
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
                                    {friend[FIELD_MAPPING.currency]}
                                </Typography>
                                <img
                                    src="https://via.placeholder.com/20" // placeholder coin image
                                    alt="Coin"
                                    style={{ width: 20, height: 20 }}
                                />
                            </>
                        ) : (
                            <Typography variant="body1">
                                {friend[FIELD_MAPPING.tasks]} tasks
                            </Typography>
                        )}
                    </Box>
                </Box>
            ))}
        </Box>
    );
};

export default Tab3;
