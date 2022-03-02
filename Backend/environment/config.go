package environment

import (
	"os"
)

func GetFrontendURI() string {
	return os.Getenv("FRONTEND_URI")
}

// having a hard time dealing with environment variable injection
// into the docker container
// so hard coding it
func GetDBUser() string {
	return os.Getenv("POSTGRES_USER")
}

func GetDBPassword() string {
	return os.Getenv("POSTGRES_PASSWORD")
}

func GetDB() string {
	return os.Getenv("POSTGRES_DB")
}

func GetDBPort() string {
	return os.Getenv("PG_PORT")
}
