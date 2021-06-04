import React, { useState } from 'react';
import { Redirect, useHistory } from 'react-router-dom';

import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Snackbar from '@material-ui/core/Snackbar';
import TextField from '@material-ui/core/TextField';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';

import ServerError from '../components/ServerError';
import { isAuthenticated, login } from '../services/authentication';
import { fetchAccountId } from '../services/fetchData';


const useStyles = makeStyles({
  field: {
    marginTop: 20,
    markginBottom: 20,
    display: 'block'
  },
  btn: {
    marginTop: 20
  }
});

function Alert(props) {
  return <MuiAlert elevation={4} variant='filled' {...props} />;
}

function Login() {
  const classes = useStyles();
  const history = useHistory();
  const [username, changeUsername] = useState('');
  const [password, changePassword] = useState('');
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
              className={classes.field}
              label='Username'
              variant='outlined'
              value={username}
              type={'input'}
              name={'username'}
              color='secondary'
            />
            <TextField
              onChange={(e) => changePassword(e.target.value)}
              className={classes.field}
              label='Password'
              variant='outlined'
              value={password}
              type={'password'}
              name={'password'}
              color='secondary'
            />
            <Button
              fullWidth
              type={'submit'}
              className={classes.btn}
              color='primary'
              variant='contained'
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
