package database

import (
	"DiffSync/database"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestCannotUseLiveContext(t *testing.T) {
	assert := assert.New(t)
	// we shouldnt be able to use a live DB from a test
	liveContext, err := database.NewLiveContext()
	if err != nil {
		// We aren't running in the docker container so the connection failed
		// just ignore this situation
		return
	}
	defer liveContext.Close()

	var garbage int = 0
	assert.Panics(func() {
		liveContext.Query("SELECT EntityID FROM filesystem WHERE Parent = NULL", []interface{}{}, &garbage)
	}, "do not query a live context db from a test!")
}

func TestCannotUseTestingContext(t *testing.T) {
	assert := assert.New(t)

	// we should not be able to perform queries without using "RunTest"
	testContext := database.NewTestingContext()
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

func TestUpdatesAreIsolated(t *testing.T) {
	assert := assert.New(t)

	testContext := database.NewTestingContext()
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

func tableExists(tableName string, ctx database.TestingContext) bool {
	var existence bool
	if err := ctx.Query(`SELECT EXISTS (
			SELECT * FROM information_schema.tables
			WHERE table_schema = 'public' AND table_name = $1
		)`, []interface{}{tableName}, &existence); err == nil {

		return existence
	}
	return false
}
