import React, { useState, useEffect } from 'react';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core';

import { fetchMonthData, fetchYearData, fetchRecords } from '../services/fetchData';
import RecordTable from '../components/RecordTable';


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
    height: 200,
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
    width: 24,
    textAlign: 'center',
  },
  centerText: {
    paddingTop: 2,
  },
}));

const currentDate = new Date().toISOString().split('T')[0].split('-');
const currentYearMonth = `${currentDate[0]}-${currentDate[1]}`;
const currentYear = currentDate[0];

function Dashboard() {
  const classes = useStyles();
  const [monthWorkouts, setMonthWorkouts] = useState([]);
  const [yearWorkouts, setYearWorkouts] = useState([]);
  const [records, setRecords] = useState([]);

  useEffect(() => {
    fetchRecords().then((data) => setRecords(data));
    fetchMonthData(currentYearMonth).then((data) => setMonthWorkouts(data));
    fetchYearData(currentYear).then((data) => setYearWorkouts(data));
  }, []);


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
      {/******************************************* SUMMARY *******************************************/}
      <Card elevation={2} className={classes.summaryCardStyle}>
        <CardHeader
          title='Summary'
          className={classes.header}
        />
        <CardContent className={classes.content}>
          <Typography className={classes.textCol}>
            <span className={classes.centerText}>Workouts (YTD)</span>
            <span className={classes.dataBackground}>{yearWorkouts.length}</span>
          </Typography>
          <Typography className={classes.textCol}>
            <span className={classes.centerText}>Workouts (This month)</span>
            <span className={classes.dataBackground}>{monthWorkouts.length}</span>
          </Typography>
        </CardContent>
      </Card>
      <div className={classes.dashboardContainer}>
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
      </div>
    </Grid>
  );
}

export default Dashboard;
