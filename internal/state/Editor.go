package diffsync

import (
	"github.com/google/uuid"
	"github.com/gorilla/websocket"
)

// Defines a connected client as well as the data required
// for diffsync. Note: On refers to the document the editor is attached to
type EditSession struct {
	Shadow       string
	BackupShadow string
	On           *Document

	Socket *websocket.Conn
	ID     uuid.UUID
}

// creates a new editor for a target document
func newEditorOn(on *Document, socket *websocket.Conn) *EditSession {
	return &EditSession{
		Shadow:       "",
		BackupShadow: "",
		Socket:       socket,
		ID:           uuid.New(),
		On:           on,
	}
}

func (session *EditSession) Write(message []byte) {
	session.On.Sync <- message
}
