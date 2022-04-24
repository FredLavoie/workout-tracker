import React from 'react';
import { useHistory } from 'react-router-dom';

import {
  Card,
  CardHeader,
  CardContent,
  Grid,
  Typography
} from '@mui/material';


export function SearchResultCard({ content }) {
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
      sx={style.root}
    >
      {content.map((ea, index) => (
        <Card
          elevation={2}
          key={index}
          id={ea.id}
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
  root: {
    marginBottom: '32px',
    marginTop: '16px',
    width: { md: '100%', sm: '90%' },
    display: 'flex',
    justifyContent: 'flex-start',
    flexWrap: 'wrap'
  },
  cardStyle: {
    width: '256px',
    margin: '0px auto 16px auto',
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
};
