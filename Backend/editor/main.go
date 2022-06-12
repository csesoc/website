package editor

import (
	"errors"
	"log"
	"strconv"

	"cms.csesoc.unsw.edu.au/database/repositories"
	"github.com/gorilla/websocket"
)

// This is the main loop that the editor client will run
func EditorClientLoop(requestedDocument int, fs repositories.IDockerUnpublishedFilesystemRepository, ws *websocket.Conn) error {
	manager := getGlobalManagerInstance()
	manager.startDocumentServer(requestedDocument)

	defer manager.closeDocumentServer(requestedDocument)
	defer func() {
		ws.WriteMessage(websocket.CloseMessage, []byte("Terminating."))
		ws.Close()
	}()

	file, err := fs.GetFromVolumeTruncated(strconv.Itoa(requestedDocument))
	if err != nil {
		return errors.New("Unable to open request document")
	}

	defer file.Close()

	for {
		_, buf, err := ws.ReadMessage()
		if err != nil {
			if !websocket.IsCloseError(err, websocket.CloseGoingAway, websocket.CloseNoStatusReceived) {
				log.Printf("something went horribly wrong, terminating connection: %v\n", err)
				break
			}
		}

		file.Truncate(0)
		_, err = file.Seek(0, 0)
		if err != nil {
			return errors.New("something went wrong!")
		}

		_, err = file.Write(buf)
		if err != nil {
			return errors.New("failed to write to file")
		}

		// send an acknowledgement to the client
		ws.WriteMessage(websocket.TextMessage, []byte("acknowledged"))
	}

	return nil
}
