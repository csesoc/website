package diffsyncService

// Internal package that defines basic web socket methods :)
// the package includes the main websocket entry listening method

import (
	diffsync "DiffSync/internal/state"
	"log"
	"net/http"

	"github.com/gorilla/websocket"
)

var docManager = NewDocumentManager()
var Upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

// http endpoint for handling requests to start editing a document
func EditEndpoint(w http.ResponseWriter, r *http.Request) {
	requestedDocument, ok := r.URL.Query()["document"]
	if !ok || len(requestedDocument[0]) < 1 {
		w.WriteHeader(400)
		return
	}

	ws, err := Upgrader.Upgrade(w, r, nil)
	editSession := docManager.CreateEditSession(ws, requestedDocument[0])
	if err != nil {
		log.Println(err)
	}

	Listen(ws, editSession)
}

// Listen is the main websocket method, just constantly spins
// in a loop waiting for something cool to happen
func Listen(conn *websocket.Conn, editorSession *diffsync.EditSession) {
	for {
		// Note that: conn.ReadMessage() BLOCKS the goroutine while we wait for a message
		_, p, err := conn.ReadMessage()
		if err != nil {
			docManager.CloseEditSession(editorSession)
			return
		}

		// perform diff + patch + sync operations
		editorSession.Write(p)
	}
}
