package main

import (
	auth "DiffSync/auth"
	service "DiffSync/internal/service"
	"log"
	"net/http"

	"github.com/rs/cors"
)

func main() {
	mux := http.NewServeMux()

	mux.HandleFunc("/edit", service.EditEndpoint)
	mux.HandleFunc("/preview", service.PreviewHTTPHandler)
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
