package main

// Mostly copied from: https://github.com/csesoc/csesoc.unsw.edu.au/blob/dev/backend/server/events/events.go

import (
	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"time"
)

type (
	FbResponse struct {
		Data  []FbRespEvent `json:"data"`
		Error FbRespError   `json:"error"`
	}

	// FbRespEvent - struct to unmarshal event specifics
	FbRespEvent struct {
		Description string      `json:"description"`
		Name        string      `json:"name"`
		Start       string      `json:"start_time"`
		End         string      `json:"end_time"`
		ID          string      `json:"id"`
		Place       FbRespPlace `json:"place"`
		IsCancelled bool        `json:"is_cancelled"`
		IsOnline    bool        `json:"is_online"`
		Cover       FbRespCover `json:"cover"`
	}

	// FbRespError - struct to unmarshal any error response
	FbRespError struct {
		ErrorType int    `json:"type"`
		Message   string `json:"message"`
	}

	// FbRespCover - struct to unmarshal the URI of the cover image
	FbRespCover struct {
		CoverURI string `json:"source"`
	}

	// FbRespPlace - event location can come with added information, so we only take the name
	FbRespPlace struct {
		Name string `json:"name"`
	}

	// MarshalledEvents - struct to pack up events with the last update time to be marshalled.
	MarshalledEvents struct {
		LastUpdate int64   `json:"updated"`
		Events     []Event `json:"events"`
	}

	// Event - struct to store an individual event with all the info we want
	Event struct {
		Name        string `json:"name"`
		Description string `json:"description"`
		Start       string `json:"start_time"`
		End         string `json:"end_time"`
		ID          string `json:"fb_event_id"`
		Place       string `json:"place"`
		CoverURL    string `json:"fb_cover_img"`
	}
)

const (
	FBEventPath    = "/csesoc/events"
	FBGraphAPIPath = "https://graph.facebook.com/v15.0"
)

var FBAccessToken = os.Getenv("FB_TOKEN")

// fetchEvents just fetches directly from the FB api, much of this code is bonked from the old website
//	i wish go had monads :(
func queryFbApi() (FbResponse, error) {
	eventsReq, err := http.Get(
		fmt.Sprintf(
			"%s%s?access_token=%s&since=%d",
			FBGraphAPIPath, FBEventPath, FBAccessToken, time.Now().Unix(),
		),
	)
	if err != nil {
		return FbResponse{}, fmt.Errorf("there was an error fetching events from FB: %w", err)
	}

	defer eventsReq.Body.Close()
	if eventsReq.StatusCode != http.StatusOK {
		return FbResponse{}, fmt.Errorf("facebook api returned a http status: %d", eventsReq.StatusCode)
	}

	unparsedEvents, readErr := ioutil.ReadAll(eventsReq.Body)
	if readErr != nil {
		return FbResponse{}, fmt.Errorf("failed to read response body %w", readErr)
	}

	var apiResp FbResponse
	json.Unmarshal(unparsedEvents, &apiResp)
	if (apiResp.Error != FbRespError{}) {
		return FbResponse{}, errors.New("facebook api returned an error")
	}

	return apiResp, nil
}

// parseFbResponse takes a raw fb API response and converts it into a sequence of events
func parseFbResponse(resp FbResponse) []Event {
	events := []Event{}

	for _, event := range resp.Data {
		if !event.IsCancelled {
			parsedEvent := Event{
				Name: event.Name, Description: event.Description,
				Start: event.Start, End: event.End,
				ID: event.ID, Place: event.Place.Name,
				CoverURL: event.Cover.CoverURI,
			}

			if event.IsOnline {
				parsedEvent.Place = "Online"
			}

			events = append(events, parsedEvent)
		}
	}

	return events
}

// GetFBEvents returns a sequence of all CSESoc events
func GetFBEvents() ([]Event, error) {
	if rawFbData, err := queryFbApi(); err != nil {
		return parseFbResponse(rawFbData), nil
	} else {
		return nil, err
	}
}
