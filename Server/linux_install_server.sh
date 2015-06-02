echo "-> Updating system's package list ..."
sudo apt-get update
echo "-> Success"
echo "-> Fetching new versions of existing packages ..."
sudo apt-get upgrade
echo "-> Success"
echo "-> Installing nodejs ..."
sudo apt-get install nodejs
echo "-> Success"
echo "-> Installing npm ..."
sudo apt-get install npm
echo "-> Success"
