import React, { useState, useEffect } from 'react';

import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';

import ServerError from '../components/ServerError';
import { months } from '../lib/months';
import { fetchMonthData } from '../services/fetchData';
import {
  calculateWeek,
  correctDate,
  determineNextMonth
} from '../utils';

const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: 32,
    marginTop: 16,
    width: '100%',
  },
  header: {
    paddingLeft: 16,
    paddingBottom: 8,
    paddingTop: 8,
  },
  cardStyle: {
    width: '100%',
    flexGrow: '1',
    margin: '0px auto 16px auto',
    [theme.breakpoints.up('sm')]: {
      margin: '8px 0px 4px 8px',
      width: 256,
    },
  },
  content: {
    padding: '0 16px 16px 16px',
  },
  bodyText: {
    font: 'inherit',
    margin: 0,
  },
  weekContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  weekNav: {
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '65vw',
      margin: '16px auto',
    },
    display: 'flex',
    justifyContent: 'space-around',
    marginTop: '16px'
  },
  monthTitle: {
    width: '30%',
    minWidth: 200,
    textAlign: 'center',
  },
  navLink: {
    minWidth: 80,
  }
}));

function Week() {
  const classes = useStyles();
  const [workouts, setWorkouts] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  // dateArr example: Jan 31, 2020 -> ["1", "31", "2020"]
  const [dateArr, setDateArr] = useState(new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }).split(',')[0].split('/'));
  const [currentMonthToFetch, setCurrentMonthToFetch] = useState(`${dateArr[2]}-${dateArr[0].padStart(2, '0')}`);
  const [nextMonthToFetch, setNextMonthToFetch] = useState(`${dateArr[2]}-${String(Number(dateArr[0]) - 1).padStart(2, '0')}`);

  const weekArr = calculateWeek(dateArr);

  function handleClickPrevious() {
    const dateOfWeekToFetch = dateArr.map((ea, index) => {
      if (index === 1) return String(Number(ea) - 7);
      else return ea;
    });
    const correctedDate = correctDate(dateOfWeekToFetch);
    const nextMonthToFetch = determineNextMonth(correctedDate);
    setCurrentMonthToFetch(`${correctedDate[2]}-${correctedDate[0].padStart(2, '0')}`);
    setNextMonthToFetch(`${nextMonthToFetch[0]}-${nextMonthToFetch[1].padStart(2, '0')}`);
    setDateArr(correctedDate);
  }

  function handleClickNext() {
    const dateOfWeekToFetch = dateArr.map((ea, index) => {
      if (index === 1) return String(Number(ea) + 7);
      else return ea;
    });
    const correctedDate = correctDate(dateOfWeekToFetch);
    const nextMonthToFetch = determineNextMonth(correctedDate);
    setCurrentMonthToFetch(`${correctedDate[2]}-${correctedDate[0].padStart(2, '0')}`);
    setNextMonthToFetch(`${nextMonthToFetch[0]}-${nextMonthToFetch[1].padStart(2, '0')}`);
    setDateArr(correctedDate);
  }

  useEffect(async () => {
    setIsLoading(true);
    const abortCont = new AbortController();
    try {
      const data1 = await fetchMonthData(currentMonthToFetch, abortCont);
      const data2 = await fetchMonthData(nextMonthToFetch, abortCont);
      const newWorkouts = [...data1, ...data2];
      setWorkouts(newWorkouts);
      setIsLoading(false);
    } catch (error) {
      if (error.name === 'AbortError') return;
      setIsLoading(false);
      setError(error.message);
    }
    return () => abortCont.abort();
  }, [dateArr]);

  return (
    <Grid
      container
      direction='column'
      alignItems='center'
      className={classes.root}
    >
      {error && <ServerError errorMessage={error} />}
      {isLoading && <CircularProgress />}
      {workouts && !isLoading &&
        <div>
          <div className={classes.weekNav}>
            <Button onClick={handleClickPrevious} className={classes.navLink} color="primary" size="small" startIcon={<NavigateBeforeIcon />}>Prev</Button>
            <Typography variant='h5' gutterBottom className={classes.monthTitle}>
              {`Week of ${months[weekArr[0].split('-')[1]]} ${weekArr[0].split('-')[2]}`}
            </Typography>
            <Button onClick={handleClickNext} className={classes.navLink} color="primary" size="small" endIcon={<NavigateNextIcon />}>Next</Button>
          </div>
          <div className={classes.weekContainer}>
            {weekArr.map((day, index) => (
              <Card elevation={2} className={classes.cardStyle} key={index}>
                <Typography variant='body1' color='textSecondary' className={classes.header}>
                  {`Sunday, ${months[day.split('-')[1]]} ${day.split('-')[2]}`}
                </Typography>
                <CardContent className={classes.content}>
                  <Typography component='div'>
                    <pre className={classes.bodyText}>{workouts.find((ea) => ea.date === day)?.workout_body || 'Rest'}</pre>
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>}
    </Grid>
  );
}

export default Week;
