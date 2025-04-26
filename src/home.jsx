import React from 'react';
import { Box, Button, Typography, AppBar, Toolbar, Container, Stack, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { useNavigate } from 'react-router-dom';

function HomePage() {
    
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
                        variant="h6"
                        sx={{ cursor: 'pointer', fontWeight: 'bold' }}
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    >
                        BeBetter
                    </Typography>
                    <Button color="inherit" onClick={() => navigate('/login')}>
                        Login
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
                            sx={{
                                fontWeight: 900,
                                fontSize: { xs: '2.5rem', md: '4rem' },
                                lineHeight: 1.2,
                            }}
                        >
                            Bet on your Future with <span style={{ fontStyle: 'italic', textDecoration: 'underline' }}>BeBetter</span>
                        </Typography>

                        <Typography variant="h6">
                            Transform your personal accountability into gambling with friends. Track tasks, earn rewards,
                            and bet on friends to achieve your goals in a fun, (slightly) supportive community.
                        </Typography>

                        <Stack direction="row" spacing={2}>
                            <Button variant="contained" color="primary" onClick={() => navigate('/register')}>
                                Sign Up
                            </Button>
                            <Button
                                variant="outlined"
                                sx={{ color: 'white', borderColor: 'white' }}
                                onClick={scrollToHowItWorks}
                            >
                                Learn More
                            </Button>
                        </Stack>
                    </Stack>
                </Container>
            </Box>

            {/* How it Works Section */}
            <Box
                id="how-it-works"
                sx={{
                    minHeight: '100vh',
                    backgroundColor: 'white',
                    color: 'black',
                    pt: 12,
                    px: 2,
                    textAlign: 'left',
                    overflowX: 'hidden',
                }}
            >
                <Container maxWidth="md">
                    <Stack spacing={6}>
                        <Typography variant="h3">
                            How it Works
                        </Typography>

                        <List>
                            {[
                                'Share and complete your tasks',
                                'Bet on when you think your friends will complete theirs',
                                'Rack up your BetCoin',
                                'Brag to your friends about your wealth',
                            ].map((text, index) => (
                                <ListItem key={index} sx={{ pl: 0 }}>
                                    <ListItemIcon sx={{ minWidth: '32px' }}>
                                        <FiberManualRecordIcon fontSize="small" />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={
                                            <Typography variant="h6">
                                                {text}
                                            </Typography>
                                        }
                                    />
                                </ListItem>
                            ))}
                        </List>

                        <Stack direction="row" spacing={2}>
                            <Button variant="contained" color="primary" onClick={() => navigate('/register')}>
                                Sign Up
                            </Button>
                            <Button variant="outlined" color="primary" onClick={() => navigate('/login')}>
                                Login
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
