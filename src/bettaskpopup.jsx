import React, { useState } from 'react';
import { Modal, Box, TextField, Button } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { TimePicker } from '@mui/x-date-pickers';
import { Typography,Divider } from '@mui/material';
import { formatDistanceToNow } from 'date-fns';
import DateTimeSlider from './datetimeslider';
import { Globaler, host_url } from './global.jsx';


const BetTaskPopup = ({ open, onClose, onSubmit, selectedTask }) => {
    const { username, description, duedate, betamount, taskid } = selectedTask || {};

    let isSubmitting = false;
    const handleSubmit = async () => {
        if (isSubmitting) return; // Prevent multiple submissions
        isSubmitting = true;
        await onSubmit({ betAmount, dueDate, taskid });
        onClose();
        isSubmitting = false;
    };

    const getRelativeDate = (date) => {
        const now = new Date();
        const distance = formatDistanceToNow(date, { addSuffix: true });
        return distance;
    }

    const [betAmount, setBetAmount] = useState(betamount || 100);
    const [hasAlreadyBet, setHasAlreadyBet] = useState(false);
    React.useEffect(() => {
        setBetAmount(betamount || 100);
        setDueDate(new Date());
        const hasAlreadyBet = selectedTask && selectedTask.bets.some(bet => bet.username === Globaler.username);
        setHasAlreadyBet(hasAlreadyBet);
    }, [betamount, duedate]);

    const handleBetAmountChange = (event) => {
        setBetAmount(event.target.value);
    };

    const [dueDate, setDueDate] = useState(new Date());


    // RETURNS:

    if (!username) {
        return null; // Render nothing if no task is selected
    }

    const getSortedBets = () => {
        const newBet = { username: Globaler.username, date: dueDate };
        if (!selectedTask.bets) return [newBet];
        if (hasAlreadyBet) {
            return selectedTask.bets.map(bet => (bet.username === Globaler.username ? newBet : bet)).sort((a, b) => new Date(a.date) - new Date(b.date));
        }
        const allBets = [...selectedTask.bets, newBet];
        return allBets.sort((a, b) => new Date(a.date) - new Date(b.date));
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={{ display: 'flex', gap: 2 }}>

                <Box
                    sx={{
                        flex: 1,
                        position: 'absolute',
                        top: '50%',
                        left: '40%',
                        transform: 'translate(-50%, -50%)',
                        width: 500,
                        bgcolor: 'background.default',
                        boxShadow: 24,
                        p: 4,
                        borderRadius: 2,
                    }}
                >
                    <Typography variant="h3">{username}'s task</Typography>
                    <TextField
                        fullWidth
                        label="Task Description"
                        variant="outlined"
                        margin="normal"
                        value={description}
                        contentEditable={false}
                        multiline
                        rows={3}
                        sx={{
                            '& .MuiInputLabel-root': {
                            // Ensure the label has enough space and doesn't get cut off
                            marginTop: '-2px',
                            },
                            '& .MuiOutlinedInput-root': {
                            maxHeight: 200,
                            overflowY: 'auto',
                            }
                        }}
                        />
                    <br></br>
                    <br></br>

                    <Typography variant="h8">
                        <b>Due Date:</b> {duedate ? new Date(duedate).toLocaleString('en-US', {
                            weekday: 'long',
                            month: 'numeric',
                            day: 'numeric',
                            hour: 'numeric',
                            minute: 'numeric',
                            hour12: true,
                        }) : 'No due date set'}
                    </Typography>
                    <br></br>
                    <Typography variant="h8">Due {getRelativeDate(duedate)}</Typography>
                    <br></br>
                    <br></br>

                    <Typography variant="h8">
                        Select when you think <b>{username}</b> will complete their task:
                    </Typography>

                    <DateTimeSlider shouldDisable={hasAlreadyBet} futureDate={duedate} setDueDate={setDueDate} username={username} />

                    <TextField
                        fullWidth
                        label="Bet Amount"
                        variant="outlined"
                        value={betAmount}
                        onChange={handleBetAmountChange}
                        type="number"
                        disabled={betamount !== null}
                        inputProps={{ min: 100, step: 50, max: 1000 }}
                    />

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                        <Button onClick={onClose} sx={{ mr: 1 }}>
                            Cancel
                        </Button>
                        <Button variant="contained" onClick={handleSubmit} disabled={hasAlreadyBet}>
                            Add Bet
                        </Button>
                    </Box>
                </Box>
                <Box
                    sx={{
                        flex: 1,
                        position: 'absolute',
                        top: '50%',
                        left: '80%',
                        transform: 'translate(-50%, -50%)',
                        width: 300,
                        bgcolor: 'primary.main',
                        boxShadow: 24,
                        p: 4,
                        borderRadius: 2,
                    }}
                >
                    <Typography variant="h4" sx={{padding: 1}}>Current Bets</Typography>
                    <br></br>
                    {getSortedBets().map((bet, index) => (
                        <Box
                            key={index}
                            sx={{
                                padding: 2,
                                marginBottom: 2,
                                bgcolor: bet.username === Globaler.username ? 'background.default2' : 'inherit',
                                border: (theme) => `2px solid ${theme.palette.background.default2}`,
                                borderRadius: '4px',
                            }}
                        >
                            <Typography variant="h6">{bet.username}</Typography>
                            <Typography variant="body1">
                                {new Date(bet.date).toLocaleString('en-US', {
                                    weekday: 'long',
                                    month: 'numeric',
                                    day: 'numeric',
                                    hour: 'numeric',
                                    minute: 'numeric',
                                    hour12: true,
                                })}
                            </Typography>
                        </Box>
                    ))}
                    <br></br>
                    <Typography variant="h6">Total bets: {getSortedBets().length}</Typography>
                </Box>
            </Box>
        </Modal>
    );
};

export default BetTaskPopup;