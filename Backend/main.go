package main

import (
	auth "DiffSync/internal/auth"
	service "DiffSync/internal/service"
	"log"
	"net/http"
)

func main() {
	http.HandleFunc("/edit", service.EditEndpoint)
	http.HandleFunc("/preview", service.PreviewHTTPHandler)
	http.HandleFunc("/getallusers", auth.GetAllUsers)
	http.HandleFunc("/login", auth.LoginHandler)
	http.Handle("/", http.FileServer(http.Dir("./html")))
	log.Fatal(http.ListenAndServe(":8080", nil))
}
