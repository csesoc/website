package database

import (
	"io/ioutil"
	"path/filepath"

	_ "github.com/lib/pq"
)

// importSchema just loads the startup script stored in Postgres/create_tables.sql
func importSchema() (string, error) {
	absPath, _ := filepath.Abs("../../Postgres/create_tables.sql")

	contents, err := ioutil.ReadFile(absPath)
	if err != nil {
		return "", err
	}

	return string(contents), nil
}
