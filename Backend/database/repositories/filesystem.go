// defines the filesystem repository
package repositories

import (
	"errors"
)

// Implements IRepositoryInterface
type FilesystemRepository struct {
	embeddedContext
}

// We really should use an ORM jesus this is ugly
func (rep FilesystemRepository) query(query string, input ...interface{}) (FilesystemEntry, error) {
	entity := FilesystemEntry{}
	children := []int{}

	err := rep.ctx.Query(query,
		input,
		&entity.EntityID, &entity.LogicalName, &entity.IsDocument, &entity.IsPublished,
		&entity.CreatedAt, &entity.OwnerUserId, nullableID{&entity.ParentFileID})
	if err != nil {
		return FilesystemEntry{}, err
	}

	rows, err := rep.ctx.QueryRow("SELECT EntityID FROM filesystem WHERE Parent = $1", []interface{}{entity.EntityID})
	if err != nil {
		return FilesystemEntry{}, err
	}

	// finally scan in the rows
	for rows.Next() {
		var x int
		err := rows.Scan(&x)
		if err != nil {
			return FilesystemEntry{}, err
		}

		children = append(children, x)
	}

	entity.ChildrenIDs = children
	return entity, nil
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

func (rep FilesystemRepository) GetEntryWithID(ID int) (FilesystemEntry, error) {
	if ID == FILESYSTEM_ROOT_ID {
		return rep.GetRoot()
	}

	return rep.query("SELECT * FROM filesystem WHERE EntityID = $1", ID)
}

func (rep FilesystemRepository) GetRoot() (FilesystemEntry, error) {
	return rep.query("SELECT * FROM filesystem WHERE Parent IS NULL")
}

func (rep FilesystemRepository) GetEntryWithParentID(ID int) (FilesystemEntry, error) {
	return rep.query("SELECT * FROM filesystem WHERE Parent = $1", ID)
}

func (rep FilesystemRepository) DeleteEntryWithID(ID int) error {
	return rep.ctx.Exec("SELECT delete_entity($1)", []interface{}{ID})
}

func (rep FilesystemRepository) RenameEntity(ID int, name string) error {
	return rep.ctx.Exec("UPDATE filesystem SET logicalname = ($1) WHERE entityid = ($2)", []interface{}{name, ID})
}
