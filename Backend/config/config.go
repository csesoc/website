package config

import (
	"os"
)

func GetFrontendURI() string {
	env := os.Getenv("FRONTEND_URI")
	return env
}
