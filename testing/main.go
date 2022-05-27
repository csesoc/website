package main

type empty = struct{}

func main() {
	x := make(chan empty)
	y := make(chan empty)

	// wait on x OR y
	select {
	case <-x:
		// do stuff with x

	case <-y:
		// do stuff with y

	default:
		// do stuff
	}
}
