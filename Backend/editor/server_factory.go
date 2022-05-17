package editor

import (
	"sync"

	"github.com/google/uuid"
)

// perhaps "factory" isnt appropriate but serverFactory just manages
// instances of active documents that are being edited
type serverFactory struct {
	// activeServers is the
	activeServers map[uuid.UUID]*server
	lock          sync.Mutex
}

// global instances of the serverFactory
// grrrr global state bad :O
var globalServerManager *serverFactory
var managerLock sync.Mutex

func GetServerFactoryInstance() *serverFactory {
	managerLock.Lock()

	if globalServerManager == nil {
		globalServerManager = &serverFactory{
			activeServers: make(map[uuid.UUID]*server),
		}
	}

	managerLock.Unlock()
	return globalServerManager
}

// starts or fetches a server instance for a client to connect to
func (sf *serverFactory) FetchServer(serverID uuid.UUID) *server {
	// todo: resolve the serverID to a document once
	// everyone's week 7 tickets are done
	var s *server

	sf.lock.Lock()

	if locatedServer, ok := sf.activeServers[serverID]; !ok {
		// setup the new server's state with the document contents
		sf.activeServers[serverID] = newServer()
		s = sf.activeServers[serverID]
	} else {
		s = locatedServer
	}

	sf.lock.Unlock()

	return s
}
