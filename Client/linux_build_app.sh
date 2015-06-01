echo "-> Installing bower ..."
sudo bower install
echo "-> Success"
echo "-> Installing plugins ..."
sudo ./plugins.sh
echo "-> Success" 
echo "-> Building app ..."
ionic build
echo "-> Success"
