package diffsyncService

import (
	state "DiffSync/internal/state"
	"reflect"

	"github.com/gorilla/websocket"
)

// This package manages all the currently opened documents within the server
// its responsible for opening files, reading into memory and spinning up a document edit session
// also responsible for closing document edit sessions

type DocumentManager struct {
	openDocuments *ConcurrentMap
	// pls no get mad at me
	extensionsToLoad []reflect.Type
}

func NewDocumentManager() *DocumentManager {
	return &DocumentManager{
		openDocuments: NewConcurrentMap(),
		// extension to load in when we create a document
		extensionsToLoad: []reflect.Type{
			reflect.TypeOf(Previewer{})},
	}
}

// OpenDocument opens a document and reads it into memory
func (manager *DocumentManager) OpenDocument(documentID string) *state.Document {
	if _, ok := manager.openDocuments.Read(documentID); !ok {
		// create a new document since it doesnt exist, also loads in required extensions
		document := state.NewDocument(documentID, manager.extensionsToLoad)
		manager.openDocuments.Write(document.DocID, document)

		// finally load all the extension we want into the document
		for _, extensionType := range docManager.extensionsToLoad {
			// TODO: change this to something a bit cleaner
			switch extensionType {
			case reflect.TypeOf(Previewer{}):
				newPreviewer := new(Previewer)
				newPreviewer.Construct(state.NewEditorOn(document, nil))

				document.LoadAndStartExtension(newPreviewer)

				break
			default:
				continue
			}

		}

		// spin it up to accept changes
		go document.Spin()
	}

	doc, _ := manager.openDocuments.Read(documentID)
	return doc
}

// Closes a document, leaving alll resources to be freed :)
func (manager *DocumentManager) CloseDocument(doc *state.Document) {
	manager.openDocuments.Delete(doc.DocID)
}

// CreateEditSession just adds a new editor to the document requested
// takes the websocket connection of the editor and creates a document instance
// if one does not already exist, returns the editors internal ID
func (manager *DocumentManager) CreateEditSession(conn *websocket.Conn, requestedDocument string) *state.EditSession {
	doc := manager.OpenDocument(requestedDocument)
	editor := state.NewEditorOn(doc, conn)
	doc.JoinDocument <- editor
	return editor
}

// CloseEditSession disconnects an editor from an associated document
func (manager *DocumentManager) CloseEditSession(editor *state.EditSession) {
	// after deletion the number of editors will be zero, marking it for deletion
	// i'm sorry this is awfully hacky, its before the deletion to deal with a race
	// condition
	if len(editor.On.Editors) == 1 {
		manager.CloseDocument(editor.On)
	}

	editor.On.LeaveDocument <- editor
	editor.On = nil
}
