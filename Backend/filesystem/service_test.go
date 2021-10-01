package filesystem

import (
	"DiffSync/database"
	"log"
	"os"
	"strconv"
	"testing"

	"github.com/jackc/pgtype"
	"github.com/stretchr/testify/assert"
)

var testContext database.TestingContext

func TestMain(m *testing.M) {
	testContext = database.NewTestingContext()

	defer testContext.Close()
	os.Exit(m.Run())
}

func TestRootRetrieval_Integration(t *testing.T) {
	assert := assert.New(t)

	testContext.RunTest(func() {
		root, err := getRootInfo(testContext)

		if assert.Nil(err) {
			assert.Equal("root", root.EntityName)
			assert.False(root.IsDocument)
			assert.GreaterOrEqual(len(root.Children), 0)
		}
	})
}

func TestRootInsert_Integration(t *testing.T) {
	assert := assert.New(t)

	testContext.RunTest(func() {
		newDir, _ := createFilesystemEntityAtRoot(testContext, "test_directory", ADMIN, false)
		newDoc, _ := createFilesystemEntity(testContext, newDir, "test_directory", ADMIN, true)

		var docCount int
		var dirCount int

		if assert.Nil(testContext.Query("SELECT COUNT(*) FROM filesystem WHERE EntityID = $1", []interface{}{newDir}, &dirCount)) {
			assert.Equal(dirCount, 1)
		}

		if assert.Nil(testContext.Query("SELECT COUNT(*) FROM filesystem WHERE EntityID = $1", []interface{}{newDoc}, &docCount)) {
			assert.Equal(docCount, 1)
		}

		expectedChildren := pgtype.Hstore{}
		if assert.Nil(testContext.Query("SELECT Children FROM filesystem WHERE parent IS NULL", []interface{}{}, &expectedChildren)) {
			if _, exists := expectedChildren.Map[strconv.Itoa(newDir)]; !exists {
				assert.True(false)
			}
		}

		expectedChildren = pgtype.Hstore{}
		if assert.Nil(testContext.Query("SELECT Children FROM filesystem WHERE EntityID = $1", []interface{}{newDir}, &expectedChildren)) {
			if _, exists := expectedChildren.Map[strconv.Itoa(newDoc)]; !exists {
				assert.True(false)
			}
		}
	})
}

func TestDocumentInfoRetrieval_Integration(t *testing.T) {
	assert := assert.New(t)

	testContext.RunTest(func() {
		newDoc, err := createFilesystemEntityAtRoot(testContext, "test_doc", ADMIN, true)
		if err != nil {
			log.Fatalf(err.Error())
		}

		info, err := getFilesystemInfo(testContext, newDoc)
		if assert.Nil(err) {
			assert.True(info.IsDocument)
			assert.Equal("test_doc", info.EntityName)
			assert.Empty(info.Children)
		}
	})
}

func TestEntityDeletion(t *testing.T) {
	assert := assert.New(t)

	testContext.RunTest(func() {
		root, _ := getRootInfo(testContext)

		// Test setup
		newDir, _ := createFilesystemEntityAtRoot(testContext, "cool_dir", ADMIN, false)
		newDoc, _ := createFilesystemEntity(testContext, newDir, "cool_doc", ADMIN, true)

		assert.NotNil(deleteEntity(testContext, root.EntityID))
		assert.NotNil(deleteEntity(testContext, newDir))

		assert.Nil(deleteEntity(testContext, newDoc))
		info, _ := getFilesystemInfo(testContext, newDir)
		assert.NotContains(strconv.Itoa(newDoc), info.Children)
		assert.Nil(deleteEntity(testContext, newDir))

		root, _ = getRootInfo(testContext)
		assert.NotContains(strconv.Itoa(newDir), root.Children)

		anotherDirectory, _ := createFilesystemEntityAtRoot(testContext, "cheese", ADMIN, false)
		nestedDirectory, _ := createFilesystemEntity(testContext, anotherDirectory, "cheeseBurger", ADMIN, false)
		file, _ := createFilesystemEntity(testContext, nestedDirectory, "spinach", ADMIN, false)

		assert.NotNil(deleteEntity(testContext, nestedDirectory))
		assert.Nil(deleteEntity(testContext, file))
		assert.Nil(deleteEntity(testContext, nestedDirectory))
		assert.Nil(deleteEntity(testContext, anotherDirectory))

		root, _ = getRootInfo(testContext)
		assert.NotContains(strconv.Itoa(anotherDirectory), root.Children)
	})
}

func TestEntityRename(t *testing.T) {
	assert := assert.New(t)

	testContext.RunTest(func() {
		// Test setup
		newDir, _ := createFilesystemEntityAtRoot(testContext, "cool_dir", ADMIN, false)
		newDoc, _ := createFilesystemEntity(testContext, newDir, "cool_doc", ADMIN, true)
		newDoc1, _ := createFilesystemEntity(testContext, newDir, "cool_doc1", ADMIN, true)
		newDoc2, _ := createFilesystemEntity(testContext, newDir, "cool_doc2", ADMIN, true)

		assert.True(testContext.WillFail(func() error { return renameEntity(testContext, newDoc, "cool_doc2") }))
		assert.True(testContext.WillFail(func() error { return renameEntity(testContext, newDoc1, "cool_doc2") }))
		assert.True(testContext.WillFail(func() error { return renameEntity(testContext, newDoc2, "cool_doc1") }))

		assert.Nil(renameEntity(testContext, newDoc, "yabba dabba doo"))
		assert.Nil(renameEntity(testContext, newDir, "zoinks"))
	})
}

func TestEntityChildren(t *testing.T) {
	assert := assert.New(t)

	testContext.RunTest(func() {
		// Test setup
		dir1, _ := createFilesystemEntityAtRoot(testContext, "d1", ADMIN, false)
		dir2, _ := createFilesystemEntityAtRoot(testContext, "d2", ADMIN, false)
		dir3, _ := createFilesystemEntityAtRoot(testContext, "d3", ADMIN, false)
		dir4, _ := createFilesystemEntityAtRoot(testContext, "d4", ADMIN, false)
		emptyDir, _ := createFilesystemEntityAtRoot(testContext, "de", ADMIN, false)

		for x := 1; x < 10; x++ {
			if x%3 == 0 {
				createFilesystemEntity(testContext, dir1, "cool_doc"+string(x), ADMIN, true)
			}
			if x%5 == 0 {
				createFilesystemEntity(testContext, dir2, "cool_doc"+string(x), ADMIN, true)
			}
			if x%2 == 0 {
				createFilesystemEntity(testContext, dir3, "cool_doc"+string(x), ADMIN, true)
			}
			createFilesystemEntity(testContext, dir4, "cool_doc"+string(x), ADMIN, true)
		}

		assert.NotNil(getEntityChildren(testContext, dir1))
		assert.NotNil(getEntityChildren(testContext, dir2))
		assert.NotNil(getEntityChildren(testContext, dir3))
		assert.NotNil(getEntityChildren(testContext, dir4))

		d1_kids, _ := getEntityChildren(testContext, dir1)
		d2_kids, _ := getEntityChildren(testContext, dir2)
		d3_kids, _ := getEntityChildren(testContext, dir3)
		d4_kids, _ := getEntityChildren(testContext, dir4)
		de_kids, _ := getEntityChildren(testContext, emptyDir)

		assert.True(len(d1_kids) == 3)
		assert.True(len(d2_kids) == 1)
		assert.True(len(d3_kids) == 4)
		assert.True(len(d4_kids) == 9)
		assert.True(len(de_kids) == 0)
	})
}
