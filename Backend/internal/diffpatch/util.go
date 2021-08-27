package diffpatch

func min(a int, b int) int {
	if a <= b {
		return a
	} else {
		return b
	}
}

func abs(a int) int {
	if a <= 0 {
		return -a
	}
	return a
}
