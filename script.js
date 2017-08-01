// MP3 players
var revIdlePlayer = new Tone.Player("./idle2.mp3").toMaster()
var revUpPlayer = new Tone.Player("./accel.mp3").toMaster()
var revDownPlayer = new Tone.Player("./decel.mp3").toMaster()

revUpPlayer.volume.value = 2
revDownPlayer.volume.value = 2

// Timing
var ctx = new Tone.Context()
var elapsedTimeSincePedalDown = 0
var elapsedTimeSincePedalUp = 0

// Remember keys pressed
var keysdown = {}

// Play revIdlePlayer
revIdlePlayer.autostart = true
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

		// How many seconds was the pedal up for?
		elapsedTimeSincePedalUp = ctx.now() - elapsedTimeSincePedalUp
		$("#startTime").text(elapsedTimeSincePedalUp + " seconds")

		// start rev up sounds from time when pedal went up or from start
		if (elapsedTimeSincePedalUp > 0 && elapsedTimeSincePedalUp < 9.4) {
			
			// stop rev down sounds
			revDownPlayer.stop()

			revUpPlayer.start(0) // should start when pedal was last pressed
			console.log("in")
		} else {
			revUpPlayer.start(0)
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

		// And start rev down sounds at the correct time
		if (elapsedTimeSincePedalDown > 6.5) {
			revDownPlayer.start(0) // start from the beginning
			// Start the idle sounds when rev down ends
			revIdlePlayer.start(ctx.now() + 6.5) 
		} else {
			revDownPlayer.start(ctx.now(), 6.5 - elapsedTimeSincePedalDown) // should start when pedal was let go
			revIdlePlayer.start(ctx.now() + elapsedTimeSincePedalDown)
		}
		elapsedTimeSincePedalUp = ctx.now()
		console.log("Pedal let go at: " + elapsedTimeSincePedalUp)

	}
	delete keysdown[e.keyCode]
})