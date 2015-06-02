echo "-> Installing bower ..."
bower install
echo "-> Success"
echo "-> Installing plugins ..."
./plugins.ps1
echo "-> Success" 
echo "-> Building app ..."
ionic build
echo "-> Success"