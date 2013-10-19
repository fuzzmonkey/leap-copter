var Leap = require('leapjs');
var arDrone = require('ar-drone');

var leapController = new Leap.Controller();
var copterClient  = arDrone.createClient();

leapController.on('connect', function() {
  console.log("Successfully connected.");
  copterClient.takeoff();
});

var previousPosition = 0.0
leapController.on('deviceFrame', function( frame ) {
	if (frame.hands[0]) {
		currentPosition = (parseInt(frame.hands[0].stabilizedPalmPosition[1]/10)+1)*10
		if (currentPosition < previousPosition) {
			console.log('down: ' + currentPosition)
			copterClient.down(0.5) 
		} else if (currentPosition != previousPosition) {
		  console.log('up: ' + currentPosition)
			copterClient.up(0.5)
		}
		previousPosition = currentPosition
	}
});

leapController.connect();