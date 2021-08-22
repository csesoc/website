package diffpatch

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestPrefixSuffixFinders(t *testing.T) {

	a := []string{"Hey", "Don't", "Borgir", "Write", "Yourself"}
	b := []string{"Hey", "Don't", "Borgir", "Write", "Yourself"}
	assert.EqualValues(t, 4, FindCommonPrefix(a, b))
	assert.EqualValues(t, 0, FindCommonSuffix(a, b))

	a = []string{"Hey", "Don't", "Write", "Yourself"}
	b = []string{"Hey", "Don't", "Write", "Yourself"}
	assert.EqualValues(t, 3, FindCommonPrefix(a, b))
	assert.EqualValues(t, 0, FindCommonSuffix(a, b))

	a = []string{"Hey", "Don't", "Write", "Yourself", "Borgir", "Cheese"}
	b = []string{"Hey", "Don't", "Write", "Yourself"}
	assert.EqualValues(t, 3, FindCommonPrefix(a, b))
	assert.EqualValues(t, -1, FindCommonSuffix(a, b))

	a = []string{"Hey", "Don't", "Write", "Yourself"}
	b = []string{"Hey", "Don't", "Write", "Yourself", "Borgir", "Cheese"}
	assert.EqualValues(t, 3, FindCommonPrefix(a, b))
	assert.EqualValues(t, -1, FindCommonSuffix(a, b))

	a = []string{"dsa", "dsa", "gfdgfd", "fds"}
	b = []string{"nobody", "dsa", "gfdgfd", "fds"}
	assert.EqualValues(t, -1, FindCommonPrefix(a, b))
	assert.EqualValues(t, 1, FindCommonSuffix(a, b))

	a = []string{"dsa", "dsa", "gfdgfd", "fds"}
	b = []string{"Hey", "Don't", "Write", "Yourself", "Borgir", "Cheese"}
	assert.EqualValues(t, -1, FindCommonPrefix(a, b))
	assert.EqualValues(t, -1, FindCommonSuffix(a, b))

	a = []string{"Hey", "Don't", "Write", "Yourself"}
	b = []string{"Hey", "Borgir", "Borgir", "Write", "Yourself"}
	assert.EqualValues(t, 0, FindCommonPrefix(a, b))
	assert.EqualValues(t, 3, FindCommonSuffix(a, b))

	a = []string{"rick", "and", "morty", "requires", "an", "extremely", "large iq"}
	b = []string{"rick", "and", "morty", "requires", "a", "extremely", "large iq"}
	assert.EqualValues(t, 3, FindCommonPrefix(a, b))
	assert.EqualValues(t, 5, FindCommonSuffix(a, b))
}
