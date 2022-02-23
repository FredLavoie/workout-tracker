import React from 'react';

import AppBar from '@mui/material/AppBar';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

function NotFound() {
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

export default NotFound;
