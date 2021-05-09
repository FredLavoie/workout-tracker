import React from 'react';
import { Redirect } from 'react-router-dom';
import { isAuthenticated } from '../helpers/authentication';

function Home() {
	if (isAuthenticated() === true){
		return <Redirect to='/dashboard' />
	} 
	return <Redirect to='/login' />
}

export default Home;
