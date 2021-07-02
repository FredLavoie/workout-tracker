import React, { useState, useEffect } from 'react';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core';

import { fetchYearData, fetchRecords } from '../services/fetchData';
import months from '../lib/months';
import RecordTable from '../components/RecordTable';
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
  },
  dashboardContainer: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap'
  },
  cardStyle: {
    width: 360,
    margin: '0px auto 16px auto',
    [theme.breakpoints.up('sm')]: {
      margin: '0px 16px 16px 8px',
    },
  },
  summaryCardStyle: {
    width: 360,
    height: 600,
    margin: '0px auto 16px auto',
    [theme.breakpoints.up('sm')]: {
      margin: '0px 16px 16px 8px',
    },
  },
  header: {
    padding: 32,
  },
  content: {
    padding: '0 32px 32px 32px',
  },
  textCol: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  dataBackground: {
    backgroundColor: theme.palette.secondary.main,
    padding: '2px 4px',
    borderRadius: 6,
    textAlign: 'center',
  },
  centerText: {
    paddingTop: 2,
  },
  horzLine: {
    borderTop: '1px solid #f0f0f5',
    paddingTop: 8,
  },
}));

const currentDate = new Date().toISOString().split('T')[0].split('-');
const currentYear = currentDate[0];
const monthNumbersArr = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];

function Dashboard() {
  const classes = useStyles();
  const [yearWorkouts, setYearWorkouts] = useState([]);
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const abortCont = new AbortController();
    Promise.all([
      fetchRecords(abortCont),
      fetchYearData(currentYear, abortCont),
    ]).then((data) => {
      setRecords(data[0]);
      setYearWorkouts(data[1]);
      setIsLoading(false);
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

  function filterWorkoutsForMonth(workouts, monthNumber) {
    const numberOfWorkouts = workouts.filter((ea) => {
      return ea.date.split('-')[1] === monthNumber;
    });
    return numberOfWorkouts.length;
  }

  return (
    <Grid
      container
      direction='column'
      alignItems='center'
      className={classes.root}
    >
      <Typography variant='h4' className={classes.title}>
        Dashboard
      </Typography>
      {error && <ServerError errorMessage={error} />}
      {isLoading && <CircularProgress />}
      {!error && !isLoading && <div className={classes.dashboardContainer}>
        {/******************************************* SUMMARY *******************************************/}
        <Card elevation={2} className={classes.summaryCardStyle}>
          <CardHeader
            title='Summary'
            className={classes.header}
          />
          <CardContent className={classes.content}>
            {monthNumbersArr.map((ea, index) => (
              <Typography key={index} className={classes.textCol}>
                <span className={classes.centerText}>{months[ea]}</span>
                <span className={classes.dataBackground}>{
                  filterWorkoutsForMonth(yearWorkouts, ea)
                }</span>
              </Typography>
            ))}
            <Typography className={`${classes.textCol} ${classes.horzLine}`}>
              <span className={classes.centerText}>Year-to-date</span>
              <span className={classes.dataBackground}>{yearWorkouts.length}</span>
            </Typography>
          </CardContent>
        </Card>
        {/**************************************** STRENGTH PRs ***************************************/}
        <Card elevation={2} className={classes.cardStyle}>
          <CardHeader
            title='Strength PRs'
            className={classes.header}
          />
          <RecordTable type={'strength'} records={records.filter((ea) => ea.type === 'strength')} />
        </Card>
        {/**************************************** ENDURANCE PRs **************************************/}
        <Card elevation={2} className={classes.cardStyle}>
          <CardHeader
            title='Endurance PRs'
            className={classes.header}
          />
          <RecordTable type={'endurance'} records={records.filter((ea) => ea.type === 'endurance')} />
        </Card>
        {/******************************************* WOD PRs *****************************************/}
        <Card elevation={2} className={classes.cardStyle}>
          <CardHeader
            title='WOD PRs'
            className={classes.header}
          />
          <RecordTable type={'wod'} records={records.filter((ea) => ea.type === 'wod')} />
        </Card>
      </div>}
    </Grid>
  );
}

export default Dashboard;
