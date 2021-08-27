package diffsync

import (
	"DiffSync/internal/filesystem"
	"log"
	"reflect"

	"github.com/google/uuid"
	"github.com/gorilla/websocket"
	"github.com/sergi/go-diff/diffmatchpatch"
)

// Defines what a expected argument for document processing should look like
type Payload struct {
	EditSessionID uuid.UUID
	Diffs         []byte
}

// defines a document editing session
// contains the master text and the connected clients
type Document struct {
	Text             string
	Editors          map[uuid.UUID]*EditSession
	LoadedExtensions []Extension

	DocID string

	// Channels for handling joining and leaving
	JoinDocument  chan *EditSession
	LeaveDocument chan *EditSession

	// Sync client with global state / send out changes to document state
	// Sync chan *Editor
	Sync chan Payload
	// config for diff + fuzzy patcher, this should change later
	dmp *diffmatchpatch.DiffMatchPatch
}

func NewDocument(docID string, extensions []reflect.Type) *Document {
	// determine the text to get
	docText := filesystem.Read(docID, "")
	return &Document{
		Text:             docText,
		Editors:          make(map[uuid.UUID]*EditSession),
		LoadedExtensions: make([]Extension, 0),

		JoinDocument:  make(chan *EditSession),
		LeaveDocument: make(chan *EditSession),
		Sync:          make(chan Payload),
		DocID:         docID,
		dmp:           diffmatchpatch.New(),
	}
}

// LoadExtension is called by document manager, it loads an extension into a document
func (doc *Document) LoadAndStartExtension(extension Extension) {
	doc.LoadedExtensions = append(doc.LoadedExtensions, extension)
	extension.GetEditSession().Shadow = doc.Text
	extension.StartExtension(doc.Text)
}

// attempts the apply a patch to document to both a shadow and server doc
func (document *Document) fuzzyPatch(editor *EditSession, parsedPatches []diffmatchpatch.Patch) {
	newDoc, _ := document.dmp.PatchApply(parsedPatches, document.Text)
	newShadow, _ := document.dmp.PatchApply(parsedPatches, editor.Shadow)

	document.Text = newDoc
	editor.Shadow = newShadow
}

// computes a set of edits for a client shadow and the global document state
func (document *Document) generateEdits(editor *EditSession) (string, bool) {
	diffs := document.dmp.PatchMake(editor.Shadow, document.Text)
	editor.Shadow = document.Text
	return document.dmp.PatchToText(diffs), len(diffs) != 0
}

// Spin is just a continuous spin loop waiting for stuff to happen
func (document *Document) Spin() {
	for {
		select {
		case editor := <-document.JoinDocument:
			document.Editors[editor.ID] = editor
			editor.Shadow = document.Text
			editor.Socket.WriteMessage(websocket.TextMessage, []byte(document.Text))

			log.Printf("client %s just joined", editor.ID)
			break

		case editor := <-document.LeaveDocument:
			delete(document.Editors, editor.ID)
			log.Printf("client %s left", editor.ID)

			// if the document now has no active connections just close the spin loop and free the document
			// document will be GC'd
			if len(document.Editors) == 0 {
				log.Println("closing document")
				// stop all the extensions running on this doc
				for _, extension := range document.LoadedExtensions {
					extension.StopExtension()
				}
				return
			}

			break

		case patch := <-document.Sync:
			parsedPatches, _ := document.dmp.PatchFromText(string(patch.Diffs))
			if len(parsedPatches) == 0 {
				continue
			}
			document.fuzzyPatch(document.Editors[patch.EditSessionID], parsedPatches)

			// propogate changes to all connected clients :)
			for _, editor := range document.Editors {
				// take diff between client shadow and server text
				diffs, souldPropogate := document.generateEdits(editor)
				if souldPropogate {
					editor.Socket.WriteMessage(websocket.TextMessage, []byte(diffs))
				}
			}

			// propogate changes to all connected extenions :)
			for _, extension := range document.LoadedExtensions {
				diffs, shouldPropogate := document.generateEdits(extension.GetEditSession())
				if shouldPropogate {
					extension.ApplyPatch(diffs)
				}
			}
			break
		}
	}
}
