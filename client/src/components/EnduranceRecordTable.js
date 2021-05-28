import React from 'react';
import { useHistory } from 'react-router-dom';

import Typography from '@material-ui/core/Typography';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles } from '@material-ui/core';

import recordList from '../lib/recordList';

const useStyles = makeStyles({
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
  }
});

function EnduranceRecordTable({ records }) {
  const classes = useStyles();
  const history = useHistory();

  const sortedRecords = records.sort((a, b) => b.date > a.date);
  const filteredEventList = recordList.endurance.filter((ea) => records.find((rec) => rec.event === ea));

  function handleClickActive(target) {
    console.log('id inside StrengthRecordTable component: ', target.id);
    history.push(`/records/${target.id}`);
  }

  return (
    <CardContent className={classes.content}>
      {filteredEventList.map((event, index) => (
        <div key={index} className={classes.eventContainer}>
          <Typography gutterBottom variant={'subtitle1'}>
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
                    onClick={(e) => handleClickActive(e.target.id)}
                  >
                    <Typography variant={'body2'}>
                      {ea.date}
                    </Typography>
                    <Typography variant={'body2'}>
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

export default EnduranceRecordTable;
