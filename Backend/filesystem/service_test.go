package filesystem

import (
	"DiffSync/database"
	"context"
	"log"
	"os"
	"strconv"
	"testing"

	"github.com/jackc/pgtype"
	"github.com/stretchr/testify/assert"
)

var pool database.Pool

func TestMain(m *testing.M) {
	testHost := database.SpinTestDB()

	var err error
	pool, err = database.NewPool(database.Config{
		HostAndPort: testHost,
		User:        "postgres",
		Password:    "test",
		Database:    "cms_testing_db",
	})
	if err != nil {
		log.Fatalf(err.Error())
	}

	defer pool.Close()
	os.Exit(m.Run())
}

func TestRootRetrieval_Integration(t *testing.T) {
	assert := assert.New(t)

	root, err := getRootInfo(pool)
	if assert.Nil(err) {
		assert.Equal("root", root.EntityName)
		assert.False(root.IsDocument)
		assert.Greater(len(root.Children), 0)
	}
}

func TestRootInsert_Integration(t *testing.T) {
	assert := assert.New(t)

	newDir, _ := createFilesystemEntityAtRoot(pool, "test_directory", ADMIN, false)
	newDoc, _ := createFilesystemEntity(pool, newDir, "test_directory", ADMIN, true)

	var docCount int
	var dirCount int

	if assert.Nil(pool.GetConn().QueryRow(context.Background(), "SELECT COUNT(*) FROM filesystem WHERE EntityID = $1", newDir).Scan(&dirCount)) {
		assert.Equal(dirCount, 1)
	}

	if assert.Nil(pool.GetConn().QueryRow(context.Background(), "SELECT COUNT(*) FROM filesystem WHERE EntityID = $1", newDoc).Scan(&docCount)) {
		assert.Equal(docCount, 1)
	}

	expectedChildren := pgtype.Hstore{}
	if assert.Nil(pool.GetConn().QueryRow(context.Background(), "SELECT Children FROM filesystem WHERE parent IS NULL").Scan(&expectedChildren)) {
		if _, exists := expectedChildren.Map[strconv.Itoa(newDir)]; !exists {
			assert.True(false)
		}
	}

	expectedChildren = pgtype.Hstore{}
	if assert.Nil(pool.GetConn().QueryRow(context.Background(), "SELECT Children FROM filesystem WHERE EntityID = $1", newDir).Scan(&expectedChildren)) {
		if _, exists := expectedChildren.Map[strconv.Itoa(newDoc)]; !exists {
			assert.True(false)
		}
	}
}

func TestDocumentInfoRetrieval_Integration(t *testing.T) {
	assert := assert.New(t)

	newDoc, err := createFilesystemEntityAtRoot(pool, "test_doc", ADMIN, true)
	if err != nil {
		log.Fatalf(err.Error())
	}

	info, err := getFilesystemInfo(pool, newDoc)
	if assert.Nil(err) {
		assert.True(info.IsDocument)
		assert.Equal("test_doc", info.EntityName)
		assert.Empty(info.Children)
	}
}
