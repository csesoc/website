package repositories

import "log"

type frontendsRepository struct {
	embeddedContext
}

// GetFrontendFromURL is the implementation of the frontend repository for frontendRepository
func (rep frontendsRepository) GetFrontendFromURL(url string) int {
	err := rep.embeddedContext.ctx.Query("SELECT frontendid from frontend where frontendurl = $1;", []interface{}{r.URL.Path}, &frontendid)
	if err != nil {
		log.Println("frontend doesn't exist", err.Error())
	}
}
