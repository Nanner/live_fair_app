echo "-> Installing cordova ..."
npm install -g cordova
echo "-> Success"
echo "-> Installing ionic ..."
npm install -g ionic
echo "-> Success"
echo "-> Adding platforms ..."
ionic platform add android
ionic platform add ios
echo "-> Success"
echo "-> Installing bower ..."
npm install -g bower
bower install
echo "-> Success"
echo "-> Installing plugins ..."
./plugins.ps1
echo "-> Success" 