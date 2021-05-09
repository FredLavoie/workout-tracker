import { useHistory } from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button'
import Toolbar from '@material-ui/core/Toolbar';
import { logout } from '../helpers/authentication';

function NavBarMain() {
	const history = useHistory();

	async function handleSubmit(e) {
    e.preventDefault();
    await logout();
    return history.push('/login');
  }

	return (
    <AppBar 
			position='fixed' 
			elevation={0}
			color='primary'
		>
			<Toolbar>
				<Typography variant='h5' display='block'>
					Workout Tracker
				</Typography>

				<Button onClick={handleSubmit}>
					logout
				</Button>

			</Toolbar>
		</AppBar>
	)
}

export default NavBarMain;
