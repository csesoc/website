// TITLE: Login functions
// Created by (Jacky: FafnirZ) (09/21)
// Last modified by (Jacky: FafnirZ)(04/09/21)
// # # #
/*
This module handles the database query and parsing of data for the login functions
as well as some error handling
**/
package database

import (
	"database/sql"
	"log"

	_ "github.com/lib/pq"
)

var connStr string = "host=db port=5432 user=postgres password=postgres dbname=test_db sslmode=disable"

func CredentialsMatch(email string, password string) int {
	// not sure if this is necessary, might create a global struct which
	// opens a connection and leaves it open????
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal(err)
	}
	// not sure if this is safe
	rows, err := db.Query("SELECT count(*) from person where email = $1 and password = $2;", email, password)
	if err != nil {
		log.Fatal(err)
	}

	var result int
	// there is only 1 row which will be returned
	for rows.Next() {
		rows.Scan(&result)
	}

	return result

}
