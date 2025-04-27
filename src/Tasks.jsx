import React, { useState } from 'react';
import { Container, Box, Typography, TextField, Button, List, ListItem, ListItemText, IconButton, Checkbox } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { ClearIcon } from '@mui/x-date-pickers';
import AddTaskPopup from './addtaskpopup';
import { Globaler, host_url } from './global.jsx';
import { set } from 'date-fns';
import CompleteTaskPopup from './completetaskpopup.jsx';
import { Tooltip } from '@mui/material';


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

const Tasks = () => {
    const [tasks, setTasks2] = useState([]);
    const setTasks = (newTasks) => {
        const sortedTasks = newTasks.sort((a, b) => a.duedate - b.duedate);
        setTasks2(sortedTasks);
    };
    const [taskDesc, setTaskDesc] = useState('');

    // Popup state
    const [openPopup_add, setOpenPopup_add] = useState(false);
    const [openPopup_complete, setOpenPopup_complete] = useState(false);
    const [taskToComplete, setTaskToComplete] = useState(null);

    // EAT IT:
    const getDisabled = (index) => {
        const task = tasks[index];
        return task.iscomplete;
    }
    const getChecked = (index) => {
        const task = tasks[index];
        return task.iscomplete;
    }
    const handleCheckboxClick = (index) => {
        const task = tasks[index];
        console.log(task);
        setTaskToComplete(task);
        setOpenPopup_complete(true);
    }
    const handleCompleteTask = async (taskid) => {
        const taskToComplete = tasks.find(task => task.taskid === taskid);
        taskToComplete.iscomplete = true;
        setTasks([...tasks]);
        refreshUserInfo();
        return;
    }


    // Fetch tasks from the server when the component mounts
    React.useEffect(() => {
        const fetchTasks = async () => {
            const data = await fetch(`${host_url}/api/tasks`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
            });
            if (!data.ok) {
                // Handle the error if the response is not OK
                alert("Error fetching tasks");
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
        setOpenPopup_add(true);
    };

    const handleDeleteTask = async (index) => {
        const taskToDelete = tasks[index];
        const data = await fetch(`${host_url}/api/tasks/${taskToDelete.taskid}`, {
            method: "DELETE",
            headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
            },
        });
        if (!data.ok) {
            // Handle the error if the response is not OK
            alert("Error deleting task");
        }
        else {
            const newTasks = tasks.filter((_, i) => i !== index);
            setTasks(newTasks);
        }
    };

    return (
        <Container maxWidth="sm" style={{ marginTop: '2rem' }}>
            <Typography variant="h4" gutterBottom>
                Your Tasks
            </Typography>
            
            <TextField
                fullWidth
                label="New Task"
                variant="outlined"
                value={taskDesc}
                onChange={(e) => setTaskDesc(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        handleAddTask();
                    }
                }}
                style={{ marginBottom: '1rem' }}
            />
            <br></br>
            
            <Button variant="contained" color="primary" onClick={handleAddTask} fullWidth>
                Add Task
            </Button>
            <br></br>
            <List>
                {tasks.map((task, index) => (
                    <ListItem
                        key={index}
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            padding: 1.5,
                            borderBottom: '1px solid',
                        }}
                    >
                        {/* Checkbox on the left */}
                        <Checkbox 
                            onClick={() => handleCheckboxClick(index)} 
                            checked={task.iscomplete} 
                            disabled={task.iscomplete}
                            sx={{ marginRight: 2 }} 
                        />
                        
                        {/* Task description */}
                        <Box sx={{ flex: 1 }}>
                            <Typography variant="body1" sx={{
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                display: '-webkit-box',
                                WebkitBoxOrient: 'vertical',
                                WebkitLineClamp: 2, // Limits description to 3 lines
                                width: 300
                            }}>
                                {task.description}
                            </Typography>
                            <Typography variant="body2">
                                <b>Due: {task.duedate.toLocaleString('en-US', {
                                    weekday: 'long',
                                    month: 'numeric',
                                    day: 'numeric',
                                    hour: 'numeric',
                                    minute: 'numeric',
                                })}</b>
                            </Typography>
                        </Box>

                        {/* Bets profile pictures */}
                        <Box sx={{ display: 'flex', marginLeft: 2 }}>
                            {task.bets && task.bets.slice(0, 3).map((bet, betIndex) => (
                                <Box
                                    key={betIndex}
                                    sx={{
                                        position: 'relative',
                                        marginRight: 1,
                                    }}
                                >
                                    <Tooltip title={bet.username} arrow placement="top">
                                        <img
                                            src={`https://ui-avatars.com/api/?name=${bet.username}`}
                                            alt={bet.username}
                                            style={{
                                                width: 30,
                                                height: 30,
                                                borderRadius: '50%',
                                                cursor: 'pointer',
                                            }}
                                        />
                                    </Tooltip>
                                </Box>
                            ))}
                        </Box>


                        {/* Delete button */}
                        <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteTask(index)}>
                            <DeleteIcon />
                        </IconButton>
                    </ListItem>
                ))}
            </List>
            <AddTaskPopup
                open={openPopup_add}
                taskDesc={taskDesc}
                onClose={() => {
                    setTaskDesc('');
                    setOpenPopup_add(false);
                }}
                onSubmit={async (newtask) => {
                    const data = await fetch(`${host_url}/api/tasks`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${localStorage.getItem("token")}`,
                        },
                        mode: "cors",
                        body: JSON.stringify({ desc: newtask.taskDescription, date: newtask.dueDate }),
                    });

                    const currentCounter = parseInt(localStorage.getItem("counter") || "0", 10);
                    localStorage.setItem("counter", currentCounter + 1);

                    if (!data.ok) {
                        // Handle the error if the response is not OK
                        alert("Error adding task");
                    }
                    else {
                        const taskID = await data.json();
                        setTasks([...tasks, { description: newtask.taskDescription, duedate: new Date(newtask.dueDate), taskid: taskID, iscomplete: false, username: localStorage.getItem("username") }]);
                        setTaskDesc('');
                        setOpenPopup_add(false);
                    }
                }}  
            />
            <CompleteTaskPopup
                open={openPopup_complete}
                taskToComplete={taskToComplete}
                onClose={() => {
                    setTaskToComplete(null);
                    setOpenPopup_complete(false);
                }}
                onSubmit={handleCompleteTask}
            />
        </Container>
    );
};

export default Tasks;
