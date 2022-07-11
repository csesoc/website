package service

import (
	"log"

	"github.com/gorilla/websocket"
	"github.com/sergi/go-diff/diffmatchpatch"
)

// defines the json structure of a response
type response struct {
	Status  string            `json:"status"`
	Errors  []string          `json:"errors"`
	Payload map[string]string `json:"payload"`
}

// This file defines the headless extensions for a client facing extension
// that is everything can be propogated to some client somewhere
const CLIENT_EXTENSION_NAME = "ClientConnection"

type ClientHead struct {
	Socket *websocket.Conn
	dmp    *diffmatchpatch.DiffMatchPatch

	sendToDoc func([]diffmatchpatch.Patch)
	terminate func()

	stopSpinning chan bool
}

// Create a new client
func NewClientHead(conn *websocket.Conn) *ClientHead {
	return &ClientHead{
		Socket:       conn,
		dmp:          diffmatchpatch.New(),
		stopSpinning: make(chan bool),
	}
}

// Methods for the new ClientHead to implement the ExtensionHead interface
// we just need to tell the connected socket that they're now attached to a document :)
func (c *ClientHead) Init(commMethod func([]diffmatchpatch.Patch), terminate func(), documentState *string) {
	c.sendToDoc = commMethod
	c.terminate = terminate
	// we need to transport the current state of the document to the client
	// this can be done by diffing the document via an empty string
	patches := c.dmp.PatchMake("", *documentState)

	c.Socket.WriteJSON(response{
		Status: "connected",
		Errors: []string{},
		Payload: map[string]string{
			"patches": c.dmp.PatchToText(patches),
		},
	})
}

// Just tell the client that their connection is now closed
func (c *ClientHead) Destroy(docState *string) {
	c.Socket.WriteJSON(response{
		Status:  "closed",
		Errors:  []string{},
		Payload: map[string]string{},
	})
	c.Socket.Close()
}

// The following methods are more so "stubs" as this extension does not run as a service
func (c *ClientHead) IsService() bool {
	return true
}

// Finally the big beefy Synchronise function :)
func (c *ClientHead) Synchronise(patches []diffmatchpatch.Patch) {
	// We assume that the connected client symmetrically implements the diff sync algorithm
	// hence we just pass our patches onto them
	parsedPatches := c.dmp.PatchToText(patches)
	c.Socket.WriteJSON(response{
		Status: "connected",
		Errors: []string{},
		Payload: map[string]string{
			"patches": parsedPatches,
		},
	})
}

// Spin in a loop listenining for updates on our
// websocket connection
func (c *ClientHead) Spin() {
	for {
		select {
		case <-c.stopSpinning:
			return
		default:
			// todo: this code assumes that if our request is invalid then no request was sent
			// do a bit of research into the gorilla sockets API and refactor that assumption out :)
			var req response
			err := c.Socket.ReadJSON(&req)
			if err != nil {
				if !websocket.IsCloseError(err, websocket.CloseGoingAway, websocket.CloseNoStatusReceived) {
					log.Printf("something went horribly wrong, terminating connection: %v\n", err)
				}

				c.Stop()
			}

			parsedPatches, err := c.dmp.PatchFromText(req.Payload["patches"])
			if err != nil {
				log.Printf("something went horribly wrong when parsing diff: %v\n", err)
				c.Stop()
			}

			c.sendToDoc(parsedPatches)
			break
		}
	}
}

func (c *ClientHead) Stop() {
	c.terminate()
	c.stopSpinning <- true
}
