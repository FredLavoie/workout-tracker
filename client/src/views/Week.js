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
import { calculateWeek } from '../utils/calculateWeek';
import { correctDate } from '../utils/correctDate';
import { fetchMonthData } from '../services/fetchData';

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
  const [dateArr, setDateArr] = useState(new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }).split(',')[0].split('/'));
  const [currentMonthToFetch, setCurrentMonthToFetch] = useState(`${dateArr[2]}-${dateArr[0].padStart(2, '0')}`);
  const [nextMonthToFetch, setNextMonthToFetch] = useState(`${dateArr[2]}-${String(Number(dateArr[0]) - 1).padStart(2, '0')}`);

  const weekArr = calculateWeek(dateArr);

  function handleClickPrevious() {
    // TODO: fix bug when pressing PREV where the next month's workouts are missing in the list
    const weekToFetch = dateArr.map((ea, index) => {
      if (index === 1) return String(Number(ea) - 7);
      else return ea;
    });
    const correctedDate = correctDate(weekToFetch);
    setDateArr(correctedDate);
    setCurrentMonthToFetch(`${correctedDate[2]}-${correctedDate[0].padStart(2, '0')}`);
    let nextMonth = -1;
    let nextYear = -1;
    if (Number(correctedDate[0]) - 1 === 0) {
      nextMonth = 12;
      nextYear = Number(correctedDate[2] - 1);
    } else {
      nextMonth = Number(correctedDate[0]) - 1;
      nextYear = Number(correctedDate[2]);
    }
    setNextMonthToFetch(`${String(nextYear)}-${String(nextMonth).padStart(2, '0')}`);
  }

  function handleClickNext() {
    const weekToFetch = dateArr.map((ea, index) => {
      if (index === 1) return String(Number(ea) + 7);
      else return ea;
    });
    const correctedDate = correctDate(weekToFetch);
    setDateArr(correctedDate);
    setCurrentMonthToFetch(`${correctedDate[2]}-${correctedDate[0].padStart(2, '0')}`);
    let nextMonth = -1;
    let nextYear = -1;
    if (Number(correctedDate[0]) + 1 === 13) {
      nextMonth = 1;
      nextYear = Number(correctedDate[2] + 1);
    } else {
      nextMonth = Number(correctedDate[0]) + 1;
      nextYear = Number(correctedDate[2]);
    }
    setNextMonthToFetch(`${String(nextYear)}-${String(nextMonth).padStart(2, '0')}`);
  }

  useEffect(() => {
    setIsLoading(true);
    const abortCont = new AbortController();
    try {
      const data1 = fetchMonthData(currentMonthToFetch, abortCont);
      const data2 = fetchMonthData(nextMonthToFetch, abortCont);
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
      {!error && !isLoading &&
        <div>
          <div className={classes.weekNav}>
            <Button onClick={handleClickPrevious} className={classes.navLink} color="primary" size="small" startIcon={<NavigateBeforeIcon />}>Prev</Button>
            <Typography variant='h5' gutterBottom className={classes.monthTitle}>
              {`Week of ${months[weekArr[0].split('-')[1]]} ${weekArr[0].split('-')[2]}`}
            </Typography>
            <Button onClick={handleClickNext} className={classes.navLink} color="primary" size="small" endIcon={<NavigateNextIcon />}>Next</Button>
          </div>
          <div className={classes.weekContainer}>
            <Card elevation={2} className={classes.cardStyle}>
              <Typography variant='body1' color='textSecondary' className={classes.header}>
                {`Sunday, ${months[weekArr[0].split('-')[1]]} ${weekArr[0].split('-')[2]}`}
              </Typography>
              <CardContent className={classes.content}>
                <Typography component='div'>
                  <pre className={classes.bodyText}>{workouts.find((ea) => ea.date === weekArr[0])?.workout_body || 'Rest'}</pre>
                </Typography>
              </CardContent>
            </Card>
            <Card elevation={2} className={classes.cardStyle}>
              <Typography variant='body1' color='textSecondary' className={classes.header}>
                {`Monday ${months[weekArr[1].split('-')[1]]} ${weekArr[1].split('-')[2]}`}
              </Typography>
              <CardContent className={classes.content}>
                <Typography component='div'>
                  <pre className={classes.bodyText}>{workouts.find((ea) => ea.date === weekArr[1])?.workout_body || 'Rest'}</pre>
                </Typography>
              </CardContent>
            </Card>
            <Card elevation={2} className={classes.cardStyle}>
              <Typography variant='body1' color='textSecondary' className={classes.header}>
                {`Tuesday ${months[weekArr[2].split('-')[1]]} ${weekArr[2].split('-')[2]}`}
              </Typography>
              <CardContent className={classes.content}>
                <Typography component='div'>
                  <pre className={classes.bodyText}>{workouts.find((ea) => ea.date === weekArr[2])?.workout_body || 'Rest'}</pre>
                </Typography>
              </CardContent>
            </Card>
            <Card elevation={2} className={classes.cardStyle}>
              <Typography variant='body1' color='textSecondary' className={classes.header}>
                {`Wednesday ${months[weekArr[3].split('-')[1]]} ${weekArr[3].split('-')[2]}`}
              </Typography>
              <CardContent className={classes.content}>
                <Typography component='div'>
                  <pre className={classes.bodyText}>{workouts.find((ea) => ea.date === weekArr[3])?.workout_body || 'Rest'}</pre>
                </Typography>
              </CardContent>
            </Card>
            <Card elevation={2} className={classes.cardStyle}>
              <Typography variant='body1' color='textSecondary' className={classes.header}>
                {`Thursday ${months[weekArr[4].split('-')[1]]} ${weekArr[4].split('-')[2]}`}
              </Typography>
              <CardContent className={classes.content}>
                <Typography component='div'>
                  <pre className={classes.bodyText}>{workouts.find((ea) => ea.date === weekArr[4])?.workout_body || 'Rest'}</pre>
                </Typography>
              </CardContent>
            </Card>
            <Card elevation={2} className={classes.cardStyle}>
              <Typography variant='body1' color='textSecondary' className={classes.header}>
                {`Friday ${months[weekArr[5].split('-')[1]]} ${weekArr[5].split('-')[2]}`}
              </Typography>
              <CardContent className={classes.content}>
                <Typography component='div'>
                  <pre className={classes.bodyText}>{workouts.find((ea) => ea.date === weekArr[5])?.workout_body || 'Rest'}</pre>
                </Typography>
              </CardContent>
            </Card>
            <Card elevation={2} className={classes.cardStyle}>
              <Typography variant='body1' color='textSecondary' className={classes.header}>
                {`Saturday ${months[weekArr[6].split('-')[1]]} ${weekArr[6].split('-')[2]}`}
              </Typography>
              <CardContent className={classes.content}>
                <Typography component='div'>
                  <pre className={classes.bodyText}>{workouts.find((ea) => ea.date === weekArr[6])?.workout_body || 'Rest'}</pre>
                </Typography>
              </CardContent>
            </Card>
          </div>
        </div>}
    </Grid>
  );
}

export default Week;
