package document

import (
	"sync"

	"github.com/google/uuid"
	"github.com/sergi/go-diff/diffmatchpatch"
)

type documentState struct {
	// Shadows maps an extension ID to an shadow
	// Connected extensions maps an extension ID to an extension
	baseText            string
	shadows             map[uuid.UUID]*string
	connectedExtensions map[uuid.UUID]*Extension

	readingExtensions sync.RWMutex
}

// Types:
// syncPayload defines the arguments for a sync operation against
// a document, the signature refers to the ID of the extension sending
// this payload
type syncPayload struct {
	patches   []diffmatchpatch.Patch
	signature uuid.UUID
}

// terminatePayload represents a request to terminate an extensions
// connect to a document, marks it for garbage collection later
type terminatePayload struct {
	signature uuid.UUID
}
