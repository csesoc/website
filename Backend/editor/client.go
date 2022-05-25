package editor

import (
	"github.com/gorilla/websocket"
)

// client is the embodiment of all data relating to a client connection
// it is mostly managed by the server
// quick sidenote:
//		since sendOp and sendAcknowledgement are bounded we can actually deadlock the system
//		by filling them up :P, the server avoids this with a little hack, it spins a goroutine
//		to publish updates from the client within the pipe
type client struct {
	socket              *websocket.Conn
	sendOp              chan op
	sendAcknowledgement chan bool
}

// models an operation a client can propagte to the server
type op struct {
	data     string
	location int
	// todo: add more metadata
}

type opRequest struct {
	operations []op
}

func newClient(socket *websocket.Conn) *client {
	return &client{
		socket:              socket,
		sendOp:              make(chan op),
		sendAcknowledgement: make(chan bool),
	}
}

// stateClientInstance starts the client's spinny loop
// in this loop the client listens for updates and pushes
// them down the websocket, it also pulls stuff up the websocket
// the server will use the appropriate channels to communicate
// updates to the client, namely: sendOp and sendAcknowledgement
func (c *client) run(serverPipe pipe) {
	for {
		select {
		case <-c.sendOp:
			// push the operation down the websocket
			break

		case <-c.sendAcknowledgement:
			// push the acknowlegement down the websocket
			break

		default:
			request := opRequest{}

			err := c.socket.ReadJSON(&request)
			if err != nil {
				// todo: terminate & close websocket

			}

			// iterate over all incoming operations and push up the server pipe
			for _, op := range request.operations {
				serverPipe(op)
			}
		}
	}
}
