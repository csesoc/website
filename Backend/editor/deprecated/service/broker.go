package service

import (
	"cms.csesoc.unsw.edu.au/editor/deprecated/document"
	"github.com/gorilla/websocket"
)

var (
	newDoc  = []string{CLIENT_EXTENSION_NAME}
	newConn = []string{CLIENT_EXTENSION_NAME}
)

// Broker is arguably a super important type, its purpose is simple
// and it acts as an intermediatary layer between the document manager, documents and extensions
// the broker can open new documents via the document manager, connect new clients to a document
// and attaches new
type Broker struct {
	manager *document.Manager
}

func NewBroker() *Broker {
	return &Broker{
		manager: document.GetManagerInstance(),
	}
}

// ConnectOrOpenDocument does 2 things, if a document is open
// then it creates a new connection to the document and triggers the newConn event
// loading in the required extensions, otherwise if the documnet is not open it
// triggers the newDoc event, creating the document and loading in the newDoc extensions
func (b *Broker) ConnectOrOpenDocument(documentID string, conn *websocket.Conn) error {
	var requiredExtensions []string = newDoc

	if b.manager.IsDocOpen(documentID) {
		// document is open we can just trigger the new conn event :)
		requiredExtensions = newConn
	} else {
		// otherwise open the doc and trigger a new doc event
		err := b.manager.OpenDocument(documentID)
		if err != nil {
			return err
		}

		requiredExtensions = newDoc
	}

	for _, extName := range requiredExtensions {
		b.manager.LoadExtension(documentID, extensionFactory(
			extName, conn,
		))
	}
	return nil
}

// small factory for generating extensions based on a name :)
func extensionFactory(extName string, conn *websocket.Conn) *document.Extension {
	var head document.ExtensionHead
	switch extName {
	case CLIENT_EXTENSION_NAME:
		head = NewClientHead(conn)
		break
	case AUTOSAVE_EXTENSION_NAME:
		head = NewAutosaveHead()
		break
	}

	return document.NewExtensionWithHead(head)
}
