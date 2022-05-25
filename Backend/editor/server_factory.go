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
	} else {
		s = locatedServer
	}

	sf.lock.Unlock()

	return s
}
