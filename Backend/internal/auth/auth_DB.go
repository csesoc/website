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

/*
 * queries the database for user
 * @params email
 * @params password
 */
func CredentialsMatch(email string, password string) int {
	// not sure if this is safe yet
	var result int
	err := httpDbPool.GetConn().QueryRow(context.Background(), "SELECT count(*) from person where email = $1 and password = $2;", email, password).Scan(&result)
	if err != nil {
		log.Println("credentials match err", err.Error())
	}

	return result
}

/*
 * returns the permissions from database
 * @returns
 */
func getPermissions(groupname string) string {
	var result string
	err := httpDbPool.GetConn().QueryRow(context.Background(), "SELECT permission from groups where name = $1;", groupname).Scan(&result)
	if err != nil {
		log.Print("get permissions error", err.Error())
	}
	return result
}

// TODO implement function in which checks whether or not the user's group is above the permission level of the task
