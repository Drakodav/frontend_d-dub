#!/bin/bash

# super important `source ~/.nvm/nvm.sh;`
# allows npm to be run on our host machine

# run from this directory
cd "${BASH_SOURCE%/*}" || exit

echo "installing & building project"
yarn install
yarn build

echo "########### connecting to server and run commands in sequence ###########"
#create directories
sudo ssh -i ../../web-mapping_key.pem azureuser@40.121.42.196 \
'
mkdir -p frontend_d-dub/{build, scripts};
'

# copy build folder
sudo scp -i ../../web-mapping_key.pem \
-r \
../build/ \
azureuser@40.121.42.196:/home/azureuser/frontend_d-dub/build/

# copy scripts directory
sudo scp -i ../../web-mapping_key.pem \
-r \
../scripts/ \
azureuser@40.121.42.196:/home/azureuser/frontend_d-dub/scripts/

# copy Dockerfile
sudo scp -i ../../web-mapping_key.pem \
../Dockerfile \
azureuser@40.121.42.196:/home/azureuser/frontend_d-dub/

# create docker containers and clean up
sudo ssh -i ../../web-mapping_key.pem azureuser@40.121.42.196 \
'
sudo find frontend_d-dub/ -type f -iname "*.sh" -exec chmod +x {} \;
cd frontend_d-dub/scripts;
sudo ./react.sh;
cd ../..

echo "Cleaning up...";
sudo rm -r frontend_d-dub;

'
echo "Finished updating react frontent to latest version"