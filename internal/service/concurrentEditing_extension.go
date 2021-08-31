package service

import (
	"errors"

	"cms.csesoc.unsw.edu.au/internal/document"
	"github.com/google/uuid"
	"github.com/gorilla/websocket"
)

// This file defines and declares the concurrent editing extension
// that attaches to the document

const CONCURRENT_EDITING_EXTENSION_NAME string = "extension.concurrent_editing"

var concurrent_requiredExtensions []string = []string{
	"",
}

type ConcurrentEditingExtension struct {
	trackingDoc     uuid.UUID
	attachedClients map[uuid.UUID]websocket.Conn

	document.DocManagerAdmin
}

// Constructor for a concurrent extension
func NewConcurrentExtension() *ConcurrentEditingExtension {
	return &ConcurrentEditingExtension{
		trackingDoc:     uuid.Nil,
		attachedClients: make(map[uuid.UUID]websocket.Conn),
	}
}

// Rest of the implementation for the extension interface
func (ext *ConcurrentEditingExtension) GetName() string {
	return CONCURRENT_EDITING_EXTENSION_NAME
}

func (ext *ConcurrentEditingExtension) AttachToDoc(doc uuid.UUID) error {
	if ext.trackingDoc != uuid.Nil {
		ext.trackingDoc = doc
		return nil
	}
	return errors.New("already tracking a document")
}

func (ext *ConcurrentEditingExtension) GetTrackingDoc() uuid.UUID {
	return ext.trackingDoc
}

func (ext *ConcurrentEditingExtension) GetShadow() *string {
	// this extension has no defined single shadow, instead of handles multiple
	return nil
}
