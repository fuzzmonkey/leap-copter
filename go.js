// Script for controlling a Parrot AR Drone 2.0 with a leap motion

var Leap = require('leapjs');
var arDrone = require('ar-drone');

var leapController = new Leap.Controller({enableGestures: true});
var copterClient = arDrone.createClient();

var previousPosition = 0.0;
var flying = false;

var actionSpeeds = {
	forward: 0.1, 
	backward: 0.1, 
	up: 0.2, 
	down: 0.2, 
	left: 0.1, 
	right: 0.1, 
	counterClockwise: 1,
	clockwise: 1
}

function handlePitch(hand) {
	if (hand.pitch() <= -0.5) {
		console.log('forward: ' + hand.pitch())
		return 'front'
	} else if (hand.pitch() >= 0.5) {
		console.log('backward: '+ hand.pitch())
		return 'back';
	}
}

function handleRoll(hand) {
	if (hand.roll() <= -0.5) {
		console.log('right:' + hand.roll())
		return 'right'
		return;
	} else if (hand.roll() >= 0.5) {
		console.log('left:' + hand.roll())
		return 'left';
	}
}

function handleHeight(hand, previousPosition) {
	currentPosition = (parseInt(hand.stabilizedPalmPosition[1]/10)+1)*10
	if (currentPosition < previousPosition) {
		console.log('down: ' + currentPosition)
		return 'down';
	} else if (currentPosition != previousPosition) {
		console.log('up: ' + currentPosition)
		return 'up';
	}
	previousPosition = currentPosition;
}

function handleSpin(hand) {
	if ( hand.fingers.length == 0) {
		if (hand.roll() <= -0.5) {
			console.log('counterClockwise:' + hand.roll())
			return 'counterClockwise';
		} else if (hand.roll() >= 0.5) {
			console.log('clockwise:' + hand.roll())
			return 'clockwise';
		}
	}
}

function handleInput(hand) {
	action = handleSpin(copterClient, hand)
	if (action) return action
	action = handleRoll(copterClient, hand)
	if (action) return action
	action = handlePitch(copterClient, hand)
	if (action) return action
	action = handleHeight(copterClient, hand, previousPosition)
	return action;
}

leapController.on('connect', function() {
	console.log("Successfully connected.");
});

leapController.on('deviceFrame', function( frame ) {
	if (frame.hands[0]) {
		var hand = frame.hands[0];

		if (!flying && hand.fingers.length == 5) {
			flying = true;
			copterClient.takeoff()
		}
		if (!flying) return;

		action = handleInput(hand)

		if (action)
			speed = actionSpeeds[action];
			copterClient[action](speed);
	} else {
		copterClient.stop();
	}
});

leapController.connect();