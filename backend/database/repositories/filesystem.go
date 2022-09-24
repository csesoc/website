// defines the filesystem repository
package repositories

import (
	"errors"
	"strings"

	"github.com/google/uuid"
)

// Implements IRepositoryInterface
type filesystemRepository struct {
	embeddedContext
}

// The ID for root, set this as the ID in a specified request
var FilesystemRootID uuid.UUID = uuid.Nil

// We really should use an ORM jesus this is ugly
func (rep filesystemRepository) query(query string, input ...interface{}) (FilesystemEntry, error) {
	entity := FilesystemEntry{}
	children := []uuid.UUID{}

	err := rep.ctx.Query(query,
		input,
		&entity.EntityID, &entity.LogicalName, &entity.IsDocument, &entity.IsPublished,
		&entity.CreatedAt, &entity.OwnerUserId, &entity.ParentFileID)
	if err != nil {
		return FilesystemEntry{}, err
	}

	rows, err := rep.ctx.QueryRow("SELECT EntityID FROM filesystem WHERE Parent = $1", []interface{}{entity.EntityID})
	if err != nil {
		return FilesystemEntry{}, err
	}

	// finally scan in the rows
	for rows.Next() {
		var x uuid.UUID
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
func (rep filesystemRepository) CreateEntry(file FilesystemEntry) (FilesystemEntry, error) {
	// TODO: I feel like this is useless?
	// if file.ParentFileID == FilesystemRootID {
	// 	// determine root ID
	// 	root, err := rep.GetRoot()
	// 	if err != nil {
	// 		return FilesystemEntry{}, errors.New("failed to get root")
	// 	}

	// 	file.ParentFileID = root.EntityID
	// }

	var newID uuid.UUID
	err := rep.ctx.Query("SELECT new_entity($1, $2, $3, $4)", []interface{}{file.ParentFileID, file.LogicalName, file.OwnerUserId, file.IsDocument}, &newID)
	if err != nil {
		return FilesystemEntry{}, err
	}
	return rep.GetEntryWithID(newID)
}

// TODO: Change this
func (rep filesystemRepository) GetEntryWithID(ID uuid.UUID) (FilesystemEntry, error) {
	if ID == FilesystemRootID {
		return rep.GetRoot("A")
	}

	result, err := rep.query("SELECT * FROM filesystem WHERE EntityID = $1", ID)
	return result, err
}

// TODO: Is this even necessary anymore? frontend table's GetIDWithName does same thing
func (rep filesystemRepository) GetRoot(frontend string) (FilesystemEntry, error) {
	return rep.query("SELECT * FROM frontend WHERE FrontendLogicalname = $1", frontend)
}

func (rep filesystemRepository) GetEntryWithParentID(ID uuid.UUID) (FilesystemEntry, error) {
	return rep.query("SELECT * FROM filesystem WHERE Parent = $1", ID)
}

func (rep filesystemRepository) GetIDWithPath(path string) (uuid.UUID, error) {
	// I could do this with one query, where I query the repository for all files in parentNames and process that here
	parentNames := strings.Split(path, "/")
	if parentNames[0] != "" {
		return uuid.Nil, errors.New("path must start with /")
	}

	// Determine main parent
	parent, err := rep.query("SELECT * FROM filesystem WHERE LogicalName = $1", parentNames[1])
	if err != nil {
		return uuid.Nil, err
	}
	// Loop through children
	for i := 2; i < len(parentNames); i++ {
		child, err := rep.query("SELECT * FROM filesystem WHERE LogicalName = $1 AND Parent = $2", parentNames[i], parent.EntityID)
		if err != nil {
			return uuid.Nil, err
		}

		parent = child
	}

	return parent.EntityID, err
}

func (rep filesystemRepository) DeleteEntryWithID(ID uuid.UUID) error {
	return rep.ctx.Exec("SELECT delete_entity($1)", []interface{}{ID})
}

func (rep filesystemRepository) RenameEntity(ID uuid.UUID, name string) error {
	return rep.ctx.Exec("UPDATE filesystem SET LogicalName = ($1) WHERE EntityId = ($2)", []interface{}{name, ID})
}
