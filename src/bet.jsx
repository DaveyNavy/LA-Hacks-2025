import React, { useState } from 'react';
import { Box, Typography, TextField, Button, List, ListItem, ListItemText, IconButton } from '@mui/material';
import BetTaskPopup from './bettaskpopup';
import { Globaler, host_url } from './global.jsx';


const Tab1 = () => {
    const [tasks, setTasks2] = useState([]);
    const setTasks = (newTasks) => {
        const sortedTasks = newTasks.sort((a, b) => a.duedate - b.duedate);
        setTasks2(sortedTasks);
    };

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
    
    // Popup state
    const [openPopup, setOpenPopup] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);


    // Fetch tasks from the server when the component mounts
    React.useEffect(() => {
        const fetchTasks = async () => {
            const data = await fetch(`${host_url}/api/friends/tasks`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
            });
            if (!data.ok) {
                // Handle the error if the response is not OK
                alert("Error fetching friend tasks");
            } else {
                const fetchedTasks = await data.json();
                console.log(fetchedTasks);
                setTasks(fetchedTasks.map(task => ({
                    ...task,
                    duedate: new Date(task.duedate),
                })));
            }
        };
        fetchTasks();
    }, []);

    const handleBetTask = (index) => {
        const bets = tasks[index].bets || [];
        bets.sort((a, b) => a.date - b.date).reverse();
        setSelectedTask(tasks[index]);
        setOpenPopup(true);
    };

    return (
        <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
            <Box
                    sx={{
                      flex: 1,
                      position: "relative",
                      padding: 1.5,
                    }}
                  >
            <Typography variant="h6" sx={{ marginBottom: 2 }}>
                Bet on Tasks
            </Typography>
            
            <List style={{ marginTop: '1rem' }}>
                {tasks.map((task, index) => (
                    <ListItem 
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: 1.5,
                            marginBottom: 2,
                            border: (theme) => `1px solid ${theme.palette.border}`,
                            borderRadius: '4px',
                            width: '100%',
                        }}
                        key={index} 
                        button="true"
                        onClick={() => handleBetTask(index)} 
                        style={{ transition: 'background-color 0.3s' }}
                    >
                        {/* Left column - Takes 4/5ths of the width */}
                        <Box sx={{ display: 'flex', flexDirection: 'column', width: '70%', marginRight: 3 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                <Typography variant="h6"><b><u>{task.username}</u></b></Typography>
                                <Typography variant="body2" sx={{ textAlign: 'right' }}>
                                    <b>Due: </b>
                                    { task.duedate.toLocaleString('en-US', {
                                        weekday: 'long',
                                        month: 'numeric',
                                        day: 'numeric',
                                        hour: 'numeric',
                                        minute: 'numeric',
                                    })}
                                </Typography>
                            </Box>
                            <Typography
                                variant="body2"
                                sx={{
                                    marginTop: 1,
                                    overflow: 'hidden',       // Hides overflowed content
                                    textOverflow: 'ellipsis', // Adds "..." at the end of truncated text
                                    width: 450
                                }}
                            >
                                {task.description}
                            </Typography>

                        </Box>
                        {/* Right column - Takes 1/5th of the width */}
                        <Box sx={{ display: 'flex', flexDirection: 'column', width: '30%', alignItems: 'flex-end', borderLeft: '1px solid', paddingLeft: 3, paddingRight: 1, alignContent:'center' }}>
                            <Typography variant="body2">
                                Number of Bets: {task.bets ? task.bets.length : 0}
                            </Typography>
                            <Button
                                variant="contained"
                                onClick={() => handleBetTask(index)}
                                sx={{ marginTop: 1, width: '100%'}}
                            >
                                Bet Now
                            </Button>
                        </Box>
                    </ListItem>
                ))}
            </List>

            </Box>
            <BetTaskPopup
                open={openPopup}
                selectedTask={selectedTask}
                onClose={() => {
                    setSelectedTask(null);
                    setOpenPopup(false);
                }}
                onSubmit={async ({betAmount, dueDate, taskid}) => {
                    console.log("Bet amount:", betAmount);
                    console.log("Due date:", dueDate);
                    console.log("Task ID:", taskid);
                    const data = await fetch(`${host_url}/api/bets/${taskid}`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${localStorage.getItem("token")}`,
                        },
                        mode: "cors",
                        body: JSON.stringify({ betAmount: Number(betAmount), date: dueDate }),
                    });
                    if (!data.ok) {
                        // Handle the error if the response is not OK
                        const json = await data.json();
                        console.log(json);
                        alert("Error placing bet: " + json.error);
                    }
                    else {
                        const result = await data.json();
                        console.log(result);
                        setSelectedTask(null);
                        setOpenPopup(false);
                        refreshUserInfo();
                    }
                }}
            />
        </Box>
    );
};

export default Tab1;