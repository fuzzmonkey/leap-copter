// Panic stations, stop the copter from shredding fingers.
var arDrone = require('ar-drone');
var copterClient  = arDrone.createClient();

copterClient.land();
copterClient.stop();
