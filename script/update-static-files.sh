# This script updates the front end static files to be served by nginx.
# The static files are to be generated locally and pushed to github.

echo "Copying index.html file into nginx folder"
sudo cp ~/workout-tracker/client/build/index.html /var/www/workout/index.html;
echo "Backing up asset files to backup directory"
sudo mv /var/www/workout/assets  /var/www/workout/assets-old;
echo "Copying asset build files into nginx folder"
sudo cp -r ~/workout-tracker/client/build/assets /var/www/workout/assets;
echo "Copy asset admin files back into nginx asset folder"
sudo cp -r /var/www/workout/assets-old/admin /var/www/workout/assets/admin;
echo "Removing old asset files"
sudo rm -r /var/www/workout/assets-old;

echo "Restarting nginx"
sudo systemctl restart nginx;
systemctl status nginx;

echo "Static files update complete"
