package main

import (
	"net/http"

	"cms.csesoc.unsw.edu.au/internal/service"
)

func main() {
	mux := http.NewServeMux()
	service.LoadClientExtensionEndpoints(mux)
	http.ListenAndServe(":8080", mux)
}
