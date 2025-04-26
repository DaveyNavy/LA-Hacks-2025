import React, { useState } from 'react';
import { Container, Typography, TextField, Button, List, ListItem, ListItemText, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddTaskPopup from './addtaskpopup';

const Tasks = () => {
    const [tasks, setTasks] = useState([]);
    const [taskDesc, setTaskDesc] = useState('');

    // Popup state
    const [openPopup, setOpenPopup] = useState(false);


    // Fetch tasks from the server when the component mounts
    React.useEffect(() => {
        const fetchTasks = async () => {
            const data = await fetch("http://localhost:3000/api/tasks", {
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
        setOpenPopup(true);
    };

    const handleDeleteTask = async (index) => {
        const taskToDelete = tasks[index];
        const data = await fetch(`http://localhost:3000/api/tasks/${taskToDelete.id}`, {
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
            <Button variant="contained" color="primary" onClick={handleAddTask} fullWidth>
                Add Task
            </Button>
            <List style={{ marginTop: '1rem' }}>
                {tasks.map((task, index) => (
                    <ListItem
                        key={index}
                        secondaryAction={
                            <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteTask(index)}>
                                <DeleteIcon />
                            </IconButton>
                        }
                    >
                        <ListItemText primary={task.description} />
                        <ListItemText primary={task.duedate.toLocaleDateString()} />
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
                        setTasks([...tasks, { description: newtask.taskDescription, duedate: new Date(newtask.dueDate), id: taskID }]);
                        setTaskDesc('');
                        setOpenPopup(false);
                    }
                }}  
            />
        </Container>
    );
};

export default Tasks;