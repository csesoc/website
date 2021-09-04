package auth

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	_ "github.com/lib/pq"
)

type Person struct {
	Id    int    `json:"id"`
	Name  string `json:"name"`
	First string `json: "first"`
	Pass  string `json: "pass"`
}

type People []Person

// this function is just to get familiar with the code and have some example postgres handling code
func GetAllUsers(w http.ResponseWriter, r *http.Request) {
	// host = db -> because it depends on db in docker-compose file
	connStr := "host=db port=5432 user=postgres password=postgres dbname=test_db sslmode=disable"
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal(err)
	}

	// query
	rows, _ := db.Query("SELECT * from person;")

	var peopleList People
	// put sql query into json
	for rows.Next() {
		item := Person{}
		// log.Print(rows)
		rows.Scan(&item.Id, &item.Name, &item.First, &item.Pass)
		peopleList = append(peopleList, item)
	}

	json, _ := (json.Marshal(peopleList))
	//log.Println(string(out))

	w.Header().Set("content-type", "application/json")

	// print to body
	fmt.Fprintf(w, string(json))

}
