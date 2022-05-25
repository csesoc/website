package editor

import (
	"fmt"
	"sync"
)

type server struct {
	// todo: change to whatever data structure is being used for
	// todo: stop the client map from growing too large using some compaction
	// strategy or a more appropriate ds
	// state management
	state     string
	statelock sync.Mutex
	clients   map[int]*clientState
}

type clientState struct {
	*client
	canSendOps bool
}

func newServer() *server {
	// ideally state shouldnt be a string due to its immutability
	// any update requires the allocation + copy of a new string in memory
	return &server{
		state:     "amongus!!!",
		statelock: sync.Mutex{},
		clients:   make(map[int]*clientState),
	}
}

// a pipe is a closure that the client can use to communicate
// with the server, it wraps its internal client ID for security reasons
type pipe = func(operation op)

// connectClient connects a client to a server and returns a one way pipe
// it can use for communication with the server
// TODO: synchronise this properly
func (s *server) connectClient(c *client) pipe {
	// register this client
	clientID := len(s.clients)
	s.clients[clientID] = &clientState{
		client:     c,
		canSendOps: true,
	}

	// we need to create a new worker for this client too
	workerHandle := make(chan func())
	killHandle := make(chan empty)
	go createAndStartWorker(workerHandle, killHandle)

	// finally build a comm pipe for this client
	return s.buildClientPipe(clientID, workerHandle, killHandle)
}

// buildClientPipe is a function that returns the "pipe" for a client
// this pipe contains all the necessary code that the client needs to communicate with the server
// when the client wishes to send data to the server they simply just call this pipe with the operation
func (s *server) buildClientPipe(clientID int, workerWorkHandle chan func(), workerKillHandle chan empty) func(op) {
	return func(operation op) {
		// this could also just be captured from the outer func
		clientState := s.clients[clientID]
		thisClient := clientState.client
		if !clientState.canSendOps {
			// todo: in the future terminate this client
			// this is the only thing we can do in order to enforce
			// consistency across all clients
			panic("oh no!")
		}

		// to deal with this incoming operation we need to push
		// data to the worker assigned to this client
		workerWorkHandle <- func() {
			clientState.canSendOps = false

			// apply op to client states
			s.statelock.Lock()
			// todo: do stuff with the incoming data
			// replace the print with something else
			fmt.Print(thisClient)
			transformedOperation := transformPipeline(operation, s.state)
			s.statelock.Unlock()

			// propagate updates to all connected clients except this one
			// if we send it to this client then we may deadlock the server and client
			for id, connectedClient := range s.clients {
				if id == clientID {
					continue
				}

				// push update
				connectedClient.client.sendOp <- transformedOperation
			}

			clientState.canSendOps = true
			thisClient.sendAcknowledgement <- true
		}
	}
}
