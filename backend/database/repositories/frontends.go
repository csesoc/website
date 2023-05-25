package repositories

import "github.com/google/uuid"

type frontendsRepository struct {
	embeddedContext
}

const InvalidFrontend = -1

func NewFrontendRepo(frontEndID uuid.UUID, logicalName string, URL string, embeddedContext embeddedContext) (filesystemRepository, error) {
	err := embeddedContext.ctx.Query("SELECT new_frontend($1, $2, $3)", []interface{}{frontEndID, logicalName, URL})
	if err != nil {
		return filesystemRepository{}, err
	}
	return filesystemRepository{
		frontEndID,
		logicalName,
		URL,
		embeddedContext,
	}, nil
}

// GetFrontendFromURL is the implementation of the frontend repository for frontendRepository
func (rep frontendsRepository) GetFrontendFromURL(url string) int {
	var frontendId int
	err := rep.ctx.Query("SELECT FrontendId from frontend where FrontendUrl = $1;", []interface{}{url}, &frontendId)
	if err != nil {
		return InvalidFrontend
	}

	return frontendId
}
