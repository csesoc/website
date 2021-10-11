package auth

import (
	_config "DiffSync/config"
	"DiffSync/database"
	"log"
)

var httpDbPool database.Pool

// declaring frontend uri to use throughout the package
var FRONTEND_URI = _config.GetFrontendURI()

var PG_USER = _config.GetDBUser()
var PG_PASSWORD = _config.GetDBPassword()
var PG_DB = _config.GetDB()

// might need to include environment for hostandport later
// but might not be worth it since the port is manually mapped
// at this point in time anyways
func init() {
	var err error

	httpDbPool, err = database.NewPool(database.Config{
		HostAndPort: "db:5432",
		User:        PG_USER,
		Password:    PG_PASSWORD,
		Database:    PG_DB,
	})

	if err != nil {
		log.Println(err.Error())
	}
}
