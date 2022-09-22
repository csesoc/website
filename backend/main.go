package main

import (
	"log"
	"net/http"

	"cms.csesoc.unsw.edu.au/endpoints"
	"cms.csesoc.unsw.edu.au/environment"

	"github.com/rs/cors"
)

func main() {
	mux := http.NewServeMux()

	endpoints.RegisterFilesystemEndpoints(mux)
	endpoints.RegisterAuthenticationEndpoints(mux)
	endpoints.RegisterEditorEndpoints(mux)

	// whitelisted URLs
	frontend_URI := environment.GetFrontendURI()

	// CORS middleware added
	c := cors.New(cors.Options{
		// for testing purposes
		AllowedOrigins:   []string{frontend_URI},
		AllowedMethods:   []string{http.MethodGet, http.MethodPost},
		AllowCredentials: true,
	})
	handler := cors.Default().Handler(mux)
	handler = c.Handler(handler)

	log.Print("CMS Go backend starting on port :8080 :D.")
	log.Print("Amongus.")
	log.Fatal(http.ListenAndServe(":8080", handler))
}
