# this script updates the React static files after updates are pulled to the server

CWD=$PWD

echo "Creating static files"
cd ~/workout-tracker/client;
yarn build;
wait

if [[ ! -d "~/workout-tracker/client/build" ]]; then
  echo "build process failed. ending script.";
	return;
fi

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
echo "Removing build directory from repo"
sudo rm -r ~/workout-tracker/client/build;

echo "Restarting nginx"
cd $CWD;
sudo systemctl restart nginx;
systemctl status nginx;

echo "Updating static files complete"
