// TITLE: Login functions
// Created by (Jacky: FafnirZ) (09/21)
// Last modified by (Jacky: FafnirZ)(04/09/21)
// # # #
/*
This module handles the database query and parsing of data for the login functions
as well as some error handling
**/
package auth

import (
	"context"
	"log"

	_ "github.com/lib/pq"
)

func CredentialsMatch(email string, password string) int {
	// not sure if this is safe
	var result int
	err := httpDbPool.GetConn().QueryRow(context.Background(), "SELECT count(*) from person where email = $1 and password = $2;", email, password).Scan(&result)
	if err != nil {
		log.Fatal(err)
	}

	return result
}
