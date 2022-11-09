package main

import (
	"encoding/json"
	"fmt"
	"log"
)

type EventsService struct {
	cache responseCache
}

// FetchEvents reads from the FB API and process the data into a nice clean format
//	to be returned to the user :)
func (service *EventsService) FetchEvents() []byte {
	if service.cache.HasExpired() {
		events, err := GetFBEvents()
		// if theres an error log it and renew the cache
		// keeping the old stale data
		if err != nil {
			log.Printf("Cache refresh service failed, error: %v", err)
			service.cache.Renew()
		} else {
			parsedJson, _ := json.Marshal(events)
			service.cache.RenewWith(parsedJson)
		}

	}

	resp, err := service.cache.Read()
	if err != nil {
		panic(fmt.Errorf(
			"fatal error, cache should not be empty at this point: %w", err,
		))
	}

	return resp
}
