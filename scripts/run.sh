#!/bin/bash

# super important `source ~/.nvm/nvm.sh;`
# allows npm to be run on our host machine

# run from this directory
cd "${BASH_SOURCE%/*}" || exit

# shh in our server
echo "########### connecting to server and run commands in sequence ###########"
sudo ssh -i ../../web-mapping_key.pem azureuser@40.121.42.196 \
'
git clone https://github.com/Drakodav/frontend_d-dub.git;
sudo find frontend_d-dub/ -type f -iname "*.sh" -exec chmod +x {} \;
cd frontend_d-dub/;
source ~/.nvm/nvm.sh;
yarn install;
yarn build;
cd scripts
sudo ./react.sh;
cd ../.. ;
sudo rm -r frontend_d-dub;
 
'

echo "Cleaning up..."
echo "Finished updating django to latest version"
