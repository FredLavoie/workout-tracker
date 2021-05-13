import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import { fetchMonthData } from '../services/fetchData';

function Calendar() {
	const [workouts, setWorkouts] = useState([]);
	const location = useLocation();
	let monthToFetch = location.pathname.split('/')[2];

	useEffect(() => {
  	fetchMonthData(monthToFetch).then(data => setWorkouts(data));
		// eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

	return (
	<div>
		<Typography variant='h3'>
			Calendar
		</Typography>
		{workouts.map(workout => (
			<div key={workout.id}>
				<Typography variant='body1'>
					{workout.date}
				</Typography>
				<Typography variant='body2'>
					{workout.body}
				</Typography>
			</div>
		))}
	</div>
	)
}

export default Calendar;
