import React from 'react';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
// import { makeStyles } from '@material-ui/core';


// const useStyles = makeStyles({


// });

function SearchResultCard({ content }) {
  // const classes = useStyles();

  return (
    <Grid container>
      {content.map((ea, index) => (
        <Card elevation={1} key={index}>
          <CardHeader
            title={ea.workout_body ? 'Workout' : 'Personal Record'}
            subheader={ea.date}
          />
          <CardContent>
            <Typography variant='body2' color='textSecondary'>
              {ea.workout_body ? '' : `${ea.type} - ${ea.event}`}
            </Typography>
            <Typography variant='body2' color='textSecondary'>
              {ea.workout_body ? '' : ea.score}
            </Typography>
            <Typography display='inline-block' variant='body2' color='textSecondary'>
              {ea.workout_body ? ea.workout_body : ''}
            </Typography>
          </CardContent>
        </Card>
      ))
      }
    </Grid >
  );
}

export default SearchResultCard;
