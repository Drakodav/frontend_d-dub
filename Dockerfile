FROM node:15.4

RUN apt-get -y update && apt-get -y upgrade

# Make a working directory in the image and set it as working dir
RUN mkdir -p /user/src/app
WORKDIR /usr/src/app

# copy dist into image
COPY ./build /usr/src/app/build

RUN npm install -g serve
# expose localhost 8002 on the image
EXPOSE 5000

# # run uwsgi 
CMD [ "serve", "-s", "build", "-n" ]

