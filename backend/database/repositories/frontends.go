package repositories

import (
	"fmt"

	"github.com/google/uuid"
)

type frontendsRepository struct {
	embeddedContext
}

const InvalidFrontend = -1

func NewFrontendRepo(logicalName string, URL string, embeddedContext embeddedContext) (filesystemRepository, error) {
	rows, err := embeddedContext.ctx.QueryRow("SELECT * from new_frontend($1, $2)", []interface{}{logicalName, URL})
	if err != nil {
		return filesystemRepository{}, fmt.Errorf("Error setting up frontend in Postgres (new_frontend): %w", err)
	}

	defer rows.Close()

	var frontendID uuid.UUID
	var frontendRoot uuid.UUID

	if rows.Next() {
		err := rows.Scan(&frontendID, &frontendRoot)
		if err != nil {
			return filesystemRepository{}, fmt.Errorf("Error scanning columns within new_frontend: %w", err)
		}
	}

	return filesystemRepository{
		frontendID,
		frontendRoot,
		logicalName,
		URL,
		embeddedContext,
	}, nil
}

// GetFrontendFromURL is the implementation of the frontend repository for frontendRepository
func (rep frontendsRepository) GetFrontendFromURL(url string) int {
	var frontendId int
	err := rep.ctx.Query("SELECT ID from frontend where URL = $1;", []interface{}{url}, &frontendId)
	if err != nil {
		return InvalidFrontend
	}

	return frontendId
}
