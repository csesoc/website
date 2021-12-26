// This file just defines a series of string algorithms
package algorithms

import "sync"

type EditType int

const (
	Add EditType = iota
	Remove
)
const concurrentBatchSize int = 20

type Edit struct {
	Index int
	Val   string
	Type  EditType
}

func min(a, b int) int {
	if a < b {
		return a
	}
	return b
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
// conquer algorithm (when run sequentially)
func CommonPrefixConcurrent(a, b []string) int {
	n := min(len(a), len(b))
	if n <= concurrentBatchSize {
		return CommonPrefix(a, b)
	}

	// recurse on subarrays
	var mid = n / 2
	lowerIndex := CommonPrefixConcurrent(a[:mid], b[:mid])
	higherIndex := CommonPrefixConcurrent(a[mid:], b[mid:])

	// determine what index to actually return
	if lowerIndex == -1 {
		return -1
	} else {
		if lowerIndex < mid-1 {
			return lowerIndex
		}
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
// between two word arrays, implementation is just directly
// based on the paper for the Myer's String difference algorithm
func ComputeDiff(a, b []string) []Edit {
	n := len(a)
	m := len(b)
	o := n + m

	predMatrix := [][]int{}
	v := make([]int, 2*(n+m)+1)
	v[1+o] = 0

	for d := 0; d < n+m; d++ {
		for k := -d; k <= d; k += 2 {
			// update the furthest reaching values
			x := 0
			if k == -d || (k != d && v[k+o-1] < v[k+o+1]) {
				x = v[o+k+1]
			} else {
				x = v[o+k-1] + 1
			}

			y := x - k

			// now extend the path
			for x < n && y < m && a[x] == b[y] {
				x += 1
				y += 1
			}

			v[o+k] = x
			if x >= n && y >= m {
				return predToEditScript(predMatrix, a, b)
			}

			// push into the pred matrix
			// perhaps this isnt the most effiicient method
			// TODO: make more efficient :D
			out := make([]int, 2*(m+n)+1)
			copy(out, v)
			predMatrix = append(predMatrix, out)
		}
	}
	return []Edit{}
}

// trace computes the trace script from a given
// pred matrix
func predToEditScript(matrix [][]int, a, b []string) []Edit {
	// finally turn the edit list into a sequence of edits
	depth := len(matrix)
	editScript := []Edit{}

	x := len(a)
	y := len(b)
	o := len(a) + len(b)
	k := x - y

	for d := depth - 1; d >= 0; d-- {
		v := matrix[d]

		prevK := k
		// find the previous diagonal component we landed on
		if k == -d || (k != d && v[k+o-1] < v[k+o+1]) {
			prevK += 1
		} else {
			prevK -= 1
		}

		prevX := v[prevK+o]
		prevY := prevX - prevK

		// move back up along diagonals
		for x > prevX && y > prevY {
			x -= 1
			y -= 1
		}

		// finally create edit script elements :)
		if x == prevX && d > 0 {
			editScript = append(editScript, Edit{x, b[prevY], Add})
		} else if y == prevY && d > 0 {
			editScript = append(editScript, Edit{x, a[prevX], Remove})
		}

		x = prevX
		y = prevY
		k = prevK
	}

	return editScript
}
