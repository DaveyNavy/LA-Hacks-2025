import React, { use, useEffect, useState } from 'react';
import { Modal, Box, TextField, Button, CircularProgress } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { TimePicker } from '@mui/x-date-pickers';
import { Typography } from '@mui/material';
import { format, parseISO } from 'date-fns';
import { Globaler, host_url } from './global.jsx';


const CompleteTaskPopup = ({ open, onClose, onSubmit, taskToComplete }) => {
    const { username, description, duedate, betamount, taskid } = taskToComplete || {};

    const [loading, setLoading] = useState(false);

    console.log('CompleteTaskPopup', taskToComplete);

    const handleSubmit = async (event) => {
        if (loading) return; // Prevent multiple submissions
        setLoading(true); // Set loading state

        const form = event.target.closest('form'); // Find the closest form ancestor
        if (!form) return; // Ensure the form exists
        const formData = new FormData(form); // Collect form data
        try {

            const response = await fetch("http://localhost:3000/api/uploads", {
                method: "POST",
                body: formData,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
            });

            const json = await response.json();
            console.log(json);


            if (!response.ok) {
                alert("Error uploading file: " + json.message);
            } else {
                // alert("File uploaded successfully");
                console.log("File uploaded successfully");
                onSubmit(taskid); // Call the onSubmit function with the task ID
                onClose(); // Close the popup after submission
            }

        } catch (error) {
            console.error("Error:", error);
        }

        setLoading(false); // Reset loading state
    };

    if (!username) {
        return null; // Render nothing if no task is selected
    }

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
                <Typography variant="h4">Complete Task</Typography>
                <TextField
                    fullWidth
                    label="Task Description"
                    variant="outlined"
                    margin="normal"
                    value={description}
                    contentEditable={false}
                />

                {/* Embedded Form */}
                <br></br>
                <br></br>
                <Typography variant="body1">Upload a file to prove the completion of your task:</Typography>
                <br></br>
                <form
                    action="http://localhost:3000/api/uploads"
                    encType="multipart/form-data"
                    method="post"
                >
                    <div className="form-group">
                        <input
                            type="file"
                            className="form-control-file"
                            name="uploaded_file"
                        />
                        <input type="number" name="id" hidden value={taskid || 4} readOnly={true} />
                    </div>
                    <br></br>
                    <Button
                        variant="contained"
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? (
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <CircularProgress size={24} />
                            </Box>
                        ) : (
                            'Complete Task'
                        )}
                    </Button>
                </form>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Button onClick={onClose} sx={{ mr: 1 }} disabled={loading}>
                        Cancel
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};;

export default CompleteTaskPopup;