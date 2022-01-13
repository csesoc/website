// defines the filesystem repository
package repositories

import (
	"errors"
	"strconv"
	"time"

	"cms.csesoc.unsw.edu.au/database/contexts"
	"cms.csesoc.unsw.edu.au/environment"
	"github.com/jackc/pgtype"
)

// filesystem model (model stored within database)
type FilesystemEntry struct {
	EntityID    int
	LogicalName string

	IsDocument  bool
	IsPublished bool
	CreatedAt   time.Time

	OwnerUserId  int
	ParentFileID int
	ChildrenIDs  []int
}

// Repository interface that all valid filesystem repositories
// mocked/real should implement
type IFilesystemRepository interface {
	GetEntryWithID(ID int) (FilesystemEntry, error)
	GetRoot() (FilesystemEntry, error)
	GetEntryWithParentID(ID int) FilesystemEntry

	CreateEntry(file FilesystemEntry) (FilesystemEntry, error)
	DeleteEntryWithID(ID int) error

	RenameEntity(ID int, name string) error
}

// Implements: IFilesystemRepository
type FilesystemRepository struct {
	ctx contexts.DatabaseContext
}

// The ID for root, set this as the ID in a specified request
const FILESYSTEM_ROOT_ID = -1

// We really should use an ORM jesus this is ugly
func (rep FilesystemRepository) query(query string, input ...interface{}) (FilesystemEntry, error) {
	entity := FilesystemEntry{}
	children := pgtype.Hstore{}

	err := rep.ctx.Query(query,
		input,
		&entity.EntityID, &entity.LogicalName, &entity.IsDocument, &entity.IsDocument, &entity.IsPublished,
		&entity.CreatedAt, &entity.OwnerUserId, &entity.ParentFileID, &children)
	if err != nil {
		return FilesystemEntry{}, errors.New("failed to read from database")
	}

	for k := range children.Map {
		a, _ := strconv.Atoi(k)
		entity.ChildrenIDs = append(entity.ChildrenIDs, a)
	}

	return entity, nil
}

func (rep FilesystemRepository) GetEntryWithID(ID int) (FilesystemEntry, error) {
	return rep.query("SELECT * FROM filesystem WHERE EntityID = $1", ID)
}

func (rep FilesystemRepository) GetRoot() (FilesystemEntry, error) {
	return rep.query("SELECT * FROM filesystem WHERE Parent IS NULL")
}

func (rep FilesystemRepository) GetEntryWithParentID(ID int) (FilesystemEntry, error) {
	return rep.query("SELECT * FROM filesystem WHERE Parent = $1", ID)
}

// Returns: entry struct containing the entity that was just created
func (rep FilesystemRepository) CreateEntry(file FilesystemEntry) (FilesystemEntry, error) {
	if file.ParentFileID == FILESYSTEM_ROOT_ID {
		// determine root ID
		root, err := rep.GetRoot()
		if err != nil {
			return FilesystemEntry{}, errors.New("failed to get root")
		}

		file.ParentFileID = root.EntityID
	}

	var newID int
	err := rep.ctx.Query("SELECT new_entity($1, $2, $3, $4)", []interface{}{file.ParentFileID, file.LogicalName, file.OwnerUserId, file.IsDocument}, &newID)
	if err != nil {
		return FilesystemEntry{}, err
	}

	return rep.GetEntryWithID(newID)
}

func (rep FilesystemRepository) DeleteEntryWithID(ID int) error {
	return rep.ctx.Exec("SELECT delete_entity($1)", []interface{}{ID})
}

func (rep FilesystemRepository) RenameEntity(ID int, name string) error {
	return rep.ctx.Exec("UPDATE filesystem SET logicalname = ($1) WHERE entityid = ($2)", []interface{}{name, ID})
}

// utility function for testing
func (rep FilesystemRepository) GetTestContext() contexts.TestingContext {
	if !environment.IsTestingEnvironment() {
		panic("not in a testing environment")
	}

	return rep.ctx.(contexts.TestingContext)
}
