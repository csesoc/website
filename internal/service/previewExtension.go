package diffsyncService

import (
	diffsync "DiffSync/internal/state"
	"fmt"
	"html"
	"net/http"

	"github.com/sergi/go-diff/diffmatchpatch"
)

// Package defines and implements the live preview service for real time preview of the content
// the service works on the basis of acting as a editsession client to the document, like other clients
// it recieves realtime updates
const PREVIEW_EXTENSION_NAME string = "extension.previewer"

// defines the internal state for a previwer
type Previewer struct {
	// documentHook is the client attched to the document edit session
	documentHook  *diffsync.EditSession
	previewText   string
	previewShadow string

	// exposed functionality
	sync chan string
	stop chan bool

	// config for diff + fuzzy patcher, this should change later
	dmp *diffmatchpatch.DiffMatchPatch
}

// implementation of the Extension interface
func (previewer *Previewer) Construct(hook *diffsync.EditSession) {
	previewer.documentHook = hook

	previewer.sync = make(chan string)
	previewer.stop = make(chan bool)
	previewer.dmp = diffmatchpatch.New()
}

func (previewer *Previewer) StartExtension(documentState string) {
	previewer.previewText = documentState
	previewer.previewShadow = documentState
	go previewer.Spin()
}

func (previwer *Previewer) GetExtensionName() string {
	return PREVIEW_EXTENSION_NAME
}

func (previwer *Previewer) StopExtension() {
	previwer.stop <- true
}

func (previewer *Previewer) ApplyPatch(patches string) {
	previewer.sync <- patches
}

func (previwer *Previewer) GetEditSession() *diffsync.EditSession {
	return previwer.documentHook
}

// spinning loop of death that handles document sychronisation + diff propogation
// basically just an event loop implementing the client side of differential synchronisation
func (previewer *Previewer) Spin() {
	for {
		select {
		case patches := <-previewer.sync:
			parsedPatches, _ := previewer.dmp.PatchFromText(patches)

			if len(parsedPatches) == 0 {
				continue
			}
			// fuzy patch our patches in
			newClient, _ := previewer.dmp.PatchApply(parsedPatches, previewer.previewText)
			newShadow, _ := previewer.dmp.PatchApply(parsedPatches, previewer.previewShadow)

			previewer.previewText = newClient
			previewer.previewShadow = newShadow

			// finally diff the 2 and propogate the patches back to the server
			diffs := previewer.dmp.PatchMake(previewer.previewShadow, previewer.previewText)
			previewer.previewShadow = previewer.previewText
			previewer.documentHook.On.Sync <- diffsync.Payload{
				Diffs:         []byte(previewer.dmp.PatchToText(diffs)),
				EditSessionID: previewer.documentHook.ID,
			}
			break
		case _ = <-previewer.stop:
			return
		}
	}
}

// Actual HTTP methods for the previewExtension
func PreviewHTTPHandler(w http.ResponseWriter, r *http.Request) {
	// Extract the requested document ID and then find our preview extension :)
	requestedDocument, ok := r.URL.Query()["document"]
	if !ok || len(requestedDocument[0]) < 1 {
		w.WriteHeader(400)
		return
	}

	// assume they're sensible and the document exists
	doc, _ := docManager.openDocuments.Read(requestedDocument[0])
	if doc == nil {
		w.WriteHeader(404)
		return
	}

	for _, extension := range doc.LoadedExtensions {
		if extension.GetExtensionName() == PREVIEW_EXTENSION_NAME {
			// read the client text and output it
			preview := extension.(*Previewer)
			fmt.Printf("ping pong")
			// safety?? whats that?
			w.Header().Set("Content-Type", "text/html; charset=utf-8")
			w.Write([]byte("<!DOCTYPE html><head></head><body>" + html.UnescapeString(preview.previewText) + "</body>"))
		}
	}
}
