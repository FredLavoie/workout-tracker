import React from 'react';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core';


const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: 32,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '90%',
    },
  },
  cardStyle: {
    width: 256,
    margin: '0px auto 16px auto'
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

function SearchResultCard({ content }) {
  const classes = useStyles();

  return (
    <Grid
      container
      justify='center'
      className={classes.root}
    >
      {content.map((ea, index) => (
        <Card elevation={2} key={index} className={classes.cardStyle}>
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

export default SearchResultCard;
