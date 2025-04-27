import React, { useState } from 'react';
import { Container, Typography, TextField, Button, List, ListItem, ListItemText, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddTaskPopup from './addtaskpopup';

const Tab1 = () => {
    const [tasks, setTasks2] = useState([]);
    const setTasks = (newTasks) => {
        const sortedTasks = newTasks.sort((a, b) => a.duedate - b.duedate);
        setTasks2(sortedTasks);
    };
    const [taskDesc, setTaskDesc] = useState('');

    // Popup state
    const [openPopup, setOpenPopup] = useState(false);


    // Fetch tasks from the server when the component mounts
    React.useEffect(() => {
        const fetchTasks = async () => {
            const data = await fetch("http://localhost:3000/api/friends/tasks", {
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

    const handleAddTask = () => {
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
                        button 
                        onClick={() => alert(`Task clicked: ${task.description}`)} 
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
            <AddTaskPopup
                open={openPopup}
                taskDesc={taskDesc}
                onClose={() => {
                    setTaskDesc('');
                    setOpenPopup(false);
                }}
                onSubmit={async (newtask) => {
                    const formattedDate = newtask.dueDate.toISOString().split('T')[0]; // Convert to "YYYY-MM-DD" format
                    const data = await fetch("http://localhost:3000/api/tasks", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${localStorage.getItem("token")}`,
                        },
                        mode: "cors",
                        body: JSON.stringify({ desc: newtask.taskDescription, date: formattedDate }),
                    });
                    if (!data.ok) {
                        // Handle the error if the response is not OK
                        alert("Error adding task");
                    }
                    else {
                        const taskID = await data.json();
                        setTasks([...tasks, { description: newtask.taskDescription, duedate: new Date(newtask.dueDate), taskid: taskID }]);
                        setTaskDesc('');
                        setOpenPopup(false);
                    }
                }}
            />
        </Container>
    );
};

export default Tab1;