package database

import (
	"context"
	"log"
	"os"
	"testing"

	"github.com/stretchr/testify/assert"
)

var pool Pool

func TestMain(m *testing.M) {
	testHost := SpinTestDB()

	var err error
	pool, err = NewPool(Config{
		HostAndPort: testHost,
		User:        "postgres",
		Password:    "test",
		Database:    "cms_testing_db",
	})
	if err != nil {
		log.Fatalf(err.Error())
		os.Exit(1)
	}
	defer pool.Close()
	os.Exit(m.Run())
}

func TestMockDBSetup(t *testing.T) {
	assert := assert.New(t)

	requiredTables := []string{"person", "filesystem", "groups"}
	for _, val := range requiredTables {
		var existence bool
		if assert.Nil(pool.GetConn().QueryRow(context.Background(), `SELECT EXISTS (
			SELECT * FROM information_schema.tables
			WHERE table_schema = 'public' AND table_name = $1
			)`, val).Scan(&existence)) {

			assert.True(existence)
		}
	}
}
