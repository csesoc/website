package repositories

import "github.com/google/uuid"

type frontendsRepository struct {
	embeddedContext
}

var InvalidFrontend = uuid.Nil

// GetFrontendFromURL is the implementation of the frontend repository for frontendRepository
func (rep frontendsRepository) GetFrontendFromURL(url string) (uuid.UUID, error) {
	var frontendId uuid.UUID
	err := rep.ctx.Query("SELECT FrontendID from frontend where FrontendUrl = $1;", []interface{}{url}, &frontendId)
	if err != nil {
		return InvalidFrontend, err
	}

	return frontendId, nil
}

// Get FrontendID (uuid) with logical name
func (rep frontendsRepository) GetIDWithName(name string) (uuid.UUID, error) {
	var frontendId uuid.UUID
	err := rep.ctx.Query("SELECT FrontendID from frontend where FrontendLogicalName = $1;", []interface{}{name}, &frontendId)
	if err != nil {
		return InvalidFrontend, err
	}
	return frontendId, nil
}
