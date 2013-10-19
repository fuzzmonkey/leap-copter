var arDrone = require('ar-drone');

var copterClient  = arDrone.createClient();

copterClient.land();
copterClient.stop();
