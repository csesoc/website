package editor

import (
	"fmt"
	"sync"
)

type documentServer struct {
	// todo: change to whatever data structure is being used for
	// todo: stop the clientView map from growing too large using some compaction
	// strategy or a more appropriate ds
	// state management
	state     string
	statelock sync.Mutex
	clients   map[int]*clientState
}

type clientState struct {
	*clientView
	canSendOps bool
}

func newDocumentServer() *documentServer {
	// ideally state shouldn't be a string due to its immutability
	// any update requires the allocation + copy of a new string in memory
	return &documentServer{
		state:     "amongus!!!",
		statelock: sync.Mutex{},
		clients:   make(map[int]*clientState),
	}
}

// a pipe is a closure that the clientView can use to communicate
// with the server, it wraps its internal clientView ID for security reasons
type pipe = func(operation op)

// connectClient connects a clientView to a documentServer and returns a one way pipe
// it can use for communication with the documentServer
// TODO: synchronise this properly
func (s *documentServer) connectClient(c *clientView) pipe {
	// register this clientView
	clientID := len(s.clients)
	s.clients[clientID] = &clientState{
		clientView: c,
		canSendOps: true,
	}

	// we need to create a new worker for this clientView too
	workerHandle := make(chan func())
	killHandle := make(chan empty)
	go createAndStartWorker(workerHandle, killHandle)

	// finally build a comm pipe for this clientView
	return s.buildClientPipe(clientID, workerHandle, killHandle)
}

// buildClientPipe is a function that returns the "pipe" for a clientView
// this pipe contains all the necessary code that the clientView needs to communicate with the documentServer
// when the clientView wishes to send data to the documentServer they simply just call this pipe with the operation
func (s *documentServer) buildClientPipe(clientID int, workerWorkHandle chan func(), workerKillHandle chan empty) func(op) {
	return func(operation op) {
		// this could also just be captured from the outer func
		clientState := s.clients[clientID]
		thisClient := clientState.clientView
		if !clientState.canSendOps {
			// todo: in the future terminate this clientView
			// this is the only thing we can do in order to enforce
			// consistency across all clients
			panic("oh no!")
		}

		// to deal with this incoming operation we need to push
		// data to the worker assigned to this clientView
		workerWorkHandle <- func() {
			clientState.canSendOps = false

			// apply op to clientView states
			s.statelock.Lock()
			// todo: do stuff with the incoming data
			// replace the print with something else
			fmt.Print(thisClient)
			transformedOperation := transformPipeline(operation, s.state)
			s.statelock.Unlock()

			// propagate updates to all connected clients except this one
			// if we send it to this clientView then we may deadlock the server and clientView
			for id, connectedClient := range s.clients {
				if id == clientID {
					continue
				}

				// push update
				connectedClient.clientView.sendOp <- transformedOperation
			}

			clientState.canSendOps = true
			thisClient.sendAcknowledgement <- true
		}
	}
}
