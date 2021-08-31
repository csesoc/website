package document

import (
	"bytes"
	"errors"
	"fmt"
	"os"
	"sync"

	"github.com/google/uuid"
)

type manager struct {
	// mapping from document IDs to open document states
	openDocuments    map[uuid.UUID]*Document
	readingDocuments sync.RWMutex
}

// docManager is the global document manager, it is only accessible
// via methods in the document package :)
var docManager manager = manager{
	openDocuments: make(map[uuid.UUID]*Document),
}

// openDocument opens a document with and ID representing the text's internal
// id in the database, it will also spin up the document for us :)
func openDocument(documentID string, callingExtension Extension) uuid.UUID {
	// TODO: reimplement once the filesystem is complete
	// for now its a basic read from file method
	f, _ := os.Open(fmt.Sprintf("mock/%s", documentID))
	defer f.Close()

	fileBuffer := new(bytes.Buffer)
	fileBuffer.ReadFrom(f)

	newDoc := NewDocument(fileBuffer.String())
	docManager.readingDocuments.Lock()
	defer docManager.readingDocuments.Unlock()

	docManager.openDocuments[newDoc.id] = newDoc
	newDoc.LoadExtension(callingExtension)
	go newDoc.Spin()
	return newDoc.id
}

// closeDocument closes a document with a specific ID
func closeDocument(documentID uuid.UUID) error {
	docManager.readingDocuments.Lock()
	defer docManager.readingDocuments.Unlock()

	if doc, ok := docManager.openDocuments[documentID]; ok {
		return doc.Stop()
	}
	return errors.New("no such document exists within the manager")
}

// loadExtension allows you to load an extension given a document UUID
func loadExtensions(documentID uuid.UUID, extensions ...Extension) error {
	docManager.readingDocuments.Lock()
	defer docManager.readingDocuments.Unlock()

	if doc, ok := docManager.openDocuments[documentID]; ok {
		for _, extension := range extensions {
			err := doc.LoadExtension(extension)
			if err != nil {
				return err
			}
		}
	}
	return errors.New("no such document exists within the manager")
}

// syncWithShadow attempts to sync a shadow with a document with a given docID
func syncWithShadow(docID uuid.UUID, shadow *string) error {
	docManager.readingDocuments.Lock()
	defer docManager.readingDocuments.Unlock()

	if doc, ok := docManager.openDocuments[docID]; ok {
		return doc.SyncTextWithShadow(shadow)
	}
	return errors.New("no such document exists within the manager")
}

// syncWithPayload attemps to sync a document with a sync payload and a docID
func syncWithPayload(docID uuid.UUID, payload SyncPayload) error {
	docManager.readingDocuments.Lock()
	defer docManager.readingDocuments.Unlock()

	if doc, ok := docManager.openDocuments[docID]; ok {
		return doc.SyncTextWithPayload(payload)
	}
	return errors.New("no such document exists within the manager")
}

// getExtensionInstance for returns the extension instance of extension_name
// for a document with ID docID
func getExtensionInstance(docID uuid.UUID, extensionName string) (Extension, error) {
	docManager.readingDocuments.Lock()
	defer docManager.readingDocuments.Unlock()

	if doc, ok := docManager.openDocuments[docID]; ok {
		doc, err := doc.GetExtensionInstace(extensionName)
		return doc, err
	}
	return nil, errors.New("no such document exists within the manager")
}

// This structure defines admin access to the global
// document manager :), can be embedded into a structure
// and used there
type DocManagerAdmin struct{}

// accessible methods form DocManagerAdmin
func (manager DocManagerAdmin) OpenDocument(documentID string, extensionInstance Extension) uuid.UUID {
	return openDocument(documentID, extensionInstance)
}

func (manager DocManagerAdmin) CloseDocument(documentID uuid.UUID) error {
	return closeDocument(documentID)
}

func (manager DocManagerAdmin) SyncWithShadow(docID uuid.UUID, shadow *string) error {
	return syncWithShadow(docID, shadow)
}

func (manager DocManagerAdmin) SyncWithPayload(docID uuid.UUID, payload SyncPayload) error {
	return syncWithPayload(docID, payload)
}

func (manager DocManagerAdmin) LoadExtensions(docID uuid.UUID, extension ...Extension) error {
	return loadExtensions(docID, extension...)
}

func (manager DocManagerAdmin) GetExtensionInstance(docID uuid.UUID, extensionName string) (Extension, error) {
	ext, err := getExtensionInstance(docID, extensionName)
	return ext, err
}

// This structure defines what non-admin privelges
// to the document manager looks like, can also be
// embedded into a struct and used there
type DocManagerUser struct{}

// accessilbe methods from DocManagerUser
func (manager DocManagerUser) SyncWithShadow(docID uuid.UUID, shadow *string) error {
	return syncWithShadow(docID, shadow)
}

func (manager DocManagerUser) SyncWithPayload(docID uuid.UUID, payload SyncPayload) error {
	return syncWithPayload(docID, payload)
}
