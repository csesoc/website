package repositories

import (
	"fmt"
	"log"
	"os"
	"strconv"
	"testing"

	"cms.csesoc.unsw.edu.au/database/repositories"
	"cms.csesoc.unsw.edu.au/filesystem"

	"github.com/jackc/pgtype"
	"github.com/stretchr/testify/assert"
)

var repo = repositories.GetRepository(repositories.FILESYSTEM).(repositories.FilesystemRepository)
var testContext = repo.GetTestContext()

func TestMain(m *testing.M) {
	os.Exit(m.Run())
}

func TestRootRetrieval_Integration(t *testing.T) {
	assert := assert.New(t)
	testContext.RunTest(func() {
		root, err := filesystem.GetRootInfo(testContext)

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
		newDir, _ := filesystem.CreateFilesystemEntityAtRoot(testContext, "test_directory", filesystem.ADMIN, false)
		newDoc, _ := filesystem.CreateFilesystemEntity(testContext, newDir, "test_directory", filesystem.ADMIN, true)

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
		newDoc, err := filesystem.CreateFilesystemEntityAtRoot(testContext, "test_doc", filesystem.ADMIN, true)
		if err != nil {
			log.Fatalf(err.Error())
		}

		info, err := filesystem.GetFilesystemInfo(testContext, newDoc)
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
		root, _ := filesystem.GetRootInfo(testContext)

		// Test setup
		newDir, _ := filesystem.CreateFilesystemEntityAtRoot(testContext, "cool_dir", filesystem.ADMIN, false)
		newDoc, _ := filesystem.CreateFilesystemEntity(testContext, newDir, "cool_doc", filesystem.ADMIN, true)

		assert.True(testContext.WillFail(func() error { return filesystem.DeleteEntity(testContext, root.EntityID) }))
		assert.True(testContext.WillFail(func() error { return filesystem.DeleteEntity(testContext, newDir) }))

		assert.Nil(filesystem.DeleteEntity(testContext, newDoc))
		info, _ := filesystem.GetFilesystemInfo(testContext, newDir)
		assert.NotContains(strconv.Itoa(newDoc), info.Children)
		assert.Nil(filesystem.DeleteEntity(testContext, newDir))

		root, _ = filesystem.GetRootInfo(testContext)
		assert.NotContains(strconv.Itoa(newDir), root.Children)

		anotherDirectory, _ := filesystem.CreateFilesystemEntityAtRoot(testContext, "cheese", filesystem.ADMIN, false)
		nestedDirectory, _ := filesystem.CreateFilesystemEntity(testContext, anotherDirectory, "cheeseBurger", filesystem.ADMIN, false)
		file, _ := filesystem.CreateFilesystemEntity(testContext, nestedDirectory, "spinach", filesystem.ADMIN, false)

		assert.True(testContext.WillFail(func() error { return filesystem.DeleteEntity(testContext, nestedDirectory) }))
		assert.Nil(filesystem.DeleteEntity(testContext, file))
		assert.Nil(filesystem.DeleteEntity(testContext, nestedDirectory))
		assert.Nil(filesystem.DeleteEntity(testContext, anotherDirectory))

		root, _ = filesystem.GetRootInfo(testContext)
		assert.NotContains(strconv.Itoa(anotherDirectory), root.Children)
	})
}

func TestEntityRename(t *testing.T) {
	assert := assert.New(t)

	testContext.RunTest(func() {
		// Test setup
		newDir, _ := filesystem.CreateFilesystemEntityAtRoot(testContext, "cool_dir", filesystem.ADMIN, false)
		newDoc, _ := filesystem.CreateFilesystemEntity(testContext, newDir, "cool_doc", filesystem.ADMIN, true)
		newDoc1, _ := filesystem.CreateFilesystemEntity(testContext, newDir, "cool_doc1", filesystem.ADMIN, true)
		newDoc2, _ := filesystem.CreateFilesystemEntity(testContext, newDir, "cool_doc2", filesystem.ADMIN, true)

		assert.True(testContext.WillFail(func() error { return filesystem.RenameEntity(testContext, newDoc, "cool_doc2") }))
		assert.True(testContext.WillFail(func() error { return filesystem.RenameEntity(testContext, newDoc1, "cool_doc2") }))
		assert.True(testContext.WillFail(func() error { return filesystem.RenameEntity(testContext, newDoc2, "cool_doc1") }))

		assert.Nil(filesystem.RenameEntity(testContext, newDoc, "yabba dabba doo"))
		assert.Nil(filesystem.RenameEntity(testContext, newDir, "zoinks"))
	})
}

func TestEntityChildren(t *testing.T) {
	assert := assert.New(t)

	testContext.RunTest(func() {
		// Test setup
		dir1, _ := filesystem.CreateFilesystemEntityAtRoot(testContext, "d1", filesystem.ADMIN, false)
		dir2, _ := filesystem.CreateFilesystemEntityAtRoot(testContext, "d2", filesystem.ADMIN, false)
		dir3, _ := filesystem.CreateFilesystemEntityAtRoot(testContext, "d3", filesystem.ADMIN, false)
		dir4, _ := filesystem.CreateFilesystemEntityAtRoot(testContext, "d4", filesystem.ADMIN, false)
		emptyDir, _ := filesystem.CreateFilesystemEntityAtRoot(testContext, "de", filesystem.ADMIN, false)

		for x := 1; x < 10; x++ {
			if x%3 == 0 {
				filesystem.CreateFilesystemEntity(testContext, dir1, "cool_doc"+fmt.Sprint(x), filesystem.ADMIN, true)
			}
			if x%5 == 0 {
				filesystem.CreateFilesystemEntity(testContext, dir2, "cool_doc"+fmt.Sprint(x), filesystem.ADMIN, true)
			}
			if x%2 == 0 {
				filesystem.CreateFilesystemEntity(testContext, dir3, "cool_doc"+fmt.Sprint(x), filesystem.ADMIN, true)
			}
			filesystem.CreateFilesystemEntity(testContext, dir4, "cool_doc"+fmt.Sprint(x), filesystem.ADMIN, true)
		}

		assert.NotNil(filesystem.GetEntityChildren(testContext, dir1))
		assert.NotNil(filesystem.GetEntityChildren(testContext, dir2))
		assert.NotNil(filesystem.GetEntityChildren(testContext, dir3))
		assert.NotNil(filesystem.GetEntityChildren(testContext, dir4))

		d1_kids, _ := filesystem.GetEntityChildren(testContext, dir1)
		d2_kids, _ := filesystem.GetEntityChildren(testContext, dir2)
		d3_kids, _ := filesystem.GetEntityChildren(testContext, dir3)
		d4_kids, _ := filesystem.GetEntityChildren(testContext, dir4)
		de_kids, _ := filesystem.GetEntityChildren(testContext, emptyDir)

		assert.True(len(d1_kids) == 3)
		assert.True(len(d2_kids) == 1)
		assert.True(len(d3_kids) == 4)
		assert.True(len(d4_kids) == 9)
		assert.True(len(de_kids) == 0)
	})
}
