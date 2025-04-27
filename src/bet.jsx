import React, { useState } from 'react';
import { Container, Typography, TextField, Button, List, ListItem, ListItemText, IconButton } from '@mui/material';
import BetTaskPopup from './bettaskpopup';
import { Globaler, host_url } from './global.jsx';


const Tab1 = () => {
    const [tasks, setTasks2] = useState([]);
    const setTasks = (newTasks) => {
        const sortedTasks = newTasks.sort((a, b) => a.duedate - b.duedate);
        setTasks2(sortedTasks);
    };
    
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
        <Container maxWidth="sm" style={{ marginTop: '2rem' }}>
            <Typography variant="h4" gutterBottom>
                Bet on Tasks
            </Typography>
            <List style={{ marginTop: '1rem' }}>
                {tasks.map((task, index) => (
                    <ListItem 
                        key={index} 
                        button="true"
                        onClick={() => handleBetTask(index)} 
                        style={{ transition: 'background-color 0.3s' }}
                    >
                        <ListItemText primary={task.username} />
                        <ListItemText primary={task.description} />
                        <ListItemText primary={task.duedate.toLocaleString('en-US', {
                            weekday: 'long',
                            month: 'numeric',
                            day: 'numeric',
                            hour: 'numeric',
                            minute: 'numeric',
                        })} />
                        <ListItemText primary={`Number of Bets: ${task.bets ? task.bets.length : 0}`} />
                    </ListItem>
                ))}
            </List>
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
                        setTaskDesc('');
                        setOpenPopup(false);
                    }
                }}
            />
        </Container>
    );
};

export default Tab1;