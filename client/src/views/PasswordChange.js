import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import MuiAlert from '@mui/material/Alert';
import OutlinedInput from '@mui/material/OutlinedInput';
import Snackbar from '@mui/material/Snackbar';
import Typography from '@mui/material/Typography';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import makeStyles from '@mui/styles/makeStyles';

import { changePassword } from '../services/authentication';
import { validatePasswordChange } from '../utils/validatePasswordChange';

const useStyles = makeStyles({
  root: {
    minHeight: 'calc(100vh - 64px)'
  },
  btn: {
    marginTop: 20
  },
  textField: {
    width: '100%',
    margin: '8px 0px',
  },
});

function Alert(props) {
  return <MuiAlert elevation={4} variant='filled' {...props} />;
}

function Password() {
  const classes = useStyles();
  const history = useHistory();
  const [newPassword1, changeNewPassword1] = useState('');
  const [newPassword2, changeNewPassword2] = useState('');
  const [open, setOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    const validatedInput = validatePasswordChange(newPassword1, newPassword2);
    if (!validatedInput) {
      setAlertMessage({ severity: 'error', message: 'The two passwords do not match or don\'t meet the requirements.' });
      setOpen(true);
      return;
    }
    try {
      changePassword(newPassword1, newPassword2);
      setAlertMessage({ severity: 'success', message: 'Successfully changed password.' });
      setOpen(true);
      setTimeout(() => history.push('/dashboard'), 1500);
      return; // TODO: is this needed?
    } catch (error) {
      setAlertMessage({ severity: 'error', message: error.message });
      return setOpen(true);
    }
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
      <Grid
        container
        direction='column'
        alignItems='center'
        justifyContent='center'
        className={classes.root}
      >
        <Typography variant='h4' gutterBottom>
          Password Reset
        </Typography>
        <Typography variant='subtitle1' gutterBottom>
          Your password must contain at least 8 characters and cannot be entirely numeric.
        </Typography>
        <Grid item xs={12} md={3}>
          <form noValidate onSubmit={handleSubmit}>
            <FormControl className={classes.textField} variant="outlined">
              <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
              <OutlinedInput
                onChange={(e) => changeNewPassword1(e.target.value)}
                value={newPassword1}
                type={showPassword ? 'input' : 'password'}
                name={'newPassword1'}
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
            <FormControl className={classes.textField} variant="outlined">
              <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
              <OutlinedInput
                onChange={(e) => changeNewPassword2(e.target.value)}
                value={newPassword2}
                type={showPassword ? 'input' : 'password'}
                name={'newPassword2'}
                color='secondary'
              />
            </FormControl>
            <Button
              fullWidth
              type={'submit'}
              className={classes.btn}
              color='primary'
              variant='contained'
              key={`${!newPassword1 || !newPassword2 ? true : false}`}
              disabled={!newPassword1 || !newPassword2 ? true : false}
            >
              Change Password
            </Button>
          </form>
        </Grid>
      </Grid>
      <Snackbar open={open} autoHideDuration={4000} onClose={handleClose}>
        {alertMessage && <Alert severity={alertMessage.severity}>{alertMessage.message}</Alert>}
      </Snackbar>
    </Container>
  );
}

export default Password;
