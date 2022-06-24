import React from 'react';
import { useHistory } from 'react-router-dom';

import {
  Box,
  CardContent,
  Typography,
} from '@mui/material';

import { recordList } from '../lib/recordList';
import { tRecord } from '../types';


export function RecordTable({ type, records }) {
  const history = useHistory();

  const sortedRecords = records.sort((a: tRecord, b: tRecord) => b.date > a.date);
  const filteredEventList = recordList[type].filter((ea: string) => records.find((rec: tRecord) => rec.event === ea));

  function handleClickActive(target: Element) {
    const encodedString = target.id.toLowerCase().replace(/ /g, '-');
    history.push(`/records/event/${encodedString}`);
  }

  return (
    <CardContent sx={style.content}>
      {filteredEventList.map((event, index) => (
        <Box key={index} id={event} sx={style.eventContainer} onClick={(e) => handleClickActive(e.currentTarget)}>
          <Typography variant={'subtitle1'} >
            {event}
          </Typography>

          {[sortedRecords.find((ea) => ea.event === event)].map((ea) => {
            return (
              <Box
                key={ea.id}
                id={ea.event}
                data-testid='recordItem'
              >
                <Typography variant={'body2'} sx={style.score}>
                  {ea.score}
                </Typography>
              </Box>
            );
          })}
        </Box>
      ))}
    </CardContent>
  );
}

const style = {
  content: {
    padding: '0 32px 32px 32px',
  },
  eventContainer: {
    marginBottom: '8px',
    display: 'flex',
    justifyContent: 'space-between',
    cursor: 'pointer',
  },
  score: {
    backgroundColor: 'secondary.main',
    padding: '2px 4px',
    borderRadius: '6px',
    margin: '2px 0',
    color: '#212121',
  },
};
