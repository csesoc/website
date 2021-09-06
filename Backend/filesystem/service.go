package filesystem

import (
	"DiffSync/database"
	"context"
	"errors"
)

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
	var parentID int
	err := pool.GetConn().QueryRow(context.Background(), "SELECT EntityID FROM filesystem WHERE parent IS NULL").Scan(&parentID)
	if err != nil {
		return 0, errors.New("failed to create a new DB entry")
	}

	id, err := createFilesystemEntity(pool, parentID, logicalName, ownerGroup, isDocument)

	return id, err
}
