package document

import (
	"errors"
	"sync"

	"cms.csesoc.unsw.edu.au/internal/storage"
)

// Manager is a singleton "class" thats in charge
// of maintaining a global state for all open documents
// and their underlying document connection
type Manager struct {
	// openDocuments maps document IDs (in the database) to document states
	openDocuments    map[string]*Document
	readingDocuments *sync.RWMutex
}

var managerInstance *Manager
var lock = &sync.Mutex{}

// implementation of the singleton pattern :)
func GetManagerInstance() *Manager {
	if managerInstance == nil {
		lock.Lock()
		defer lock.Unlock()

		managerInstance = &Manager{
			openDocuments:    make(map[string]*Document),
			readingDocuments: &sync.RWMutex{},
		}
	}

	return managerInstance
}

// openDocument opens a document with and ID representing the text's internal
// id in the database, it will also spin up the document for us :)
// note that on failure it returns an error indicating that the document
// could not be opened
func (docManager *Manager) OpenDocument(documentName string) error {
	if _, ok := docManager.openDocuments[documentName]; ok {
		return errors.New("document already open")
	}

	newDoc := newDocument(documentName, storage.Read(documentName, "data"))
	docManager.readingDocuments.Lock()
	defer docManager.readingDocuments.Unlock()

	docManager.openDocuments[documentName] = newDoc

	go newDoc.spin()
	return nil
}

// CloseAndStopDocument closes a document with a specific ID and
// sends it a shutdown signal
func (docManager *Manager) CloseAndStopDocument(documentName string) error {
	if doc := docManager.closeDocument(documentName); doc != nil {
		return doc.stop()
	}
	return errors.New("no such document exists within the manager")
}

// closeDocument just closes a document and stops
// the manager from maintaining it (should only be called internally)
// and within the context of the document event loop to prevent deadlocks
func (docManager *Manager) closeDocument(documentName string) *Document {
	docManager.readingDocuments.Lock()
	defer docManager.readingDocuments.Unlock()

	if doc, ok := docManager.openDocuments[documentName]; ok {
		delete(docManager.openDocuments, documentName)
		return doc
	}
	return nil
}

// LoadExtension adds an extension to a document with the specified ID
func (docManager *Manager) LoadExtension(documentName string, ext *Extension) error {
	if _, ok := docManager.openDocuments[documentName]; !ok {
		return errors.New("document not open")
	}

	return docManager.openDocuments[documentName].addExtension(ext)
}

// IsDocOpen determines if we have a document open and spinning :)
func (docManager *Manager) IsDocOpen(documentName string) bool {
	_, ok := docManager.openDocuments[documentName]
	return ok
}
