package document

import (
	"errors"
	"sync"

	"github.com/google/uuid"
	"github.com/sergi/go-diff/diffmatchpatch"
)

type Document struct {
	id           uuid.UUID
	documentName string
	documentState

	// these are the extensions loaded into the document
	// during spin up
	isSpinning bool

	// events to react to
	syncEvent               chan syncPayload
	terminateExtensionEvent chan terminatePayload
	stopSpinningEvent       chan bool

	dmp *diffmatchpatch.DiffMatchPatch
}

// NewDocument returns a new instance of a document allocated on the heap
func newDocument(documentName string, baseText string) *Document {
	return &Document{
		id:           uuid.New(),
		documentName: documentName,
		documentState: documentState{
			baseText:            baseText,
			shadows:             make(map[uuid.UUID]*string),
			connectedExtensions: make(map[uuid.UUID]*Extension),
			readingExtensions:   sync.RWMutex{},
		},

		isSpinning: false,

		syncEvent:               make(chan syncPayload),
		terminateExtensionEvent: make(chan terminatePayload),
		stopSpinningEvent:       make(chan bool),

		dmp: diffmatchpatch.New(),
	}
}

// AddExtension registers an an extension as loaded
// into a document, the document will now propgate updates to this extension
// and track a shadow for this document
func (doc *Document) addExtension(ext *Extension) error {
	doc.readingExtensions.Lock()
	defer doc.readingExtensions.Unlock()

	doc.connectedExtensions[ext.getID()] = ext
	doc.shadows[ext.getID()] = new(string)
	*doc.shadows[ext.getID()] = doc.baseText

	// initialise the extension and pass
	// it the the channel that it can use to send updates
	ext.init(doc.syncEvent, doc.terminateExtensionEvent, &doc.baseText)
	if ext.isService() {
		go ext.spin()
	}

	return nil
}

// Spin is the main entrypoint in the document
// spinning blocks the current goroutine, hence it should be called
// as its own independent goroutine and interfaced with via the appropriate methods
func (doc *Document) spin() {
	doc.isSpinning = true

	for {
		select {
		// something has just told us to die D:
		case _ = <-doc.stopSpinningEvent:
			doc.isSpinning = false
			// Stop extensions
			for _, ext := range doc.connectedExtensions {
				ext.destroy(&doc.baseText)
			}
			return

		// an extension is trying to terminate itself
		case payload := <-doc.terminateExtensionEvent:
			delete(doc.shadows, payload.signature)
			delete(doc.connectedExtensions, payload.signature)

			// if there are no more connected extensions just die off
			if len(doc.connectedExtensions) == 0 {
				doc.stop()
				return
			}

			break

		// an extension is trying to synrhconise the document state
		case payload := <-doc.syncEvent:
			// parse the patches into the diffmatchpatch library
			if len(payload.patches) == 0 {
				continue
			}

			// Apply the patch to the document text
			// it is assumed that the patches have already been applied
			// to the extension shadow
			sig := payload.signature
			newText, _ := doc.dmp.PatchApply(payload.patches, doc.baseText)
			newShadow, _ := doc.dmp.PatchApply(payload.patches, *doc.shadows[sig])

			doc.baseText = newText
			*doc.shadows[sig] = newShadow

			for extID, ext := range doc.connectedExtensions {
				// generate a new list of patches to apply to the extension
				// and send them off
				extensionShadow := doc.shadows[extID]
				patches := doc.dmp.PatchMake(*extensionShadow, doc.baseText)
				*extensionShadow = doc.baseText

				// propogate edits to extension
				if len(patches) != 0 {
					ext.Synchronise(patches)
				}
			}
			break
		default:
			break
		}
	}
}

// Stop terminates the spinning of a document
// if it is spinning, otherwise it throws and error
func (doc *Document) stop() error {
	if !doc.isSpinning {
		return errors.New("document is not spinning, nothing to stop")
	}

	for _, ext := range doc.connectedExtensions {
		if ext.isSpinning() {
			ext.stop()
		}
	}

	// finally tell the singleton manager to
	// delete us for goooood :)
	GetManagerInstance().closeDocument(doc.documentName)
	return nil
}
