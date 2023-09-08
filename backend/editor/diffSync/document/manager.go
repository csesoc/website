package document

import (
	"errors"
	"sync"

	"cms.csesoc.unsw.edu.au/database/contexts"
	"cms.csesoc.unsw.edu.au/database/repositories"
	"cms.csesoc.unsw.edu.au/internal/storage"
	"github.com/google/uuid"
)

// Manager is a singleton "class" thats in charge
// of maintaining a global state for all open documents
// and their underlying document connection
type Manager struct {
	// openDocuments maps document IDs (in the database) to document states
	openDocuments    map[uuid.UUID]*Document
	readingDocuments *sync.RWMutex
}

var (
	managerInstance *Manager
	lock            = &sync.Mutex{}
	repo, _         = repositories.NewFilesystemRepo("test", "test1", contexts.GetDatabaseContext())
)

// implementation of the singleton pattern :)
func GetManagerInstance() *Manager {
	if managerInstance == nil {
		lock.Lock()
		defer lock.Unlock()

		managerInstance = &Manager{
			openDocuments:    make(map[uuid.UUID]*Document),
			readingDocuments: &sync.RWMutex{},
		}
	}

	return managerInstance
}

// openDocument opens a document with and ID representing the text's internal
// id in the database, it will also spin up the document for us :)
// note that on failure it returns an error indicating that the document
// could not be opened
func (docManager *Manager) OpenDocument(documentID uuid.UUID) error {
	if _, ok := docManager.openDocuments[documentID]; ok {
		return errors.New("document already open")
	}

	// Get the name of the document
	docInfo, err := repo.GetEntryWithID(documentID)
	if err != nil {
		return errors.New("invalid document id")
	}
	newDoc := newDocument(documentID, docInfo.LogicalName, storage.Read(documentID.String(), "data"))
	docManager.readingDocuments.Lock()
	defer docManager.readingDocuments.Unlock()

	docManager.openDocuments[documentID] = newDoc

	go newDoc.spin()
	return nil
}

// CloseAndStopDocument closes a document with a specific ID and
// sends it a shutdown signal
func (docManager *Manager) CloseAndStopDocument(documentID uuid.UUID) error {
	if doc := docManager.closeDocument(documentID); doc != nil {
		return doc.stop()
	}
	return errors.New("no such document exists within the manager")
}

// closeDocument just closes a document and stops
// the manager from maintaining it (should only be called internally)
// and within the context of the document event loop to prevent deadlocks
func (docManager *Manager) closeDocument(documentID uuid.UUID) *Document {
	docManager.readingDocuments.Lock()
	defer docManager.readingDocuments.Unlock()

	if doc, ok := docManager.openDocuments[documentID]; ok {
		delete(docManager.openDocuments, documentID)
		return doc
	}
	return nil
}

// LoadExtension adds an extension to a document with the specified ID
func (docManager *Manager) LoadExtension(documentID uuid.UUID, ext *Extension) error {
	if _, ok := docManager.openDocuments[documentID]; !ok {
		return errors.New("document not open")
	}

	return docManager.openDocuments[documentID].addExtension(ext)
}

// IsDocOpen determines if we have a document open and spinning :)
func (docManager *Manager) IsDocOpen(documentID uuid.UUID) bool {
	_, ok := docManager.openDocuments[documentID]
	return ok
}
