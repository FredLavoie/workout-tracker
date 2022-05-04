import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import {
  Box,
  Button,
  ButtonGroup,
  CircularProgress,
  Grid,
  Snackbar,
  Typography,
  TextField,
} from '@mui/material';

import MuiAlert from '@mui/material/Alert';

import { fetchWorkout, postWorkout, updateWorkout, deleteWorkout } from '../services/fetchData';
import { convertTime, validateWorkout } from '../utils';
import { ServerError } from '../components/ServerError';


// eslint-disable-next-line prefer-arrow-callback
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={4} ref={ref} {...props} />;
});


export function Workout() {
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


  useEffect(async () => {
    const abortCont = new AbortController();
    if (workoutId === 'new') {
      setSelectedDate(newWorkoutDate !== null ? newWorkoutDate : currentDate);
      setSelectedTime(currentTime);
      setWorkoutBody('');
      changeNewOrEdit(1);
      setIsLoading(false);
    } else {
      try {
        const data = await fetchWorkout(workoutId, abortCont);
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
  }, [location]);


  async function handleSubmit(event) {
    event.preventDefault();

    if (workoutId === 'new') {
      const valid = validateWorkout(selectedDate, selectedTime, workoutBody);
      if (valid) {
        try {
          await postWorkout(selectedDate, selectedTime, workoutBody);
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
          await updateWorkout(workoutId, selectedDate, selectedTime, workoutBody);
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
      await deleteWorkout(workoutId);
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
      sx={style.root}
    >
      <Typography variant='h4' gutterBottom>
        Workout
      </Typography>
      {error && <ServerError errorMessage={error} />}
      {isLoading && <CircularProgress />}
      {!error && !isLoading && <Grid sx={style.formSize}>
        <Box component='form' noValidate onSubmit={handleSubmit} sx={style.formContainer}>
          <Typography sx={style.labelStyle}>
            Date
          </Typography>
          <TextField
            onChange={(e) => setSelectedDate(e.target.value)}
            margin='normal'
            id='date-picker'
            value={selectedDate}
          />
          <Typography sx={style.labelStyle}>
            Time
          </Typography>
          <TextField
            onChange={(e) => setSelectedTime(e.target.value)}
            margin='normal'
            id='time-picker'
            value={selectedTime}
          />
          <Typography sx={style.labelStyle}>
            Workout
          </Typography>
          {workoutBody === '' ?
            <TextField
              onChange={(e) => setWorkoutBody(e.target.value)}
              sx={style.field}
              id='workout-body'
              multiline
              rows={10}
              value=''
              variant='outlined'
            />
            :
            <TextField
              onChange={(e) => setWorkoutBody(e.target.value)}
              sx={style.field}
              id='workout-body'
              multiline
              rows={10}
              defaultValue={workoutBody}
              variant='outlined'
            />
          }
          <Button
            fullWidth
            type={'submit'}
            sx={style.btn}
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
              <Button onClick={handleCancel} sx={style.btn} variant='outlined'>Cancel</Button>
              :
              <ButtonGroup fullWidth sx={style.btnGrp}>
                <Button onClick={handleCancel}>Go Back</Button>
                <Button onClick={handleDelete}>Delete</Button>
              </ButtonGroup>
          }
        </Box>
      </Grid>}
      <Snackbar open={open} autoHideDuration={4000} onClose={handleClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        {alertMessage && <Alert severity={alertMessage.severity}>{alertMessage.message}</Alert>}
      </Snackbar>
    </Grid>
  );
}

const style = {
  root: {
    minHeight: 'calc(100vh - 96px)',
    marginBottom: '32px',
    marginTop: '16px',
  },
  field: {
    margin: '16px 0 16px 0',
  },
  btn: {
    marginTop: '16px',
  },
  btnGrp: {
    marginTop: '16px',
  },
  formSize: {
    width: { sm: '65%', xs: '90%' },
  },
  formContainer: {
    display: 'flex',
    flexDirection: 'column',
    margin: 'auto',
  },
  labelStyle: {
    marginTop: '16px',
  },
};
