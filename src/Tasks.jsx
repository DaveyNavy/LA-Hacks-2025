import React, { useState } from 'react';
import { Container, Typography, TextField, Button, List, ListItem, ListItemText, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const Tasks = () => {
    const [tasks, setTasks] = useState([]);
    const [task, setTask] = useState('');

    const handleAddTask = () => {
        if (task.trim()) {
            setTasks([...tasks, task]);
            setTask('');
        }
    };

    const handleDeleteTask = (index) => {
        const newTasks = tasks.filter((_, i) => i !== index);
        setTasks(newTasks);
    };

    return (
        <Container maxWidth="sm" style={{ marginTop: '2rem' }}>
            <Typography variant="h4" gutterBottom>
                To-Do List
            </Typography>
            <TextField
                fullWidth
                label="New Task"
                variant="outlined"
                value={task}
                onChange={(e) => setTask(e.target.value)}
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
                        <ListItemText primary={task} />
                    </ListItem>
                ))}
            </List>
        </Container>
    );
};

export default Tasks;