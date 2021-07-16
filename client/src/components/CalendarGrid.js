import React from 'react';
import { useHistory } from 'react-router-dom';

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
    border: '1.5px solid #d9d9d9',
  },
  daySquare: {
    width: '13%',
    paddingBottom: '8%',
    border: '1.5px solid #d9d9d9',
    display: 'flex',
    flexGrow: '1',
    justifyContent: 'right',
  },
  active: {
    backgroundColor: theme.palette.secondary.main,
    cursor: 'pointer',
  },
  dayOfMonth: {
    backgroundColor: '#ede7f6',
    cursor: 'pointer',
  },
  notDayOfMonth: {
    ackgroundColor: '#fff',
  },
  innerText: {
    padding: 4
  },
  today: {
    backgroundColor: theme.palette.primary.main,
    borderRadius: 4,
    padding: '4px 6px',
    color: '#fff'
  }
}));



function CalendarGrid(props) {
  const classes = useStyles();
  const history = useHistory();

  const weekDayFirstMonthDay = new Date(`${props.year}/${props.month}/01`).getDay();
  const numberOfDaysInMonth = new Date(props.year, props.month, 0).getDate();
  const currentDate = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }).split(',')[0];

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
    if (Number(currentDate.split('/')[1]) + 1 === dayOfTheMonth
      && currentDate.split('/')[0].padStart(2, '0') === props.month
      && currentDate.split('/')[2] === props.year) {
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
        ea.workoutId = workout.id;
      }
    }
  }

  async function handleClickActive(id, dayNum) {
    if (dayNum === 0) return;
    if (!id) {
      history.push('/workouts/new');
    } else {
      history.push(`/workouts/${id}`);
    }
  }


  function applySquareStyle(ea) {
    if (ea.active) return classes.active;
    if (ea.dayNumber > 0) return classes.dayOfMonth;
    return classes.notDayOfMonth;
  }

  return (
    <div className={classes.container}>
      {contentArray.map((ea, index) => (
        <div
          onClick={(e) => handleClickActive(e.currentTarget.id, ea.dayNumber)}
          key={index}
          id={ea.workoutId ? ea.workoutId : ''}
          className={`${classes.daySquare} ${applySquareStyle(ea)}`}
        >
          {ea.dayNumber !== 0
            ?
            <Typography
              variant='body2'
              id={ea.workoutId ? ea.workoutId : ''}
              className={`${classes.innerText} ${ea.today ? classes.today : ''}`}
            >
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
