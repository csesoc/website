package editor

import (
	"errors"
	"sync"
)

// manager matches all instances of an open document
type manager struct {
	// openDocuments is a set of currently open documents
	// perhaps a global lock is a slight bottleneck
	openDocuments     map[int]struct{}
	openDocumentsLock sync.Mutex
}

var globalManagerInstance *manager
var managerLock sync.Mutex = sync.Mutex{}

// getManagerInstance returns the singleton instance of the document manager
func getGlobalManagerInstance() *manager {
	managerLock.Lock()
	defer managerLock.Unlock()

	if globalManagerInstance == nil {
		globalManagerInstance = &manager{
			openDocuments:     make(map[int]struct{}),
			openDocumentsLock: sync.Mutex{},
		}
	}

	return globalManagerInstance
}

// startDocumentServer creates a new document server given an FS repo and a websocket conn
func (m *manager) startDocumentServer(documentID int) error {
	m.openDocumentsLock.Lock()
	defer m.openDocumentsLock.Unlock()

	if _, ok := m.openDocuments[documentID]; ok {
		return errors.New("document already open!")
	}

	m.openDocuments[documentID] = struct{}{}
	return nil
}

// closeDocumentServer closes a document server and de-registers it from the manager
// it assumes the underlying websocket connection is also closed
func (m *manager) closeDocumentServer(documentID int) error {
	m.openDocumentsLock.Lock()
	defer m.openDocumentsLock.Unlock()

	if _, ok := m.openDocuments[documentID]; ok {
		return errors.New("document was never opened!!")
	}

	delete(m.openDocuments, documentID)
	return nil
}
