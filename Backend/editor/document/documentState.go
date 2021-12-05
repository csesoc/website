package document

import (
	"sync"

	"github.com/google/uuid"
)

type documentState struct {
	// Shadows maps an extension ID to an shadow
	// Connected extensions maps an extension ID to an extension
	baseText            string
	shadows             map[uuid.UUID]*string
	connectedExtensions map[uuid.UUID]*Extension

	readingExtensions sync.RWMutex
}
