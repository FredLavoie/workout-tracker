import React from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { createTheme, ThemeProvider, StyledEngineProvider, adaptV4Theme } from '@mui/material';
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';
import Home from './views/Home';
import Login from './views/Login';
import Dashboard from './views/Dashboard';
import Workout from './views/Workout';
import Record from './views/Record';
import DetailRecord from './views/DetailRecord';
import Calendar from './views/Calendar';
import Search from './views/Search';
import Week from './views/Week';
import Password from './views/PasswordChange';
import NotFound from './views/NotFound';
import './App.css';

import { deepPurple, teal } from '@mui/material/colors';

const myTheme = createTheme(adaptV4Theme({
  palette: {
    mode: 'light',
    primary: deepPurple,
    secondary: teal
  },
  MuiButton: {
    root: {
      transition: 'color .01s',
    },
  },
}));

function App() {
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={myTheme}>
        <Router>
          <Switch>
            <Route exact path='/' component={Home} />
            <Route exact path='/login' component={Login} />
            <Layout>
              <Switch>
                <PrivateRoute exact path='/dashboard' component={Dashboard} />
                <PrivateRoute path='/workouts' component={Workout} />
                <PrivateRoute exact path='/records/event/:event' component={DetailRecord} />
                <PrivateRoute exact path='/records/:id' component={Record} />
                <PrivateRoute exact path='/cal/:date' component={Calendar} />
                <PrivateRoute exact path='/search' component={Search} />
                <PrivateRoute exact path='/password-change' component={Password} />
                <PrivateRoute path='/week' component={Week} />
                <Route exact path='/404' component={NotFound} />
                <Route component={NotFound} />
              </Switch>
            </Layout>
          </Switch>
        </Router>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

export default App;
