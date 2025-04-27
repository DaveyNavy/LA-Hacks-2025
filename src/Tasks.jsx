import React, { useState } from 'react';
import { Container, Typography, TextField, Button, List, ListItem, ListItemText, IconButton, Checkbox } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { ClearIcon } from '@mui/x-date-pickers';
import AddTaskPopup from './addtaskpopup';
import { Globaler, host_url } from './global.jsx';
import { set } from 'date-fns';
import CompleteTaskPopup from './completetaskpopup.jsx';


const Tasks = () => {
    const [tasks, setTasks2] = useState([]);
    const setTasks = (newTasks) => {
        const sortedTasks = newTasks.sort((a, b) => a.duedate - b.duedate);
        setTasks2(sortedTasks);
    };
    const [taskDesc, setTaskDesc] = useState('');

    // Popup state
    const [openPopup_add, setOpenPopup_add] = useState(false);
    const [openPopup_complete, setOpenPopup_complete] = useState(false);
    const [taskToComplete, setTaskToComplete] = useState(null);

    // EAT IT:
    const getDisabled = (index) => {
        const task = tasks[index];
        return task.iscomplete;
    }
    const getChecked = (index) => {
        const task = tasks[index];
        return task.iscomplete;
    }
    const handleCheckboxClick = (index) => {
        const task = tasks[index];
        console.log(task);
        setTaskToComplete(task);
        setOpenPopup_complete(true);
    }
    const handleCompleteTask = async (taskid) => {
        const taskToComplete = tasks.find(task => task.taskid === taskid);
        taskToComplete.iscomplete = true;
        setTasks([...tasks]);
        return;
    }


    // Fetch tasks from the server when the component mounts
    React.useEffect(() => {
        const fetchTasks = async () => {
            const data = await fetch(`${host_url}/api/tasks`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
            });
            if (!data.ok) {
                // Handle the error if the response is not OK
                alert("Error fetching tasks");
            } else {
                const fetchedTasks = await data.json();
                console.log(fetchedTasks);
                setTasks(fetchedTasks.map(task => ({
                    ...task,
                    duedate: new Date(task.duedate),
                })));
            }
        };
        fetchTasks();
    }, []);

    const handleAddTask = () => {
        setOpenPopup_add(true);
    };

    const handleDeleteTask = async (index) => {
        const taskToDelete = tasks[index];
        const data = await fetch(`${host_url}/api/tasks/${taskToDelete.taskid}`, {
            method: "DELETE",
            headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
            },
        });
        if (!data.ok) {
            // Handle the error if the response is not OK
            alert("Error deleting task");
        }
        else {
            const newTasks = tasks.filter((_, i) => i !== index);
            setTasks(newTasks);
        }
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
                        button="true"
                        // onClick={() => alert(`Task clicked: ${task.description}`)}
                        style={{ transition: 'background-color 0.3s' }}
                        // secondaryAction={
                        //     <IconButton edge="end" aria-label="delete" onClick={(e) => {
                        //         handleDeleteTask(index);
                        //         e.stopPropagation();
                        //     }}>
                        //         <DeleteIcon />
                        //     </IconButton>
                        // }
                        secondaryAction={
                            <>
                                <IconButton edge="end" aria-label="complete" onClick={(e) => {
                                    // Handle checkbox click logic here
                                    e.stopPropagation();
                                }}>
                                    <Checkbox onClick={() => { handleCheckboxClick(index) }} disabled={getDisabled(index)} checked={getChecked(index)} />
                                </IconButton>
                                <IconButton edge="end" aria-label="delete" onClick={(e) => {
                                    handleDeleteTask(index);
                                    e.stopPropagation();
                                }}>
                                    <DeleteIcon />
                                </IconButton>
                            </>
                        }
                    >
                        <ListItemText primary={task.description} />
                        <ListItemText primary={task.duedate.toLocaleString('en-US', {
                            weekday: 'long',
                            month: 'numeric',
                            day: 'numeric',
                            hour: 'numeric',
                            minute: 'numeric',
                        })} />
                        {task.bets && task.bets.map((bet, betIndex) => (
                            <ListItemText key={betIndex} primary={`User: ${bet.username}`} />
                        ))}
                    </ListItem>
                ))}
            </List>
            <AddTaskPopup
                open={openPopup_add}
                taskDesc={taskDesc}
                onClose={() => {
                    setTaskDesc('');
                    setOpenPopup_add(false);
                }}
                onSubmit={async (newtask) => {
                    const data = await fetch(`${host_url}/api/tasks`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${localStorage.getItem("token")}`,
                        },
                        mode: "cors",
                        body: JSON.stringify({ desc: newtask.taskDescription, date: newtask.dueDate }),
                    });

                    const currentCounter = parseInt(localStorage.getItem("counter") || "0", 10);
                    localStorage.setItem("counter", currentCounter + 1);

                    if (!data.ok) {
                        // Handle the error if the response is not OK
                        alert("Error adding task");
                    }
                    else {
                        const taskID = await data.json();
                        setTasks([...tasks, { description: newtask.taskDescription, duedate: new Date(newtask.dueDate), taskid: taskID }]);
                        setTaskDesc('');
                        setOpenPopup_add(false);
                    }
                }}  
            />
            <CompleteTaskPopup
                open={openPopup_complete}
                taskToComplete={taskToComplete}
                onClose={() => {
                    setTaskToComplete(null);
                    setOpenPopup_complete(false);
                }}
                onSubmit={handleCompleteTask}
            />
        </Container>
    );
};

export default Tasks;