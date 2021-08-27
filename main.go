package main

import (
	service "DiffSync/internal/service"
	"log"
	"net/http"
)

func main() {
	http.HandleFunc("/edit", service.EditEndpoint)
	http.HandleFunc("/preview", service.PreviewHTTPHandler)
	http.Handle("/", http.FileServer(http.Dir("./html")))
	log.Fatal(http.ListenAndServe(":8080", nil))
}
