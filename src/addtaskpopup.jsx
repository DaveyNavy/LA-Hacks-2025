import React, { useState } from 'react';
import { Modal, Box, TextField, Button } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { TimePicker } from '@mui/x-date-pickers';
import { Typography } from '@mui/material';
import { format } from 'date-fns';
import "dotenv/config";


const AddTaskPopup = ({ open, onClose, onSubmit, taskDesc }) => {
    const now = new Date();
    const [taskDescription, setTaskDescription] = useState(taskDesc || '');
    React.useEffect(() => {
        setTaskDescription(taskDesc || '');
    }, [taskDesc]);

    const [dueDate, setDueDate] = useState(null);
    const [textFieldValue, setTextFieldValue] = useState(format(now, 'yyyy-MM-dd HH:mm'));
    const handleTextFieldChange = (event) => {
        setTextFieldValue(event.target.value);
        try {
            const newDate = parseISO(event.target.value);
            if (newDate >= now && newDate <= endDate) {
                const newValue = differenceInSeconds(newDate, now);
                setValue(newValue);
            }
        } catch (e) {
            console.error("Invalid date format");
        }
    };



    let isSubmitting = false;
    const handleSubmit = async () => {
        if (isSubmitting) return; // Prevent multiple submissions
        isSubmitting = true;

        if (!taskDescription || !dueDate) {
            alert('Please fill in all fields.');
            isSubmitting = false;
            return;
        }
        if (dueDate < new Date()) {
            isSubmitting = false;
            alert('Due date cannot be in the past.');
            return;
        }
        await onSubmit({ taskDescription, dueDate });
        setTaskDescription('');
        setDueDate(null);
        onClose();
        isSubmitting = false;
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
                <Typography variant="h3">Add New Task</Typography>                <TextField
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
                <TextField
                    label="Select Date & Time"
                    type="datetime-local"
                    value={dueDate}
                    onChange={handleTextFieldChange}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    inputProps={{
                        min: format(new Date(), 'yyyy-MM-dd HH:mm'),
                    }}
                    fullWidth
                    margin="normal"
                />

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