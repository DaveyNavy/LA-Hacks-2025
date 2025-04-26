import React, { useState } from 'react';
import { Modal, Box, TextField, Button } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const AddTaskPopup = ({ open, onClose, onSubmit, taskDesc }) => {
    const [taskDescription, setTaskDescription] = useState(taskDesc || '');
    React.useEffect(() => {
        setTaskDescription(taskDesc || '');
    }, [taskDesc]);

    const [dueDate, setDueDate] = useState(null);

    const handleSubmit = () => {
        if (!taskDescription || !dueDate) {
            alert('Please fill in all fields.');
            return;
        }
        if (dueDate < new Date()) {
            alert('Due date cannot be in the past.');
            return;
        }
        onSubmit({ taskDescription, dueDate });
        setTaskDescription('');
        setDueDate(null);
        onClose();
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 2,
                }}
            >
                <h2>Add New Task</h2>
                <TextField
                    fullWidth
                    label="Task Description"
                    variant="outlined"
                    margin="normal"
                    value={taskDescription}
                    onChange={(e) => setTaskDescription(e.target.value)}
                    inputRef={(input) => {
                        if (input && open) {
                            input.focus();
                        }
                    }}
                />
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                        label="Due Date"
                        value={dueDate}
                        onChange={(newValue) => setDueDate(newValue)}
                        renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
                    />
                </LocalizationProvider>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Button onClick={onClose} sx={{ mr: 1 }}>
                        Cancel
                    </Button>
                    <Button variant="contained" onClick={handleSubmit}>
                        Add Task
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default AddTaskPopup;