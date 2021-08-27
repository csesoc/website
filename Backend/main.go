package main

import (
	websocket "DiffSync/internal/websocket"
	"log"
	"net/http"
)

func main() {
	http.HandleFunc("/edit", websocket.EditEndpoint)
	http.Handle("/", http.FileServer(http.Dir("./html")))
	log.Fatal(http.ListenAndServe(":8080", nil))
}
