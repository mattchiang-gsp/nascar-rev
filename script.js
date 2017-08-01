// MP3 players
var revIdlePlayer = new Tone.Player("./rev-idle.mp3").toMaster()
var revUpPlayer = new Tone.Player("./rev-up.mp3").toMaster()
var revDownPlayer = new Tone.Player("./rev-down.mp3").toMaster()

// Timing
var ctx = new Tone.Context()
var elapsedTimeSinceUp
var elapsedTimeSinceDown

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

		// stop rev down sounds
		elapsedTimeSinceDown = ctx.now() - elapsedTimeSinceDown
		console.log("Pedal was up for: " + elapsedTimeSinceDown)
		revDownPlayer.stop()

		// start rev up sounds at 0 or where we left off
		if (elapsedTimeSinceDown > 0 && elapsedTimeSinceDown < 11) {
			revUpPlayer.start(11 - elapsedTimeSinceDown)
		} else {
			revUpPlayer.start(0)
		}
		elapsedTimeSinceUp = ctx.now()
		console.log("Pressing pedal down at: " + elapsedTimeSinceUp)
	}
})

// On pedal up
$("body").keyup(function(e) {
	if (e.keyCode == 66) { // 66 = 'b'

		// Stop the rev up sounds
		elapsedTimeSinceUp = ctx.now() - elapsedTimeSinceUp
		$("#stopwatch").text(elapsedTimeSinceUp)
		console.log("Pedal pressed for: " + elapsedTimeSinceUp)
		revUpPlayer.stop()

		// And start rev down sounds at the correct time
		elapsedTimeSinceDown = ctx.now()
		revDownPlayer.start(0, 11 - elapsedTimeSinceUp)
		console.log("Pedal let go at: " + elapsedTimeSinceDown)

		// Start the idle sounds when rev down ends
		revIdlePlayer.start(ctx.now() + (11 - (11 - elapsedTimeSinceUp)))		
	}
	delete keysdown[e.keyCode]
})