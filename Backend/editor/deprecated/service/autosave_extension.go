package service

import (
	"github.com/sergi/go-diff/diffmatchpatch"
)

const AUTOSAVE_EXTENSION_NAME = "AutosaveExtension"

type AutosaveHead struct {
	stopSpinning chan bool
	ExtensionStub
}

// Creates a new autosave extension
func NewAutosaveHead() *AutosaveHead {
	return &AutosaveHead{
		stopSpinning: make(chan bool),
		ExtensionStub: ExtensionStub{
			serverShadow: new(string),
			dmp:          diffmatchpatch.New(),
			baseText:     "",
		},
	}
}

// Methods for the new ClientHead to implement the ExtensionHead interface
// we just need to tell the connected socket that they're now attached to a document :)
func (c *AutosaveHead) Init(commMethod func([]diffmatchpatch.Patch), terminate func(), documentState *string) {
	c.sendToDoc = commMethod
	c.ExtensionStub.baseText = *documentState
	*c.ExtensionStub.serverShadow = *documentState
}

// Just tell the client that their connection is now closed
func (c *AutosaveHead) Destroy(state *string) {
	close(c.stopSpinning)
}

// The following methods are more so "stubs" as this extension does not run as a service
func (c *AutosaveHead) IsService() bool {
	return true
}

// Spin in a loop listenining for updates on our
// websocket connection
func (c *AutosaveHead) Spin() {
	for {
		switch {
		case <-c.stopSpinning:
			return
		default:
			// TODO: write to file system every n seconds
			// @Jacky
			break
		}
	}
}

func (c *AutosaveHead) Stop() {
	c.stopSpinning <- true
}
