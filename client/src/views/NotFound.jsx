import React from 'react';

import {
  AppBar,
  Container,
  Toolbar,
  Typography
} from '@mui/material';


export function NotFound() {
  return (
    <Container>
      <AppBar position='fixed' elevation={1} color='primary'>
        <Toolbar>
          <Typography variant='h5' display='block'>
            Workout Tracker
          </Typography>
        </Toolbar>
      </AppBar>
      <Typography variant='h4' align='center'>
        <br />
        404 - Resource not found
      </Typography>
    </Container>
  );
}
