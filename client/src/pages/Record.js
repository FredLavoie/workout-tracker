import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Snackbar from '@material-ui/core/Snackbar';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core';

import MuiAlert from '@material-ui/lab/Alert';

import { fetchRecord, updateRecord, postRecord, deleteRecord } from '../services/fetchData';
import { validateRecord } from '../lib/helperFunctions';
import recordList from '../lib/recordList';

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: 'calc(100vh - 64px)',
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


function Alert(props) {
  return <MuiAlert elevation={4} variant='filled' {...props} />;
}


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
  const [open, setOpen] = useState(false);


  useEffect(() => {
    if (recordId === 'new') {
      setSelectedDate(currentDate);
      changeNewOrEdit(1);
    } else {
      fetchRecord(recordId)
        .then((data) => {
          console.log('data: ', data);
          setSelectedDate(data.date);
          setRecordType(data.type);
          setRecordEvent(data.event);
          setRecordScore(data.score);
          changeNewOrEdit(0);
        });
    }
    // eslint-disable-next-line
  }, []);


  async function handleSubmit(event) {
    event.preventDefault();

    if (recordId === 'new') {
      const valid = validateRecord(selectedDate, recordType, recordEvent, recordScore);
      if (valid) {
        await postRecord(selectedDate, recordType, recordEvent, recordScore);
        return history.goBack();
      }
      return setOpen(true);
    } else {
      const valid = validateRecord(selectedDate, recordType, recordEvent, recordScore);
      if (valid) {
        await updateRecord(recordId, selectedDate, recordType, recordEvent, recordScore);
        return history.goBack();
      }
      return setOpen(true);
    }
  }

  function handleCancel() {
    return history.goBack();
  }

  async function handleDelete() {
    await deleteRecord(recordId);
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
        Personal Record
      </Typography>
      <Grid className={classes.formSize}>
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
              labelPlacement="top"
            />
            <FormControlLabel
              value="endurance"
              control={<Radio color="primary" />}
              label="Endurance"
              labelPlacement="top"
            />
            <FormControlLabel
              value="wod"
              control={<Radio color="primary" />}
              label="WOD"
              labelPlacement="top"
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
      </Grid>
      <Snackbar open={open} autoHideDuration={4000} onClose={handleClose}>
        <Alert severity='error'>
          Invalid input. Check that the date format is YYY:MM:DD
        </Alert>
      </Snackbar>
    </Grid>
  );
}

export default Record;
