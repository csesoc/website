// TITLE: Schema
// Created by (Varun: Varun-Sethu) (09/21)
// Last modified by (Varun: Varun-Sethu) (1/10/21)
// # # #
/*
	File is just a small utility file for fetching the startup script for our databases.
**/
package contexts

import (
	"io/ioutil"
	"path/filepath"

	_ "github.com/lib/pq"
)

// importSchema just loads the startup script stored in Postgres/create_tables.sql
func importSchema() (string, error) {
	// TODO: no.... just no....
	absPath, _ := filepath.Abs("../../../Postgres/create_tables.sql")

	contents, err := ioutil.ReadFile(absPath)
	if err != nil {
		return "", err
	}

	return string(contents), nil
}
