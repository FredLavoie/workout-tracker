import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import { logout } from '../helpers/authentication';


const useStyles = makeStyles((theme) =>({
  root: {
    flexGrow: 1,
    zIndex: theme.zIndex.drawer + 1,
  },
  avatar: {
    backgroundColor: theme.palette.secondary.main,
  },
  menuButton: {
    color: theme.palette.secondary.main,
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));


function NavBarMain() {
  const classes =  useStyles();
  const history = useHistory();
  const username = localStorage.getItem('username');
  const firstTwoLetter = `${username[0].toUpperCase()}${username[1].toUpperCase()}`;

  async function handleSubmit(e) {
    e.preventDefault();
    await logout();
    return history.push('/login');
  }

  return (
    <AppBar
      position='fixed'
      color='primary'
      elevation={0}
      className={classes.root}
    >
      <Toolbar>
        <Typography edge='start' variant='h5' className={classes.title}>
          Workout Tracker
        </Typography>

        <Button onClick={handleSubmit} className={classes.menuButton}>
          logout
        </Button>
        <Avatar className={classes.avatar}>{firstTwoLetter}</Avatar>
      </Toolbar>
    </AppBar>
  )
}

export default NavBarMain;
