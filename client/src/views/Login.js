import React, { useState } from 'react';
import { Redirect, useHistory } from 'react-router-dom';

import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import MuiAlert from '@mui/material/Alert';
import OutlinedInput from '@mui/material/OutlinedInput';
import Snackbar from '@mui/material/Snackbar';
import TextField from '@mui/material/TextField';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import makeStyles from '@mui/styles/makeStyles';

import ServerError from '../components/ServerError';
import { isAuthenticated, login } from '../services/authentication';
import { fetchAccountId } from '../services/fetchData';


const useStyles = makeStyles({
  btn: {
    marginTop: 20,
    color: '#fff',
  },
  textField: {
    width: '100%',
    margin: '8px 0px',
  },
});

function Alert(props) {
  return <MuiAlert elevation={4} variant='filled' {...props} />;
}

function Login() {
  const classes = useStyles();
  const history = useHistory();
  const [username, changeUsername] = useState('');
  const [password, changePassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(null);

  function handleSubmit(event) {
    event.preventDefault();
    try {
      const data = login(username, password);
      if (data.non_field_errors) {
        return setOpen(true);
      }
      try {
        fetchAccountId();
        history.push('/dashboard');

      } catch (error) {
        return setError(error.message);
      }
    } catch (error) {
      return setError(error.message);
    }
  }

  if (isAuthenticated() === true) {
    return <Redirect to='/dashboard' />;
  }

  function handleClose() {
    setOpen(false);
  }

  function handleClickShowPassword() {
    setShowPassword(!showPassword);
  }

  function handleMouseDownPassword(event) {
    event.preventDefault();
  }

  return (
    <Container>
      <AppBar position='fixed' elevation={1} color='primary'>
        <Toolbar>
          <Typography variant='h5' display='block'>
            Workout Tracker
          </Typography>
        </Toolbar>
      </AppBar>
      <Grid
        container
        direction='column'
        alignItems='center'
        justifyContent='center'
        style={{ minHeight: '100vh' }}
      >
        <Grid item xs={12} md={3}>
          <form noValidate onSubmit={handleSubmit}>
            <TextField
              onChange={(e) => changeUsername(e.target.value)}
              className={classes.textField}
              label='Username'
              variant='outlined'
              value={username}
              type={'input'}
              name={'username'}
              color='secondary'
            />
            <FormControl className={classes.textField} variant="outlined">
              <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
              <OutlinedInput
                onChange={(e) => changePassword(e.target.value)}
                value={password}
                type={showPassword ? 'input' : 'password'}
                name={'password'}
                color='secondary'
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      size="large"
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
                labelWidth={70}
              />
            </FormControl>
            <Button
              fullWidth
              type={'submit'}
              className={classes.btn}
              color='primary'
              variant='contained'
              key={`${!username || !password ? true : false}`}
              endIcon={<KeyboardArrowRightIcon />}
              disabled={!username || !password ? true : false}
            >
              Login
            </Button>
          </form>
        </Grid>
        {error && <ServerError errorMessage={error} />}
      </Grid>
      <Snackbar open={open} autoHideDuration={4000} onClose={handleClose}>
        <Alert severity='error'>
          Wrong username or password! Please try again.
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default Login;
