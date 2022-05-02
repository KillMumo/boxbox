read -p 'please input you version: ' version

docker build -t react-app-web:"$version" ./

docker tag react-app-web:"$version" react-app-web:latest
