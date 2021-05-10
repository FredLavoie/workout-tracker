import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import NavBarMain from './NavBarMain';
import { makeStyles } from '@material-ui/core';
import HomeIcon from '@material-ui/icons/Home';
import TodayIcon from '@material-ui/icons/Today';
import SearchIcon from '@material-ui/icons/Search';


const dateArray = new Date().toISOString().split('T')[0].split('-');
const calPath = `/cal/${dateArray[0]}-${dateArray[1]}`;

const drawerWidth = 240;

const useStyles = makeStyles({
  page: {
    background: '#f9f9f9',
    width: '100%',
		height: '100vh',
  },
  root: {
    display: 'flex',
  },
  drawer: {
    width: drawerWidth,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  active: {
    background: '#f4f4f4'
  },
})

function Layout({ children }) {
	const classes = useStyles();
  const history = useHistory();
  const location = useLocation();


	return (
		<div>
			<NavBarMain />
			<div className={classes.root}>
				<Drawer
					className={classes.drawer}
					variant="permanent"
					classes={{ paper: classes.drawerPaper }}
					anchor="left"
				>
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
								onClick={() => console.log('/search')}
								className={location.pathname === '/search' ? classes.active : null}
							>
								<ListItemIcon><SearchIcon /></ListItemIcon>
								<ListItemText primary='Search' />
						</ListItem>
					</List>
				</Drawer>
				<div className={classes.page}>
					{ children }
				</div>
			</div>
		</div>
	)
}

export default Layout;