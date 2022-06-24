import React, { useState } from 'react';

import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormGroup,
  FormControlLabel,
  Grid,
  TextField,
  Typography
} from '@mui/material';

import { SearchResultCard } from '../components/SearchResultCard';
import { ServerError } from '../components/ServerError';
import { fetchSearchResults } from '../services/fetchData';
import { tConditionalEntry } from '../types';


export function Search() {
  const [checkedWorkout, setCheckedWorkout] = useState(true);
  const [checkedRecord, setCheckedRecord] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  function handleClear() {
    setSearchQuery('');
    setSearchResults(null);
    setError(null);
  }

  async function handleSubmit(event: { preventDefault: () => void; }) {
    event.preventDefault();
    setIsLoading(true);
    try {
      const results = await fetchSearchResults(checkedWorkout, checkedRecord, searchQuery);
      const sortedResults = results.sort((a: tConditionalEntry, b: tConditionalEntry) => {
        const aSeconds = new Date(a.date).getTime();
        const bSeconds = new Date(b.date).getTime();
        if (bSeconds > aSeconds) return 1;
        if (bSeconds < aSeconds) return -1;
        return 0;
      });
      setSearchResults(sortedResults);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setSearchResults(null);
      setError(error);
      return;
    }
  }

  return (
    <Grid
      container
      direction='column'
      alignItems='center'
      sx={style.root}
    >
      <Typography variant='h4' sx={style.title}>
        Search
      </Typography>
      <Box component='form' noValidate onSubmit={handleSubmit} sx={style.formElement}>
        <TextField
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={style.searchBox}
          id='record-score'
          placeholder='Search workouts/records...'
          value={searchQuery}
        />
        <FormGroup row sx={style.checkboxes}>
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
                data-testid='checkedRecord'
              />}
            label='PRs'
          />
        </FormGroup>
        <Box sx={style.buttonContainer}>
          <Button
            type={'submit'}
            sx={style.elementMargin}
            color='primary'
            variant='contained'
            data-testid='submit-search'
            key={`${searchQuery === '' ? true : false}`}
            disabled={searchQuery === '' ? true : false}
          >
            Search
          </Button>
          <Button
            onClick={handleClear}
            sx={style.elementMargin}
            color='primary'
            variant='outlined'
            data-testid='clear-search'
          >
            Clear
          </Button>
        </Box>
      </Box>
      {error && <ServerError errorMessage={error} />}
      {isLoading && <Box sx={style.loading}><CircularProgress /></Box>}
      {searchResults && searchResults.length > 0 ? <Typography color='primary'>( Number of results found: {searchResults.length} )</Typography> : ''}
      {searchResults && searchResults.length > 0 ? <SearchResultCard content={searchResults} /> : <></>}
    </Grid>
  );
}

const style = {
  root: {
    marginBottom: '32px',
    marginTop: '16px',
  },
  title: {
    marginBottom: '16px',
  },
  searchBox: {
    marginTop: '16px',
    width: '272px',
  },
  elementMargin: {
    marginTop: '16px',
  },
  checkboxes: {
    marginTop: '16px',
    marginLeft: '16px',
    width: '208px',
    display: 'flex',
    justifyContent: 'center',
  },
  formElement: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    width: '100%',
    marginBottom: '16px',
  },
  buttonContainer: {
    width: '208px',
    display: 'flex',
    justifyContent: 'space-around'
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '10%',
  },
};
