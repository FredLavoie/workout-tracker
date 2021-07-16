import React from 'react';
import { useHistory } from 'react-router-dom';

import Typography from '@material-ui/core/Typography';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles } from '@material-ui/core';

import recordList from '../lib/recordList';

const useStyles = makeStyles((theme) => ({
  content: {
    padding: '0 32px 32px 32px',
  },
  individualContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    cursor: 'pointer',
  },
  eventContainer: {
    marginBottom: 8,
    display: 'flex',
    justifyContent: 'space-between',
    cursor: 'pointer',
  },
  score: {
    backgroundColor: theme.palette.secondary.main,
    padding: '2px 4px',
    borderRadius: 6,
    margin: '2px 0',
  },
  date: {
    margin: '2px 0',
  },
}));

function RecordTable({ type, records }) {
  const classes = useStyles();
  const history = useHistory();

  const sortedRecords = records.sort((a, b) => b.date > a.date);
  const filteredEventList = recordList[type].filter((ea) => records.find((rec) => rec.event === ea));

  function handleClickActive(target) {
    const encodedString = target.id.toLowerCase().replace(/ /g, '-');
    history.push(`/records/event/${encodedString}`);
  }

  return (
    <CardContent className={classes.content}>
      {filteredEventList.map((event, index) => (
        <div key={index} id={event} className={classes.eventContainer} onClick={(e) => handleClickActive(e.currentTarget)}>
          <Typography variant={'subtitle1'} >
            {event}
          </Typography>

          {[sortedRecords.find((ea) => ea.event === event)].map((ea) => {
            return (
              <div
                key={ea.id}
                id={ea.event}
              >
                <Typography variant={'body2'} className={classes.score}>
                  {ea.score}
                </Typography>
              </div>
            );
          })}
        </div>
      ))}
    </CardContent>
  );
}

export default RecordTable;
