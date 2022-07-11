package algorithms

import (
	"math/rand"
	"time"
)

// generates a random word of length n
func randomWord(n int) string {
	rand.Seed(time.Now().UnixNano())
	result := make([]byte, n)

	for i := 0; i < n; i++ {
		asciiBase := rand.Int31()
		result[i] = byte(asciiBase % 256)
	}

	return string(result)
}
