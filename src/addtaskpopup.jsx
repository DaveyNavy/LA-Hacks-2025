import React, { useState } from 'react';
import { Modal, Box, TextField, Button } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { TimePicker } from '@mui/x-date-pickers';
import { Typography } from '@mui/material';
import { format, parseISO } from 'date-fns';
import { Globaler, host_url } from './global.jsx';


const AddTaskPopup = ({ open, onClose, onSubmit, taskDesc }) => {
    const now = new Date();
    const [taskDescription, setTaskDescription] = useState(taskDesc || '');
    React.useEffect(() => {
        setTaskDescription(taskDesc || '');
        // update duedate and textfield value:
        const newDate = new Date(now.getTime() + 1 * 60 * 1000);
        setDueDate(newDate);
        setTextFieldValue(format(newDate, 'yyyy-MM-dd HH:mm'));
    }, [taskDesc]);

    const [dueDate, setDueDate] = useState(new Date(now.getTime() + 1 * 60 * 1000));
    const [textFieldValue, setTextFieldValue] = useState(format(new Date(now.getTime() + 1 * 60 * 1000), 'yyyy-MM-dd HH:mm'));
    const handleTextFieldChange = (event) => {
        setTextFieldValue(event.target.value);
        try {
            const newDate = parseISO(event.target.value);
            setDueDate(newDate);
        } catch (e) {
            console.log(e);
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
                    width: 500,
                    bgcolor: 'background.default',
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 4,
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                }}
            >
                <Typography variant="h5">Add New Task</Typography>                <TextField
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
                    value={textFieldValue}
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
                        <b>Cancel</b>
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