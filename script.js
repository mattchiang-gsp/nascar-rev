// MPH settings
var $body = $("body")
var number = 0
var isDown = 0
var delay = 250
var nextTime = 0

// MP3 players
var revIdlePlayer = new Tone.Player("./idle3.mp3").toMaster()
var revUpPlayer = new Tone.Player("./accel4.mp3").toMaster()
var revDownPlayer = new Tone.Player("./decel.mp3").toMaster()

revUpPlayer.volume.value = 6
revDownPlayer.volume.value = 2
revIdlePlayer.volume.value = -6

// Timing
var ctx = new Tone.Context()
var elapsedTimeSincePedalDown = 0 // foot on gas
var elapsedTimeSincePedalUp = 0 // foot off gas
var counter = 1

// Remember keys pressed
var keysdown = {}

// Loop accel sounds
revUpPlayer.setLoopPoints(26, 29);
revUpPlayer.loop = true;

// Play revIdlePlayer
revIdlePlayer.autostart = true
revIdlePlayer.setLoopPoints(3, 8);
revIdlePlayer.loop = true

// requestAnimationFrame(watcher)

// function watcher(time) {
// 	console.log(isDown)
// 	requestAnimationFrame(watcher)
// 	if (time < nextTime) {
// 		return
// 	}
// 	nextTime = time + delay
// 	if (isDown != 0 && (number + isDown) >= 0) { // Stop at 0 mph
// 		number += isDown
// 		$("#result").text(number)
// 		console.log(number)
// 	}
// }

// On pedal down
$body.keydown(function(e) {
	
	// Is key/pedal already down?
	if (keysdown[e.keyCode]) {
		return
	}

	// Remember the pedal is pressed
	keysdown[e.keyCode] = true
	isDown = 1

	if (e.keyCode == 66) { // 66 = 'b'

		// stop idle sounds
		revIdlePlayer.stop()
		revDownPlayer.stop()

		// How many seconds was the pedal up for?
		elapsedTimeSincePedalUp = ctx.now() - elapsedTimeSincePedalUp
		$("#startTime").text(elapsedTimeSincePedalUp + " seconds")

		// start rev up sounds from time when pedal went up or from start
		// start on the right place depends on previous foot on gas pedal time + time off pedal
		if (counter > 0) { // first time revving up
			revUpPlayer.start(ctx.now(), 0)
			counter--
			console.log(counter)
		} 
		else if (elapsedTimeSincePedalDown > 18) { // if we were going fast speed
			// if foot was off for more than 6 seconds, start accel from the beginning
			if (elapsedTimeSincePedalUp > 6) {
				revUpPlayer.start(ctx.now(), 0)
				console.log("High speed, let go for a long time")
			}
			// if foot was off between 3-6 seconds, start accel from a little after the beginning
			else if (elapsedTimeSincePedalUp > 3) {
				revUpPlayer.start(ctx.now(), 3)
				console.log("High speed, let go for a medium time")
			}
			// if foot was off between 0-3 seconds, start accel from the middle
			else {
				revUpPlayer.start(ctx.now(), 7)
				console.log("High speed, let go for little time")
			}
		} else if (elapsedTimeSincePedalDown > 11) { // if we were going medium speed
			if (elapsedTimeSincePedalUp > 4) {
				revUpPlayer.start(ctx.now(), 0)
				console.log("Medium speed, let go for a long time")
			} else if (elapsedTimeSincePedalUp > 2) {
				revUpPlayer.start(ctx.now(), 1.5)
				console.log("Medium speed, let go for a medium time")
			} else {
				revUpPlayer.start(ctx.now(), 3)
				console.log("Medium speed, let go for little time")
			}
		} else { // if we were starting up speed
			if (elapsedTimeSincePedalUp > 2) {
				revUpPlayer.start(ctx.now(), 0)
				console.log("Starting up, let go for a while")
			} else {
				revUpPlayer.start(ctx.now(), 1)
				console.log("Starting up, let go for little time")
			}
		}

		elapsedTimeSincePedalDown = ctx.now()
		console.log("Pressing pedal down at: " + elapsedTimeSincePedalDown)
	}
})

// On pedal up
$("body").keyup(function(e) {
	if (e.keyCode == 66) { // 66 = 'b'

		isDown = -1

		// How many seconds was the pedal down for?
		elapsedTimeSincePedalDown = ctx.now() - elapsedTimeSincePedalDown
		$("#stopwatch").text(elapsedTimeSincePedalDown + " seconds")

		// Stop the acceleration sound
		revUpPlayer.stop()

		// Play rev down sounds that fit 
		if (elapsedTimeSincePedalDown > 18) { // if foot on the gas was more than 7 seconds
			revDownPlayer.start(0) // start from the beginning
			revIdlePlayer.start(ctx.now() + 6.5) 
		} else if (elapsedTimeSincePedalDown > 11) { // if foot on the gas was 3-7 seconds
			revDownPlayer.start(ctx.now(), 2) 
			revIdlePlayer.start(ctx.now() + 4.5)
		} else if (elapsedTimeSincePedalDown > 3) { // if foot on the gas was 1-3 seconds
			revDownPlayer.start(ctx.now(), 4) 
			revIdlePlayer.start(ctx.now() + 2.5)
		} else { // if foot on gas was less than 1 second
			revDownPlayer.start(ctx.now(), 5.5) 
			revIdlePlayer.start(ctx.now() + 1)
		}

		elapsedTimeSincePedalUp = ctx.now()
		console.log("Pedal let go at: " + elapsedTimeSincePedalUp)

	}
	delete keysdown[e.keyCode]
})