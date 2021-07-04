import React from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { createMuiTheme, ThemeProvider } from '@material-ui/core';
import deepPurple from '@material-ui/core/colors/deepPurple';
import teal from '@material-ui/core/colors/teal';
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
import Password from './views/PasswordChange';
import NotFound from './views/NotFound';
import './App.css';

const myTheme = createMuiTheme({
  palette: {
    type: 'light',
    primary: deepPurple,
    secondary: teal
  },
  MuiButton: {
    root: {
      transition: 'color .01s',
    },
  },
});

function App() {
  return (
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
              <Route exact path='/404' component={NotFound} />
              <Route component={NotFound} />
            </Switch>
          </Layout>
        </Switch>
      </Router>
    </ThemeProvider>
  );
}

export default App;
