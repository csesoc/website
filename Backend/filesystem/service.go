package filesystem

import (
	"DiffSync/database"
	"context"
	"errors"

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
func createFilesystemEntity(pool database.Pool, parent int, logicalName string, ownerGroup int, isDocument bool) (int, error) {
	// pool is thread safe so its calm
	var newID int
	err := pool.GetConn().QueryRow(context.Background(), "SELECT new_entity($1, $2, $3, $4)", parent, logicalName, ownerGroup, isDocument).Scan(&newID)
	if err != nil {
		return 0, errors.New("failed to create a new DB entry")
	}

	return newID, nil
}

// createFilesystemEntityAtRoot creates a new entity with root as its parent
func createFilesystemEntityAtRoot(pool database.Pool, logicalName string, ownerGroup int, isDocument bool) (int, error) {
	// pool is thread safe so its calm
	root, err := getRootID(pool)
	if err != nil {
		return 0, err
	}

	id, err := createFilesystemEntity(pool, root, logicalName, ownerGroup, isDocument)

	return id, err
}

// getRootID returns the id of the root directory
func getRootID(pool database.Pool) (int, error) {
	// pool is thread safe so its calm
	var parentID int
	err := pool.GetConn().QueryRow(context.Background(), "SELECT EntityID FROM filesystem WHERE parent IS NULL").Scan(&parentID)
	if err != nil {
		return 0, errors.New("failed to find root id")
	}

	return parentID, nil
}

// getFilesystemInfo returns information regarding a specific file system entity
func getFilesystemInfo(pool database.Pool, docID int) (EntityInfo, error) {
	entity := EntityInfo{}
	children := pgtype.Hstore{}

	err := pool.GetConn().QueryRow(context.Background(), "SELECT EntityID, LogicalName, IsDocument, Children FROM filesystem WHERE EntityID = $1",
		docID).Scan(&entity.EntityID, &entity.EntityName, &entity.IsDocument, &children)
	if err != nil {
		return EntityInfo{}, errors.New("failed to read from database")
	}

	for k := range children.Map {
		entity.Children = append(entity.Children, k)
	}

	return entity, nil
}

// getRootInfo gets the file information for the root
func getRootInfo(pool database.Pool) (EntityInfo, error) {
	rootID, err := getRootID(pool)
	if err != nil {
		return EntityInfo{}, err
	}
	info, err := getFilesystemInfo(pool, rootID)
	return info, err
}

// deleteEntity removes an entity from the filesystem
func deleteEntity(pool database.Pool, entityID int) error {
	_, err := pool.GetConn().Exec(context.Background(),
		"SELECT delete_entity($1)", entityID)
	return err
}

// renameEntity changes the logical name of a given object in the filesystem
func renameEntity(pool database.Pool, entityID int, newName string) error {
	_, err := pool.GetConn().Exec(context.Background(),
		"UPDATE filesystem SET logicalname = ($1) WHERE entityid = ($2)", newName, entityID)
	return err
}

// getFilesystemInfo returns information regarding a specific file system entity
func getEntityChildren(pool database.Pool, docID int) ([]string, error) {
	children := pgtype.Hstore{}

	err := pool.GetConn().QueryRow(context.Background(), "SELECT children FROM filesystem WHERE entityid = $1",
		docID).Scan(&children)
	if err != nil {
		return nil, errors.New("failed to read from database")
	}

	list := []string{}

	for k := range children.Map {
		list = append(list, k)
	}

	return list, nil
}
