package editor

import (
	"bytes"
	"errors"
	"fmt"
	"log"

	"cms.csesoc.unsw.edu.au/database/repositories"
	"github.com/google/uuid"
	"github.com/gorilla/websocket"
)

// This is the main loop that the editor client will run
func EditorClientLoop(requestedDocument uuid.UUID, fs repositories.UnpublishedVolumeRepository, ws *websocket.Conn) error {
	manager := getGlobalManagerInstance()
	err := manager.startDocumentServer(requestedDocument)
	if err != nil {
		terminateWs(ws, "locked")
		return errors.New("unable to open request document")
	}

	defer manager.closeDocumentServer(requestedDocument)
	file, err := fs.GetFromVolume(requestedDocument.String())
	if err != nil {
		terminateWs(ws, "error")
		return errors.New("unable to open request document")
	}

	defer file.Close()

	// Our communication protocol is rather simple...
	// client starts:
	//		-> sends websocket connection
	// 		-> connection upgraded
	//		-> we send the current state of the document
	// 		-> client continues
	//		-> client sends updated
	//		-> we apply updated and send acknowledgement

	// send the current state of the document
	buf := &bytes.Buffer{}
	bytes, err := buf.ReadFrom(file)
	if err != nil {
		return errors.New("unable to read request document")
	}

	// Empty file
	if bytes == 0 {
		buf.WriteString("[]")
	}

	ws.WriteMessage(websocket.TextMessage, []byte(fmt.Sprintf(`{"type": "init", "contents": %s}`, buf.String())))

	for {
		_, buf, err := ws.ReadMessage()
		if err != nil {
			if !websocket.IsCloseError(err, websocket.CloseGoingAway, websocket.CloseNoStatusReceived) {
				log.Printf("something went horribly wrong, terminating connection: %v\n", err)
			}
			break
		}

		file.Truncate(0)
		file.Seek(0, 0)
		file.Write(buf)

		// send an acknowledgement to the client
		ws.WriteMessage(websocket.TextMessage, []byte(`{"type": "acknowledged"}`))
	}

	terminateWs(ws, "terminating")
	return nil
}

// terminateWs is just a small util function thats called on termination
func terminateWs(ws *websocket.Conn, reason string) {
	ws.WriteMessage(websocket.CloseMessage, websocket.FormatCloseMessage(websocket.CloseGoingAway, fmt.Sprintf(`"%s"`, reason)))
	ws.Close()
}
