package editor

// worker is a single goroutine that listens for work to execute, it also optionally listens for a termination
// signal the reason we have this is because we spin up a goroutine for each incoming keystroke from the client
// so my suspicion is that the overhead of allocating a stack and then deallocating it on each keystroke
// is rather costly (despite goroutines being rather lightweight)
// TODO: in the future benchmark the actual impact of just spinning a goroutine on each keystroke
// 		and remove this if it isnt actually as bad as suspected
// NOTE: each client is allocated one worker they can push work to :D

type empty struct{}

// createAndStartWorker is the body of a worker goroutine
// it can be called via: go startWorker(handles)
func createAndStartWorker(workHandle chan func(), killHandle chan empty) {
	for {
		select {
		case work := <-workHandle:
			// do the work and then return ourselves to the worker pool
			work()

		case <-killHandle:
			// just die :(
			return

		default:
			// do nothing
		}
	}
}
