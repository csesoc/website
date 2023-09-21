package tests

import (
	"net/http"
	"net/http/httptest"
	"testing"

	repMocks "cms.csesoc.unsw.edu.au/database/repositories/mocks"
	"cms.csesoc.unsw.edu.au/endpoints"
	mock_endpoints "cms.csesoc.unsw.edu.au/endpoints/mocks"
	"cms.csesoc.unsw.edu.au/endpoints/models"
	"cms.csesoc.unsw.edu.au/internal/logger"
	"github.com/golang/mock/gomock"
	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"
)

// Currently failing, because the websocket upgrade thing fails and will send back a 500 error.
func TestEditHandler(t *testing.T) {
	controller := gomock.NewController(t)
	assert := assert.New(t)
	defer controller.Finish()

	// Test Setup
	documentID := uuid.New()
	form := models.ValidEditRequest{DocumentID: documentID}
	responseRecorder := httptest.NewRecorder()
	request := httptest.NewRequest("GET", "/editor", nil)

	//Make unpublishedvolumes
	mockUnpublishedVolume := repMocks.NewMockIUnpublishedVolumeRepository(controller)

	// Make logger
	log := logger.OpenLog("New Handler Log")
	mockDepFactory := mock_endpoints.NewMockDependencyFactory(controller)
	mockDepFactory.EXPECT().GetLogger().Return(log)
	mockDepFactory.EXPECT().GetUnpublishedVolumeRepo().Return(mockUnpublishedVolume)

	// Test execution
	response := endpoints.EditHandler(form, responseRecorder, request, mockDepFactory)
	assert.Equal(response.Status, http.StatusInternalServerError)
}
