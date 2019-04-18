# healthcare

Healthcare Supply Chain

Main repo for the group project involving blockchain
How to run:
1. cd /fabric-dev-servers
2. ./startFabric.sh
3. cd ~/Development/healthcare/healthcare/
4. (if changed .cto files or .js files, then generate new business network archive - bna) 
composer archive create --sourceType dir --sourceName .
5. (for --archiveFile parameter use current bna file, ex: healthcare@0.0.1.bna) 
composer network install --archiveFile healthcare@0.0.2.bna --card PeerAdmin@healthcare
6. composer network start --networkName healthcare --networkVersion 0.0.2 --networkAdmin admin --networkAdminEnrollSecret adminpw --card PeerAdmin@healthcare --file healthcare-admin.card
7. composer-rest-server 
composer-rest-server -c admin@healthcare -n never -u true -w true
# card to use: admin@healthcare
8. yo hyperledger-composer
9. cd healthcare-angular-app
10. npm install
11. npm start

1. locate /home/ruzo/fabric-dev-servers/fabric-scripts/hlfv1/composer
2. Run docker-compose start
3. Run composer-rest-server -c admin@healthcare -n never -u true -w true
3. Run docker-compose stop
