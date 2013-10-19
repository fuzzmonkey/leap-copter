var Leap = require('leapjs');
var arDrone = require('ar-drone');

var leapController = new Leap.Controller();
var copterClient = arDrone.createClient();

leapController.on('connect', function() {
	console.log("Successfully connected.");
	copterClient.takeoff();
});

var previousPosition = 0.0;

leapController.on('deviceFrame', function( frame ) {
	if (frame.hands[0]) {
		var hand = frame.hands[0];

		if (hand.roll() <= -0.5) {
			copterClient.left(0.5)
			console.log('right:' + hand.roll())
		} else if (hand.roll() >= 0.5) {
			copterClient.right(0.5)
			console.log('left:' + hand.roll())
		}

		if (hand.pitch() <= -0.5) {
			copterClient.front(0.5)
			console.log('forward: ' + hand.pitch())
		} else if (hand.pitch() >= 0.5) {
			copterClient.back(0.5)
			console.log('backward: '+ hand.pitch())
		}

		currentPosition = (parseInt(frame.hands[0].stabilizedPalmPosition[1]/10)+1)*10
		if (currentPosition < previousPosition) {
			copterClient.down(0.5) 
			console.log('down: ' + currentPosition)
		} else if (currentPosition != previousPosition) {
			copterClient.up(0.5)
			console.log('up: ' + currentPosition)
		}
		previousPosition = currentPosition;
	}
});

leapController.connect();