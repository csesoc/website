package editor

import (
	"errors"
	"net/http"
	"strconv"

	"github.com/google/uuid"
	"github.com/gorilla/websocket"
)

// This file just defines some of the endpoints for the editor
// and ties together its various disparate components
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

	defer manager.closeDocumentServer(requestedDocument)
	file, err := fs.GetFromVolume(strconv.Itoa(requestedDocument))
	if err != nil {
		terminateWs(ws, "error")
		return errors.New("Unable to open request document")
	}

	wsClient := newClient(ws)
	targetServer := GetDocumentServerFactoryInstance().FetchDocumentServer(uuid.MustParse(requestedDocument[0]))
	commPipe, terminatePipe := targetServer.connectClient(wsClient)

	go wsClient.run(commPipe, terminatePipe)
}
