package service

import (
	"fmt"
	"log"

	"github.com/gorilla/websocket"
	"github.com/sergi/go-diff/diffmatchpatch"
)

// This file defines the headless extensions for a client facing extension
// that is everything can be propogated to some client somewhere
const CLIENT_EXTENSION_NAME = "ClientConnection"

type ClientHead struct {
	Socket    *websocket.Conn
	dmp       *diffmatchpatch.DiffMatchPatch
	sendToDoc func([]diffmatchpatch.Patch)

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
func (c *ClientHead) Init(commMethod func([]diffmatchpatch.Patch), documentState *string) {
	c.sendToDoc = commMethod
	c.Socket.WriteMessage(websocket.TextMessage, []byte(`
	{
		"status": "connected",
		"errors": [],
		"payload": {}
	}`))
}

// Just tell the client that their connection is now closed
func (c *ClientHead) Destroy(docState *string) {
	c.Socket.WriteMessage(websocket.TextMessage, []byte(`
	{
		"status": "closed",
		"errors": [],
		"payload": {}
	}`))
	c.Socket.Close()
}

// The following methods are more so "stubs" as this extension does not run as a service
func (c *ClientHead) IsService() bool {
	return true
}

// Spin in a loop listenining for updates on our
// websocket connection
func (c *ClientHead) Spin() {
	// defines an incoming request structure
	var req struct {
		Status  int    `json:"status"`
		Patches string `json:"patches"`
	}

	for {
		switch {
		case <-c.stopSpinning:
			return
		default:
			err := c.Socket.ReadJSON(&req)
			// golang error checking :(((((
			if err != nil {
				log.Fatalf("something went horribly wrong, terminating connection: %v\n", err)
				c.Stop()
				c.Destroy(nil)
				return
			}
			parsedPatches, err := c.dmp.PatchFromText(req.Patches)
			if err != nil {
				log.Fatalf("something went horribly wrong, terminating connection: %v\n", err)
				c.Stop()
				c.Destroy(nil)
				return
			}

			c.sendToDoc(parsedPatches)
			break
		}
	}
}

func (c *ClientHead) Stop() {
	c.stopSpinning <- true
}

// Finally the big beefy Synchronise function :)
func (c *ClientHead) Synchronise(patches []diffmatchpatch.Patch) {
	// We assume that the connected client symmetrically implements the diff sync algorithm
	// hence we just pass our patches onto them
	parsedPatches := c.dmp.PatchToText(patches)
	c.Socket.WriteMessage(websocket.TextMessage, []byte(fmt.Sprintf(`
	{
		"status": "closed",
		"errors": [],
		"payload": {
			"patches": %s
		}
	}`, parsedPatches)))
}
