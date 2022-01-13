// defines the filesystem repository
package repositories

import (
	"errors"
	"strconv"

	"cms.csesoc.unsw.edu.au/database/contexts"
	"cms.csesoc.unsw.edu.au/environment"
	"github.com/jackc/pgtype"
)

// Implements IRepositoryInterface
type FilesystemRepository struct {
	ctx contexts.DatabaseContext
}

// The ID for root, set this as the ID in a specified request
const FILESYSTEM_ROOT_ID = -1

// internal ID for holding potentially null
// foreign keys
// implements scannable interface
type NullableID struct {
	ID *int
}

// Implementation of the scan interface
func (ni NullableID) Scan(src interface{}) error {
	switch v := src.(type) {
	case int:
		*ni.ID = v
		break
	case nil:
		*ni.ID = -1
		break
	default:
		break
	}

	return nil
}

// We really should use an ORM jesus this is ugly
func (rep FilesystemRepository) query(query string, input ...interface{}) (FilesystemEntry, error) {
	entity := FilesystemEntry{}
	children := pgtype.Hstore{}

	err := rep.ctx.Query(query,
		input,
		&entity.EntityID, &entity.LogicalName, &entity.IsDocument, &entity.IsPublished,
		&entity.CreatedAt, &entity.OwnerUserId, NullableID{&entity.ParentFileID}, &children)
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
func (rep FilesystemRepository) GetTestContext() *contexts.TestingContext {
	if !environment.IsTestingEnvironment() {
		panic("not in a testing environment")
	}

	return rep.ctx.(*contexts.TestingContext)
}
