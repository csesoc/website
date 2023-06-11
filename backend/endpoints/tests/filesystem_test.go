package tests

import (
	"net/http"
	"testing"

	"cms.csesoc.unsw.edu.au/database/repositories"
	repMocks "cms.csesoc.unsw.edu.au/database/repositories/mocks"
	"cms.csesoc.unsw.edu.au/endpoints"
	"cms.csesoc.unsw.edu.au/endpoints/mocks"
	"cms.csesoc.unsw.edu.au/endpoints/models"
	"cms.csesoc.unsw.edu.au/internal/logger"
	"github.com/golang/mock/gomock"
	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"
)

func TestValidEntityInfo(t *testing.T) {
	controller := gomock.NewController(t)
	assert := assert.New(t)
	defer controller.Finish()

	// ==== test setup =====
	entityID := uuid.New()
	mockFileRepo := repMocks.NewMockIFilesystemRepository(controller)
	mockFileRepo.EXPECT().GetEntryWithID(entityID).Return(repositories.FilesystemEntry{
		EntityID:     entityID,
		LogicalName:  "random name",
		IsDocument:   false,
		ParentFileID: repositories.FilesystemRootID,
		ChildrenIDs:  []uuid.UUID{},
	}, nil).Times(1)

	mockDepFactory := createMockDependencyFactory(controller, mockFileRepo, true)

	// ==== test execution =====
	form := models.ValidInfoRequest{EntityID: entityID}
	response := endpoints.GetEntityInfo(form, mockDepFactory)

	assert.Equal(response.Status, http.StatusOK)
	assert.Equal(response.Response, models.EntityInfoResponse{
		EntityID:   entityID,
		EntityName: "random name",
		IsDocument: false,
		Parent:     repositories.FilesystemRootID,
		Children:   []models.EntityInfoResponse{},
	})
}

func TestValidCreateNewEntity(t *testing.T) {
	controller := gomock.NewController(t)
	assert := assert.New(t)
	defer controller.Finish()

	// ==== test setup =====
	entityID := uuid.New()
	parentFileID := uuid.New()
	entityToCreate := repositories.FilesystemEntry{
		LogicalName:  "random name",
		ParentFileID: parentFileID,
		IsDocument:   false,
		OwnerUserId:  1,
	}

	mockFileRepo := repMocks.NewMockIFilesystemRepository(controller)
	mockFileRepo.EXPECT().CreateEntry(entityToCreate).Return(repositories.FilesystemEntry{
		EntityID:     entityID,
		LogicalName:  "random name",
		IsDocument:   false,
		ChildrenIDs:  []uuid.UUID{},
		ParentFileID: parentFileID,
	}, nil).Times(1)

	mockDockerFileSystemRepo := repMocks.NewMockIUnpublishedVolumeRepository(controller)
	mockDockerFileSystemRepo.EXPECT().AddToVolume(entityID.String()).Return(nil).Times(1)

	mockDepFactory := createMockDependencyFactory(controller, mockFileRepo, true)
	mockDepFactory.EXPECT().GetUnpublishedVolumeRepo().Return(mockDockerFileSystemRepo)

	form := models.ValidEntityCreationRequest{
		LogicalName: "random name",
		Parent:      parentFileID,
		IsDocument:  false,
		OwnerGroup:  1,
	}

	// ==== test execution =====
	response := endpoints.CreateNewEntity(form, mockDepFactory)
	assert.Equal(response.Status, http.StatusOK)
	assert.Equal(response.Response, models.NewEntityResponse{
		NewID: entityID,
	})
}

func TestValidDeleteFilesystemEntity(t *testing.T) {
	controller := gomock.NewController(t)
	assert := assert.New(t)
	defer controller.Finish()

	// ==== test setup =====
	entityID := uuid.New()
	mockFileRepo := repMocks.NewMockIFilesystemRepository(controller)
	mockFileRepo.EXPECT().DeleteEntryWithID(entityID).Return(nil).Times(1)

	mockDepFactory := createMockDependencyFactory(controller, mockFileRepo, true)

	form := models.ValidInfoRequest{
		EntityID: entityID,
	}

	// ==== test execution =====
	response := endpoints.DeleteFilesystemEntity(form, mockDepFactory)
	assert.Equal(response.Status, http.StatusOK)
}

func TestValidGetChildren(t *testing.T) {
	controller := gomock.NewController(t)
	assert := assert.New(t)
	defer controller.Finish()

	// ==== test setup =====
	entityID := uuid.New()
	childID := uuid.New()
	mockFileRepo := repMocks.NewMockIFilesystemRepository(controller)
	mockFileRepo.EXPECT().GetEntryWithID(entityID).Return(repositories.FilesystemEntry{
		EntityID:    entityID,
		LogicalName: "random name",
		IsDocument:  false,
		ChildrenIDs: []uuid.UUID{childID},
	}, nil).Times(1)

	mockDepFactory := createMockDependencyFactory(controller, mockFileRepo, true)

	form := models.ValidInfoRequest{
		EntityID: entityID,
	}

	// ==== test execution =====
	response := endpoints.GetChildren(form, mockDepFactory)
	assert.Equal(response.Status, http.StatusOK)
	assert.Equal(response.Response, models.ChildrenRequestResponse{
		Children: []uuid.UUID{childID},
	})
}

// createMockDependencyFactory just constructs an instance of a dependency factory mock
func createMockDependencyFactory(controller *gomock.Controller, mockFileRepo *repMocks.MockIFilesystemRepository, needsLogger bool) *mocks.MockDependencyFactory {
	mockDepFactory := mocks.NewMockDependencyFactory(controller)
	if mockFileRepo != nil {
		mockDepFactory.EXPECT().GetFilesystemRepo().Return(mockFileRepo)
	}

	if needsLogger {
		log := logger.OpenLog("new log")
		mockDepFactory.EXPECT().GetLogger().Return(log)
	}

	return mockDepFactory
}
