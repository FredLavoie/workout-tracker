# This script creates a backup file of the whole database and places the file in <project_root>/BACKUP/db_backups/ directory

file_name="`date +%Y-%m-%d`.dump"

echo "Backing up workout database";
pg_dump -Fc -h localhost -U flavoie workout > "/home/flavoie/workout-tracker/BACKUP/db_backups/$file_name";
echo "Deleting old backup files (> 15 days)";
find /home/flavoie/workout-tracker/BACKUP/db_backups -type f -iname '*.dump' -mtime +15 -delete;
echo "Saving database backup complete";
