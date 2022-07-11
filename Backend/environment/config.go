package environment

import (
	"os"
)

func GetFrontendURI() string {
	return os.Getenv("FRONTEND_URI")
}

func GetDBUser() string {
	return os.Getenv("POSTGRES_USER")
}

func GetDBHost() string {
	return os.Getenv("POSTGRES_HOST")
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
