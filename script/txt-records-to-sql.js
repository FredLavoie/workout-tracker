/**
 * This script will take all my workouts writen in txt files and convert them to insert statement in an sql file
 * that will be saved in the "workout_migrations" directory
 *
 * To execute the script, run:
 * node script/txt-records-to-sql.js <path/to/file.txt>
 *
 * The file can be be executed by running:
 * 	psql -U <user_name> -h <host_name> -d <database_name> < <path_to_file.sql>
 */

const fs = require('fs');
const uuid = require('uuid');
const inputFile = process.argv[2];

fs.readFile(inputFile, 'utf-8', (error, data) => {
  if (error) {
    console.log(error);
    return;
  }

  // first step in processing txt file to separate content into array
  const arrayData = data.split('=============================').map((ea) => ea.split('\n'));

  const tempArray = [];
  for (const subArray of arrayData) {
    const temp = subArray.filter((ea) => ea !== '');
    tempArray.push(temp);
  }

  // reassemble content into array of individual days
  const resultArray = tempArray[0];
  for (let i = 1; i < tempArray.length; i++) {
    let date = '';
    if (i !== tempArray.length - 1) {
      date = tempArray[i].pop();
      resultArray.push(tempArray[i]);
      resultArray.push(date);
    } else {
      resultArray.push(tempArray[i]);
    }
  }

  // create results string of all the sql statements
  let resultString = '';
  const year = inputFile.split('workout_logs/')[1].split('/')[0];
  const month = inputFile.split('workout_logs/')[1].split('/')[1].split('-')[0];

  for (let i = 0; i < resultArray.length; i += 2) {
    const day = resultArray[i].split(' ')[1];
    const body = resultArray[i + 1].join('\n');
    resultString += 'INSERT INTO workouts_workout(id, author_id, date, time, body, created_at, updated_at)\n';
    resultString += `VALUES ('${uuid.v4()}', 1, '${year}-${month}-${day}', '12:00:00', '${body}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);\n`;
  }

  fs.writeFileSync(`./script/workout_migrations/${year}-${month}_migration.sql`, resultString);
  console.log(`Completed creating migration for ${year}-${month}`);
});
