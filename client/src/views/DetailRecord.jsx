import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';

import { fetchEventRecords } from '../services/fetchData';
import ServerError from '../components/ServerError';

const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: 32,
    marginTop: 16,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '90%',
    },
    display: 'flex',
    justifyContent: 'flex-start',
    flexWrap: 'wrap'
  },
  title: {
    marginBottom: 16,
    [theme.breakpoints.up('sm')]: {
      marginBottom: 52,
    },
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '10%',
  },
  cardStyle: {
    width: 360,
    margin: '0px auto 16px auto',
    [theme.breakpoints.up('sm')]: {
      margin: '0px 0px 16px 0px',
    },
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
    width: 360,
    marginTop: 16,
  }
}));

function DetailRecord() {
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();
  const [records, setRecrods] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const eventToFetch = location.pathname.split('/')[3];

  useEffect(async () => {
    const abortCont = new AbortController();
    try {
      const data = await fetchEventRecords(eventToFetch, abortCont);
      const sortedRecords = data.sort((a, b) => b.date > a.date);
      setRecrods(sortedRecords);
      setIsLoading(false);
    } catch (error) {
      if (error.name === 'AbortError') return;
      setIsLoading(false);
      setError(error.message);
    }
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
      className={classes.root}
    >
      <Typography variant='h4' className={classes.title}>
        Record Details
      </Typography>
      {error && <ServerError errorMessage={error} />}
      {isLoading && <div className={classes.loading}><CircularProgress /></div>}
      {records && !isLoading && <Card elevation={2} className={classes.cardStyle}>
        <CardHeader
          title={records[0].event}
          className={classes.header}
        />
        <CardContent className={classes.content}>
          {records.map((ea, index) => (
            <div key={index} id={ea.id} className={classes.individualContainer} onClick={(e) => handleClickActive(e.target)}>
              <Typography variant={'body2'} className={classes.date}>{ea.date}</Typography>
              <Typography variant={'body2'} className={classes.score}>{ea.score}</Typography>
            </div>
          ))}
        </CardContent>
      </Card>}
      <Button className={classes.button} variant='outlined' onClick={handleCancel}>Go Back</Button>
    </Grid>
  );
}

export default DetailRecord;
