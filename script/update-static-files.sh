# This script updates the front end static files to be served by nginx.
# The static files are to be generated locally and pushed to github.

# Note that the admin files need to be updated manually if updates
# are made to the admin files.

echo "Copying index.html file into nginx folder"
sudo cp ~/workout-tracker/client/build/index.html /var/www/workout/index.html;

echo "Backing up asset files to temp directory"
sudo mv /var/www/workout/assets  /var/www/workout/temp;

echo "Copying asset build files into nginx folder"
sudo cp -r ~/workout-tracker/client/build/assets /var/www/workout/assets;

echo "Removing old asset files"
sudo rm -r /var/www/workout/temp;

echo "Restarting nginx"
sudo systemctl restart nginx;
systemctl status nginx;

echo "Static files update complete"
