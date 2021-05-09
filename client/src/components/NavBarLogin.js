import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';

function NavBarLogin() {
	return (
      <AppBar position='fixed' elevation={0} color='primary'>
			<Toolbar>
				<Typography variant='h5' display='block' align='center'>
					Workout Tracker
				</Typography>
			</Toolbar>
		</AppBar>
	);
}

export default NavBarLogin;
