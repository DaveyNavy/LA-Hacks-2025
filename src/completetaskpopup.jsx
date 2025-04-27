import React, { use, useEffect, useState } from 'react';
import { Modal, Box, TextField, Button } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { TimePicker } from '@mui/x-date-pickers';
import { Typography } from '@mui/material';
import { format, parseISO } from 'date-fns';
import { Globaler, host_url } from './global.jsx';


const CompleteTaskPopup = ({ open, onClose, onSubmit, taskToComplete }) => {
    const { username, description, duedate, betamount, taskid } = taskToComplete || {};

    console.log('CompleteTaskPopup', taskToComplete);

    const handleSubmit = async () => {
        if (isSubmitting) return; // Prevent multiple submissions
        isSubmitting = true;

        const data = await fetch(`${host_url}/api/tasks/${taskToComplete.taskid}`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
            },
        });
        if (!data.ok) {
            // Handle the error if the response is not OK
            alert("Error completing task");
        } else {
            const newTasks = tasks.filter((_, i) => i !== index);
            setTasks(newTasks);
        }
        

        await onSubmit({ taskid });
        onClose();
        isSubmitting = false;
    };

    if (!username) {
        return null; // Render nothing if no task is selected
    }

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
                <Typography variant="h3">Complete Task</Typography>                <TextField
                    fullWidth
                    label="Task Description"
                    variant="outlined"
                    margin="normal"
                    value={description}
                    contentEditable={false}
                />



                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Button onClick={onClose} sx={{ mr: 1 }}>
                        Cancel
                    </Button>
                    <Button variant="contained" onClick={handleSubmit}>
                        Complete Task
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default CompleteTaskPopup;