package main

import (
	"cms.csesoc.unsw.edu.au/endpoints"
	"cms.csesoc.unsw.edu.au/environment"

	"log"
	"net/http"

	"github.com/rs/cors"
)

func main() {
	mux := http.NewServeMux()

	endpoints.RegisterFilesystemEndpoints(mux)
	endpoints.RegisterAuthenticationEndpoints(mux)
	endpoints.RegisterEditorEndpoints(mux)

	mux.Handle("/", http.FileServer(http.Dir("./editor/html")))

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
