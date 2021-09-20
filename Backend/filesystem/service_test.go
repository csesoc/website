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
		assert.GreaterOrEqual(len(root.Children), 0)
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

func TestEntityDeletion(t *testing.T) {
	assert := assert.New(t)
	root, _ := getRootInfo(pool)

	// Test setup
	newDir, _ := createFilesystemEntityAtRoot(pool, "cool_dir", ADMIN, false)
	newDoc, _ := createFilesystemEntity(pool, newDir, "cool_doc", ADMIN, true)

	assert.NotNil(deleteEntity(pool, root.EntityID))
	assert.NotNil(deleteEntity(pool, newDir))

	assert.Nil(deleteEntity(pool, newDoc))
	info, _ := getFilesystemInfo(pool, newDir)
	assert.NotContains(strconv.Itoa(newDoc), info.Children)
	assert.Nil(deleteEntity(pool, newDir))

	root, _ = getRootInfo(pool)
	assert.NotContains(strconv.Itoa(newDir), root.Children)

	anotherDirectory, _ := createFilesystemEntityAtRoot(pool, "cheese", ADMIN, false)
	nestedDirectory, _ := createFilesystemEntity(pool, anotherDirectory, "cheeseBurger", ADMIN, false)
	file, _ := createFilesystemEntity(pool, nestedDirectory, "spinach", ADMIN, false)

	assert.NotNil(deleteEntity(pool, nestedDirectory))
	assert.Nil(deleteEntity(pool, file))
	assert.Nil(deleteEntity(pool, nestedDirectory))
	assert.Nil(deleteEntity(pool, anotherDirectory))

	root, _ = getRootInfo(pool)
	assert.NotContains(strconv.Itoa(anotherDirectory), root.Children)
}

func TestEntityRename(t *testing.T) {
	assert := assert.New(t)

	// Test setup
	newDir, _ := createFilesystemEntityAtRoot(pool, "cool_dir", ADMIN, false)
	newDoc, _ := createFilesystemEntity(pool, newDir, "cool_doc", ADMIN, true)
	newDoc1, _ := createFilesystemEntity(pool, newDir, "cool_doc1", ADMIN, true)
	newDoc2, _ := createFilesystemEntity(pool, newDir, "cool_doc2", ADMIN, true)

	assert.NotNil(renameEntity(pool, newDoc, "cool_doc2"))
	assert.NotNil(renameEntity(pool, newDoc1, "cool_doc2"))
	assert.NotNil(renameEntity(pool, newDoc2, "cool_doc1"))

	assert.Nil(renameEntity(pool, newDoc, "yabba dabba doo"))
	assert.Nil(renameEntity(pool, newDir, "zoinks"))

}

func TestEntityChildren(t *testing.T) {
	assert := assert.New(t)

	// Test setup

	dir1, _ := createFilesystemEntityAtRoot(pool, "d1", ADMIN, false)
	dir2, _ := createFilesystemEntityAtRoot(pool, "d2", ADMIN, false)
	dir3, _ := createFilesystemEntityAtRoot(pool, "d3", ADMIN, false)
	dir4, _ := createFilesystemEntityAtRoot(pool, "d4", ADMIN, false)
	emptyDir, _ := createFilesystemEntityAtRoot(pool, "de", ADMIN, false)

	for x := 1; x < 10; x++ {
		if x%3 == 0 {
			createFilesystemEntity(pool, dir1, "cool_doc"+string(x), ADMIN, true)
		}
		if x%5 == 0 {
			createFilesystemEntity(pool, dir2, "cool_doc"+string(x), ADMIN, true)
		}
		if x%2 == 0 {
			createFilesystemEntity(pool, dir3, "cool_doc"+string(x), ADMIN, true)
		}
		createFilesystemEntity(pool, dir4, "cool_doc"+string(x), ADMIN, true)
	}

	assert.NotNil(getEntityChildren(pool, dir1))
	assert.NotNil(getEntityChildren(pool, dir2))
	assert.NotNil(getEntityChildren(pool, dir3))
	assert.NotNil(getEntityChildren(pool, dir4))

	d1_kids, _ := getEntityChildren(pool, dir1)
	d2_kids, _ := getEntityChildren(pool, dir2)
	d3_kids, _ := getEntityChildren(pool, dir3)
	d4_kids, _ := getEntityChildren(pool, dir4)
	de_kids, _ := getEntityChildren(pool, emptyDir)

	assert.True(len(d1_kids) == 3)
	assert.True(len(d2_kids) == 1)
	assert.True(len(d3_kids) == 4)
	assert.True(len(d4_kids) == 9)
	assert.True(len(de_kids) == 0)

}
