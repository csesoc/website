package algorithms

import (
	"log"
	"strings"
	"testing"

	"cms.csesoc.unsw.edu.au/algorithms"
	"github.com/stretchr/testify/assert"
)

// testcases for suffix and prefix calculation
// just reversed for suffix test
var suffixPrefixTestCases = []struct {
	a        string
	b        string
	expected int
}{
	{"hello world", "hello world", 1},
	{"hello jacob", "hello jamie", 0},
	{"cheese burger", "potato burger", -1},
	{"distant distances remind me of distant places", "distant distance reminds me of places", 0},
	{"a b a c a d a", "a d a b a c b a", 0},
	{"hello there, I love cheese", "hello there, I love cheese", 4},
	{"hello there , I love cheese", "hello there, I love cheese", 0},
}

func reverse(input []string) []string {
	output := make([]string, len(input))

	for i := 0; i < len(input); i++ {
		output[len(input)-1-i] = input[i]
	}

	return output
}

// Realistically: no one is ever going to type a line
// this long :P
const testSize = 32000

func setupPrefixBenchmark() ([]string, []string) {
	// setup benchmark
	sentence := make([]string, testSize)
	sentenceCop := make([]string, testSize)
	for i := 0; i < testSize; i++ {
		sentence[i] = randomWord(5)
	}

	copy(sentenceCop, sentence)

	return sentence, sentenceCop
}

func BenchmarkConcurrentPrefix(b *testing.B) {
	// setup benchmark
	sentence, sentenceCop := setupPrefixBenchmark()

	b.ResetTimer()
	b.StartTimer()
	result := algorithms.CommonPrefixConcurrent(sentence, sentenceCop)
	b.StopTimer()

	if result != len(sentence)-1 {
		b.Fail()
	}
}

func BenchmarkPrefix(b *testing.B) {
	// setup benchmark
	sentence, sentenceCop := setupPrefixBenchmark()

	b.ResetTimer()
	b.StartTimer()
	result := algorithms.CommonPrefix(sentence, sentenceCop)
	b.StopTimer()

	if result != len(sentence)-1 {
		b.Fail()
	}
}

func TestCommonPrefix(t *testing.T) {
	assert := assert.New(t)

	for _, testCase := range suffixPrefixTestCases {
		concurrentValue := algorithms.CommonPrefixConcurrent(strings.Fields(testCase.a), strings.Fields(testCase.b))
		regularValue := algorithms.CommonPrefix(strings.Fields(testCase.a), strings.Fields(testCase.b))

		if !assert.Equal(testCase.expected, algorithms.CommonPrefix(
			strings.Fields(testCase.a),
			strings.Fields(testCase.b))) {
			log.Printf("Failed: %s vs %s\n", testCase.a, testCase.b)
		}

		assert.Equal(regularValue, concurrentValue)
	}
}

func TestCommonSuffix(t *testing.T) {
	assert := assert.New(t)

	for _, testCase := range suffixPrefixTestCases {
		suffixStart := algorithms.CommonSuffix(reverse(strings.Fields(testCase.a)),
			reverse(strings.Fields(testCase.b)))

		assert.Equal(testCase.expected, suffixStart)
	}

	// additional test for large arrays (+ 20 words)
	randomSentence := `
	Did the magical character really weigh the dream?
	What if the aback promise ate the specific?
	The quixotic investment can't count the bus.
	Did the jazzy volume really fill the hell?
	Is the order subject better than the economy?
	The petty role can't dance the variety.
	The roasted sink notes into the formal judge.
	The classy screw can't coach the editor.
	The admirable dig affords into the similar appearance.`

	a := strings.Fields(randomSentence)
	b := strings.Fields(randomSentence)

	assert.Equal(68, algorithms.CommonSuffix(a, b))
}

func TestStringDifference(t *testing.T) {
	testCases := []struct {
		a        string
		b        string
		expected []algorithms.Edit
	}{
		{"hello world", "hello world", []algorithms.Edit{}},
		{"Hey Don't Borgir Write yourself off", "Hey dont Borgir Write yourself off", []algorithms.Edit{{1, "dont", algorithms.Add}, {1, "Don't", algorithms.Remove}}},
		{"Hello there Jacob", "Hello there", []algorithms.Edit{{2, "Jacob", algorithms.Remove}}},
	}
	assert := assert.New(t)

	for _, tetestCase := range testCases {
		computedDiff := algorithms.ComputeDiff(strings.Fields(tetestCase.a), strings.Fields(tetestCase.b))
		assert.Equal(tetestCase.expected, computedDiff)
	}
}
