package diffpatch

import "strings"

// Simple library to implement text based diffing and patching
// The goal is that this is transpiled to JS and serves as the client code too

type Edit struct {
	isInsertion bool
	value       string
}

// Diff function is consumed here, wraps around pre-processing algos + Myer's diff algo
func Diff(a string, b string) []Edit {
	aWords := strings.Split(a, " ")
	bWords := strings.Split(b, " ")

	prefixEnd := findCommonPrefix(aWords, bWords)
	suffixStart := findCommonSuffix(aWords, bWords)
	aWords = aWords[prefixEnd:suffixStart]
	bWords = bWords[prefixEnd:suffixStart]

	return myersDiffToEditScript(aWords, bWords, myersDiff(aWords, bWords))
}
