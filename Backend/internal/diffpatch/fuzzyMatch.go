package diffpatch

// Notes:
// this file defines a basic fuzzyMatch based on the Bitap algorithm
// does not support unicode, only ascii (unicode gives me nightmares)

// returns the best approximate location for needle within haystack
func fuzzyMatch(needle, haystack string, loc int) int {
	/**approximateLoc := min(loc, len(haystack))

	if needle == haystack {
		return 0
	} else if len(haystack) == 0 {
		return -1
	} else if haystack[approximateLoc:approximateLoc+len(needle)] == needle {
		return approximateLoc
	}

	// otherwise fuzzy approximate match
	for d := 0; d < len(needle); d++ {

	}**/
	return -1
}

// regular bitap implementation, returns best match
// upto a hamming distance of err
func bitap(needle, haystack string, err int) {
	/**m := len(needle)

	matchMask := 1 << uint(len(needle)-1)
	bestLoc := -1

	var binMin, binMid int
	binMax := len(needle) + len(haystack)
	lastRd := []int{}
	**/
}
