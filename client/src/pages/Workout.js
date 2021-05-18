import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Grid from '@material-ui/core/Grid';
import Snackbar from '@material-ui/core/Snackbar';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core';

import MuiAlert from '@material-ui/lab/Alert';

import { fetchWorkout, postWorkout, updateWorkout, deleteWorkout } from '../services/fetchData';
import { validateNewWorkout } from '../lib/helperFunctions';

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: 'calc(100vh - 64px)',
  },
  field: {
    markginBottom: 16
  },
  btn: {
    marginTop: 16
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

  const hour = Number(timeArr[0]) + 1;
  return `${hour}:00`;
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
  const [open, setOpen] = useState(false);


  useEffect(() => {
    if (workoutId === 'new') {
      setSelectedDate(currentDate);
      setSelectedTime(currentTime);
      changeNewOrEdit(1);
    } else {
      fetchWorkout(workoutId)
        .then((data) => {
          setSelectedDate(data.date);
          setSelectedTime(data.time.split(':').slice(0, 2).join(':'));
          setWorkoutBody(data.workout_body);
          changeNewOrEdit(0);
        });
    }
    // eslint-disable-next-line
  }, []);


  async function handleSubmit(event) {
    event.preventDefault();

    if (workoutId === 'new') {
      const valid = validateNewWorkout(selectedDate, selectedTime, workoutBody);
      if (valid) {
        await postWorkout(selectedDate, selectedTime, workoutBody);
        return history.goBack();
      }
      return setOpen(true);
    } else {
      const valid = validateNewWorkout(selectedDate, selectedTime, workoutBody);
      if (valid) {
        await updateWorkout(workoutId, selectedDate, selectedTime, workoutBody);
        return history.goBack();
      }
      return setOpen(true);
    }
  }

  function handleCancel() {
    return history.goBack();
  }

  async function handleDelete() {
    await deleteWorkout(workoutId);
    return history.goBack();
  }

  function handleClose() {
    setOpen(false);
  }

  return (
    <Grid
      container
      direction='column'
      alignItems='center'
      justify='center'
      className={classes.root}
    >
      <Typography variant='h4' gutterBottom>
        Workout
      </Typography>
      <Grid className={classes.formSize}>
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
          <Typography className={classes.workout}>
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
      </Grid>
      <Snackbar open={open} autoHideDuration={4000} onClose={handleClose}>
        <Alert severity='error'>
          Invalid input. Check that the time format is 00:00 and the date format is YYY:MM:DD
        </Alert>
      </Snackbar>
    </Grid>
  );
}

export default Workout;
