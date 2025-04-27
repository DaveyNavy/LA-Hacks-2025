import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, AppBar, Toolbar, Container, Stack, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { useNavigate } from 'react-router-dom';
import './home.css';
import { Globaler, host_url } from './global.jsx';

function HomePage() {
    
    const TypewriterEffect = ({ text, speed}) => {
        const [displayedText, setDisplayedText] = useState('');
        const [index, setIndex] = useState(0);
    
        useEffect(() => {
            const interval = setInterval(() => {
                if (index < text.length) {
                    setDisplayedText(displayedText + text[index]); 
                    setIndex(index + 1);
                }
            }, speed);
    
            return () => clearInterval(interval);
        }, [index, text, speed, displayedText]);
    
        return <span className="typewriter-text">{displayedText}</span>;
    };
    
    const navigate = useNavigate();

    const scrollToHowItWorks = () => {
        const howItWorksSection = document.getElementById('how-it-works');
        if (howItWorksSection) {
            howItWorksSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <>
            <style>
                {`
                    html, body {
                        background: black;
                        margin: 0;
                        padding: 0;
                        overflow-x: hidden;
                    }
                `}
            </style>
        <Box sx={{ width: '100%', overflowX: 'hidden', overflowY: 'auto' }}>
            {/* header bar */}
            <AppBar
                position="fixed"
                sx={{
                    backgroundColor: 'black',
                    boxShadow: 'none',
                }}
            >
                <Toolbar sx={{ justifyContent: 'space-between' }}>
                    <Typography
                        variant="h4"
                        sx={{ cursor: 'pointer', fontWeight: 'bold', color: 'white', padding: 4 }}
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    >
                        <b>BeBetter</b>
                    </Typography>
                    <Button color="primary" onClick={() => navigate('/login')} sx={{padding: 4}}>
                        <b><h3>Login</h3></b>
                    </Button>
                </Toolbar>
            </AppBar>

            {/* main page */}
            <Box
                sx={{
                    minHeight: '100vh',
                    width: '100%',
                    backgroundColor: 'black',
                    color: 'white',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    pt: 8, // push below the header
                    px: 2,
                    textAlign: 'center',
                    overflowX: 'hidden',
                }}
            >
                <Container maxWidth="md">
                    <Stack spacing={4} alignItems="center">
                        <Typography
                            variant="h2"
                            className="Home"
                            sx={{
                                fontWeight: 900,
                                fontSize: { xs: '2.5rem', md: '4rem' },
                                lineHeight: 1.2,
                            }}
                        >
                            <TypewriterEffect text="Bet On Your Future With BeBetter" speed={100}/>
                        </Typography>

                        <Typography variant="h6">
                            Transform your personal accountability into gambling with friends. Track tasks, earn rewards,
                            and bet on friends to achieve your goals in a fun, (slightly) supportive community.
                        </Typography>

                        <Stack direction="row" spacing={2}>
                            <Button variant="contained" color="primary" onClick={() => navigate('/register')}
                                sx={{width: '200px', height: '50px', fontSize: '1.2rem'}}>
                                <b>Sign Up</b>
                            </Button>
                        </Stack>
                    </Stack>
                </Container>
            </Box>
        </Box>
        </>
    );
}

export default HomePage;
