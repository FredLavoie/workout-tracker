import React from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { createMuiTheme, ThemeProvider } from '@material-ui/core';
import deepPurple from '@material-ui/core/colors/deepPurple';
import teal from '@material-ui/core/colors/teal';
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Workout from './pages/Workout';
import Record from './pages/Record';
import Calendar from './pages/Calendar';
import Search from './pages/Search';
import Password from './pages/PasswordChange';
import NotFound from './pages/NotFound';
import './App.css';

const myTheme = createMuiTheme({
  palette: {
    type: 'light',
    primary: deepPurple,
    secondary: teal
  }
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
              <PrivateRoute path='/records' component={Record} />
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
