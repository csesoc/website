package tests

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"cms.csesoc.unsw.edu.au/database/repositories"
	"cms.csesoc.unsw.edu.au/database/repositories/mocks"
	"cms.csesoc.unsw.edu.au/endpoints"
	"cms.csesoc.unsw.edu.au/endpoints/models"
	"github.com/golang/mock/gomock"
	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"
)

// Currently failing, because the websocket upgrade thing fails and will send back a 500 error.
func TestEditHandler(t *testing.T) {
	controller := gomock.NewController(t);
	assert := assert.New(t)
	defer controller.Finish()

	// Test Setup
	documentID := uuid.New()
  	responseRecorder := httptest.NewRecorder();
  	request := httptest.NewRequest("GET", "/editor", nil);
	  
	mockFileRepo := mocks.NewMockIFilesystemRepository(controller)
	mockFileRepo.EXPECT().GetEntryWithID(documentID).Return(repositories.FilesystemEntry{
		EntityID:    documentID,
		LogicalName: "random name",
		IsDocument:  false,
		ChildrenIDs: []uuid.UUID{},
	}, nil).Times(1)

	mockDockerFileSystemRepo := mocks.NewMockIUnpublishedVolumeRepository(controller)
	mockDockerFileSystemRepo.EXPECT().AddToVolume(documentID.String()).Return(nil).Times(1)
		  
	mockDepFactory := createMockDependencyFactory(controller, mockFileRepo, true)
	mockDepFactory.EXPECT().GetUnpublishedVolumeRepo().Return(mockDockerFileSystemRepo)
	
	// Test execution
	form := models.ValidEditRequest{DocumentID: documentID}
	response := endpoints.EditHandler(form, responseRecorder, request, mockDepFactory)

	assert.Equal(response.Status, http.StatusOK)
}


