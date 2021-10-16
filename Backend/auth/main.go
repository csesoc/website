package auth

import (
	_config "DiffSync/config"
	"DiffSync/database"
	"DiffSync/environment"
	"log"
)

var httpDbContext database.LiveContext

// declaring frontend uri to use throughout the package
var FRONTEND_URI = _config.GetFrontendURI()

var PG_USER = _config.GetDBUser()
var PG_PASSWORD = _config.GetDBPassword()
var PG_DB = _config.GetDB()

// might need to include environment for hostandport later
// but might not be worth it since the port is manually mapped
// at this point in time anyways
func init() {
	if !environment.IsTestingEnvironment() {
		var err error

		httpDbContext, err = database.NewLiveContext()

		if err != nil {
			log.Println(err.Error())
		}
	}
}
