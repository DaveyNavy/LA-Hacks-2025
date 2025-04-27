import React, { useState, useEffect } from 'react';
import Slider from '@mui/material/Slider';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { format, parseISO, addSeconds, differenceInSeconds } from 'date-fns';
import { Globaler, host_url } from './global.jsx';


const DateTimeSlider = ({ shouldDisable, futureDate, setDueDate, username }) => {
    // Convert futureDate to Date object if it's a string
    const endDate = typeof futureDate === 'string' ? parseISO(futureDate) : new Date(futureDate);
    const now = new Date();

    // Calculate total seconds between now and future date
    const totalSeconds = differenceInSeconds(endDate, now);


    React.useEffect(() => {
        setDueDate(new Date());
        setTextFieldValue(format(new Date(), 'yyyy-MM-dd HH:mm'));
        // setTextFieldValue(format(futureDate, 'yyyy-MM-dd HH:mm'));
    }, [futureDate]);

    // State for the current selected value (in seconds from now)
    const [value, setValue2] = useState(0);
    const setValue = (newValue) => {
        setValue2(newValue);
        const newDate = addSeconds(now, newValue);
        newDate.setSeconds(0, 0);
        setDueDate(newDate);
    }
    const [textFieldValue, setTextFieldValue] = useState(format(now, 'yyyy-MM-dd HH:mm'));

    // Calculate the current date based on slider value
    const currentDate = addSeconds(now, value);

    // Generate marks for the slider
    const generateMarks = () => {
        const marks = [];
        const steps = 5; // Number of marks to show (including start and end)

        for (let i = 0; i <= steps; i++) {
            const markValue = Math.floor((totalSeconds / steps) * i);
            const markDate = addSeconds(now, markValue);

            marks.push({
                value: markValue,
                label: format(markDate, 'MMM d'),
            });
        }

        return marks;
    };

    // Handle slider change
    const handleSliderChange = (event, newValue) => {
        setValue(newValue);
        const newDate = addSeconds(now, newValue);
        setTextFieldValue(format(newDate, 'yyyy-MM-dd HH:mm'));
    };

    // Handle text field change
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

    // Format value for the slider tooltip
    const formatValueText = (value) => {
        return format(addSeconds(now, value), 'PPpp');
    };

    // Handle button click
    const handleButtonClick = () => {
        console.log("Selected date:", currentDate);
        console.log("Formatted:", format(currentDate, 'yyyy-MM-dd HH:mm:ss'));
    };

    return (
        <div style={{ padding: '20px', maxWidth: '600px' }}>
            <Slider
                value={value}
                onChange={handleSliderChange}
                min={0}
                max={totalSeconds + 1}
                step={60} // 15-minute steps
                marks={generateMarks()}
                // valueLabelDisplay="auto"
                // valueLabelFormat={formatValueText}
                disabled={shouldDisable}
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
                    min: format(now, 'yyyy-MM-dd HH:mm'),
                    max: format(endDate, 'yyyy-MM-dd HH:mm'),
                }}
                fullWidth
                margin="normal"
                disabled={shouldDisable}
            />

            {/* <div style={{ marginTop: '20px' }}>
                <Button
                    variant="contained"
                    onClick={handleButtonClick}
                >
                    Log Selected Date
                </Button>
            </div> */}

            <div style={{ marginTop: '10px', color: '#666' }}>
                {/* You bet that {username} will complete their task at: {format(currentDate, 'PPPPpppp')} */}
                You bet that {username} will complete their task as close to this date as possible.
            </div>
        </div>
    );
};

// Example usage:
// <DateTimeSlider futureDate="2025-12-31T23:59:59" />
export default DateTimeSlider;