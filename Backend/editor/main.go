package editor

import (
	"log"
	"net/http"

	"github.com/google/uuid"
	"github.com/gorilla/websocket"
)

// This file just defines some of the endpoints for the editor
// and ties togher its various disparate components
var Upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

// Actual edit endpoint
func EditEndpoint(w http.ResponseWriter, r *http.Request) {
	requestedDocument, ok := r.URL.Query()["document"]
	if !ok || len(requestedDocument[0]) < 1 {
		w.WriteHeader(400)
		return
	}

	ws, err := Upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
	}

	wsClient := newClient(ws)
	targetServer := GetServerFactoryInstance().FetchServer(uuid.MustParse(requestedDocument[0]))
	commPipe := targetServer.connectClient(wsClient)

	go wsClient.run(commPipe)
}
