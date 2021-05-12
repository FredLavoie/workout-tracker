import React, { useEffect } from 'react';
import Typography from '@material-ui/core/Typography';
import { fetchAccountId } from '../services/fetchData';

function Dashboard() {

  useEffect(() => {
    fetchAccountId();
  }, []);

  return (
    <div>
      <Typography variant='h3'>
        Dashboard
      </Typography>
    </div>
  )
}

export default Dashboard;
