package diffpatch

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestPrefixSuffixFinders(t *testing.T) {

	a := []string{"Hey", "Don't", "Borgir", "Write", "Yourself"}
	b := []string{"Hey", "Don't", "Borgir", "Write", "Yourself"}
	assert.EqualValues(t, 4, findCommonPrefix(a, b))
	assert.EqualValues(t, 0, findCommonSuffix(a, b))

	a = []string{"Hey", "Don't", "Write", "Yourself"}
	b = []string{"Hey", "Don't", "Write", "Yourself"}
	assert.EqualValues(t, 3, findCommonPrefix(a, b))
	assert.EqualValues(t, 0, findCommonSuffix(a, b))

	a = []string{"Hey", "Don't", "Write", "Yourself", "Borgir", "Cheese"}
	b = []string{"Hey", "Don't", "Write", "Yourself"}
	assert.EqualValues(t, 3, findCommonPrefix(a, b))
	assert.EqualValues(t, -1, findCommonSuffix(a, b))

	a = []string{"Hey", "Don't", "Write", "Yourself"}
	b = []string{"Hey", "Don't", "Write", "Yourself", "Borgir", "Cheese"}
	assert.EqualValues(t, 3, findCommonPrefix(a, b))
	assert.EqualValues(t, -1, findCommonSuffix(a, b))

	a = []string{"dsa", "dsa", "gfdgfd", "fds"}
	b = []string{"nobody", "dsa", "gfdgfd", "fds"}
	assert.EqualValues(t, -1, findCommonPrefix(a, b))
	assert.EqualValues(t, 1, findCommonSuffix(a, b))

	a = []string{"dsa", "dsa", "gfdgfd", "fds"}
	b = []string{"Hey", "Don't", "Write", "Yourself", "Borgir", "Cheese"}
	assert.EqualValues(t, -1, findCommonPrefix(a, b))
	assert.EqualValues(t, -1, findCommonSuffix(a, b))

	a = []string{"Hey", "Don't", "Write", "Yourself"}
	b = []string{"Hey", "Borgir", "Borgir", "Write", "Yourself"}
	assert.EqualValues(t, 0, findCommonPrefix(a, b))
	assert.EqualValues(t, 3, findCommonSuffix(a, b))

	a = []string{"rick", "and", "morty", "requires", "an", "extremely", "large iq"}
	b = []string{"rick", "and", "morty", "requires", "a", "extremely", "large iq"}
	assert.EqualValues(t, 3, findCommonPrefix(a, b))
	assert.EqualValues(t, 5, findCommonSuffix(a, b))
}

func TestMyersDiffBFS(t *testing.T) {
	a := []string{"Hey", "Don't", "eat", "Write", "Yourself"}
	b := []string{"Hey", "Don't", "Borgir", "Write", "Yourself"}
	assert.EqualValues(t, myersDiffToEditScript(a, b, myersDiff(a, b)), []Edit{Edit{false, "eat"}, Edit{true, "Borgir"}})
	a = []string{"cheese", "below", "the", "belt", "chickens", "eat", "pasta"}
	b = []string{"yoghurt", "below", "the", "belt", "chickens", "hate", "pasta"}
	assert.EqualValues(t, myersDiffToEditScript(a, b, myersDiff(a, b)), []Edit{Edit{false, "cheese"}, Edit{true, "yoghurt"}, Edit{false, "eat"}, Edit{true, "hate"}})

	a = []string{"Hey", "Don't", "Write", "Yourself", "Borgir", "Cheese"}
	b = []string{"Hey", "Don't", "Write", "Yourself"}
	assert.EqualValues(t, myersDiffToEditScript(a, b, myersDiff(a, b)), []Edit{Edit{false, "Borgir"}, Edit{false, "Cheese"}})

	a = []string{"Hey", "Don't", "Write", "Yourself"}
	b = []string{"Hey", "Don't", "Write", "Yourself", "Borgir", "Cheese"}
	assert.EqualValues(t, myersDiffToEditScript(a, b, myersDiff(a, b)), []Edit{Edit{true, "Borgir"}, Edit{true, "Cheese"}})

	a = []string{"rick", "and", "morty", "requires", "an", "extremely", "large iq"}
	b = []string{"rick", "and", "morty", "requires", "a", "extremely", "large iq"}
	assert.EqualValues(t, myersDiffToEditScript(a, b, myersDiff(a, b)), []Edit{Edit{false, "an"}, Edit{true, "a"}})

	a = []string{"a", "b", "c", "a", "b", "b", "a"}
	b = []string{"c", "b", "a", "b", "a", "c"}
	assert.EqualValues(t, myersDiffToEditScript(a, b, myersDiff(a, b)), []Edit{Edit{false, "a"}, Edit{true, "c"}, Edit{true, "b"}, Edit{true, "a"}, Edit{true, "c"}})

	a = []string{"tomato"}
	b = []string{}
	assert.EqualValues(t, myersDiffToEditScript(a, b, myersDiff(a, b)), []Edit{Edit{false, "tomato"}})

	a = []string{}
	b = []string{"tomato"}
	assert.EqualValues(t, myersDiffToEditScript(a, b, myersDiff(a, b)), []Edit{Edit{true, "tomato"}})
}
