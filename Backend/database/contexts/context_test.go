package contexts

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

// We shouldnt be able to use a live DB from a test, function just tests that
func TestCannotUseLiveContext(t *testing.T) {
	assert := assert.New(t)
	liveContext, err := newLiveContext()
	if err != nil {
		// We aren't running in a docker container so the connection failed
		// just ignore this situation and pass the test
		return
	}
	defer liveContext.Close()

	var garbage int = 0
	assert.Panics(func() {
		liveContext.Query("SELECT EntityID FROM filesystem WHERE Parent = NULL", []interface{}{}, &garbage)
	}, "do not query a live context db from a test!")
}

// we should not be able to perform queries without using "RunTest", once again function
// just tests that
func TestCannotUseTestingContext(t *testing.T) {
	assert := assert.New(t)

	testContext := newTestingContext()
	defer testContext.Close()

	assert.Panics(func() {
		testContext.Exec("DROP TABLE filesystem", []interface{}{})
	})

	// I'm so sorry about this
	assert.NotPanics(func() {
		testContext.RunTest(func() {
			testContext.Exec("DROP TABLE IF EXISTS person", []interface{}{})
		})
	})
}

// all updates from tests should be isolated to an invocation of RunTest, function
// just tests that behaviour.
func TestUpdatesAreIsolated(t *testing.T) {
	assert := assert.New(t)

	testContext := newTestingContext()
	defer testContext.Close()

	// create a table in a test env
	testContext.RunTest(func() {
		err := testContext.Exec(`CREATE TABLE test_table(joe SERIAL PRIMARY KEY)`, []interface{}{})
		if assert.Nil(err) {
			assert.True(tableExists("test_table", testContext))
		}
	})

	// create a new test env and check that the table isnt there
	testContext.RunTest(func() {
		assert.False(tableExists("test_table", testContext))
	})
}

// util function to querying the existence of a table
func tableExists(tableName string, ctx *TestingContext) bool {
	var existence bool
	if err := ctx.Query(`SELECT EXISTS (
			SELECT * FROM information_schema.tables
			WHERE table_schema = 'public' AND table_name = $1
		)`, []interface{}{tableName}, &existence); err == nil {

		return existence
	}
	return false
}
