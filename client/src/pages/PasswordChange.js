import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Snackbar from '@material-ui/core/Snackbar';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';

import { changePassword } from '../services/authentication';
import { validatePasswordChange } from '../lib/helperFunctions';

const useStyles = makeStyles({
  root: {
    minHeight: 'calc(100vh - 64px)'
  },
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

function Password() {
  const classes = useStyles();
  const [newPassword1, changeNewPassword1] = useState('');
  const [newPassword2, changeNewPassword2] = useState('');
  const [open, setOpen] = useState(false);
  const history = useHistory();

  async function handleSubmit(event) {
    event.preventDefault();
    const validatedInput = validatePasswordChange(newPassword1, newPassword2);
    if (validatedInput === false) {
      return setOpen(true);
    }

    const data = await changePassword(newPassword1, newPassword2);
    if (data.detail !== 'New password has been saved.') {
      return setOpen(true);
    }
    return history.push('/dashboard');
  }

  function handleClose() {
    setOpen(false);
  }

  return (
    <Container>
      <Grid
        container
        direction='column'
        alignItems='center'
        justify='center'
        className={classes.root}
      >
        <Typography variant='h4' gutterBottom>
          Password Reset
				</Typography>
        <Divider />
        <Typography variant='subtitle1' gutterBottom>
          Your password must contain at least 8 characters and cannot be entirely numeric.
				</Typography>
        <Grid item xs={12} md={3}>
          <form noValidate onSubmit={handleSubmit}>
            <TextField
              onChange={(e) => changeNewPassword1(e.target.value)}
              className={classes.field}
              label='New Password'
              variant='outlined'
              value={newPassword1}
              type={'input'}
              name={'newPassword1'}
              color='secondary'
            />
            <TextField
              onChange={(e) => changeNewPassword2(e.target.value)}
              className={classes.field}
              label='New Password'
              variant='outlined'
              value={newPassword2}
              type={'input'}
              name={'newPassword2'}
              color='secondary'
            />
            <Button
              fullWidth
              type={'submit'}
              className={classes.btn}
              color='primary'
              variant='contained'
              disabled={!newPassword1 || !newPassword2 ? true : false}
            >
              Change Password
            </Button>
          </form>
        </Grid>
      </Grid>
      <Snackbar open={open} autoHideDuration={4000} onClose={handleClose}>
        <Alert severity='error'>
          New passwords don't match or wrong old password.
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default Password;
