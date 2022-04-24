import React from 'react';
import { useHistory } from 'react-router-dom';

import {
  Card,
  CardHeader,
  CardContent,
  Grid,
  Typography
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';


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
  cardStyle: {
    width: 256,
    margin: '0px auto 16px auto',
    [theme.breakpoints.up('sm')]: {
      margin: '0px 16px 16px 8px',
    },
    cursor: 'pointer',
  },
  header: {
    paddingBottom: 0,
  },
  detail: {
    pading: 'none',
  },
  bodyText: {
    font: 'inherit',
    margin: 0,
  }
}));

export function SearchResultCard({ content }) {
  const classes = useStyles();
  const history = useHistory();

  function handleClickActive(id, workout) {
    if (workout === true) {
      history.push(`/workouts/${id}`);
    } else {
      history.push(`/records/${id}`);
    }
  }

  return (
    <Grid
      className={classes.root}
    >
      {content.map((ea, index) => (
        <Card
          elevation={2}
          key={index}
          id={ea.id}
          className={classes.cardStyle}
          onClick={(e) => handleClickActive(e.currentTarget.id, !!ea.workout_body)}
        >
          <CardHeader
            title={ea.workout_body ? 'Workout' : 'Personal Record'}
            subheader={ea.date}
            className={classes.header}
          />
          {ea.workout_body
            ?
            <CardContent>
              <Typography component='div' variant='body2' color='textSecondary'>
                <pre className={classes.bodyText}>{ea.workout_body}</pre>
              </Typography>
            </CardContent>
            :
            <CardContent>
              <Typography variant='body2' color='textSecondary'>
                {`${ea.type} - ${ea.event}`}
              </Typography>
              <Typography variant='body2' color='textSecondary'>
                {ea.score}
              </Typography>
            </CardContent>
          }
        </Card>
      ))
      }
    </Grid >
  );
}
