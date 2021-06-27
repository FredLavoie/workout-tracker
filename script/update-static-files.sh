# this script updates the React static files after updates are pulled to the server

CWD=$PWD

echo "Creating static files"
cd ~/workout-tracker/client;
yarn build;
wait

echo "Copying static files into nginx static folder"
sudo cp ~/workout-tracker/client/build/index.html /var/www/workout/index.html;
sudo mv /var/www/workout/static  /var/www/workout/static-old;
sudo cp -r ~/workout-tracker/client/build/static /var/www/workout/static;
sudo cp -r /var/www/workout/static-old/admin /var/www/workout/static/admin;

echo "Removing old static files"
sudo rm -r /var/www/workout/static-old;

echo "Restarting nginx"
cd $CWD;
sudo systemctl restart nginx;
systemctl status nginx;

echo "Updating static files complete"
