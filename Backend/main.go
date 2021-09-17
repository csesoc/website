package main

import (
	"DiffSync/filesystem"
	auth "DiffSync/internal/auth"
	service "DiffSync/internal/service"
	"log"
	"net/http"

	"github.com/rs/cors"
)

func main() {
	mux := http.NewServeMux()

	mux.HandleFunc("/edit", service.EditEndpoint)
	mux.HandleFunc("/preview", service.PreviewHTTPHandler)
	mux.HandleFunc("/filesystem/info", filesystem.GetEntityInfo)
	mux.HandleFunc("/filesystem/info/root", filesystem.GetEntityInfo)
	mux.HandleFunc("/filesystem/create", filesystem.CreateNewEntity)
	mux.HandleFunc("/filesystem/delete", filesystem.DeleteFilesystemEntity)
	mux.HandleFunc("/filesystem/rename", filesystem.RenameFilesystemEntity)
	mux.HandleFunc("/filesystem/children", filesystem.GetChildren)
	mux.HandleFunc("/login", auth.LoginHandler)
	mux.HandleFunc("/logout", auth.LogoutHandler)
	mux.Handle("/", http.FileServer(http.Dir("./html")))

	// CORS middleware added
	c := cors.New(cors.Options{
		// for testing purposes
		AllowedOrigins:   []string{"localhost:3000"},
		AllowedMethods:   []string{http.MethodGet, http.MethodPost},
		AllowCredentials: true,
	})
	handler := cors.Default().Handler(mux)
	handler = c.Handler(handler)

	log.Fatal(http.ListenAndServe(":8080", handler))
}
