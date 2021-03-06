import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Grid,
  Typography
} from '@mui/material';

import { fetchEventRecords } from '../services/fetchData';
import { ServerError } from '../components/ServerError';
import { tRecord } from '../types';


export function DetailRecord() {
  const history = useHistory();
  const location = useLocation();
  const [records, setRecrods] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const eventToFetch = location.pathname.split('/')[3];

  useEffect(() => {
    const abortCont = new AbortController();
    const setupPage = async () => {
      try {
        const data = await fetchEventRecords(eventToFetch, abortCont);
        const sortedRecords = data.sort((a: tRecord, b: tRecord) => b.date > a.date);
        setRecrods(sortedRecords);
        setIsLoading(false);
      } catch (error) {
        if (error.name === 'AbortError') return;
        setIsLoading(false);
        setError(error.message);
      }
    };
    setupPage();
    return () => abortCont.abort();
  }, []);

  function handleClickActive(target) {
    if (target.id) history.push(`/records/${target.id}`);
    else history.push(`/records/${target.parentNode.id}`);
  }

  function handleCancel() {
    history.goBack();
  }

  return (
    <Grid
      container
      direction='column'
      alignItems='center'
      sx={style.root}
    >
      <Typography variant='h4' sx={style.title}>
        Record Details
      </Typography>
      {error && <ServerError errorMessage={error} />}
      {isLoading && <Box sx={style.loading}><CircularProgress /></Box>}
      {records && !isLoading &&
        <Card elevation={2} sx={style.cardStyle}>
          <CardHeader title={records[0].event} />
          <CardContent sx={style.content}>
            {records.map((ea, index) => (
              <Box key={index} id={ea.id} sx={style.individualContainer} onClick={(e) => handleClickActive(e.target)}>
                <Typography variant={'body2'}>{ea.date}</Typography>
                <Typography variant={'body2'}>{ea.score}</Typography>
              </Box>
            ))}
          </CardContent>
        </Card>}
      <Button sx={style.button} variant='outlined' onClick={handleCancel}>Go Back</Button>
    </Grid>
  );
}

const style = {
  root: {
    marginBottom: '32px',
    marginTop: '16px',
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-start',
    flexWrap: 'wrap'
  },
  title: {
    marginBottom: '16px',
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '10%',
  },
  cardStyle: {
    width: '360px',
    margin: '0px 0px 16px 0px',
  },
  individualContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    cursor: 'pointer',
    margin: '8px 0',
  },
  content: {
    padding: '0 32px 32px 32px',
  },
  button: {
    width: '360px',
    marginTop: '16px',
  }
};
