package diffsync

import (
	"github.com/gorilla/websocket"
)

// This package manages all the currently opened documents within the server
// its responsible for opening files, reading into memory and spinning up a document edit session
// also responsible for closing document edit sessions

type DocumentManager struct {
	openDocuments *ConcurrentMap
}

func NewDocumentManager() *DocumentManager {
	return &DocumentManager{
		openDocuments: NewConcurrentMap(),
	}
}

// OpenDocument opens a document and reads it into memory
func (manager *DocumentManager) OpenDocument(documentID string) *Document {
	if _, ok := manager.openDocuments.Read(documentID); !ok {
		// create a new document since it doesnt exist
		document := NewDocument(documentID)
		manager.openDocuments.Write(document.DocID, document)
		// spin it up to accept changes
		go document.Spin()
	}

	doc, _ := manager.openDocuments.Read(documentID)
	return doc
}

// Closes a document, leaving alll resources to be freed :)
func (manager *DocumentManager) CloseDocument(doc *Document) {
	manager.openDocuments.Delete(doc.DocID)
}

// CreateEditSession just adds a new editor to the document requested
// takes the websocket connection of the editor and creates a document instance
// if one does not already exist, returns the editors internal ID
func (manager *DocumentManager) CreateEditSession(conn *websocket.Conn, requestedDocument string) *EditSession {
	doc := manager.OpenDocument(requestedDocument)
	editor := newEditorOn(doc, conn)
	doc.JoinDocument <- editor
	return editor
}

// CloseEditSession disconnects an editor from an associated document
func (manager *DocumentManager) CloseEditSession(editor *EditSession) {
	// after deletion the number of editors will be zero, marking it for deletion
	// i'm sorry this is awfully hacky, its before the deletion to deal with a race
	// condition
	if len(editor.On.Editors) == 1 {
		manager.CloseDocument(editor.On)
	}

	editor.On.LeaveDocument <- editor
	editor.On = nil
}
