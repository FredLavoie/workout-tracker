import React from 'react';

import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';

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
