package repositories

import (
	"fmt"
	"log"
	"os"
	"strconv"
	"testing"

	"cms.csesoc.unsw.edu.au/database/repositories"

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
		root, err := repo.GetRoot()

		if assert.Nil(err) {
			assert.Equal("root", root.LogicalName)
			assert.False(root.IsDocument)
			assert.GreaterOrEqual(len(root.ChildrenIDs), 0)
		}
	})
}

func TestRootInsert_Integration(t *testing.T) {
	assert := assert.New(t)

	testContext.RunTest(func() {
		// ==== Test setup ====
		newDir, _ := repo.CreateEntry(repositories.FilesystemEntry{
			LogicalName: "test_directory", ParentFileID: repositories.FILESYSTEM_ROOT_ID,
			OwnerUserId: repositories.GROUPS_ADMIN, IsDocument: false})

		newDoc, _ := repo.CreateEntry(repositories.FilesystemEntry{
			LogicalName: "test_doc", ParentFileID: newDir.EntityID,
			OwnerUserId: repositories.GROUPS_ADMIN, IsDocument: true})

		// === assertations ====
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
			if _, exists := expectedChildren.Map[strconv.Itoa(newDir.EntityID)]; !exists {
				assert.True(false)
			}
		}

		expectedChildren = pgtype.Hstore{}
		if assert.Nil(testContext.Query("SELECT Children FROM filesystem WHERE EntityID = $1", []interface{}{newDir}, &expectedChildren)) {
			if _, exists := expectedChildren.Map[strconv.Itoa(newDir.EntityID)]; !exists {
				assert.True(false)
			}
		}
	})
}

func TestDocumentInfoRetrieval_Integration(t *testing.T) {
	assert := assert.New(t)

	testContext.RunTest(func() {
		// ==== Setup ====
		newDoc, err := repo.CreateEntry(repositories.FilesystemEntry{
			LogicalName: "test_doc", ParentFileID: repositories.FILESYSTEM_ROOT_ID,
			OwnerUserId: repositories.GROUPS_ADMIN, IsDocument: true})

		// ==== Assertations ====
		if err != nil {
			log.Fatalf(err.Error())
		}

		// Query again for existence in database
		if info, err := repo.GetEntryWithID(newDoc.EntityID); assert.Nil(err) {
			assert.True(info.IsDocument)
			assert.Equal("test_doc", info.LogicalName)
			assert.Empty(info.ChildrenIDs)
		}
	})
}

func TestEntityDeletion(t *testing.T) {
	assert := assert.New(t)

	testContext.RunTest(func() {
		// ====== Setup ======
		root, _ := repo.GetRoot()

		newDir, _ := repo.CreateEntry(repositories.FilesystemEntry{
			LogicalName: "cool_dir", OwnerUserId: repositories.GROUPS_ADMIN,
			ParentFileID: repositories.FILESYSTEM_ROOT_ID, IsDocument: false,
		})

		newDoc, _ := repo.CreateEntry(repositories.FilesystemEntry{
			LogicalName: "cool_doc", OwnerUserId: repositories.GROUPS_ADMIN,
			ParentFileID: newDir.EntityID, IsDocument: true,
		})

		// ====== Assertations ======
		assert.True(testContext.WillFail(func() error { return repo.DeleteEntryWithID(root.EntityID) }))
		assert.True(testContext.WillFail(func() error { return repo.DeleteEntryWithID(newDir.EntityID) }))

		assert.Nil(repo.DeleteEntryWithID(newDoc.EntityID))
		info, _ := repo.GetEntryWithID(newDir.EntityID)
		assert.NotContains(newDoc.EntityID, info.ChildrenIDs)
		assert.Nil(repo.DeleteEntryWithID(newDir.EntityID))

		root, _ = repo.GetRoot()
		assert.NotContains(newDir.EntityID, root.ChildrenIDs)

		// ======= Secondary setup ==========
		anotherDirectory, _ := repo.CreateEntry(repositories.FilesystemEntry{
			LogicalName: "cheese", OwnerUserId: repositories.GROUPS_ADMIN,
			ParentFileID: repositories.FILESYSTEM_ROOT_ID, IsDocument: false,
		})

		nestedDirectory, _ := repo.CreateEntry(repositories.FilesystemEntry{
			LogicalName: "cheeseBurger", OwnerUserId: repositories.GROUPS_ADMIN,
			ParentFileID: anotherDirectory.EntityID, IsDocument: false,
		})

		file, _ := repo.CreateEntry(repositories.FilesystemEntry{
			LogicalName: "spinach", OwnerUserId: repositories.GROUPS_ADMIN,
			ParentFileID: nestedDirectory.EntityID, IsDocument: false,
		})

		// ====== Secondary Assertations ======
		assert.True(testContext.WillFail(func() error { return repo.DeleteEntryWithID(nestedDirectory.EntityID) }))
		assert.Nil(repo.DeleteEntryWithID(file.EntityID))
		assert.Nil(repo.DeleteEntryWithID(nestedDirectory.EntityID))
		assert.Nil(repo.DeleteEntryWithID(anotherDirectory.EntityID))

		root, _ = repo.GetRoot()
		assert.NotContains(anotherDirectory.EntityID, root.ChildrenIDs)
	})
}

