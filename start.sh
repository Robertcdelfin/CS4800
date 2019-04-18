#!/bin/bash
clear
cd /home/ruzo/fabric-dev-servers/fabric-scripts/hlfv1/composer
docker-compose start
cd /home/ruzo/Development/healthcare/healthcare
nohup composer-rest-server -c admin@healthcare -n never -w true > rest-server.out> rest-server.err < /dev/null &
cd /home/ruzo/Development/healthcare/healthcare/angular-app/
npm start
