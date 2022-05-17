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
	c          *client
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
func (s *server) connectClient(c *client) pipe {
	// prepare a comm delegate for the client
	// to communicate to us via
	clientID := len(s.clients)
	s.clients[clientID] = &clientState{
		c:          c,
		canSendOps: true,
	}

	return func(operation op) {
		// this could also just be captured from the outer func
		clientState := s.clients[clientID]
		thisClient := clientState.c
		if !clientState.canSendOps {
			// todo: in the future terminate this client
			// this is the only thing we can do in order to enforce
			// consistency across all clients
			panic("oh no!")
		}

		// spinning up a goroutine to propgate every update :flooshed:
		// not a poggers idea but goroutines are quite lightweight
		go func() {
			clientState.canSendOps = false
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
				connectedClient.c.sendOp <- transformedOperation
			}

			clientState.canSendOps = true
			thisClient.sendAcknowledgement <- true
		}()
	}
}
