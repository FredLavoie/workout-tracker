import React from 'react';

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

function ServerError(props) {
  return (
    <Container>
      <Typography variant='h4' align='center'>
        <br />
        {props.errorMessage}
      </Typography>
    </Container>
  );
}

export default ServerError;
