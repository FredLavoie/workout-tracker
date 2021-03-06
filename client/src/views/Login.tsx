import React, { useState } from 'react';
import { Redirect, useHistory } from 'react-router-dom';

import {
  AppBar,
  Box,
  Button,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Paper,
  Snackbar,
  TextField,
  Toolbar,
  Typography
} from '@mui/material';

import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

import MuiAlert, { AlertProps } from '@mui/material/Alert';

import { ServerError } from '../components/ServerError';
import { isAuthenticated, login } from '../services/authentication';
import { fetchAccountId } from '../services/fetchData';


// eslint-disable-next-line prefer-arrow-callback
const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={4} ref={ref} {...props} />;
});

export function Login() {
  const history = useHistory();
  const [username, changeUsername] = useState('');
  const [password, changePassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(event: { preventDefault: () => void }) {
    event.preventDefault();
    try {
      const data = await login(username, password);
      if (data.non_field_errors) {
        return setOpen(true);
      }
      try {
        await fetchAccountId();
        history.push('/dashboard');

      } catch (error) {
        return setError(error.message);
      }
    } catch (error) {
      return setError(error.message);
    }
  }

  // redirect to dashboard if already authenticated
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
    <Paper elevation={0}>
      <AppBar sx={style.appBar} position='fixed' elevation={1}>
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
          <Box component='form' noValidate onSubmit={handleSubmit}>
            <TextField
              onChange={(e) => changeUsername(e.target.value)}
              sx={style.textField}
              label='Username'
              variant='outlined'
              value={username}
              type={'input'}
              name={'username'}
              color='primary'
            />
            <FormControl sx={style.textField} variant='outlined'>
              <InputLabel htmlFor='outlined-adornment-password'>Password</InputLabel>
              <OutlinedInput
                onChange={(e) => changePassword(e.target.value)}
                value={password}
                type={showPassword ? 'input' : 'password'}
                name={'password'}
                label='Password'
                id='outlined-adornment-password'
                endAdornment={
                  <InputAdornment position='end'>
                    <IconButton
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      size='large'
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
            <Button
              fullWidth
              type={'submit'}
              sx={style.btn}
              color='primary'
              variant='contained'
              key={`${!username || !password ? true : false}`}
              endIcon={<KeyboardArrowRightIcon />}
              disabled={!username || !password ? true : false}
            >
              Login
            </Button>
          </Box>
        </Grid>
        {error && <ServerError errorMessage={error} />}
      </Grid>
      <Snackbar open={open} autoHideDuration={4000} onClose={handleClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity='error'>
          Wrong username or password! Please try again.
        </Alert>
      </Snackbar>
    </Paper>
  );
}


const style = {
  appBar: {
    backgroundColor: '#673ab7', // prevent appBar color from changing with mode
    ['& .MuiToolbar-root']: { minHeight: '56px' },
  },
  btn: {
    marginTop: '20px',
  },
  textField: {
    width: '100%',
    margin: '8px 0px',
  },
};
