import React from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import Tab1 from './bet.jsx';
import Tab2 from './friends.jsx';
import Tab3 from './leaderboard.jsx';
import "dotenv/config";

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`tabpanel-${index}`}
            aria-labelledby={`tab-${index}`}
            {...other}
            style={{ height: '100%' }} // allow children to fill height
        >
            {value === index && children}
        </div>
    );
}

function a11yProps(index) {
    return {
        id: `tab-${index}`,
        'aria-controls': `tabpanel-${index}`,
    };
}

export default function TabSelector() {
    const [value, setValue] = React.useState(0);

    return (
        <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={(e, val) => setValue(val)} aria-label="basic tabs example">
                    <Tab label="Bet" {...a11yProps(0)} />
                    <Tab label="Friends" {...a11yProps(1)} />
                    <Tab label="Leaderboard" {...a11yProps(2)} />
                </Tabs>
            </Box>
            <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
                <TabPanel value={value} index={0}>
                    <Tab1 />
                </TabPanel>
                <TabPanel value={value} index={1}>
                    <Tab2 />
                </TabPanel>
                <TabPanel value={value} index={2}>
                    <Tab3 />
                </TabPanel>
            </Box>
        </Box>
    );
}
