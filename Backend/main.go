package main

import (
	"cms.csesoc.unsw.edu.au/editor"
	"cms.csesoc.unsw.edu.au/endpoints"
	"cms.csesoc.unsw.edu.au/environment"

	"log"
	"net/http"

	"github.com/rs/cors"
)

func main() {
	mux := http.NewServeMux()

	mux.HandleFunc("/filesystem/info", endpoints.GetEntityInfo)
	mux.HandleFunc("/filesystem/create", endpoints.CreateNewEntity)
	mux.HandleFunc("/filesystem/delete", endpoints.DeleteFilesystemEntity)
	mux.HandleFunc("/filesystem/rename", endpoints.RenameFilesystemEntity)
	mux.HandleFunc("/filesystem/children", endpoints.GetChildren)
	mux.HandleFunc("/login", endpoints.LoginHandler)
	mux.HandleFunc("/logout", endpoints.LogoutHandler)
	mux.Handle("/", http.FileServer(http.Dir("./editor/html")))

	// editor handler
	mux.HandleFunc("/edit", editor.EditEndpoint)

	// whitelisted URLs
	var frontend_URI = environment.GetFrontendURI()

	// CORS middleware added
	c := cors.New(cors.Options{
		// for testing purposes
		AllowedOrigins:   []string{frontend_URI},
		AllowedMethods:   []string{http.MethodGet, http.MethodPost},
		AllowCredentials: true,
	})
	handler := cors.Default().Handler(mux)
	handler = c.Handler(handler)

	log.Fatal(http.ListenAndServe(":8080", handler))
}
