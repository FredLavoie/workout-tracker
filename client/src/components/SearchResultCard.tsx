import React from 'react';
import { useHistory } from 'react-router-dom';

import {
  Card,
  CardHeader,
  CardContent,
  Grid,
  Typography
} from '@mui/material';

import { workoutType, recordType } from '../types'


export function SearchResultCard({ content }) {
  const history = useHistory();

  function handleClickActive(id: string, isWorkoutContent: boolean) {
    if (isWorkoutContent === true) {
      history.push(`/workouts/${id}`);
    } else {
      history.push(`/records/${id}`);
    }
  }

  return (
    <Grid sx={style.root1}>
      {content.map((ea: (workoutType & recordType)) => (
        <Card
          elevation={2}
          key={ea.id}
          sx={style.cardStyle}
          onClick={(e) => handleClickActive(e.currentTarget.id, !!ea.workout_body)}
        >
          <CardHeader
            title={ea.workout_body ? 'Workout' : 'Personal Record'}
            subheader={ea.date}
            sx={style.header}
          />
          {ea.workout_body
            ?
            <CardContent>
              <Typography component='div' variant='body2' color='textSecondary'>
                <Typography component='pre' sx={style.bodyText}>{ea.workout_body}</Typography>
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

const style = {
  root1: {
    marginBottom: '32px',
    marginTop: '16px',
    width: { md: '100%', sm: '90%' },
    display: 'flex',
    justifyContent: 'space-evenly',
    flexWrap: 'wrap'
  },
  cardStyle: {
    width: '256px',
    margin: '0px 8px 16px 8px',
    cursor: 'pointer',
  },
  header: {
    paddingBottom: '0px',
  },
  detail: {
    pading: 'none',
  },
  bodyText: {
    font: 'inherit',
    margin: '0px',
  }
} as const;
