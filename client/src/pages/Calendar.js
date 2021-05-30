import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core';

import CalendarGrid from '../components/CalendarGrid';
import { fetchMonthData } from '../services/fetchData';
import { calculateMonth } from '../lib/helperFunctions';
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
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '65vw',
    },
  },
  monthNav: {
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '65vw',
    },
    display: 'flex',
    justifyContent: 'space-around',
    marginTop: '16px'
  },
  monthTitle: {
    width: '30%',
    textAlign: 'center',
    cursor: 'pointer',
  },
  weekNames: {
    display: 'flex',
    justifyContent: 'space-around',
    marginTop: '16px'
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '10%',
  }
}));


function Calendar() {
  const classes = useStyles();
  const [workouts, setWorkouts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const history = useHistory();
  const location = useLocation();

  const monthToFetch = location.pathname.split('/')[2]; // ex: 2021-05
  const currentMonthString = months[monthToFetch.split('-')[1]]; // May
  const currentMonth = monthToFetch.split('-')[1]; // 05
  const currentYear = monthToFetch.split('-')[0]; // 2021
  if (!currentMonthString || Number(currentYear) % 1 !== 0) history.push(`/404`);
  const prevMonth = calculateMonth(currentMonth, currentYear, 'prev');
  const nextMonth = calculateMonth(currentMonth, currentYear, 'next');

  function handleClickPrevious() {
    setWorkouts([]);
    setIsLoading(true);
    fetchMonthData(prevMonth).then((data) => {
      setWorkouts(data);
      setIsLoading(false);
    });
    history.push(`/cal/${prevMonth}`);
  }

  function handleClickNext() {
    setWorkouts([]);
    setIsLoading(true);
    fetchMonthData(nextMonth).then((data) => {
      setWorkouts(data);
      setIsLoading(false);
    });
    history.push(`/cal/${nextMonth}`);
  }

  function handleReturnToCurrent() {
    setWorkouts([]);
    setIsLoading(true);
    const currentDate = new Date().toISOString().split('T')[0].split('-');
    const dateString = `${currentDate[0]}-${currentDate[1]}`;
    fetchMonthData(dateString).then((data) => {
      setWorkouts(data);
      setIsLoading(false);
    });
    history.push(`/cal/${dateString}`);
  }

  useEffect(() => {
    fetchMonthData(monthToFetch).then((data) => {
      setWorkouts(data);
      setIsLoading(false);
    });
  }, []);

  return (
    <div>
      {isLoading && <div className={classes.loading}><CircularProgress /></div>}
      {!isLoading && <div className={classes.calendarContainer}>
        <div className={classes.monthNav}>
          <Button onClick={handleClickPrevious} color="primary" size="small" startIcon={<NavigateBeforeIcon />}>Previous</Button>
          <Typography onClick={handleReturnToCurrent} variant='h5' gutterBottom className={classes.monthTitle}>
            {`${currentMonthString} ${currentYear}`}
          </Typography>
          <Button onClick={handleClickNext} color="primary" size="small" endIcon={<NavigateNextIcon />}>Next</Button>
        </div>
        <div className={classes.outline}>
          <div className={classes.weekNames}>
            <Typography>SUN</Typography>
            <Typography>MON</Typography>
            <Typography>TUE</Typography>
            <Typography>WED</Typography>
            <Typography>THU</Typography>
            <Typography>FRI</Typography>
            <Typography>SAT</Typography>
          </div>
          <CalendarGrid workouts={workouts} month={currentMonth} year={currentYear} />
        </div>
      </div>}
    </div>
  );
}

export default Calendar;
