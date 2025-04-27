import React, { useState } from 'react';
import { Modal, Box, TextField, Button } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { TimePicker } from '@mui/x-date-pickers';
import { Typography } from '@mui/material';
import { formatDistanceToNow } from 'date-fns';
import DateTimeSlider from './datetimeslider';


const BetTaskPopup = ({ open, onClose, onSubmit, selectedTask }) => {
    const { username, description, duedate, betamount, taskid } = selectedTask || {};

    let isSubmitting = false;
    const handleSubmit = async () => {
        if (isSubmitting) return; // Prevent multiple submissions
        isSubmitting = true;
        await onSubmit({ betAmount, dueDate });
        onClose();
        isSubmitting = false;
    };

    const getRelativeDate = (date) => {
        const now = new Date();
        const distance = formatDistanceToNow(date, { addSuffix: true });
        return distance;
    }

    const [betAmount, setBetAmount] = useState(betamount || 0);
    const handleBetAmountChange = (event) => {
        setBetAmount(event.target.value);
    };

    const [dueDate, setDueDate] = useState(duedate || null);


    // RETURNS:

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
                <Typography variant="h3">{username}'s task</Typography>                <TextField
                    fullWidth
                    label="Task Description"
                    variant="outlined"
                    margin="normal"
                    value={description}
                    contentEditable={false}
                />
                <Typography variant="h6">Due in {getRelativeDate(duedate)}</Typography>

                <DateTimeSlider futureDate={duedate} setDueDate={setDueDate} />

                <TextField
                    fullWidth
                    label="Bet Amount"
                    variant="outlined"
                    margin="normal"
                    value={betAmount}
                    onChange={handleBetAmountChange}
                    type="number"
                    inputProps={{ min: 0, step: 1 }}
                />

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Button onClick={onClose} sx={{ mr: 1 }}>
                        Cancel
                    </Button>
                    <Button variant="contained" onClick={handleSubmit}>
                        Add Bet
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default BetTaskPopup;