import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core';

import ServerError from '../components/ServerError';
import { fetchMonthData } from '../services/fetchData';

const useStyles = makeStyles((theme) => ({

}));

function Week() {

  return (
    <div></div>
  );
}

export default Week;
