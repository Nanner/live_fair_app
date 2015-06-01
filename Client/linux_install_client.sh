echo "-> Updating system's package list ..."
sudo apt-get update
echo "-> Success"
echo "-> Fetching new versions of existing packages ..."
sudo apt-get upgrade
echo "-> Success"
echo "-> Installing cordova ..."
sudo npm install -g cordova
echo "-> Success"
echo "-> Installing ionic ..."
sudo npm install -g ionic
echo "-> Success"
echo "-> Adding platforms ..."
ionic platform add android
ionic platform add ios
echo "-> Success"
echo "-> Installing bower ..."
sudo npm install -g bower
sudo bower install
echo "-> Success"
echo "-> Installing plugins ..."
./plugins.sh
echo "-> Success" 
