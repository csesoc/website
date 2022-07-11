package repositories

import (
	"fmt"
	"log"
	"os"
	"testing"

	"cms.csesoc.unsw.edu.au/database/repositories"

	"github.com/jackc/pgx/v4"
	"github.com/stretchr/testify/assert"
)

var repo = repositories.GetRepository(repositories.FILESYSTEM).(repositories.FilesystemRepository)
var testContext = repo.GetTestContext()

func TestMain(m *testing.M) {
	os.Exit(m.Run())
}

func TestRootRetrieval(t *testing.T) {
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

func TestRootInsert(t *testing.T) {
	assert := assert.New(t)

	testContext.RunTest(func() {
		// ==== Test setup ====
		root, _ := repo.GetRoot()

		newDir, _ := repo.CreateEntry(repositories.FilesystemEntry{
			LogicalName: "test_directory", ParentFileID: repositories.FILESYSTEM_ROOT_ID,
			OwnerUserId: repositories.GROUPS_ADMIN, IsDocument: false})

		newDoc, _ := repo.CreateEntry(repositories.FilesystemEntry{
			LogicalName: "test_doc", ParentFileID: newDir.EntityID,
			OwnerUserId: repositories.GROUPS_ADMIN, IsDocument: true})

		// === assertations ====
		var docCount int
		var dirCount int

		if assert.Nil(testContext.Query("SELECT COUNT(*) FROM filesystem WHERE EntityID = $1", []interface{}{newDir.EntityID}, &dirCount)) {
			assert.Equal(dirCount, 1)
		}

		if assert.Nil(testContext.Query("SELECT COUNT(*) FROM filesystem WHERE EntityID = $1", []interface{}{newDoc.EntityID}, &docCount)) {
			assert.Equal(docCount, 1)
		}

		if rows, err := testContext.QueryRow("SELECT EntityID FROM filesystem WHERE Parent = $1", []interface{}{root.EntityID}); assert.Nil(err) {
			childrenArr := scanIntArray(rows)
			assert.Contains(childrenArr, newDir.EntityID)
		}

		if rows, err := testContext.QueryRow("SELECT EntityID FROM filesystem WHERE Parent = $1", []interface{}{newDir.EntityID}); assert.Nil(err) {
			childrenArr := scanIntArray(rows)
			assert.Contains(childrenArr, newDoc.EntityID)
		}
	})
}

func TestDocumentInfoRetrieval(t *testing.T) {
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
		assert.NotContains(info.ChildrenIDs, newDoc.EntityID)
		assert.Nil(repo.DeleteEntryWithID(newDir.EntityID))

		root, _ = repo.GetRoot()
		assert.NotContains(root.ChildrenIDs, newDir.EntityID)

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
		assert.NotContains(root.ChildrenIDs, anotherDirectory.EntityID)
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

func TestGetIDWithPath(t *testing.T) {
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
		currentDir := dir1
		for x := 1; x < 3; x++ {
			newDir, _ := repo.CreateEntry(getEntity("cool_doc"+fmt.Sprint(x), repositories.GROUPS_ADMIN, false, currentDir.EntityID))
			currentDir = newDir
		}

		child2id, _ := repo.GetIDWithPath("/d1/cool_doc1/cool_doc2")
		child1id, _ := repo.GetIDWithPath("/d1/cool_doc1")
		child2, _ := repo.GetEntryWithID(child2id)
		child1, _ := repo.GetEntryWithID(child1id)
		_, error1 := repo.GetIDWithPath("/d1/cool_doc2/cool_doc1")
		_, error2 := repo.GetIDWithPath("/d1/cool_doc1/cool_doc2/cool_doc1")

		assert.True(error1 != nil)
		assert.True(error2 != nil)
		assert.True(child1.EntityID == child2.ParentFileID)
		assert.True(dir1.EntityID == child1.ParentFileID)
	})

}

func contains(s []int, e int) bool {
	for _, a := range s {
		if a == e {
			return true
		}
	}
	return false
}

func scanIntArray(rows pgx.Rows) []int {
	arr := []int{}
	for rows.Next() {
		var x int
		rows.Scan(&x)
		arr = append(arr, x)
	}

	return arr
}
