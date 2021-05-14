import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core';
import { fetchMonthData } from '../services/fetchData';
import CalendarGrid from '../components/CalendarGrid';
import months from '../lib/months';


const useStyles = makeStyles((theme) => ({
  calendarContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    [theme.breakpoints.up('sm')]: {
      marginTop: 16,
      marginLeft: 16,
      marginRight: 8,
    },
  },
  outline: {
    width: '100%',
    border: '1px solid #d9d9d9',
    display: 'flex',
  }
}));

function Calendar() {
  const classes = useStyles();
  const [workouts, setWorkouts] = useState([]);
  const location = useLocation();
  const monthToFetch = location.pathname.split('/')[2]; // ex: 2021-05
  const currentMonth = months[monthToFetch.split('-')[1]]; // May
  const currentYear = monthToFetch.split('-')[0]; // 2021


  useEffect(() => {
    fetchMonthData(monthToFetch).then((data) => setWorkouts(data));
    // eslint-disable-next-line
  }, []);

  return (
    <div className={classes.calendarContainer}>
      <Typography variant='h4' gutterBottom>
        {`${currentMonth} ${currentYear}`}
      </Typography>
      <div className={classes.outline}>
        <CalendarGrid workouts={workouts} currentMonth={currentMonth} currentYear={currentYear} />
      </div>
    </div>
  );
}

export default Calendar;
