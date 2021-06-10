import React, { useState } from 'react';
import { Redirect, useHistory, useLocation } from 'react-router-dom';

import AppBar from '@material-ui/core/AppBar';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MuiAlert from '@material-ui/lab/Alert';
import Toolbar from '@material-ui/core/Toolbar';
import Snackbar from '@material-ui/core/Snackbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles, useTheme } from '@material-ui/core';

import DashboardIcon from '@material-ui/icons/Dashboard';
import FitnessCenterIcon from '@material-ui/icons/FitnessCenter';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import StarIcon from '@material-ui/icons/Star';
import TodayIcon from '@material-ui/icons/Today';

import { logout, isAuthenticated } from '../services/authentication';


const dateArray = new Date().toISOString().split('T')[0].split('-');
const calPath = `/cal/${dateArray[0]}-${dateArray[1]}`;

const drawerWidth = 200;

const useStyles = makeStyles((theme) => ({
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
    flexGrow: 1,
    zIndex: theme.zIndex.drawer + 1,
  },
  drawer: {
    width: drawerWidth,
  },
  drawerPaper: {
    width: drawerWidth,
    [theme.breakpoints.up('sm')]: {
      paddingTop: 56,
    },
  },
  active: {
    background: '#f4f4f4'
  },
  toolbar: theme.mixins.toolbar,
  logoutButton: {
    color: theme.palette.secondary.main,
  },
  avatar: {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.text.secondary,
  },
  menuButton: {
    color: theme.palette.secondary.main,
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  title: {
    flexGrow: 1,
  },
}));

function Alert(props) {
  return <MuiAlert elevation={4} variant='filled' {...props} />;
}

function Layout({ children }) {
  if (isAuthenticated() === false) {
    return <Redirect to='/login' />;
  }

  const classes = useStyles();
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
    await logout()
      .then(() => history.push('/login'))
      .catch(() => {
        return setOpen(true);
      });
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
        className={location.pathname === '/dashboard' ? classes.active : null}
      >
        <ListItemIcon><DashboardIcon /></ListItemIcon>
        <ListItemText primary='Dashboard' />
      </ListItem>
      <ListItem
        button
        onClick={() => handleMenuItemClick(calPath)}
        className={location.pathname.includes('/cal/') ? classes.active : null}
      >
        <ListItemIcon><TodayIcon /></ListItemIcon>
        <ListItemText primary='Calendar' />
      </ListItem>
      <ListItem
        button
        onClick={() => handleMenuItemClick('/search')}
        className={location.pathname === '/search' ? classes.active : null}
      >
        <ListItemIcon><SearchIcon /></ListItemIcon>
        <ListItemText primary='Search' />
      </ListItem>
      <Divider />
      <ListItem
        button
        onClick={() => handleMenuItemClick('/workouts/new')}
        className={location.pathname === '/workouts/new' ? classes.active : null}
      >
        <ListItemIcon><FitnessCenterIcon /></ListItemIcon>
        <ListItemText primary='New Workout' />
      </ListItem>
      <ListItem
        button
        onClick={() => handleMenuItemClick('/records/new')}
        className={location.pathname === '/records/new' ? classes.active : null}
      >
        <ListItemIcon><StarIcon /></ListItemIcon>
        <ListItemText primary='New PR' />
      </ListItem>
    </List>
  );



  return (
    <div className={classes.root1}>

      {/*********************************** Navbar ************************************/}
      <AppBar
        position='fixed'
        color='primary'
        elevation={1}
        className={classes.root2}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
          <Typography edge='start' variant='h5' className={classes.title}>
            Workout Tracker
          </Typography>

          <Button>
            <Avatar
              button
              className={classes.avatar}
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
          classes={{ paper: classes.drawerPaper }}
          ModalProps={{
            keepMounted: true,
          }}
        >
          {drawer}
        </Drawer>
      </Hidden>

      {/******************** Desktop drawer - permanent left **************************/}
      <Hidden xsDown implementation="css">
        <Drawer
          className={classes.drawer}
          variant="permanent"
          classes={{ paper: classes.drawerPaper }}
          anchor="left"
        >
          {drawer}
        </Drawer>
      </Hidden>


      {/*********************************** Content ***********************************/}
      <div className={classes.page}>
        {/* adds padding to push content below appbar */}
        <div className={classes.toolbar}></div>
        {children}
      </div>
      <Snackbar open={open} autoHideDuration={4000} onClose={handleCloseError}>
        <Alert severity='error'>Server error</Alert>
      </Snackbar>
    </div>
  );
}

export default Layout;
