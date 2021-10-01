package database

import (
	"DiffSync/database"
	"os"
	"testing"

	"github.com/stretchr/testify/assert"
)

var pool database.LiveContext

func TestMain(m *testing.M) {
	var err error
	pool, err = database.NewLiveContext()
	if err != nil {
		panic(err)
	}

	defer pool.Close()
	os.Exit(m.Run())
}

func TestDBSetup(t *testing.T) {
	assert := assert.New(t)

	requiredTables := []string{"person", "filesystem", "groups"}
	for _, val := range requiredTables {
		var existence bool
		if assert.Nil(pool.Query(`SELECT EXISTS (
			SELECT * FROM information_schema.tables
			WHERE table_schema = 'public' AND table_name = $1
			)`, []interface{}{val}, &existence)) {

			assert.True(existence)
		}
	}
}
