import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import Snackbar from '@mui/material/Snackbar';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import makeStyles from '@mui/styles/makeStyles';

import MuiAlert from '@mui/material/Alert';

import { fetchWorkout, postWorkout, updateWorkout, deleteWorkout } from '../services/fetchData';
import { validateWorkout } from '../utils/validateWorkout';
import { convertTime } from '../utils/convertTime';
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


// eslint-disable-next-line prefer-arrow-callback
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={4} ref={ref} {...props} />;
});


function Workout() {
  const classes = useStyles();
  const location = useLocation();
  const history = useHistory();

  const workoutId = location.pathname.split('/')[2];
  const newWorkoutDate = location.pathname.split('/')[3] || null;
  const newDate = new Date().toISOString().split('T');
  const currentDate = newDate[0];
  const currentTime = convertTime(new Date().toTimeString().split(':').splice(0, 2));
  const navDate = currentDate.split('-').splice(0, 2).join('-');

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
      setSelectedDate(newWorkoutDate !== null ? newWorkoutDate : currentDate);
      setSelectedTime(currentTime);
      changeNewOrEdit(1);
      setIsLoading(false);
    } else {
      try {
        const data = fetchWorkout(workoutId, abortCont);
        setSelectedDate(data.date);
        setSelectedTime(data.time.split(':').slice(0, 2).join(':'));
        setWorkoutBody(data.workout_body);
        changeNewOrEdit(0);
        setIsLoading(false);
      } catch (error) {
        if (error.name === 'AbortError') return;
        else {
          setIsLoading(false);
          setError(error.message);
        }
      }
    }
    return () => abortCont.abort();
  }, []);


  function handleSubmit(event) {
    event.preventDefault();

    if (workoutId === 'new') {
      const valid = validateWorkout(selectedDate, selectedTime, workoutBody);
      if (valid) {
        try {
          postWorkout(selectedDate, selectedTime, workoutBody);
          setAlertMessage({ severity: 'success', message: 'Successfully saved new workout.' });
          setOpen(true);
          setTimeout(() => history.push(`/cal/${navDate}`), 1500);
        } catch (error) {
          setAlertMessage({ severity: 'error', message: error.message });
          setOpen(true);
        }
      } else {
        setAlertMessage({ severity: 'error', message: 'One or more inputted values is invalid.' });
        setOpen(true);
      }
    } else {
      const valid = validateWorkout(selectedDate, selectedTime, workoutBody);
      if (valid) {
        try {
          updateWorkout(workoutId, selectedDate, selectedTime, workoutBody);
          setAlertMessage({ severity: 'success', message: 'Successfully updated workout.' });
          setOpen(true);
          setTimeout(() => history.push(`/cal/${navDate}`), 1500);
        } catch (error) {
          setAlertMessage({ severity: 'error', message: error.message });
          setOpen(true);
        }
      } else {
        setAlertMessage({ severity: 'error', message: 'One or more inputted values is invalid.' });
        setOpen(true);
      }
    }
  }

  function handleCancel() {
    history.goBack();
  }

  async function handleDelete() {
    try {
      deleteWorkout(workoutId);
      setAlertMessage({ severity: 'success', message: 'Successfully deleted workout.' });
      setOpen(true);
      setTimeout(() => history.push(`/cal/${navDate}`), 1500);
    } catch (error) {
      setAlertMessage({ severity: 'error', message: error.message });
      setOpen(true);
    }
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
            rows={10}
            defaultValue={workoutBody}
            variant='outlined'
          />
          <Button
            fullWidth
            type={'submit'}
            className={classes.btn}
            color='primary'
            variant='contained'
            key={`${!workoutBody ? true : false}`}
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
      <Snackbar open={open} autoHideDuration={4000} onClose={handleClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        {alertMessage && <Alert severity={alertMessage.severity}>{alertMessage.message}</Alert>}
      </Snackbar>
    </Grid>
  );
}

export default Workout;
