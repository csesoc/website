package endpoints

import (
	"errors"
	"net/http"
	"reflect"

	"cms.csesoc.unsw.edu.au/database/repositories"
	"cms.csesoc.unsw.edu.au/editor"
	"cms.csesoc.unsw.edu.au/internal/logger"
	"github.com/gorilla/websocket"
)

// websocket upgrader
var Upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

// ValidEditRequest represents a valid request that can be send to the editor endpoint
type ValidEditRequest struct {
	DocumentID int
}

// TODO: wrap in permission checks later
// EditHandler is the HTTP handler responsible for dealing with incoming requests to edit a document
// for the most part this is pased over to the editor package
func EditHandler(w http.ResponseWriter, r *http.Request, df DependencyFactory, log *logger.Log) (int, interface{}, error) {
	var input ValidEditRequest
	if status := ParseParamsToSchema(r, "GET", &input); status != http.StatusOK {
		return status, nil, nil
	}

	// fetch the docker repository
	dockerFsRepo := reflect.TypeOf((*repositories.IDockerUnpublishedFilesystemRepository)(nil))
	dockerRepo := df.GetDependency(dockerFsRepo).(repositories.IDockerUnpublishedFilesystemRepository)
	log.Write([]byte("Acquired the docker filesystem repository."))

	ws, err := Upgrader.Upgrade(w, r, nil)
	if err != nil {
		return http.StatusInternalServerError, nil, errors.New("failed to upgrade websocket connection")
	}

	// note: this blocks until completion
	log.Write([]byte("Starting editor loop"))
	err = editor.EditorClientLoop(input.DocumentID, dockerRepo, ws)
	if err != nil {
		return http.StatusInternalServerError, nil, errors.New("failed to start editor loop.")
	}

	return http.StatusOK, nil, nil
}
