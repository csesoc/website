package main

import (
	config "DiffSync/config"
	"DiffSync/database"
	"DiffSync/filesystem"
	auth "DiffSync/internal/auth"
	service "DiffSync/internal/service"
	"log"
	"net/http"

	"github.com/rs/cors"
)

func init() {
	// config validator
	var err error
	_, err = database.NewPool(database.Config{
		HostAndPort: "db:5432",
		User:        config.GetDBUser(),
		Password:    config.GetDBPassword(),
		Database:    config.GetDB(),
	})

	if err != nil {
		log.Fatal("Configurations are invalid check ENV variables", err.Error())
	}
}

func main() {
	mux := http.NewServeMux()

	mux.HandleFunc("/edit", service.EditEndpoint)
	mux.HandleFunc("/preview", service.PreviewHTTPHandler)
	mux.HandleFunc("/filesystem/info", filesystem.GetEntityInfo)
	mux.HandleFunc("/filesystem/info/root", filesystem.GetEntityInfo)
	mux.HandleFunc("/filesystem/create", filesystem.CreateNewEntity)
	mux.HandleFunc("/filesystem/delete", filesystem.DeleteFilesystemEntity)
	mux.HandleFunc("/login", auth.LoginHandler)
	mux.HandleFunc("/logout", auth.LogoutHandler)
	mux.Handle("/", http.FileServer(http.Dir("./html")))

	// whitelisted URLs
	var frontend_URI = config.GetFrontendURI()

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
