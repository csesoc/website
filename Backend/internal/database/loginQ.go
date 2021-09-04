package database

import (
	"database/sql"
	"log"

	_ "github.com/lib/pq"
)

var connStr string = "host=db port=5432 user=postgres password=postgres dbname=test_db sslmode=disable"

func GetCredentials(email string) string {
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

	// if length of result = 0 return ""
	if len(results) == 0 || len(results) > 1 {
		return ""
	}

	return results[0]

}
