import React, { useState, useEffect } from 'react';
// import { useHistory, useLocation } from 'react-router-dom';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core';

import ServerError from '../components/ServerError';
import months from '../lib/months';
import { calculateWeek } from '../utils/calculateWeek';
import { fetchMonthData } from '../services/fetchData';

const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: 32,
    marginTop: 16,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '90%',
    },
    display: 'flex',
    justifyDirection: 'column',
  },
  title: {
    marginBottom: 16,
  },
  header: {
    paddingLeft: 32,
    paddingBottom: 8,
  },
  cardStyle: {
    width: 360,
    margin: '0px auto 16px auto',
    [theme.breakpoints.up('sm')]: {
      margin: '0px 16px 16px 8px',
    },
  },
  content: {
    padding: '0 32px 32px 32px',
  },
  bodyText: {
    font: 'inherit',
    margin: 0,
  }
}));

function Week() {
  const classes = useStyles();
  // const history = useHistory();
  // const location = useLocation();
  const [workouts, setWorkouts] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const currentDateArr = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }).split(',')[0].split('/');
  const weekArr = calculateWeek(currentDateArr);
  const currentMonthToFetch = `${currentDateArr[2]}-${currentDateArr[0].padStart(2, '0')}`;
  const lastMonthToFetch = `${currentDateArr[2]}-${String(Number(currentDateArr[0]) - 1).padStart(2, '0')}`;


  useEffect(async () => {
    const abortCont = new AbortController();
    await fetchMonthData(currentMonthToFetch, abortCont)
      .then((data1) => {
        fetchMonthData(lastMonthToFetch, abortCont)
          .then((data2) => {
            const newWorkouts = [...data1, ...data2];
            setWorkouts(newWorkouts);
            setIsLoading(false);
          })
          .catch((error) => {
            if (error.name === 'AbortError') return;
            else {
              setIsLoading(false);
              setError(error.message);
            }
          });
      })
      .catch((error) => {
        if (error.name === 'AbortError') return;
        else {
          setIsLoading(false);
          setError(error.message);
        }
      });
    return () => abortCont.abort();
  }, []);

  return (
    <Grid
      container
      direction='column'
      alignItems='center'
      className={classes.root}
    >
      <Typography variant='h4' className={classes.title}>
        Week View
      </Typography>
      {error && <ServerError errorMessage={error} />}
      {isLoading && <CircularProgress />}
      {!error && !isLoading &&
        <div>
          <Card elevation={2} className={classes.cardStyle}>
            <Typography variant='body1' color='textSecondary' className={classes.header}>
              {`Sunday, ${months[weekArr[0].split('-')[1]]} ${weekArr[0].split('-')[2]}`}
            </Typography>
            <CardContent className={classes.content}>
              <Typography>
                <pre className={classes.bodyText}>{workouts.find((ea) => ea.date === weekArr[0])?.workout_body || 'Rest'}</pre>
              </Typography>
            </CardContent>
          </Card>
          <Card elevation={2} className={classes.cardStyle}>
            <Typography variant='body1' color='textSecondary' className={classes.header}>
              {`Monday ${months[weekArr[1].split('-')[1]]} ${weekArr[1].split('-')[2]}`}
            </Typography>
            <CardContent className={classes.content}>
              <Typography>
                <pre className={classes.bodyText}>{workouts.find((ea) => ea.date === weekArr[1])?.workout_body || 'Rest'}</pre>
              </Typography>
            </CardContent>
          </Card>
          <Card elevation={2} className={classes.cardStyle}>
            <Typography variant='body1' color='textSecondary' className={classes.header}>
              {`Tuesday ${months[weekArr[2].split('-')[1]]} ${weekArr[2].split('-')[2]}`}
            </Typography>
            <CardContent className={classes.content}>
              <Typography>
                <pre className={classes.bodyText}>{workouts.find((ea) => ea.date === weekArr[2])?.workout_body || 'Rest'}</pre>
              </Typography>
            </CardContent>
          </Card>
          <Card elevation={2} className={classes.cardStyle}>
            <Typography variant='body1' color='textSecondary' className={classes.header}>
              {`Wednesday ${months[weekArr[3].split('-')[1]]} ${weekArr[3].split('-')[2]}`}
            </Typography>
            <CardContent className={classes.content}>
              <Typography>
                <pre className={classes.bodyText}>{workouts.find((ea) => ea.date === weekArr[3])?.workout_body || 'Rest'}</pre>
              </Typography>
            </CardContent>
          </Card>
          <Card elevation={2} className={classes.cardStyle}>
            <Typography variant='body1' color='textSecondary' className={classes.header}>
              {`Thursday ${months[weekArr[4].split('-')[1]]} ${weekArr[4].split('-')[2]}`}
            </Typography>
            <CardContent className={classes.content}>
              <Typography>
                <pre className={classes.bodyText}>{workouts.find((ea) => ea.date === weekArr[4])?.workout_body || 'Rest'}</pre>
              </Typography>
            </CardContent>
          </Card>
          <Card elevation={2} className={classes.cardStyle}>
            <Typography variant='body1' color='textSecondary' className={classes.header}>
              {`Friday ${months[weekArr[5].split('-')[1]]} ${weekArr[5].split('-')[2]}`}
            </Typography>
            <CardContent className={classes.content}>
              <Typography>
                <pre className={classes.bodyText}>{workouts.find((ea) => ea.date === weekArr[5])?.workout_body || 'Rest'}</pre>
              </Typography>
            </CardContent>
          </Card>
          <Card elevation={2} className={classes.cardStyle}>
            <Typography variant='body1' color='textSecondary' className={classes.header}>
              {`Saturday ${months[weekArr[6].split('-')[1]]} ${weekArr[6].split('-')[2]}`}
            </Typography>
            <CardContent className={classes.content}>
              <Typography>
                <pre className={classes.bodyText}>{workouts.find((ea) => ea.date === weekArr[6])?.workout_body || 'Rest'}</pre>
              </Typography>
            </CardContent>
          </Card>
        </div>}
    </Grid>
  );
}

export default Week;
