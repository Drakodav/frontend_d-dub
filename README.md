# Dynamo Dublin frontend

Frontend https://dynamo.thev-lad.com/

## Brief

-   The main objective of the fronend application is to consume the api that I set up.
-   The data I am using is the dublin GTFS data that can be found here <https://transitfeeds.com/p/transport-for-ireland/782>.
-   The application can for now fetch bus stops and bus routes then display them on a map.
-   Although the functionality does not seem so impressive, the time and architecture required to set it up in my opinion is more impressive, everything
    from reading the gtfs data to importing it, modelling it and serializing it required in depth knowledge and hard work.
-   This frontend is powered by a plethora of different technologies that all work together under that hood. But the main bulk of it carried by create-react-app which provides a powerful starting template.
-   Finally it is in my opinion that this current setup is one that can be taken seriously for any real intention that one may have when it comes to gtfs data.

### Technologies

-   React
-   Webpack
-   PWA - workbox
-   Redux
-   Typescript

### Information

-   To run locally

```
npm install
npm run start
```

### cordova

-   installing android sdk

```
apt-get update
apt-get install default-jdk
sudo apt update && sudo apt install android-sdk

export ANDROID_HOME=/usr/android-sdk
export PATH=$PATH:$ANDROID_HOME/tools/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools

sudo chown -R $(whoami) $ANDROID_HOME

cd $ANDROID_HOME

wget https://dl.google.com/android/repository/sdk-tools-linux-4333796.zip
unzip sdk-tools-linux-4333796.zip
rm sdk-tools-linux-4333796.zip
```

-   android sdk ownership
    `sudo chown -R $(whoami) $ANDROID_HOME`

-   licences

```
cd $ANDROID_HOME/tools/bin
sudo ./sdkmanager --licenses
```
