import React, { useState } from 'react';
import { Container, Typography, TextField, Button, List, ListItem, ListItemText, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddTaskPopup from './addtaskpopup';

const Tasks = () => {
    const [tasks, setTasks] = useState([]);
    const [taskDesc, setTaskDesc] = useState('');

    // Popup state
    const [openPopup, setOpenPopup] = useState(false);

    const handleAddTask = () => {
        setOpenPopup(true);
    };

    const handleDeleteTask = (index) => {
        const newTasks = tasks.filter((_, i) => i !== index);
        setTasks(newTasks);
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
                        <ListItemText primary={task.taskDescription} />
                        <ListItemText primary={task.dueDate.toLocaleDateString()} />
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
                onSubmit={(newtask) => {
                    setTasks([...tasks, newtask]);
                    setTaskDesc('');
                    setOpenPopup(false);
                }}
            />
        </Container>
    );
};

export default Tasks;