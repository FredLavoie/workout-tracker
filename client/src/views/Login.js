import React, { useState } from 'react';
import { Redirect, useHistory } from 'react-router-dom';

import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import InputLabel from '@material-ui/core/InputLabel';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import MuiAlert from '@material-ui/lab/Alert';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import Snackbar from '@material-ui/core/Snackbar';
import TextField from '@material-ui/core/TextField';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import { makeStyles } from '@material-ui/core';

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

  async function handleSubmit(event) {
    event.preventDefault();
    login(username, password)
      .then((data) => {
        if (data.non_field_errors) {
          return setOpen(true);
        }
        fetchAccountId()
          .then(() => history.push('/dashboard'))
          .catch((error) => {
            return setError(error.message);
          });
      })
      .catch((error) => {
        return setError(error.message);
      });
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
        justify='center'
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
