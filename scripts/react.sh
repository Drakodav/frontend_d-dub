#!/bin/bash

# run from this directory
cd "${BASH_SOURCE%/*}" || exit

yarn install;
yarn build;

#react
docker stop dynamo_frontend
docker rm dynamo_frontend

docker rmi dynamo_frontend_img
docker build -t dynamo_frontend_img ../

docker create --name dynamo_frontend --network geonet \
--network-alias na_dynamo_frontend -t \
-p 5000:5000 \
dynamo_frontend_img

docker start dynamo_frontend