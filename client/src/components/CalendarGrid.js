import React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core';


const useStyles = makeStyles((theme) => ({
  container: {
    width: '100%',
    display: 'flex',
    flexGrow: '1',
    justifyContent: 'center',
    flexWrap: 'wrap',
    flexBasis: '10%',
    border: '1px solid #999999',
  },
  daySquare: {
    width: '13%',
    paddingBottom: '8%',
    border: '1px solid #d9d9d9',
    display: 'flex',
    flexGrow: '1',
    justifyContent: 'right'
  },
  active: {
    backgroundColor: theme.palette.secondary.main
  },
  innerText: {
    padding: 8
  },
  today: {
    backgroundColor: theme.palette.primary.main,
    color: '#fff'
  }
}));



function CalendarGrid(props) {
  const classes = useStyles();

  const weekDayFirstMonthDay = new Date(`${props.year}/${props.month}/01`).getDay();
  const numberOfDaysInMonth = new Date(props.year, props.month, 0).getDate();
  const currentDate = new Date().toISOString().split('T')[0];

  const contentArray = [];
  let dayOfTheMonth = 0;
  for (let i = 0; i < 42; i++) {
    const obj = { dayNumber: 0 };
    if (i === weekDayFirstMonthDay) {
      dayOfTheMonth += 1;
    }
    if (dayOfTheMonth > 0 && dayOfTheMonth <= numberOfDaysInMonth) {
      obj.dayNumber = dayOfTheMonth;
      dayOfTheMonth += 1;
    }
    if (Number(currentDate.split('-')[2]) + 1 === dayOfTheMonth
      && currentDate.split('-')[1] === props.month
      && currentDate.split('-')[0] === props.year) {
      obj.today = true;
    }
    if (dayOfTheMonth > numberOfDaysInMonth && i === 34) {
      contentArray.push(obj);
      break;
    }
    contentArray.push(obj);
  }

  for (const ea of contentArray) {
    for (const workout of props.workouts) {
      if (ea.dayNumber === Number(workout.date.split('-')[2])) {
        ea.active = true;
      }
    }
  }

  return (
    <div className={classes.container}>
      {contentArray.map((ea, index) => (
        <div key={index} className={`${classes.daySquare} ${ea.active ? classes.active : ''}`}>
          {ea.dayNumber !== 0
            ?
            <Typography variant='body2' className={`${classes.innerText} ${ea.today ? classes.today : ''}`}>
              {ea.dayNumber}
            </Typography>
            :
            ''
          }
        </div>
      ))}
    </div>
  );
}

export default CalendarGrid;
