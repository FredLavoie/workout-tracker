import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import AppBar from '@material-ui/core/AppBar';
import Avatar from '@material-ui/core/Avatar';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles, useTheme } from '@material-ui/core';

import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import HomeIcon from '@material-ui/icons/Home';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import TodayIcon from '@material-ui/icons/Today';

import { logout } from '../services/authentication';


const dateArray = new Date().toISOString().split('T')[0].split('-');
const calPath = `/cal/${dateArray[0]}-${dateArray[1]}`;

const drawerWidth = 240;

const useStyles = makeStyles((theme) =>({
  page: {
    background: '#f9f9f9',
    width: '100%',
    height: '100vh',
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
    paddingTop: 56
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

function Layout({ children }, props) {
  const { window } = props;
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const username = localStorage.getItem('username');
  const firstTwoLetter = `${username[0].toUpperCase()}${username[1].toUpperCase()}`;

  async function handleSubmit(e) {
    e.preventDefault();
    await logout();
    return history.push('/login');
  }


  const drawer = (
    <List>
      <ListItem
        button
        onClick={() => history.push('/dashboard')}
        className={location.pathname === '/dashboard' ? classes.active : null}
      >
        <ListItemIcon><HomeIcon /></ListItemIcon>
        <ListItemText primary='Dashboard' />
      </ListItem>
      <ListItem
        button
        onClick={() => history.push(calPath)}
        className={location.pathname.includes('/cal/') ? classes.active : null}
      >
        <ListItemIcon><TodayIcon /></ListItemIcon>
        <ListItemText primary='Calendar' />
      </ListItem>
      <ListItem
          button
          onClick={() => history.push('/search')}
          className={location.pathname === '/search' ? classes.active : null}
        >
          <ListItemIcon><SearchIcon /></ListItemIcon>
          <ListItemText primary='Search' />
      </ListItem>
      <Divider />
      <ListItem
          button
          className={classes.logoutButton}
          onClick={handleSubmit}
        >
          <ListItemIcon><ExitToAppIcon /></ListItemIcon>
          <ListItemText primary='Logout' />
      </ListItem>
    </List>
  );

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <div className={classes.root1}>

      {/********************************** Navbar *************************************/}
      <AppBar
      position='fixed'
      color='primary'
      elevation={1}
      className={classes.root2}
      >
        <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              className={classes.menuButton}
            >
          <MenuIcon />
        </IconButton>
        <Toolbar>
          <Typography edge='start' variant='h5' className={classes.title}>
            Workout Tracker
          </Typography>

          <Avatar className={classes.avatar}>{firstTwoLetter}</Avatar>
        </Toolbar>
      </AppBar>

      {/*********************** Mobile drawer - toggle left ***************************/}
      <Hidden smUp implementation="css">
        <Drawer
          container={container}
          variant="temporary"
          anchor={theme.direction === 'rtl' ? 'right' : 'left'}
          open={mobileOpen}
          onClose={handleDrawerToggle}
          classes={{ paper: classes.drawerPaper }}
          ModalProps={{
            keepMounted: true,
          }}
        >
          { drawer }
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
          { drawer }
        </Drawer>
      </Hidden>


      {/*********************************** Content ***********************************/}
      <div className={classes.page}>
        <div className={classes.toolbar}></div>
        { children }
      </div>
    </div>
  )
}

export default Layout;