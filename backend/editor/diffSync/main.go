package editor

import (
	"log"
	"net/http"

	"cms.csesoc.unsw.edu.au/editor/diffSync/service"
	"github.com/google/uuid"
	"github.com/gorilla/websocket"
)

// This file just defines some of the endpoints for the editor
// and ties togher its various disparate components
var broker = service.NewBroker()

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
	var err error
	var ws *websocket.Conn
	ws, err = Upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
	}

	var documentID uuid.UUID
	documentID, err = uuid.Parse(requestedDocument[0])
	if err == nil {
		err = broker.ConnectOrOpenDocument(documentID, ws)
	}
	if err != nil {
		log.Println(err)
		ws.Close()
	}
}
