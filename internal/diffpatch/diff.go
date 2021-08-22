package diffpatch

// finds the index indicating the end of the longest common prefix between
// the two strings, simple O(log n) divide and conquer algo
func findCommonPrefix(a []string, b []string) int {
	n := min(len(a), len(b))
	if n <= 1 {
		if n == 1 && a[0] == b[0] {
			return 0
		}
		return -1
	}

	// recurse on subarrays
	var mid = n / 2
	lowerIndex := findCommonPrefix(a[:mid], b[:mid])
	higherIndex := findCommonPrefix(a[mid:], b[mid:])

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
func findCommonSuffix(a []string, b []string) int {
	n := min(len(a), len(b))
	if n <= 1 {
		if n == 1 && a[len(a)-1] == b[len(b)-1] {
			return len(a) - 1
		}
		return -1
	}

	// once again, recurse on subarrays
	var mid = n / 2
	lowerIndex := findCommonSuffix(a[:mid], b[:mid])
	higherIndex := findCommonSuffix(a[mid:], b[mid:])

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

type pair struct {
	x int
	y int
}

// This implementation of the Myers' string diff algorithm works on words as opposed to charachters
// words are our minimum required level of precision for accuracy (could also do chars but too computationally expensive)
// algorithm is just a BFS through the edit space graph
// TODO: optimise by actually implementing the pseudocode in the paper and not some wacky custom BFS algo
func myersDiff(a []string, b []string) []pair {
	max := len(a) + len(b)
	var extendPath = func(vertex pair) pair {
		for vertex.x < len(a) && vertex.y < len(b) && a[vertex.x] == b[vertex.y] {
			vertex.x++
			vertex.y++
		}
		return vertex
	}
	predMatrix := make(map[pair]pair)
	predMatrix[pair{0, 0}] = extendPath(pair{0, 0})
	fronteir := []pair{predMatrix[pair{0, 0}]}

	var computePath func(pair, pair) []pair
	computePath = func(t pair, s pair) []pair {
		if s == t {
			return []pair{s}
		}

		return append(computePath(t, predMatrix[s]), s)
	}

	// for each distance d from src, compute the
	// verticies in the BFS fronteir
	for d := 0; d < max; d++ {
		prevFronteir := fronteir
		newFronteir := []pair{}
		terminate := false

		for k := 0; k < len(prevFronteir); k++ {
			vertex := prevFronteir[k]
			if vertex.x >= len(a) && vertex.y >= len(b) {
				terminate = true
				break
			}

			// from a vertex we can: follow a diagonal, add a char, delete a char
			addChar := extendPath(pair{vertex.x, vertex.y + 1})
			deleteChar := extendPath(pair{vertex.x + 1, vertex.y})
			if _, ok := predMatrix[addChar]; !ok {
				predMatrix[addChar] = vertex
			}
			if _, ok := predMatrix[deleteChar]; !ok {
				predMatrix[deleteChar] = vertex
			}
			newFronteir = append(newFronteir, deleteChar, addChar)
		}
		fronteir = newFronteir

		if terminate {
			break
		}
	}

	// recurse on the pred matrix to find the shortest path from (0, 0) -> (len(a), len(b))
	return computePath(pair{0, 0}, pair{len(a), len(b)})
}

// function that converts the output of the Myer's diff algorithm to an edit script
func myersDiffToEditScript(a, b []string, myersDiff []pair) []Edit {
	edits := []Edit{}
	for i := 0; i < len(myersDiff)-1; i++ {
		// skip if we are on the same diagonals
		if myersDiff[i].x-myersDiff[i].y == myersDiff[i+1].x-myersDiff[i+1].y {
			continue
		}

		// find the change that connects i -> i + 1
		edit := Edit{
			isInsertion: myersDiff[i].y < myersDiff[i+1].y,
		}

		if edit.isInsertion {
			edit.value = b[myersDiff[i].y]
		} else {
			edit.value = a[myersDiff[i].x]
		}
		edits = append(edits, edit)
	}
	return edits
}
