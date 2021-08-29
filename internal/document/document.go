package document

import (
	"errors"
	"sync"

	"github.com/google/uuid"
)

type Document struct {
	id       uuid.UUID
	baseText string

	// these are the extensions loaded into the document
	// during spin up
	isSpinning        bool
	loadedExtensions  map[string]Extension
	readingExtensions sync.RWMutex

	// events to react to
	syncEvent chan string
}

// NewDocument returns a new instance of a document allocated on the heap
func NewDocument(baseText string) *Document {
	return &Document{
		id:               uuid.New(),
		baseText:         baseText,
		isSpinning:       false,
		loadedExtensions: make(map[string]Extension),
	}
}

// LoadExtension registers an an extension as loaded
// into a document, the document will now propgate updates to this extension
func (doc *Document) LoadExtension(ext Extension) error {
	doc.readingExtensions.Lock()
	defer doc.readingExtensions.Unlock()

	if _, ok := doc.loadedExtensions[ext.GetName()]; ok {
		return errors.New("extension already loaded into document")
	}
	doc.loadedExtensions[ext.GetName()] = ext
	return nil
}

// GetExtensionInstance returns the instance of the extension loaded
// into this document with a specific name
func (doc *Document) GetExtensionInstace(extensionName string) (Extension, error) {
	doc.readingExtensions.Lock()
	defer doc.readingExtensions.Unlock()

	if ext, ok := doc.loadedExtensions[extensionName]; ok {
		return ext, nil
	}
	return nil, errors.New("extension already loaded into document")
}

// SyncText attempts to sync the local state of the document against
// a specified shadow text, it then alerts all loadedExtension of this new
// synchronisation
func (doc *Document) SyncText(shadow string) error {
	if !doc.isSpinning {
		return errors.New("requested document is not spinning")
	}
	// pass over the sync event handler
	doc.syncEvent <- shadow
	return nil
}

// Spin is the main entrypoint in the document
// spinning blocks the current goroutine, hence it should be called
// as its own independent goroutine and interfaced with via the appropriate methods
func (doc *Document) Spin() {
	doc.isSpinning = true
	for {
		select {
		case _ = <-doc.syncEvent:
			break
		default:
			continue
		}
	}
}
