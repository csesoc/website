package endpoints

import (
	"fmt"
	"net/http"

	editor "cms.csesoc.unsw.edu.au/editor/pessimistic"
	. "cms.csesoc.unsw.edu.au/endpoints/models"
	"github.com/gorilla/websocket"
)

// Upgrader is a websocket upgrader
var Upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

// EditHandler is the HTTP handler responsible for dealing with incoming requests to edit a document
// for the most part this is passed over to the editor package
func EditHandler(form ValidEditRequest, w http.ResponseWriter, r *http.Request, df DependencyFactory) handlerResponse[empty] {
	unpublishedVol := df.GetUnpublishedVolumeRepo()
	log := df.GetLogger()

	ws, err := Upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Write("failed to upgrade websocket connection")
		return handlerResponse[empty]{
			Status: http.StatusInternalServerError,
		}
	}

	// note: this blocks until completion
	log.Write("starting editor loop")
	err = editor.EditorClientLoop(form.DocumentID, unpublishedVol, ws)
	if err != nil {
		log.Write(fmt.Sprintf("starting editor loop, message: %v", err.Error()))
		return handlerResponse[empty]{
			Status: http.StatusInternalServerError,
		}
	}

	return handlerResponse[empty]{Status: http.StatusOK}
}
