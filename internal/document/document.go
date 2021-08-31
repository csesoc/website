package document

import (
	"errors"
	"sync"

	"github.com/google/uuid"
	"github.com/sergi/go-diff/diffmatchpatch"
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
	syncEvent    chan SyncPayload
	stopSpinning chan bool

	dmp *diffmatchpatch.DiffMatchPatch
}

// SyncPayload defines the arguments for a sync operation against
// a document
type SyncPayload struct {
	Shadow  *string
	Patches []diffmatchpatch.Patch
}

// NewDocument returns a new instance of a document allocated on the heap
func NewDocument(baseText string) *Document {
	return &Document{
		id:               uuid.New(),
		baseText:         baseText,
		isSpinning:       false,
		loadedExtensions: make(map[string]Extension),

		syncEvent:    make(chan SyncPayload),
		stopSpinning: make(chan bool),
		dmp:          diffmatchpatch.New(),
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

	ext.Load(doc.id)
	go ext.Spin()
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

// SyncTextWithShadow attemps to sync the local state of the document against
// a specified shadow
func (doc *Document) SyncTextWithShadow(shadow *string) error {
	if !doc.isSpinning {
		return errors.New("requested document is not spinning")
	}

	// create a payload
	payload := SyncPayload{
		Patches: doc.dmp.PatchMake(doc.baseText, *shadow),
		Shadow:  shadow,
	}
	doc.syncEvent <- payload
	return nil
}

// SyncTextWithPayload attempts to sync the local state of the document against
// a specified synchronisation payload, it then alerts all loadedExtension of this new
// synchronisation
func (doc *Document) SyncTextWithPayload(payload SyncPayload) error {
	if !doc.isSpinning {
		return errors.New("requested document is not spinning")
	}
	// pass over the sync event handler
	doc.syncEvent <- payload
	return nil
}

// Spin is the main entrypoint in the document
// spinning blocks the current goroutine, hence it should be called
// as its own independent goroutine and interfaced with via the appropriate methods
func (doc *Document) Spin() {
	doc.isSpinning = true

	for {
		select {
		case payload := <-doc.syncEvent:
			// parse the patches into the diffmatchpatch library
			if len(payload.Patches) == 0 {
				continue
			}

			// Apply the patch to the document text
			// it is assumed that the patches have already been applied
			// to the extension shadow
			newText, _ := doc.dmp.PatchApply(payload.Patches, doc.baseText)
			newShadow, _ := doc.dmp.PatchApply(payload.Patches, *payload.Shadow)
			doc.baseText = newText
			*payload.Shadow = newShadow

			for _, ext := range doc.loadedExtensions {

				// sometimes extensions dont have a defined shadow
				// check that the one we are trying to sync with does
				if ext.GetShadow() != nil {
					patches := doc.dmp.PatchMake(*ext.GetShadow(), doc.baseText)
					ext.SetShadow(doc.baseText)

					// propogate edits to extension
					if len(patches) != 0 {
						ext.Synchronise(patches)
					}
				} else {
					ext.SyncShadowAgainst(&doc.baseText)
				}
			}

			break
		case _ = <-doc.stopSpinning:
			doc.isSpinning = false
			// Stop extensions
			for _, ext := range doc.loadedExtensions {
				ext.Unload(doc.id)
				ext.Stop()
			}
			return
		default:
			continue
		}
	}
}

// Stop terminates the spinning of a document
// if it is spinning, otherwise it throws and error
func (doc *Document) Stop() error {
	if !doc.isSpinning {
		return errors.New("document is not spinning, nothing to stop")
	}

	doc.stopSpinning <- true
	return nil
}
