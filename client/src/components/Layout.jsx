import React, { useState } from 'react';
import { Redirect, useHistory, useLocation } from 'react-router-dom';

import {
  AppBar,
  Avatar,
  Box,
  Button,
  Divider,
  Drawer,
  Hidden,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
  Snackbar,
  Typography
} from '@mui/material';

import DashboardIcon from '@mui/icons-material/Dashboard';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import StarIcon from '@mui/icons-material/Star';
import TodayIcon from '@mui/icons-material/Today';
import ViewDayIcon from '@mui/icons-material/ViewDay';

import { useTheme } from '@mui/material';
import MuiAlert from '@mui/material/Alert';

import { logout, isAuthenticated } from '../services/authentication';


const dateArray = new Date().toISOString().split('T')[0].split('-');
const calPath = `/cal/${dateArray[0]}-${dateArray[1]}`;


// eslint-disable-next-line prefer-arrow-callback
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={4} ref={ref} {...props} />;
});

export function Layout({ children }) {
  if (isAuthenticated() === false) {
    return <Redirect to='/login' />;
  }

  const history = useHistory();
  const location = useLocation();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [open, setOpen] = useState(false);

  const username = localStorage.getItem('username');
  const firstTwoLetter = `${username[0].toUpperCase()}${username[1].toUpperCase()}`;

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      await logout();
      history.push('/login');
    } catch (error) {
      return setOpen(true);
    }
  }

  function handleCloseError() {
    setOpen(false);
  }

  function handleClickAvatar(event) {
    setAnchorEl(event.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
  }

  function handleDrawerToggle() {
    setMobileOpen(!mobileOpen);
  }

  function handleMenuItemClick(path) {
    if (mobileOpen) handleDrawerToggle();
    history.push(path);
  }

  function handleChangePasswordClick() {
    handleClose();
    history.push('/password-change');
  }

  const drawer = (
    <List>
      <ListItem
        button
        onClick={() => handleMenuItemClick('/dashboard')}
        sx={(location.pathname === '/dashboard' && style.active)}
      >
        <ListItemIcon><DashboardIcon /></ListItemIcon>
        <ListItemText primary='Dashboard' />
      </ListItem>
      <ListItem
        button
        onClick={() => handleMenuItemClick(calPath)}
        sx={(location.pathname.includes('/cal/') && style.active)}
      >
        <ListItemIcon><TodayIcon /></ListItemIcon>
        <ListItemText primary='Calendar' />
      </ListItem>
      <ListItem
        button
        onClick={() => handleMenuItemClick('/week')}
        sx={(location.pathname.includes('/week/') && style.active)}
      >
        <ListItemIcon><ViewDayIcon /></ListItemIcon>
        <ListItemText primary='Week' />
      </ListItem>
      <ListItem
        button
        onClick={() => handleMenuItemClick('/search')}
        sx={(location.pathname === '/search' && style.active)}
      >
        <ListItemIcon><SearchIcon /></ListItemIcon>
        <ListItemText primary='Search' />
      </ListItem>
      <Divider />
      <ListItem
        button
        onClick={() => handleMenuItemClick('/workouts/new')}
        sx={(location.pathname === '/workouts/new' && style.active)}
      >
        <ListItemIcon><FitnessCenterIcon /></ListItemIcon>
        <ListItemText primary='New Workout' />
      </ListItem>
      <ListItem
        button
        onClick={() => handleMenuItemClick('/records/new')}
        sx={(location.pathname === '/records/new' && style.active)}
      >
        <ListItemIcon><StarIcon /></ListItemIcon>
        <ListItemText primary='New PR' />
      </ListItem>
    </List>
  );



  return (
    <Box sx={style.root1}>

      {/*********************************** Navbar ************************************/}
      <AppBar
        position='fixed'
        color='primary'
        elevation={1}
        sx={style.root2}
      >
        <Toolbar sx={style.toolbar}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={style.menuButton}
            size="large"
          >
            <MenuIcon />
          </IconButton>
          <Typography edge='start' variant='h5' sx={style.title}>
            Workout Tracker
          </Typography>

          <Button>
            <Avatar
              button="true"
              sx={style.avatar}
              onClick={handleClickAvatar}
              aria-controls="simple-menu"
              aria-haspopup="true"
            >
              {firstTwoLetter}
            </Avatar>
          </Button>
          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleChangePasswordClick}>Change Password</MenuItem>
            <MenuItem onClick={handleSubmit}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/*********************** Mobile drawer - toggle left ***************************/}
      <Hidden smUp implementation="css">
        <Drawer
          variant="temporary"
          anchor={theme.direction === 'rtl' ? 'right' : 'left'}
          open={mobileOpen}
          onClose={handleDrawerToggle}
          sx={style.mobileDrawer}
          ModalProps={{
            keepMounted: true,
          }}
        >
          {drawer}
        </Drawer>
      </Hidden>

      {/******************** Desktop drawer - permanent left **************************/}
      <Hidden smDown implementation="css">
        <Drawer
          sx={style.desktopDrawer}
          variant="permanent"
          anchor="left"
        >
          {drawer}
        </Drawer>
      </Hidden>


      {/*********************************** Content ***********************************/}
      <Box sx={style.page}>
        {/* adds padding to push content below appbar */}
        <Box sx={style.toolbar}></Box>
        {children}
      </Box>
      <Snackbar
        open={open} autoHideDuration={4000}
        onClose={handleCloseError}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity='error'>Server error</Alert>
      </Snackbar>
    </Box>
  );
}

const drawerWidth = '200px';
const style = {
  page: {
    background: '#f9f9f9',
    width: '100%',
    minHeight: '100vh',
    height: '100%',
  },
  root1: {
    display: 'flex',
  },
  root2: {
    flexGrow: '1',
    zIndex: '1250',
  },
  mobileDrawer: {
    width: drawerWidth,
    zIndex: '1300',
  },
  desktopDrawer: {
    width: drawerWidth,
    [`& .MuiDrawer-paper`]: { width: drawerWidth, paddingTop: '64px' }
  },
  active: {
    background: '#f4f4f4'
  },
  toolbar: {
    minHeight: '56px',
    height: '56px',
  },
  logoutButton: {
    color: 'secondary.main',
  },
  avatar: {
    backgroundColor: 'secondary.main',
    color: 'text.secondary',
  },
  menuButton: {
    color: 'secondary.main',
    marginRight: '16px',
    display: { sm: 'none' },
  },
  title: {
    flexGrow: '1',
  },
};
