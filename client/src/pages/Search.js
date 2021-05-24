import React, { useState } from 'react';

import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core';

import SearchResultCard from '../components/SearchResultCard';
import { fetchSearchResults } from '../services/fetchData';

const useStyles = makeStyles({
  root: {
    marginBottom: 32,
    marginTop: 16,
  },
  title: {
    marginBottom: 16,
  },
  searchBox: {
    marginTop: 16,
    width: 272,
  },
  elementMargin: {
    marginTop: 16,
  },
  checkboxes: {
    marginTop: 16,
    marginLeft: 16,
    width: 208,
    display: 'flex',
    justifyContent: 'center',
  },
  formElement: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    width: '100%',
    marginBottom: 16,
  },
  buttonContainer: {
    width: 208,
    display: 'flex',
    justifyContent: 'space-around'
  },
});


function Search() {
  const classes = useStyles();
  const [checkedWorkout, setCheckedWorkout] = useState(true);
  const [checkedRecord, setCheckedRecord] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  function handleClear() {
    setSearchQuery('');
    setSearchResults([]);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const results = await fetchSearchResults(checkedWorkout, checkedRecord, searchQuery);
    const sortedResults = results.sort((a, b) => b.date > a.date);
    setSearchResults(sortedResults);
  }

  return (
    <Grid
      container
      direction='column'
      alignItems='center'
      className={classes.root}
    >
      <Typography variant='h4' className={classes.title}>
        Search
      </Typography>
      <form noValidate onSubmit={handleSubmit} className={classes.formElement}>
        <TextField
          onChange={(e) => setSearchQuery(e.target.value)}
          className={classes.searchBox}
          id='record-score'
          placeholder='Search workouts...'
          value={searchQuery}
        />
        <FormGroup row className={classes.checkboxes}>
          <FormControlLabel
            control={
              <Checkbox
                checked={checkedWorkout}
                onChange={(e) => setCheckedWorkout(e.target.checked)}
                name='checkedWorkout'
                color='primary'
              />}
            label='Workouts'
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={checkedRecord}
                onChange={(e) => setCheckedRecord(e.target.checked)}
                name='checkedRecord'
                color='primary'
              />}
            label='PRs'
          />
        </FormGroup>
        <div className={classes.buttonContainer}>
          <Button
            type={'submit'}
            className={classes.elementMargin}
            color='primary'
            variant='contained'
            disabled={searchQuery === '' ? true : false}
          >
            Search
          </Button>
          <Button
            onClick={handleClear}
            className={classes.elementMargin}
            color='primary'
            variant='outlined'
          >
            Clear
          </Button>
        </div>
      </form>
      {searchResults.length > 0 ? <Typography color='primary'>( Number of results found: {searchResults.length} )</Typography> : ''}
      {searchResults.length > 0 ? <SearchResultCard content={searchResults} /> : <div></div>}
    </Grid>
  );
}

export default Search;
