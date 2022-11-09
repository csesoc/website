package editor

import (
	"cms.csesoc.unsw.edu.au/editor/OT/datamodel"
	"cms.csesoc.unsw.edu.au/editor/OT/operations"
	"cms.csesoc.unsw.edu.au/environment"
	"cms.csesoc.unsw.edu.au/pkg/cmsjson"
	"github.com/google/uuid"
	"github.com/gorilla/websocket"
)

// testing_framework is a simple framework that can be used for performing integration tests on the concurrent editor
// it allows for the observation of client behavior and tracking document server behavior
type TestingClient struct {
	underlyingClient *clientView
	operationPipe    pipe
	terminationPipe  func()
}

func (tC TestingClient) HasTerminated() bool   { return len(tC.underlyingClient.sendTerminateSignal) > 0 }
func (tC TestingClient) WasAcknowledged() bool { return len(tC.underlyingClient.sendOp) > 0 }
func (tC TestingClient) GetReceivedOp() operations.Operation {
	if len(tC.underlyingClient.sendOp) == 0 {
		panic("testing client failure: expected a non-zero amount of received operations")
	}

	return <-tC.underlyingClient.sendOp
}

// GetServerState returns the current view that the server sees (as a string)
func GetServerState(serverId uuid.UUID) string {
	if !environment.IsTestingEnvironment() {
		panic("method can only be called within the context of a test!")
	}

	connectedServer := GetDocumentServerFactoryInstance().FetchDocumentServer(serverId)
	connectedServer.stateLock.Lock()
	defer connectedServer.stateLock.Unlock()

	return operations.CmsJsonConf.MarshallAST(connectedServer.state)
}

// CreateServer constructs a server with an initial state, it registers the server under the document manager
// and returns the server's ID
func CreateTestingServer(initState string) uuid.UUID {
	if !environment.IsTestingEnvironment() {
		panic("method can only be called within the context of a test!")
	}

	var err error
	factory := GetDocumentServerFactoryInstance()
	serverId := uuid.New()

	factory.lock.Lock()
	defer factory.lock.Unlock()
	factory.activeServers[serverId] = newDocumentServer()

	factory.activeServers[serverId].state, err = cmsjson.UnmarshallAST[datamodel.Document](operations.CmsJsonConf, initState)
	if err != nil {
		panic(err)
	}

	return serverId
}

// buildClients starts up n clients and returns their client views as an array
func BuildTestingClient(serverId uuid.UUID, numClients int) []TestingClient {
	if !environment.IsTestingEnvironment() {
		panic("method can only be called within the context of a test!")
	}

	connectedServer := GetDocumentServerFactoryInstance().FetchDocumentServer(serverId)

	clients := make([]TestingClient, numClients)
	for clientId := range clients {
		internalView := newClient(&websocket.Conn{})
		operationPipe, terminationPipe := connectedServer.connectClient(internalView)

		clients[clientId] = TestingClient{
			underlyingClient: internalView,
			operationPipe:    operationPipe,
			terminationPipe:  terminationPipe,
		}
	}

	return clients
}
