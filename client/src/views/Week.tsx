import React, { useState, useEffect } from 'react';

import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Typography
} from '@mui/material';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

import { ServerError } from '../components/ServerError';
import { months } from '../lib/months';
import { weekdayNames } from '../lib/weekdayNames';
import { fetchMonthData } from '../services/fetchData';
import {
  calculateWeek,
  correctDate,
  determineNextMonth
} from '../utils';

export function Week() {
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

  useEffect(() => {
    setIsLoading(true);
    const abortCont = new AbortController();
    const setupPage = async () => {
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
    };
    setupPage();
    return () => abortCont.abort();
  }, [dateArr]);

  return (
    <Grid
      container
      direction='column'
      alignItems='center'
      sx={style.root}
    >
      {error && <ServerError errorMessage={error} />}
      {isLoading && <CircularProgress />}
      {workouts && !isLoading &&
        <Box>
          <Box sx={style.weekNav}>
            <Button onClick={handleClickPrevious} sx={style.navLink} color='primary' size='small' startIcon={<NavigateBeforeIcon />}>Prev</Button>
            <Typography variant='h5' gutterBottom sx={style.monthTitle}>
              {`Week of ${months[weekArr[0].split('-')[1]]} ${weekArr[0].split('-')[2]}`}
            </Typography>
            <Button onClick={handleClickNext} sx={style.navLink} color='primary' size='small' endIcon={<NavigateNextIcon />}>Next</Button>
          </Box>
          <Box sx={style.weekContainer}>
            {weekArr.map((day, index) => (
              <Card elevation={2} sx={style.cardStyle} key={index}>
                <Typography variant='body1' color='textSecondary' sx={style.header}>
                  {`${weekdayNames[index]}, ${months[day.split('-')[1]]} ${day.split('-')[2]}`}
                </Typography>
                <CardContent sx={style.content}>
                  <Typography component='div'>
                    <Typography
                      component='pre'
                      sx={style.bodyText}
                    >
                      {workouts.find((ea) => ea.date === day)?.workout_body || 'Rest'}
                    </Typography>
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>}
    </Grid>
  );
}

const style = {
  root: {
    marginBottom: '32px',
    marginTop: '16px',
    width: '100%',
  },
  header: {
    paddingLeft: '16px',
    paddingBottom: '8px',
    paddingTop: '8px',
  },
  content: {
    padding: '0 16px 16px 16px',
  },
  bodyText: {
    font: 'inherit',
    margin: '0px',
  },
  monthTitle: {
    width: '30%',
    minWidth: '240px',
    textAlign: 'center',
  },
  navLink: {
    minWidth: '70px',
  },
  weekNav: {
    width: { sm: '65vw', sx: '100%' },
    margin: '16px auto',
    display: 'flex',
    justifyContent: 'space-around',
  },
  weekContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardStyle: {
    width: { sm: '100%', xs: '95%' },
    flexGrow: '1',
    margin: { md: '0px auto 16px auto', xs: '8px 0 4px 0' },
  },
};
