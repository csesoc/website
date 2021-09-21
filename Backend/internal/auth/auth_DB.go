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
	"DiffSync/database"
	"context"
	"log"

	_ "github.com/lib/pq"
)

var httpDbPool database.Pool

func init() {
	var err error
	httpDbPool, err = database.NewPool(database.Config{
		HostAndPort: "db:5432",
		User:        "postgres",
		Password:    "postgres",
		Database:    "test_db",
	})

	if err != nil {
		log.Println(err.Error())
	}
}

func CredentialsMatch(email string, password string) int {
	// not sure if this is safe
	var result int
	err := httpDbPool.GetConn().QueryRow(context.Background(), "SELECT count(*) from person where email = $1 and password = $2;", email, password).Scan(&result)
	if err != nil {
		log.Println("credentials match err", err.Error())
	}

	return result
}

func getPermissions(groupname string) int {
	var result int
	err := httpDbPool.GetConn().QueryRow(context.Background(), "SELECT permission from groups where name = $1;", groupname).Scan(&result)
	if err != nil {
		log.Print("get permissions error", err.Error())
	}
	return result
}
