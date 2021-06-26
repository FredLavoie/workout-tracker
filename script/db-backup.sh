# This script creates a backup file of the whole database and places the file in <project_root>/BACKUP/db_backups/ directory

backup_dir="$PWD/BACKUP/db_backups/"
file_name="`date +%Y-%m-%d`.dump"
number_of_days=15


if [ ! -d "$PWD/BACKUP/db_backups/" ];
  then
    echo "Script executed from the wrong directory.";
  else
    echo "Backing up workout database"
    pg_dump -Fc -h localhost -U flavoie workout > "$backup_dir$file_name";
    echo "Deleting old backup files (> 15 days)"
    find ./BACKUP/db_backups -type f -iname '*.dump' -mtime +15 -delete;
fi
echo "Saving backup complete"
