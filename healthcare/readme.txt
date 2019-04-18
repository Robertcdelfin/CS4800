1. cd /fabric-dev-servers
2. ./startFabric.sh
3. cd ~/Development/fabric/healthcare/
4. composer network install --archiveFile healthcare@0.0.1.bna --card PeerAdmin@hlfv1
5. composer network start --networkName healthcare --networkVersion 0.0.1 --networkAdmin admin --networkAdminEnrollSecret adminpw --card PeerAdmin@hlfv1 --file healthcare-admin.card
6. composer-rest-server 
# card to use: admin@healthcare
7. yo hyperledger-composer
8. cd healthcare-angular-app
9. npm install
10. npm start
