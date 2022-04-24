import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import {
  Box,
  Button,
  Container,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Snackbar,
  Typography
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import { Visibility, VisibilityOff } from '@mui/icons-material';

import { changePassword } from '../services/authentication';
import { validatePasswordChange } from '../utils';

// eslint-disable-next-line prefer-arrow-callback
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={4} ref={ref} {...props} />;
});

export function Password() {
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
      await changePassword(newPassword1, newPassword2);
      setAlertMessage({ severity: 'success', message: 'Successfully changed password.' });
      setOpen(true);
      setTimeout(() => history.push('/dashboard'), 1500);
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
        sx={style.root}
      >
        <Typography variant='h4' gutterBottom>
          Password Reset
        </Typography>
        <Typography variant='subtitle1' gutterBottom>
          Your password must contain at least 8 characters and cannot be entirely numeric.
        </Typography>
        <Grid item xs={12} md={3}>
          <Box component='form' noValidate onSubmit={handleSubmit}>
            <FormControl sx={style.textField} variant="outlined">
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
            <FormControl sx={style.textField} variant="outlined">
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
              sx={style.btn}
              color='primary'
              variant='contained'
              key={`${!newPassword1 || !newPassword2 ? true : false}`}
              disabled={!newPassword1 || !newPassword2 ? true : false}
            >
              Change Password
            </Button>
          </Box>
        </Grid>
      </Grid>
      <Snackbar open={open} autoHideDuration={4000} onClose={handleClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        {alertMessage && <Alert severity={alertMessage.severity}>{alertMessage.message}</Alert>}
      </Snackbar>
    </Container>
  );
}

const style = {
  root: {
    minHeight: 'calc(100vh - 64px)'
  },
  btn: {
    marginTop: '20px',
  },
  textField: {
    width: '100%',
    margin: '8px 0px',
  },
};
