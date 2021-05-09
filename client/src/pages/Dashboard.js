import React, { useEffect } from 'react';
import Typography from '@material-ui/core/Typography'
import NavBarMain from '../components/NavBarMain';

function Dashboard() {  

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(`http://localhost:8000/api/accounts/${localStorage.getItem('username')}`,{
      method: 'GET',
      headers: {
        'authorization': `Token ${token}`
      },
    })
      .then(res => res.json())
      .then(data => localStorage.setItem('accountId', data[0].id));
  }, []);

  return (
    <div>
      <NavBarMain />

      <Typography variant='h1'>
        Hello world!
      </Typography>
    </div>
  )
}

export default Dashboard;
