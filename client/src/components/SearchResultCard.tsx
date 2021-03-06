import React from 'react';
import { useHistory } from 'react-router-dom';

import {
  Card,
  CardHeader,
  CardContent,
  Grid,
  Typography
} from '@mui/material';

import { tCombinedEntry } from '../types';


export function SearchResultCard({ content, searchQuery }) {
  const history = useHistory();

  function handleClickActive(target: Element, isWorkoutContent: boolean) {
    if (isWorkoutContent) {
      history.push(`/workouts/${target.id}`);
    } else {
      history.push(`/records/${target.id}`);
    }
  }

  /**
   * Process the workout body and highlight the search term in the returned
   * JSX element
   * 
   * @param text workout body text for a single search result
   * @returns JSX.Element
   */
  function processBodyText(text: string) {
    const textArr = text.split('\n');
    const lowerCaseSearchQuery = searchQuery.toLowerCase();
    return (<Typography component='pre' sx={style.bodyText}>
      {textArr.map((subString: string) => {
        const lowerCaseSubString = subString.toLowerCase();
        return lowerCaseSubString.includes(lowerCaseSearchQuery) ?
          (<>
            <span>
              {subString.split(' ').map((subSubString: string) => {
                const lowerCaseSubSubString = subSubString.toLowerCase();
                return lowerCaseSubSubString.includes(lowerCaseSearchQuery) ?
                  (<span><mark>{subSubString}</mark> </span>)
                  :
                  (<span>{subSubString} </span>);
              })}
            </span>
            <br />
          </>)
          :
          (<><span>{subString}</span><br /></>);
      })}
    </Typography>);
  }

  return (
    <Grid sx={style.root1}>
      {content.map((ea: tCombinedEntry) => (
        <Card
          elevation={2}
          key={ea.id}
          id={ea.id}
          sx={style.cardStyle}
          onClick={(e) => handleClickActive(e.currentTarget, !!ea.workout_body)}
        >
          <CardHeader
            title={ea.workout_body ? 'Workout' : 'Personal Record'}
            subheader={ea.date}
            sx={style.header}
          />
          {ea.workout_body
            ?
            <CardContent>
              <Typography component='div' variant='body2' color='textSecondary'>
                {processBodyText(ea.workout_body)}
              </Typography>
            </CardContent>
            :
            <CardContent>
              <Typography variant='body2' color='textSecondary'>
                {`${ea.type} - ${ea.event}`}
              </Typography>
              <Typography variant='body2' color='textSecondary'>
                {ea.score}
              </Typography>
            </CardContent>
          }
        </Card>
      ))
      }
    </Grid >
  );
}

const style = {
  root1: {
    marginBottom: '32px',
    marginTop: '16px',
    width: { md: '100%', sm: '90%' },
    display: 'flex',
    justifyContent: 'space-evenly',
    flexWrap: 'wrap'
  },
  cardStyle: {
    width: '256px',
    margin: '0px 8px 16px 8px',
    cursor: 'pointer',
  },
  header: {
    paddingBottom: '0px',
  },
  detail: {
    pading: 'none',
  },
  bodyText: {
    font: 'inherit',
    margin: '0px',
  }
} as const;
