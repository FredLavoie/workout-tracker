import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Snackbar from '@material-ui/core/Snackbar';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core';

import MuiAlert from '@material-ui/lab/Alert';

import { fetchWorkout, postWorkout, updateWorkout, deleteWorkout } from '../services/fetchData';
import { validateWorkout } from '../lib/helperFunctions';
import ServerError from '../components/ServerError';

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: 'calc(100vh - 96px)',
    marginBottom: 32
  },
  field: {
    marginBottom: 16
  },
  btn: {
    marginTop: 16,
  },
  btnGrp: {
    marginTop: 16,
    display: 'felx'
  },
  formSize: {
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '60%',
    },
  },
  formContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: '90%',
    margin: 'auto',
    [theme.breakpoints.up('sm')]: {
      width: '50%',
      margin: 'auto',
    },
  },
  workout: {
    marginTop: 32
  },
}));


function convertTime(timeArr) {
  if (timeArr[0] === '23') return '23:00';

  const hour = (Number(timeArr[0]) + 1).toString();
  const paddedHour = hour.padStart(2, '0');
  return `${paddedHour}:00`;
}

function Alert(props) {
  return <MuiAlert elevation={4} variant='filled' {...props} />;
}


function Workout() {
  const classes = useStyles();
  const location = useLocation();
  const history = useHistory();

  const workoutId = location.pathname.split('/')[2];
  const newDate = new Date().toISOString().split('T');
  const currentDate = newDate[0];
  const currentTime = convertTime(new Date().toTimeString().split(':').splice(0, 2));

  const [selectedDate, setSelectedDate] = useState(currentDate);
  const [selectedTime, setSelectedTime] = useState(currentTime);
  const [workoutBody, setWorkoutBody] = useState('');
  const [newOrEdit, changeNewOrEdit] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);
  const [error, setError] = useState(null);


  useEffect(() => {
    const abortCont = new AbortController();
    if (workoutId === 'new') {
      setSelectedDate(currentDate);
      setSelectedTime(currentTime);
      changeNewOrEdit(1);
      setIsLoading(false);
    } else {
      fetchWorkout(workoutId, abortCont)
        .then((data) => {
          setSelectedDate(data.date);
          setSelectedTime(data.time.split(':').slice(0, 2).join(':'));
          setWorkoutBody(data.workout_body);
          changeNewOrEdit(0);
          setIsLoading(false);
        })
        .catch((error) => {
          if (error.name === 'AbortError') return;
          else {
            setIsLoading(false);
            setError(error.message);
          }
        });
    }
    return () => abortCont.abort();
  }, []);


  async function handleSubmit(event) {
    event.preventDefault();

    if (workoutId === 'new') {
      const valid = validateWorkout(selectedDate, selectedTime, workoutBody);
      if (valid) {
        await postWorkout(selectedDate, selectedTime, workoutBody)
          .then(() => {
            setAlertMessage({ severity: 'success', message: 'Successfully saved new workout.' });
            setOpen(true);
            setTimeout(() => history.push('/dashboard'), 2500);
            return;
          })
          .catch((error) => {
            setAlertMessage({ severity: 'error', message: error.message });
            return setOpen(true);
          });
      } else {
        setAlertMessage({ severity: 'error', message: 'One or more inputted values is invalid.' });
        return setOpen(true);
      }
    } else {
      const valid = validateWorkout(selectedDate, selectedTime, workoutBody);
      if (valid) {
        await updateWorkout(workoutId, selectedDate, selectedTime, workoutBody)
          .then(() => {
            setAlertMessage({ severity: 'success', message: 'Successfully updated workout.' });
            setOpen(true);
            setTimeout(() => history.push('/dashboard'), 2500);
            return;
          })
          .catch((error) => {
            setAlertMessage({ severity: 'error', message: error.message });
            return setOpen(true);
          });
      } else {
        setAlertMessage({ severity: 'error', message: 'One or more inputted values is invalid.' });
        return setOpen(true);
      }
    }
  }

  function handleCancel() {
    return history.goBack();
  }

  async function handleDelete() {
    await deleteWorkout(workoutId)
      .then(() => {
        setAlertMessage({ severity: 'success', message: 'Successfully deleted workout.' });
        setOpen(true);
        setTimeout(() => history.push('/dashboard'), 2500);
        return;
      })
      .catch((error) => {
        setAlertMessage({ severity: 'error', message: error.message });
        return setOpen(true);
      });
  }

  function handleClose() {
    setOpen(false);
  }

  return (
    <Grid
      container
      direction='column'
      alignItems='center'
      className={classes.root}
    >
      <Typography variant='h4' gutterBottom>
        Workout
      </Typography>
      {error && <ServerError errorMessage={error} />}
      {isLoading && <CircularProgress />}
      {!error && !isLoading && <Grid className={classes.formSize}>
        <form noValidate onSubmit={handleSubmit} className={classes.formContainer}>
          <TextField
            onChange={(e) => setSelectedDate(e.target.value)}
            margin='normal'
            id='date-picker'
            label='Date'
            value={selectedDate}
          />
          <TextField
            onChange={(e) => setSelectedTime(e.target.value)}
            margin='normal'
            id='time-picker'
            label='Time'
            value={selectedTime}
          />
          <Typography variant="caption" className={classes.workout}>
            Workout
          </Typography>
          <TextField
            onChange={(e) => setWorkoutBody(e.target.value)}
            className={classes.field}
            id='workout-body'
            multiline
            rows={20}
            defaultValue={workoutBody}
            variant='outlined'
          />
          <Button
            fullWidth
            type={'submit'}
            className={classes.btn}
            color='primary'
            variant='contained'
            disabled={!workoutBody ? true : false}
          >
            Save
          </Button>
          {
            newOrEdit === 1
              ?
              <Button onClick={handleCancel} className={classes.btn} variant='outlined'>Cancel</Button>
              :
              <ButtonGroup fullWidth className={classes.btnGrp}>
                <Button onClick={handleCancel}>Go Back</Button>
                <Button onClick={handleDelete}>Delete</Button>
              </ButtonGroup>
          }
        </form>
      </Grid>}
      <Snackbar open={open} autoHideDuration={4000} onClose={handleClose}>
        {alertMessage && <Alert severity={alertMessage.severity}>{alertMessage.message}</Alert>}
      </Snackbar>
    </Grid>
  );
}

export default Workout;
