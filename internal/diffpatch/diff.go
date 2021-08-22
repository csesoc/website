package diffpatch

// Simple library to implement text based diffing and patching
// The goal is that this is transpiled to JS and serves as the client code too

func min(a int, b int) int {
	if a <= b {
		return a
	} else {
		return b
	}
}

// finds the index indicating the end of the longest common prefix between
// the two strings, simple O(log n) divide and conquer algo
func FindCommonPrefix(a []string, b []string) int {
	n := min(len(a), len(b))
	if n <= 1 {
		if n == 1 && a[0] == b[0] {
			return 0
		}
		return -1
	}

	// recurse on subarrays
	var mid = n / 2
	lowerIndex := FindCommonPrefix(a[:mid], b[:mid])
	higherIndex := FindCommonPrefix(a[mid:], b[mid:])

	// determine what index to actually return :)
	if lowerIndex == -1 {
		return -1
	} else {
		if lowerIndex < mid-1 {
			return lowerIndex
		}
	}
	return lowerIndex + higherIndex + 1
}

// finds the index markining the begining of the common suffix
// like FindCommonPrefix, simple O(log n) divide and conquer algo
func FindCommonSuffix(a []string, b []string) int {
	n := min(len(a), len(b))
	if n <= 1 {
		if n == 1 && a[len(a)-1] == b[len(b)-1] {
			return len(a) - 1
		}
		return -1
	}

	// once again, recurse on subarrays
	var mid = n / 2
	lowerIndex := FindCommonSuffix(a[:mid], b[:mid])
	higherIndex := FindCommonSuffix(a[mid:], b[mid:])

	// determine what index to actually return :)
	if higherIndex == -1 {
		return -1
	} else {
		if higherIndex == 0 && lowerIndex != -1 {
			return lowerIndex
		}
	}
	return mid + higherIndex
}

// preprocess converts both strings into arrays of words
// and performs basic preprocessing
func preprocess(a string, b string) ([]string, []string) {
	// bin search for end of prefix
	return nil, nil
}

//https://blog.jcoglan.com/2017/02/15/the-myers-diff-algorithm-part-2/

// This implementation of the Myers' diff algorithm works on words as opposed to charachters
// words are our minimum required level of precision for accuracy (could also do chars but too computationally expensive)
// note: the algorithm works on the basis of "how do we transform a -> b" with the least amount of edits
// the idea is we "remove values" from a and "add values from b" to a
func MyersDiff(a []string, b []string) {
	type pair struct {
		numDelete int
		numAdd    int
	}
	max := len(a) + len(b)
	// algorithm is just a BFS through the edit space graph
	maxEndPoints := []int{}

	// for each distance d from src
	for d := 0; d < max; d++ {
		var x = 0
		// for each furthest reacing "k-path"
		for k := -d; k <= d; k += 2 {
			if (k == -d) || (maxEndPoints[k-1] < maxEndPoints[k+1]) {
				x = maxEndPoints[k+1]
			} else {
				x = maxEndPoints[k-1] + 1
			}
			y := x - k

		}
	}

}
