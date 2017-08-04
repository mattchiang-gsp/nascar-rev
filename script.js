// MP3 players
var revIdlePlayer = new Tone.Player("./idle3.mp3").toMaster()
var revUpPlayer = new Tone.Player("./accel3.mp3").toMaster()
var revDownPlayer = new Tone.Player("./decel.mp3").toMaster()

revUpPlayer.volume.value = 6
revDownPlayer.volume.value = 2
revIdlePlayer.volume.value = -6

// Timing
var ctx = new Tone.Context()
var elapsedTimeSincePedalDown = 0 // foot on gas
var elapsedTimeSincePedalUp = 0 // foot off gas
var counter = 1
console.log(counter)

// Remember keys pressed
var keysdown = {}

// Loop accel sounds
revUpPlayer.setLoopPoints(5, 10);
revUpPlayer.loop = true;

// Play revIdlePlayer
revIdlePlayer.autostart = true
revIdlePlayer.setLoopPoints(3, 8);
revIdlePlayer.loop = true

// On pedal down
$("body").keydown(function(e) {

	// Is key/pedal already down?
	if (keysdown[e.keyCode]) {
		return
	}

	// Remember the pedal is pressed
	keysdown[e.keyCode] = true

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
			counter++
		} 
		else if (elapsedTimeSincePedalDown > 7) { // if we were going fast speed
			// if foot was off for more than 6 seconds, start accel from the beginning
			if (elapsedTimeSincePedalUp > 6) {
				revUpPlayer.start(ctx.now(), 0)
			}
			// if foot was off between 3-6 seconds, start accel from a little after the beginning
			else if (elapsedTimeSincePedalUp > 3) {
				revUpPlayer.start(ctx.now(), 3)
			}
			// if foot was off between 0-3 seconds, start accel from the middle
			else {
				revUpPlayer.start(ctx.now(), 7)
			}
		} else if (elapsedTimeSincePedalDown > 3) { // if we were going medium speed
			if (elapsedTimeSincePedalUp > 4) {
				revUpPlayer.start(ctx.now(), 0)
			} else if (elapsedTimeSincePedalUp > 2) {
				revUpPlayer.start(ctx.now(), 1.5)
			} else {
				revUpPlayer.start(ctx.now(), 3)
			}
		} else { // if we were starting up speed
			if (elapsedTimeSincePedalUp > 2) {
				revUpPlayer.start(ctx.now(), 0)
			} else {
				revUpPlayer.start(ctx.now(), 1)
			}
		}

		elapsedTimeSincePedalDown = ctx.now()
		console.log("Pressing pedal down at: " + elapsedTimeSincePedalDown)
	}
})

// On pedal up
$("body").keyup(function(e) {
	if (e.keyCode == 66) { // 66 = 'b'

		// How many seconds was the pedal down for?
		elapsedTimeSincePedalDown = ctx.now() - elapsedTimeSincePedalDown
		$("#stopwatch").text(elapsedTimeSincePedalDown + " seconds")

		// Stop the acceleration sound
		revUpPlayer.stop()

		// Play rev down sounds that fit 
		if (elapsedTimeSincePedalDown > 7) { // if foot on the gas was more than 7 seconds
			revDownPlayer.start(0) // start from the beginning
			revIdlePlayer.start(ctx.now() + 6.5) 
		} else if (elapsedTimeSincePedalDown > 3) { // if foot on the gas was 3-7 seconds
			revDownPlayer.start(ctx.now(), 2) 
			revIdlePlayer.start(ctx.now() + 4.5)
		} else if (elapsedTimeSincePedalDown > 1) { // if foot on the gas was 1-3 seconds
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