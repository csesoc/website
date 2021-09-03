package main

import (
	service "DiffSync/internal/service"
	"database/sql"
	"log"
	"net/http"

	_ "github.com/lib/pq"
)

type Person struct {
	ID    int
	name  string
	first string
	pass  string
}

func main() {
	http.HandleFunc("/edit", service.EditEndpoint)
	http.HandleFunc("/preview", service.PreviewHTTPHandler)
	http.HandleFunc("/test", func(w http.ResponseWriter, r *http.Request) {
		// host = db -> because it depends on db in docker-compose file
		connStr := "host=db port=5432 user=postgres password=postgres dbname=test_db sslmode=disable"
		db, err := sql.Open("postgres", connStr)
		if err != nil {
			log.Fatal(err)
		}

		// ping database
		rows, _ := db.Query("SELECT * from person;")
		log.Println("HALJSDLAJ")
		list := []Person{}

		for rows.Next() {
			item := Person{}
			rows.Scan(&item.ID, &item.name, &item.first, &item.pass)
			list = append(list, item)
		}

		log.Println(list)

	})
	http.Handle("/", http.FileServer(http.Dir("./html")))
	log.Fatal(http.ListenAndServe(":8080", nil))
}
