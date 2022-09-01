package repositories

type frontendsRepository struct {
	embeddedContext
}

const InvalidFrontend = -1

// GetFrontendFromURL is the implementation of the frontend repository for frontendRepository
func (rep frontendsRepository) GetFrontendFromURL(url string) int {
	var frontendId int
	err := rep.ctx.Query("SELECT FrontendId from frontend where FrontendUrl = $1;", []interface{}{url}, &frontendId)
	if err != nil {
		return InvalidFrontend
	}

	return frontendId
}
