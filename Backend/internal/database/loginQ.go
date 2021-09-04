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
	"errors"
	"log"

	_ "github.com/lib/pq"
)

var connStr string = "host=db port=5432 user=postgres password=postgres dbname=test_db sslmode=disable"

func GetCredentials(email string) (string, error) {
	// not sure if this is necessary, might create a global struct which
	// opens a connection and leaves it open????
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal(err)
	}

	// not sure if this is safe
	rows, err := db.Query("SELECT password from person where email = $1;", email)
	if err != nil {
		log.Fatal(err)
	}

	// declaring string array
	var results []string

	for rows.Next() {
		var item string
		rows.Scan(&item)
		results = append(results, item)
	}

	// handles case: if email isnt in database
	if len(results) == 0 {
		// using same error message to give more protection
		// against error based brute force attacks against username then password
		return "", errors.New("invalid credentials")
	} else if len(results) > 1 { // handles case: if there is more than 1 email returned
		return "", errors.New("!!!!HACKERMAN ALERT!!!!there happens to be a duplicate email ")
	}

	return results[0], nil

}
