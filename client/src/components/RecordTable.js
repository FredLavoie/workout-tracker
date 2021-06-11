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
    marginBottom: 16,
  },
  eventTitle: {
    borderBottom: '1px solid #f0f0f5',
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

function StrengthRecordTable({ type, records }) {
  const classes = useStyles();
  const history = useHistory();

  const sortedRecords = records.sort((a, b) => b.date > a.date);
  const filteredEventList = recordList[type].filter((ea) => records.find((rec) => rec.event === ea));

  function handleClickActive(target) {
    if (target.id) history.push(`/records/${target.id}`);
    else history.push(`/records/${target.parentNode.id}`);
  }

  return (
    <CardContent className={classes.content}>
      {filteredEventList.map((event, index) => (
        <div key={index} className={classes.eventContainer}>
          <Typography gutterBottom variant={'subtitle1'} className={classes.eventTitle}>
            {event}
          </Typography>
          <div>
            {sortedRecords.map((ea) => {
              if (ea.event === event) {
                return (
                  <div
                    key={ea.id}
                    id={ea.id}
                    className={classes.individualContainer}
                    onClick={(e) => handleClickActive(e.target)}
                  >
                    <Typography variant={'body2'} className={classes.date}>
                      {ea.date}
                    </Typography>
                    <Typography variant={'body2'} className={classes.score}>
                      {ea.score}
                    </Typography>
                  </div>
                );
              }
            }
            )}
          </div>
        </div>
      ))}
    </CardContent>
  );
}

export default StrengthRecordTable;
