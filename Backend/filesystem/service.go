package filesystem

import (
	"DiffSync/database"
	"errors"
	"strconv"

	"github.com/jackc/pgtype"
)

type EntityInfo struct {
	EntityID   int
	EntityName string
	IsDocument bool
	Children   []string
}

const ADMIN int = 1
const USER int = 2

// createFilesystemEntity creates a new file attached to a specific entity
func CreateFilesystemEntity(ctx database.DatabaseContext, parent int, logicalName string, ownerGroup int, isDocument bool) (int, error) {
	// pool is thread safe so its calm
	var newID int
	err := ctx.Query("SELECT new_entity($1, $2, $3, $4)", []interface{}{parent, logicalName, ownerGroup, isDocument}, &newID)
	if err != nil {
		return 0, errors.New("failed to create a new DB entry")
	}

	return newID, nil
}

// createFilesystemEntityAtRoot creates a new entity with root as its parent
func CreateFilesystemEntityAtRoot(ctx database.DatabaseContext, logicalName string, ownerGroup int, isDocument bool) (int, error) {
	// pool is thread safe so its calm
	root, err := GetRootID(ctx)
	if err != nil {
		return 0, err
	}

	id, err := CreateFilesystemEntity(ctx, root, logicalName, ownerGroup, isDocument)

	return id, err
}

// getRootID returns the id of the root directory
func GetRootID(ctx database.DatabaseContext) (int, error) {
	// pool is thread safe so its calm
	var parentID int
	err := ctx.Query("SELECT EntityID FROM filesystem WHERE parent IS NULL", []interface{}{}, &parentID)
	if err != nil {
		return 0, errors.New("failed to find root id")
	}

	return parentID, nil
}

// getFilesystemInfo returns information regarding a specific file system entity
func GetFilesystemInfo(ctx database.DatabaseContext, docID int) (EntityInfo, error) {
	entity := EntityInfo{}
	children := pgtype.Hstore{}

	err := ctx.Query("SELECT EntityID, LogicalName, IsDocument, Children FROM filesystem WHERE EntityID = $1",
		[]interface{}{docID}, &entity.EntityID, &entity.EntityName, &entity.IsDocument, &children)
	if err != nil {
		return EntityInfo{}, errors.New("failed to read from database")
	}

	for k := range children.Map {
		entity.Children = append(entity.Children, k)
	}

	return entity, nil
}

// getRootInfo gets the file information for the root
func GetRootInfo(ctx database.DatabaseContext) (EntityInfo, error) {
	rootID, err := GetRootID(ctx)
	if err != nil {
		return EntityInfo{}, err
	}
	info, err := GetFilesystemInfo(ctx, rootID)
	return info, err
}

// deleteEntity removes an entity from the filesystem
func DeleteEntity(ctx database.DatabaseContext, entityID int) error {
	return ctx.Exec("SELECT delete_entity($1)", []interface{}{entityID})
}

// renameEntity changes the logical name of a given object in the filesystem
func RenameEntity(ctx database.DatabaseContext, entityID int, newName string) error {
	return ctx.Exec("UPDATE filesystem SET logicalname = ($1) WHERE entityid = ($2)", []interface{}{newName, entityID})
}

// getFilesystemChildren returns the list of children for a file system entity
func GetEntityChildren(ctx database.DatabaseContext, docID int) ([]EntityInfo, error) {
	children := pgtype.Hstore{}

	err := ctx.Query("SELECT children FROM filesystem WHERE entityid = $1", []interface{}{docID}, &children)
	if err != nil {
		return nil, errors.New("failed to read from database")
	}

	list := []EntityInfo{}

	for k := range children.Map {
		id, _ := strconv.Atoi(k)
		info, _ := GetFilesystemInfo(ctx, id)
		list = append(list, info)
	}

	return list, nil
}
