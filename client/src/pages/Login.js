import React, { useState } from 'react';
import { Redirect, useHistory } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';
import Container from '@material-ui/core/Container';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import { isAuthenticated, login } from '../helpers/authentication';
import NavBarLogin from '../components/NavBarLogin';


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
  return <MuiAlert elevation={6} variant='filled' {...props} />;
}

function Login() {
  const classes = useStyles();
  const [username, changeUsername] =  useState('');
  const [password, changePassword] =  useState('');
  const [open, setOpen] = useState(false);
  const history = useHistory();

  // handle login
  async function handleSubmit(e) {
    e.preventDefault();
    const data = await login(username, password);
    if (data.non_field_errors) {
      return setOpen(true);
    }
    return history.push('/dashboard');
  }

  if (isAuthenticated() === true) {
    return <Redirect to='/dashboard' />;
  }

  function handleClose() {
    setOpen(false);
  }

  return (
    <Container>
      <NavBarLogin />
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
              disabled={ !username || !password ? true : false }
            >
              Login
            </Button>
          </form>
        </Grid>
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
