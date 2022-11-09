package endpoints

import (
	"net/http"

	editor "cms.csesoc.unsw.edu.au/editor/OT"
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
	editor.EditEndpoint(w, r)
	return handlerResponse[empty]{}
}