func TestEntityRename(t *testing.T) {
	assert := assert.New(t)

	getEntity := func(name string, permissions int, parent int, isDocument bool) repositories.FilesystemEntry {
		return repositories.FilesystemEntry{
			LogicalName:  name,
			OwnerUserId:  permissions,
			ParentFileID: parent,
			IsDocument:   isDocument,
		}
	}

	testContext.RunTest(func() {
		// ===== Test setup =====
		newDir, _ := repo.CreateEntry(getEntity("cool_dir", repositories.GROUPS_ADMIN, repositories.FILESYSTEM_ROOT_ID, false))
		newDoc, _ := repo.CreateEntry(getEntity("cool_doc", repositories.GROUPS_ADMIN, newDir.EntityID, false))
		newDoc1, _ := repo.CreateEntry(getEntity("cool_doc1", repositories.GROUPS_ADMIN, newDir.EntityID, false))
		newDoc2, _ := repo.CreateEntry(getEntity("cool_doc2", repositories.GROUPS_ADMIN, newDir.EntityID, false))

		// ===== Assertations ======
		assert.True(testContext.WillFail(func() error { return repo.RenameEntity(newDoc.EntityID, "cool_doc2") }))
		assert.True(testContext.WillFail(func() error { return repo.RenameEntity(newDoc1.EntityID, "cool_doc2") }))
		assert.True(testContext.WillFail(func() error { return repo.RenameEntity(newDoc2.EntityID, "cool_doc1") }))

		assert.Nil(repo.RenameEntity(newDoc.EntityID, "yabba dabba doo"))
		assert.Nil(repo.RenameEntity(newDir.EntityID, "zoinks"))
	})
}

func TestEntityChildren(t *testing.T) {
	assert := assert.New(t)
	getEntity := func(name string, permissions int, isDocument bool, parent int) repositories.FilesystemEntry {
		return repositories.FilesystemEntry{
			LogicalName:  name,
			OwnerUserId:  permissions,
			ParentFileID: parent,
			IsDocument:   isDocument,
		}
	}

	testContext.RunTest(func() {
		// Test setup
		dir1, _ := repo.CreateEntry(getEntity("d1", repositories.GROUPS_ADMIN, false, repositories.FILESYSTEM_ROOT_ID))
		dir2, _ := repo.CreateEntry(getEntity("d2", repositories.GROUPS_ADMIN, false, repositories.FILESYSTEM_ROOT_ID))
		dir3, _ := repo.CreateEntry(getEntity("d3", repositories.GROUPS_ADMIN, false, repositories.FILESYSTEM_ROOT_ID))
		dir4, _ := repo.CreateEntry(getEntity("d4", repositories.GROUPS_ADMIN, false, repositories.FILESYSTEM_ROOT_ID))
		emptyDir, _ := repo.CreateEntry(getEntity("de", repositories.GROUPS_ADMIN, false, repositories.FILESYSTEM_ROOT_ID))

		for x := 1; x < 10; x++ {
			if x%3 == 0 {
				repo.CreateEntry(getEntity("cool_doc"+fmt.Sprint(x), repositories.GROUPS_ADMIN, false, dir1.EntityID))
			}
			if x%5 == 0 {
				repo.CreateEntry(getEntity("cool_doc"+fmt.Sprint(x), repositories.GROUPS_ADMIN, false, dir2.EntityID))
			}
			if x%2 == 0 {
				repo.CreateEntry(getEntity("cool_doc"+fmt.Sprint(x), repositories.GROUPS_ADMIN, false, dir3.EntityID))
			}
			repo.CreateEntry(getEntity("cool_doc"+fmt.Sprint(x), repositories.GROUPS_ADMIN, false, dir4.EntityID))
		}

		d1_kids, _ := repo.GetEntryWithID(dir1.EntityID)
		d2_kids, _ := repo.GetEntryWithID(dir2.EntityID)
		d3_kids, _ := repo.GetEntryWithID(dir3.EntityID)
		d4_kids, _ := repo.GetEntryWithID(dir4.EntityID)
		de_kids, _ := repo.GetEntryWithID(emptyDir.EntityID)

		assert.True(len(d1_kids.ChildrenIDs) == 3)
		assert.True(len(d2_kids.ChildrenIDs) == 1)
		assert.True(len(d3_kids.ChildrenIDs) == 4)
		assert.True(len(d4_kids.ChildrenIDs) == 9)
		assert.True(len(de_kids.ChildrenIDs) == 0)
	})
}
