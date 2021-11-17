
// React Imports
import { useState } from 'react';
import { useContext } from "react";
import { useHistory } from 'react-router';

// MUI Imports
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import BarChartIcon from '@mui/icons-material/BarChart';
import { Logout } from '@mui/icons-material';
import AllInboxIcon from '@mui/icons-material/AllInbox';

// Custom Components
import AuthContext from "../context/AuthContext";
import { AppBar } from './AppBar';
import { Drawer } from './Drawer';

const mdTheme = createTheme();

export default function Base({ children }) {

    const { user, logOut } = useContext(AuthContext);
    const history = useHistory();

    const [open, setOpen] = useState(true);
    const toggleDrawer = () => {
        setOpen(!open);
    };

    const goToHome = () => {
        history.push("/");
    }

    const goToProducts = () => {
        history.push("/products");
    }

    return (
        <ThemeProvider theme={mdTheme}>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <AppBar position="absolute" open={open}>
                    <Toolbar sx={{ pr: '24px' }} >
                        <IconButton edge="start" color="inherit" aria-label="open drawer" onClick={toggleDrawer} sx={{
                            marginRight: '36px',
                            ...(open && { display: 'none' }),
                        }} >
                            <MenuIcon />
                        </IconButton>
                        <Typography component="h1" variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }} >
                            Welcome {user.first_name} {user.last_name}
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Drawer variant="permanent" open={open}>
                    <Toolbar sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        px: [1],
                    }}>
                        <IconButton onClick={toggleDrawer}>
                            <ChevronLeftIcon />
                        </IconButton>
                    </Toolbar>
                    <Divider />
                    <List>
                        {/* Dashboard/Home Page button */}
                        <ListItem button onClick={goToHome}>
                            <ListItemIcon>
                                <DashboardIcon />
                            </ListItemIcon>
                            <ListItemText primary="Dashboard" />
                        </ListItem>

                        {/* Products Page button */}
                        <ListItem button onClick={goToProducts}>
                            <ListItemIcon>
                                <AllInboxIcon />
                            </ListItemIcon>
                            <ListItemText primary="Products" />
                        </ListItem>

                        {/* Sell Page button */}
                        <ListItem button>
                            <ListItemIcon>
                                <ShoppingCartIcon />
                            </ListItemIcon>
                            <ListItemText primary="Sell" />
                        </ListItem>

                        {/* Orders Page button */}
                        <ListItem button>
                            <ListItemIcon>
                                <BarChartIcon />
                            </ListItemIcon>
                            <ListItemText primary="Orders" />
                        </ListItem>

                        {/* Logout button */}
                        <ListItem button onClick={logOut}>
                            <ListItemIcon>
                                <Logout />
                            </ListItemIcon>
                            <ListItemText primary="Logout" />
                        </ListItem>
                    </List>
                </Drawer>
                {children}
            </Box>
        </ThemeProvider>
    );
}
