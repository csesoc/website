package editor

import (
	"sync"

	"github.com/google/uuid"
)

// perhaps "factory" isnt appropriate but documentServerFactory just manages
// instances of active documents that are being edited
type documentServerFactory struct {
	// activeServers is the
	activeServers map[uuid.UUID]*documentServer
	lock          sync.Mutex
}

// global instances of the serverFactory
// grrrr global state bad :O
var globalServerManager *documentServerFactory
var managerLock sync.Mutex

func GetDocumentServerFactoryInstance() *documentServerFactory {
	managerLock.Lock()

	if globalServerManager == nil {
		globalServerManager = &documentServerFactory{
			activeServers: make(map[uuid.UUID]*documentServer),
		}
	}

	managerLock.Unlock()
	return globalServerManager
}

// starts or fetches a server instance for a client to connect to
func (sf *documentServerFactory) FetchDocumentServer(serverID uuid.UUID) *documentServer {
	// todo: resolve the serverID to a document once
	// everyone's week 7 tickets are done
	var s *documentServer

	sf.lock.Lock()

	if locatedServer, ok := sf.activeServers[serverID]; !ok {
		// setup the new server's state with the document contents
		sf.activeServers[serverID] = newDocumentServer()
		s = sf.activeServers[serverID]
		s.ID = serverID
	} else {
		s = locatedServer
	}

	sf.lock.Unlock()

	return s
}

// closeDocumentServer terminates a documentServer, note that this method is only called by
// this package itself and never outside of the package
func (sf *documentServerFactory) closeDocumentServer(serverID uuid.UUID) {
	sf.lock.Lock()

	if doc, ok := sf.activeServers[serverID]; ok {
		if len(doc.clients) != 0 {
			// if there are still connected documents we consider this function call a nop
			// why? Consider the following scheduling order:
			//	a client view creates a buildAlertLeavingSignal signal
			//		-> in response this method is called
			//		-> right before acquiring the factory lock a new client attempts to join and acquires the lock
			//		-> its been added to the document that just tried to terminate itself
			//		-> we now acquire the lock, and reach this point, if this were no a noop we would have either
			//			paniced when there are clients or killed an active server
			sf.lock.Unlock()
			return
		}
		delete(sf.activeServers, serverID)
	} else {
		panic("Fatal Error: attempted to close a non-existent document server")
	}

	sf.lock.Unlock()
}
