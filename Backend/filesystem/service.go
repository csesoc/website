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
func createFilesystemEntity(ctx database.DatabaseContext, parent int, logicalName string, ownerGroup int, isDocument bool) (int, error) {
	// pool is thread safe so its calm
	var newID int
	err := ctx.Query("SELECT new_entity($1, $2, $3, $4)", []interface{}{parent, logicalName, ownerGroup, isDocument}, &newID)
	if err != nil {
		return 0, errors.New("failed to create a new DB entry")
	}

	return newID, nil
}

// createFilesystemEntityAtRoot creates a new entity with root as its parent
func createFilesystemEntityAtRoot(ctx database.DatabaseContext, logicalName string, ownerGroup int, isDocument bool) (int, error) {
	// pool is thread safe so its calm
	root, err := getRootID(ctx)
	if err != nil {
		return 0, err
	}

	id, err := createFilesystemEntity(ctx, root, logicalName, ownerGroup, isDocument)

	return id, err
}

// getRootID returns the id of the root directory
func getRootID(ctx database.DatabaseContext) (int, error) {
	// pool is thread safe so its calm
	var parentID int
	err := ctx.Query("SELECT EntityID FROM filesystem WHERE parent IS NULL", []interface{}{}, &parentID)
	if err != nil {
		return 0, errors.New("failed to find root id")
	}

	return parentID, nil
}

// getFilesystemInfo returns information regarding a specific file system entity
func getFilesystemInfo(ctx database.DatabaseContext, docID int) (EntityInfo, error) {
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
func getRootInfo(ctx database.DatabaseContext) (EntityInfo, error) {
	rootID, err := getRootID(ctx)
	if err != nil {
		return EntityInfo{}, err
	}
	info, err := getFilesystemInfo(ctx, rootID)
	return info, err
}

// deleteEntity removes an entity from the filesystem
func deleteEntity(ctx database.DatabaseContext, entityID int) error {
	// Check that we're not deleting an entity with kids or root (this is already enforced in the DB but no exception is thrown)
	// basically if u try and delete root, nothing will happen
	if rootID, err := getRootID(ctx); err != nil || rootID == entityID {
		return errors.New("cannot delete root")
	}

	if numKids, err := getNumChildren(ctx, entityID); err != nil || numKids != 0 {
		return errors.New("cannot delete an entity with kids")
	}

	return ctx.Exec("SELECT delete_entity($1)", []interface{}{entityID})
}

// renameEntity changes the logical name of a given object in the filesystem
func renameEntity(ctx database.DatabaseContext, entityID int, newName string) error {
	return ctx.Exec("UPDATE filesystem SET logicalname = ($1) WHERE entityid = ($2)", []interface{}{newName, entityID})
}

// getNumChildren is a small method to determine how many kids an entity has
func getNumChildren(ctx database.DatabaseContext, entityID int) (int, error) {
	children := pgtype.Hstore{}

	err := ctx.Query("SELECT children FROM filesystem WHERE entityid = $1", []interface{}{entityID}, &children)
	if err != nil {
		return 0, errors.New("failed to read from database")
	}

	return len(children.Map), nil
}

// getFilesystemChildren returns the list of children for a file system entity
func getEntityChildren(ctx database.DatabaseContext, docID int) ([]EntityInfo, error) {
	children := pgtype.Hstore{}

	err := ctx.Query("SELECT children FROM filesystem WHERE entityid = $1", []interface{}{docID}, &children)
	if err != nil {
		return nil, errors.New("failed to read from database")
	}

	list := []EntityInfo{}

	for k := range children.Map {
		id, _ := strconv.Atoi(k)
		info, _ := getFilesystemInfo(ctx, id)
		list = append(list, info)
	}

	return list, nil
}
