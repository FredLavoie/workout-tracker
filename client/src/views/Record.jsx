import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import CircularProgress from '@mui/material/CircularProgress';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Snackbar from '@mui/material/Snackbar';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';

import MuiAlert from '@mui/material/Alert';

import { fetchRecord, updateRecord, postRecord, deleteRecord } from '../services/fetchData';
import { validateRecord } from '../utils/validateRecord';
import ServerError from '../components/ServerError';
import { recordList } from '../lib/recordList';

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: 'calc(100vh - 96px)',
    marginBottom: 32,
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
  elementMargin: {
    marginTop: 16,
  },
}));


// eslint-disable-next-line prefer-arrow-callback
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={4} ref={ref} {...props} />;
});


function Record() {
  const classes = useStyles();
  const location = useLocation();
  const history = useHistory();

  const recordId = location.pathname.split('/')[2];
  const newDate = new Date().toISOString().split('T');
  const currentDate = newDate[0];


  const [selectedDate, setSelectedDate] = useState(currentDate);
  const [recordType, setRecordType] = useState('strength');
  const [recordEvent, setRecordEvent] = useState('');
  const [recordScore, setRecordScore] = useState('');
  const [newOrEdit, changeNewOrEdit] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);
  const [error, setError] = useState(null);


  useEffect(async () => {
    const abortCont = new AbortController();
    if (recordId === 'new') {
      setSelectedDate(currentDate);
      changeNewOrEdit(1);
      setIsLoading(false);
    } else {
      try {
        const data = await fetchRecord(recordId, abortCont);
        setSelectedDate(data.date);
        setRecordType(data.type);
        setRecordEvent(data.event);
        setRecordScore(data.score);
        changeNewOrEdit(0);
        setIsLoading(false);
      } catch (error) {
        if (error.name === 'AbortError') return;
        setIsLoading(false);
        setError(error.message);
      }
    }
    return () => abortCont.abort();
  }, []);


  async function handleSubmit(event) {
    event.preventDefault();

    if (recordId === 'new') {
      const valid = validateRecord(selectedDate, recordType, recordEvent, recordScore);
      if (valid) {
        try {
          await postRecord(selectedDate, recordType, recordEvent, recordScore);
          setAlertMessage({ severity: 'success', message: 'Successfully saved new PR.' });
          setOpen(true);
          setTimeout(() => history.push('/dashboard'), 1500);
        } catch (error) {
          setAlertMessage({ severity: 'error', message: error.message });
          setOpen(true);
        }
      } else {
        setAlertMessage({ severity: 'error', message: 'One or more inputted values is invalid.' });
        setOpen(true);
      }
    } else {
      const valid = validateRecord(selectedDate, recordType, recordEvent, recordScore);
      if (valid) {
        try {
          await updateRecord(recordId, selectedDate, recordType, recordEvent, recordScore);
          setAlertMessage({ severity: 'success', message: 'Successfully updated PR.' });
          setOpen(true);
          setTimeout(() => history.push('/dashboard'), 1500);
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
      await deleteRecord(recordId);
      setAlertMessage({ severity: 'success', message: 'Successfully deleted PR.' });
      setOpen(true);
      setTimeout(() => history.push('/dashboard'), 1500);
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
        Personal Record
      </Typography>
      {error && <ServerError errorMessage={error} />}
      {isLoading && <CircularProgress />}
      {!error && !isLoading && <Grid className={classes.formSize}>
        <form noValidate onSubmit={handleSubmit} className={classes.formContainer}>
          <Typography className={classes.elementMargin}>
            Date
          </Typography>
          <TextField
            onChange={(e) => setSelectedDate(e.target.value)}
            margin='normal'
            id='date-picker'
            value={selectedDate}
          />
          <Typography className={classes.elementMargin}>
            Event Type
          </Typography>
          <RadioGroup
            row
            name="recordType"
            value={recordType}
            className={classes.elementMargin}
            onChange={(e) => setRecordType(e.target.value)}
          >
            <FormControlLabel
              value="strength"
              control={<Radio color="primary" />}
              label="Strength"
            />
            <FormControlLabel
              value="endurance"
              control={<Radio color="primary" />}
              label="Endurance"
            />
            <FormControlLabel
              value="wod"
              control={<Radio color="primary" />}
              label="WOD"
            />
          </RadioGroup>
          <Typography className={classes.elementMargin}>
            Event
          </Typography>
          <Select
            onChange={(e) => setRecordEvent(e.target.value)}
            className={classes.elementMargin}
            id='record-event'
            value={recordEvent}
          >
            {recordList[recordType].map((ea, index) => (
              <MenuItem key={index} value={ea}>{ea}</MenuItem>
            ))}
          </Select>
          <Typography className={classes.elementMargin}>
            Score
          </Typography>
          <TextField
            onChange={(e) => setRecordScore(e.target.value)}
            className={classes.elementMargin}
            id='record-score'
            value={recordScore}
          />
          <Button
            fullWidth
            type={'submit'}
            className={classes.elementMargin}
            color='primary'
            variant='contained'
            key={`${!selectedDate || !recordEvent || !recordScore ? true : false}`}
            disabled={!selectedDate || !recordEvent || !recordScore ? true : false}
          >
            Save
          </Button>
          {
            newOrEdit === 1
              ?
              <Button onClick={handleCancel} className={classes.elementMargin} variant='outlined'>Cancel</Button>
              :
              <ButtonGroup fullWidth className={classes.elementMargin}>
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

export default Record;