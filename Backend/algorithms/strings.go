// This file just defines a series of string algorithms
package algorithms

import (
	"sync"
)

type EditType int

const (
	Add EditType = iota
	Remove
)

type Edit struct {
	Index int
	Val   string
	Type  EditType
}

// small utility function that efficiently reverses
// an array of strings (scales for large blocks)
// TODO: make generic when generics come out :P
func fastReverse(arr []string) []string {
	n := len(arr)
	out := make([]string, n)
	sem := sync.WaitGroup{}

	for i := 0; i < n; i += concurrentBatchSize {
		sem.Add(1)

		go func(i int) {
			for j := i; j < min(i+concurrentBatchSize, n); j++ {
				out[n-1-j] = arr[j]
			}
			sem.Done()
		}(i)
	}

	sem.Wait()
	return out
}

// CommonPrefix returns the common prefix between two
// sentences represented as an array of words
func CommonPrefix(a, b []string) int {
	bound := min(len(a), len(b))

	// allow compiler to eliminate
	// bounds check
	_ = a[bound-1]
	_ = b[bound-1]

	for i := 0; i < bound; i++ {
		if a[i] != b[i] {
			return i - 1
		}
	}

	return bound - 1
}

// CommonPrefixConcurrent is a faster version of the concurrent prefix algorithm
// for multi-core environments (abuse go routines :P ), its a linear time divide and
// conquer algorithm (when run sequentially), the idea is that given two subproblems
// a and b, the solution to the common prefix between a and b is given by:
// prefix(a) + prefix(b) + 1 or just prefix(a) if prefix(a) < len(a)

// limiterSem is a semaphore for limiting the amount of go routines that we spawn
var limiterSem = make(chan struct{}, concurrentSpawnLimit/2)

// starts a concurrent job
func runConcurrentJob(a, b []string, wg *sync.WaitGroup, result *int) {
	go func() {
		*result = CommonPrefixConcurrent(a, b)
		wg.Done()
	}()
}

// CommonPrefixConcurrent implementation
func CommonPrefixConcurrent(a, b []string) int {
	n := min(len(a), len(b))
	if n <= concurrentBatchSize {
		return CommonPrefix(a, b)
	}

	// recurse on subarrays
	var mid = n / 2
	var higherIndex int = 0
	var lowerIndex int = 0

	// if there are any more go routines that could
	// consume 2 more jobs start them up
	select {
	case limiterSem <- struct{}{}:
		// run subproblems concurrently
		var wg = sync.WaitGroup{}
		wg.Add(2)

		runConcurrentJob(a[mid:], b[mid:], &wg, &higherIndex)
		runConcurrentJob(a[:mid], b[:mid], &wg, &lowerIndex)

		wg.Wait()
		<-limiterSem
	default:
		// run subproblems sequentially
		lowerIndex = CommonPrefix(a[:mid], b[:mid])
		higherIndex = CommonPrefix(a[mid:], b[mid:])
	}

	// determine what index to actually return
	if lowerIndex == -1 || lowerIndex < mid-1 {
		return lowerIndex
	}

	return lowerIndex + higherIndex + 1
}

// CommonSuffix computes the start of the common
// suffix between two word arrays, measured relative to
// the end of the array
func CommonSuffix(a, b []string) int {
	reversedA := fastReverse(a)
	reversedB := fastReverse(b)

	return CommonPrefix(reversedA, reversedB)
}

// ComputeDiff returns an edit-script of the difference
// between two word arrays, implementation is just a BFS
// variant of the greedy strategy presented in the paper
// to sumarise the paper here the general idea is that the differences
// between two strings can be modelled as a graph, for example consider
// the strings abc and adc; if the original string abc is aligned vertically
// and the new string adc horizontally then the graph looks like:
// where a dot represents a vertex
// [x] a    b    c
// a   . -> . -> .
//	   |    |    |
// d   . -> . -> .
//     |    |   |
// c   . -> . -> .
//
// movement along a hoizontal edge represents deleting a charachter from the origional
// string and movment along the vertical edge represents inserting a char from the new string
// there are also zero cost edges (not pictured) that represent match points (where the two strings)
// match, since these are zero cost edges we can construct an auxillary unweighted graph from this representation
// and traverse it using BFS, we are guaranteed that our BFS traversal will result in a shortest path :)
type coord struct {
	x, y int
}

func ComputeDiff(a, b []string) []Edit {
	// utility function for cleanly extending a path
	var extendPath = func(v coord) coord {
		for v.x < len(a) && v.y < len(b) && a[v.x] == b[v.y] {
			v.x++
			v.y++
		}
		return v
	}

	max := len(a) + len(b)
	initCoord := extendPath(coord{0, 0})

	predMatrix := make(map[coord]coord)
	predMatrix[initCoord] = coord{0, 0}
	frontier := []coord{initCoord}

	// another utility function for marking a vertex
	// as visited
	var markAsVisited = func(v, pred coord) {
		if _, ok := predMatrix[v]; !ok {
			predMatrix[v] = pred
		}
	}

	// iterate over all possible distances
	for d := 0; d < max; d++ {
		nextFrontier := []coord{}

		for _, v := range frontier {
			if v.x >= len(a) && v.y >= len(b) {
				return computeEditScript(coord{0, 0}, coord{len(a), len(b)}, predMatrix, a, b)
			}

			addFromB := extendPath(coord{v.x, v.y + 1})
			delFromA := extendPath(coord{v.x + 1, v.y})

			markAsVisited(addFromB, v)
			markAsVisited(delFromA, v)

			nextFrontier = append(nextFrontier, addFromB, delFromA)
		}

		frontier = nextFrontier
	}

	return []Edit{}
}

// computeEditScript takes a predecessor matrix
// and computes a final edit script from the matrix
func computeEditScript(s, t coord, predMatrix map[coord]coord, a, b []string) []Edit {
	if s == t {
		return []Edit{}
	}

	v := t
	n := predMatrix[t]
	editScript := computeEditScript(s, n, predMatrix, a, b)

	// modify to so that it moves off a 0 cost edge
	// and rewinds to start
	for v.x > n.x && v.y > n.y {
		v.x--
		v.y--
	}

	// actually compute the edit now
	if v.x-v.y == n.x-n.y {
		return editScript
	} else if n.y < v.y {
		editScript = append(editScript, Edit{n.x, b[n.y], Add})
	} else {
		editScript = append(editScript, Edit{n.x, a[n.x], Remove})
	}

	return editScript
}
