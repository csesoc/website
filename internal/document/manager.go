package document

import (
	"bytes"
	"errors"
	"fmt"
	"os"
	"sync"
)

type Manager struct {
	// openDocuments maps document IDs (in the database) to document states
	openDocuments    map[string]*Document
	readingDocuments sync.RWMutex
}

// docManager is the global document manager, it is only accessible
// via methods in the document package :)
func NewManager() *Manager {
	return &Manager{
		openDocuments:    make(map[string]*Document),
		readingDocuments: sync.RWMutex{},
	}
}

// openDocument opens a document with and ID representing the text's internal
// id in the database, it will also spin up the document for us :)
// note that on failure it returns an error indicating that the document
// could not be opened
func (docManager *Manager) OpenDocument(documentID string) error {
	if _, ok := docManager.openDocuments[documentID]; ok {
		return errors.New("document already open")
	}

	f, err := os.Open(fmt.Sprintf("mock/%s", documentID))
	if err != nil {
		return fmt.Errorf("could not read document with id: %s", documentID)
	}
	defer f.Close()

	fileBuffer := new(bytes.Buffer)
	fileBuffer.ReadFrom(f)

	newDoc := newDocument(fileBuffer.String())
	docManager.readingDocuments.Lock()
	defer docManager.readingDocuments.Unlock()

	docManager.openDocuments[documentID] = newDoc

	go newDoc.spin()
	return nil
}

// closeDocument closes a document with a specific ID
func (docManager *Manager) CloseDocument(documentID string) error {
	docManager.readingDocuments.Lock()
	defer docManager.readingDocuments.Unlock()

	if doc, ok := docManager.openDocuments[documentID]; ok {
		delete(docManager.openDocuments, documentID)
		return doc.stop()
	}
	return errors.New("no such document exists within the manager")
}

// LoadExtension adds an extension to a document with the specified ID
func (docManager *Manager) LoadExtension(documentID string, ext *Extension) error {
	if _, ok := docManager.openDocuments[documentID]; !ok {
		return errors.New("document not open")
	}

	return docManager.openDocuments[documentID].addExtension(ext)
}

// IsDocOpen determines if we have a document open and spinning :)
func (docManager *Manager) IsDocOpen(documentID string) bool {
	_, ok := docManager.openDocuments[documentID]
	return ok
}
