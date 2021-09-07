package main

import (
	"DiffSync/filesystem"
	auth "DiffSync/internal/auth"
	service "DiffSync/internal/service"
	"log"
	"net/http"
)

func main() {
	http.HandleFunc("/edit", service.EditEndpoint)
	http.HandleFunc("/preview", service.PreviewHTTPHandler)
	http.HandleFunc("/filesystem/info", filesystem.GetEntityInfo)
	http.HandleFunc("/filesystem/info/root", filesystem.GetEntityInfo)
	http.HandleFunc("/filesystem/create", filesystem.CreateNewEntity)
	http.HandleFunc("/login", auth.LoginHandler)
	http.Handle("/", http.FileServer(http.Dir("./html")))
	log.Fatal(http.ListenAndServe(":8080", nil))
}
