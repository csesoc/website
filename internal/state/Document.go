package diffsync

import (
	"log"

	"github.com/google/uuid"
	"github.com/gorilla/websocket"
)

// defines a document editing session
// contains the master text and the connected clients
type Document struct {
	Text    string
	Editors map[uuid.UUID]*EditSession
	DocID   string

	// Channels for handling joining and leaving
	JoinDocument  chan *EditSession
	LeaveDocument chan *EditSession

	// Sync client with global state / send out changes to document state
	// Sync chan *Editor
	Sync chan []byte
}

func NewDocument(docID string) *Document {
	return &Document{
		Text:    "",
		Editors: make(map[uuid.UUID]*EditSession),

		JoinDocument:  make(chan *EditSession),
		LeaveDocument: make(chan *EditSession),
		Sync:          make(chan []byte),
		DocID:         docID,
	}
}

// Spin is just a continuous spin loop waiting for stuff to happen
func (document *Document) Spin() {
	for {
		select {
		case editor := <-document.JoinDocument:
			document.Editors[editor.ID] = editor
			log.Printf("client %s joined", editor.ID)
			break
		case editor := <-document.LeaveDocument:
			delete(document.Editors, editor.ID)
			log.Printf("client %s left", editor.ID)

			// if the document now has no active connections just close the spin loop and free the document
			// document will be GC'd
			if len(document.Editors) == 0 {
				log.Println("closing document")
				return
			}

			break
		case message := <-document.Sync:
			log.Printf("Sending message: %s", message)
			for _, editor := range document.Editors {
				editor.Socket.WriteMessage(websocket.TextMessage, message)
			}

			break
		}
	}
}
