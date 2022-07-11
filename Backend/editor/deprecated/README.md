# CMS Editor

## Payload
Unfortunately using the CMS editor as a client is rather tricky and requires a symmetrical implementation of the differential synchronisation algorithm (TBH this is not too hard 😛).

The client extension in the editor expects incoming synchronisation data to follow the following format:
```json
{
    "status": "connected",
    "errors": [],
    "payload": {
        "patches": "GNU Diff String"
    }
}
```
the difference string is assumed to be in GNU diff format. The responses you get back from the server will also be in this format.

## Architectural Guide
Theres a lot of files in this packagege :sobbing:, below is a rough outline of how some of them fit into the bigger picture.

### Issues
Theres a few issues with the current layout and they will be ironed out later. The biggest issue is how easy it is to introduce a deadlock... If you call function serviced by the event loop within an event loop you are going to deadlock that goroutine; please dont do that 🥲.

### `service/`
 - The service folder contains the broker file and our extension definitions, the broker file is responsible for loading the correct extensions into a spun up document, it generally expects an establised websocket connection for it to work.
 - The service folder as stated before contains all our extensions, the editor is designed to be super easy to extend, the goal is for contributors to be able to extend the editor with a minimal understanding of its internals. To extend the editor all you need to do is implement the `ExtensionHead` interface and register your extension in the `broker.go` file. Additionally a full Go client side implementation of the differential synchronisation algorithm is provided in `extension_stub.go`, embedding this struct in your implementation will provide you with a consistent document state to operate on. An example `ExtensionHead` is as follows (more documentation can be found on confluence)
 ```go
package service

import (
	"github.com/sergi/go-diff/diffmatchpatch"
)

const EXAMPLE_EXTENSION_NAME = "MyExampleExtension"

type ExampleHead struct {
	stopSpinning chan bool
	ExtensionStub
}

// Creates a new autosave extension
func NewExampleHead() *ExampleHead {
	return &ExampleHead{
		stopSpinning: make(chan bool),
		ExtensionStub: ExtensionStub{
			serverShadow: new(string),
			dmp:          diffmatchpatch.New(),
			baseText:     "",
		},
	}
}

// Methods for the new NewExampleHead to implement the ExtensionHead interface
// function is called when an extension is connected to a document
func (c *ExampleHead) Init(commMethod func([]diffmatchpatch.Patch), terminate func(), documentState *string) {
	c.sendToDoc = commMethod
	c.ExtensionStub.baseText = *documentState
	*c.ExtensionStub.serverShadow = *documentState
}

// Just tell the extension that their connection is now closed
func (c *ExampleHead) Destroy(state *string) {
	close(c.stopSpinning)
}

// Services are invoked as a new go routine
func (c *ExampleHead) IsService() bool {
	return true
}

// Spin in a loop listenining for updates on our
// websocket connection
func (c *ExampleHead) Spin() {
	for {
		switch {
		case <-c.stopSpinning:
			return
		default:
			// your functionality here
			break
		}
	}
}

func (c *ExampleHead) Stop() {
	c.stopSpinning <- true
}
 ```

### `document/`
 - Document contains basically all the implementation logic for the editor (its surprisingly small so give it a read 😛). The document sub-package consists to 3 critical components: some type definitions for interfaces, a singleton document manager "class" and a document type.

 - #### `manager.go`
    - This file maintains a singleton manager instance, this manager instance keeps a global record of all documents we have currently open (basically documents that are currently being edited). The manager singleton is responsible for the initialisation and creation of documents, all external interations with a document outside of the editor package happens via the manager.
 - #### `document.go`
    - This is the main implementation logic for the editor, the document type consists of a single big event loop and a set of channels, the type spins in its loop waiting for messages to be published to its respective channels, when it recieves a message it acts on it. There are only currently 3 implemented events.
        - **Synchronisation**: This event is when an extension wants to update the current textual state of the document with some extra information
        - **Extension Termination**: This is a small message an extension sends to a document to tell it that its terminated, this message allows the document to update its internal count of connected extensions and terminate itself if that count reaches 0
        - **Forced Termination**: This is a request from the document manager for the document to just stop doing its thing (how tragic 🙁 )
