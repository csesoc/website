package main

import (
	"fmt"
	"log"
	"net/http"
	"sync"
	"time"
)

func main() {
	eventService := EventsService{
		cache: responseCache{
			cacheLock:  sync.RWMutex{},
			expiryTime: time.Now(),
		},
	}

	http.HandleFunc("/events-api/v1/get-all", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprint(w, string(eventService.FetchEvents()))
	})

	// listen to port
	err := http.ListenAndServe(":8080", nil)
	if err != nil {
		log.Fatal(
			fmt.Errorf("failed to start server: %w", err))
	}
}
