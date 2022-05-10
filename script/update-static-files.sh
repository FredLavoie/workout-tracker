# This script updates the front end static files to be served by nginx.
# The static files are to be generated locally and pushed to github.

echo "Copying index.html file into nginx static folder"
sudo cp ~/workout-tracker/client/build/index.html /var/www/workout/index.html;
echo "Backing up static files to backup directory"
sudo mv /var/www/workout/static  /var/www/workout/static-old;
echo "Copying static build files into nginx folder"
sudo cp -r ~/workout-tracker/client/build/static /var/www/workout/static;
echo "Copy static admin files back into nginx static folder"
sudo cp -r /var/www/workout/static-old/admin /var/www/workout/static/admin;
echo "Removing old static files"
sudo rm -r /var/www/workout/static-old;

echo "Restarting nginx"
sudo systemctl restart nginx;
systemctl status nginx;

echo "Static files update complete"
