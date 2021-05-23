import React, { useState } from 'react';

import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core';

import { fetchSearchResults } from '../services/fetchData';

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
  searchBox: {
    marginTop: 32,
    width: 320,
  },
  elementMargin: {
    marginTop: 32,
  },
  checkboxes: {
    marginTop: 32,
    display: 'flex',
    justifyContent: 'center',
  }
}));


function Search() {
  const classes = useStyles();
  const [state, setState] = useState({
    checkedWorkout: true,
    checkedRecord: false,
    searchQuery: '',
    searchResults: [],
  });

  const handleCheck = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };

  const handleSearchInput = (event) => {
    setState({ ...state, searchQuery: event.target.value });
  };

  async function handleSubmit(event) {
    event.preventDefault();
    const results = await fetchSearchResults(state.checkedWorkout, state.checkedRecord, state.searchQuery);
    setState({ ...state, searchResults: results });
    console.log('state.searchResults: ', state.searchResults.sort((a, b) => b.date > a.date));
  }

  return (
    <Grid
      container
      direction='column'
      alignItems='center'
      justify='center'
      className={classes.root}
    >
      <Typography variant='h4'>
        Search
      </Typography>
      <form noValidate onSubmit={handleSubmit} >
        <TextField
          onChange={handleSearchInput}
          className={classes.searchBox}
          id='record-score'
          placeholder='Search workouts...'
          value={state.searchQuery}
        />
        <FormGroup row className={classes.checkboxes}>
          <FormControlLabel
            control={<Checkbox checked={state.checkedWorkout} onChange={handleCheck} name='checkedWorkout' color='primary' />}
            label='Workouts'
          />
          <FormControlLabel
            control={<Checkbox checked={state.checkedRecord} onChange={handleCheck} name='checkedRecord' color='primary' />}
            label='Records'
          />
        </FormGroup>
        <Button
          fullWidth
          type={'submit'}
          className={classes.elementMargin}
          color='primary'
          variant='contained'
          disabled={state.searchQuery === '' ? true : false}
        >
          Search
        </Button>
      </form>
      <main>
        { }
      </main>
    </Grid>
  );
}

export default Search;
