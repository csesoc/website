package document

import "github.com/google/uuid"

type manager struct {
	// mapping from document IDs to open document states
	openDocuments map[uuid.UUID]*Document
}

// docManager is the global document manager, it is only accessible
// via methods in the document package :)
var docManager manager = manager{
	openDocuments: make(map[uuid.UUID]*Document),
}

// openDocument opens a document with and ID representing the text's internal
// id in the database, additionally loads they required extensions
// for the document
func openDocument(documentID string, requiredExtensions ...string) uuid.UUID {
	return uuid.Nil
}

// closeDocument closes a document with a specific ID
func closeDocument(documentID uuid.UUID) error {
	return nil
}

// loadExtension allows you to load an extension given a document UUID
func loadExtensions(documentID uuid.UUID, extensions ...Extension) {
	// todo: implement
}

// syncWith attempts to sync a shadow with a document with a given docID
func syncWith(docID uuid.UUID, shadow string) {

}

// getExtensionInstance for returns the extension instance of extension_name
// for a document with ID docID
func getExtensionInstance(docID uuid.UUID, extensionName string) *Extension {
	return nil
}

// This structure defines admin access to the global
// document manager :), can be embedded into a structure
// and used there
type DocManagerAdmin struct{}

// accessible methods form DocManagerAdmin
func (manager DocManagerAdmin) OpenDocument(documentID string, requiredExtensions ...string) uuid.UUID {
	return openDocument(documentID, requiredExtensions...)
}

func (manager DocManagerAdmin) CloseDocument(documentID uuid.UUID) error {
	return closeDocument(documentID)
}

func (manager DocManagerAdmin) SyncWith(docID uuid.UUID, shadow string) {
	syncWith(docID, shadow)
}

func (manager DocManagerAdmin) LoadExtensions(docID uuid.UUID, extension ...Extension) {
	loadExtensions(docID, extension...)
}

func (manager DocManagerAdmin) GetExtensionInstance(docID uuid.UUID, extensionName string) *Extension {
	return getExtensionInstance(docID, extensionName)
}

// This structure defines what non-admin privelges
// to the document manager looks like, can also be
// embedded into a struct and used there
type DocManagerUser struct{}

// accessilbe methods from DocManagerUser
func (manager DocManagerUser) SyncWith(docID uuid.UUID, shadow string) {
	syncWith(docID, shadow)
}
