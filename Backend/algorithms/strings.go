// This file just defines a series of string algorithms
package algorithms

import "sync"

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

func min(a, b int) int {
	if a < b {
		return a
	}
	return b
}

// small utility function that efficiently reverses
// an array of strings (scales for large blocks)
// TODO: make generic when generics come out :P
const batchSize int = 20

func fastReverse(arr []string) []string {
	n := len(arr)
	out := make([]string, n)
	sem := sync.WaitGroup{}

	for i := 0; i < n; i += batchSize {
		sem.Add(1)

		go func(i int) {
			for j := i; j < min(i+batchSize, n); j++ {
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
	m := -1 * min(-len(a), -len(b))
	pred := make([][]int, m)
	for i := 0; i < m; i++ {
		pred[i] = make([]int, 2*m+1)
		pred[i][1] = 0
	}

	// modified BFS (based on paper)
	for d := 0; d < m; d++ {
		v := pred[d]

		for k := -d; k <= d; k += 2 {
			var x int
			if k == -d || (k != d && v[k+m-1] < v[k+m+1]) {
				x = v[k+m+1]
			} else {
				x = v[k+m-1] + 1
			}

			var y = x - k

			// extend path along diagonals of edit graph
			for x < len(a) && y < len(b) && a[x] == b[y] {
				x += 1
				y += 1
			}

			v[k+m] = x

			// terminal condition
			if x >= len(a) && y >= len(b) {
				return backtrack(pred, d, len(a), len(b))
			}
		}
	}

	return []Edit{}
}

// backtrack computes the edit script from a given
// pred matrix
func backtrack(matrix [][]int, minDepth int, xs, ys int) []Edit {
	x := xs
	y := ys
	k := x - y
	m := len(matrix[0]) / 2

	type coord struct {
		cX int
		cY int
		x  int
		y  int
	}
	list := []coord{}

	// generate an edit list
	for d := minDepth; d >= 0; d-- {
		v := matrix[d]

		if k == -d || (k != d && v[k-1] < v[k+1]) {
			k += 1
		} else {
			k -= 1
		}

		xPrev := v[k+m]
		yPrev := xPrev - k

		for x > xPrev && y > yPrev {
			list = append(list, coord{x, y, x - 1, y - 1})
			x -= 1
			y -= 1
		}

		x = xPrev
		y = yPrev
	}

	// finally turn the edit list into a sequence of edits
	return []Edit{}
}
