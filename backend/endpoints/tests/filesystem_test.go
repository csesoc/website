package tests

import (
	"io/ioutil"
	"net/http"
	"os"
	"reflect"
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
		ParentFileID: repositories.FILESYSTEM_ROOT_ID,
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
		Parent:     repositories.FILESYSTEM_ROOT_ID,
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
	dockerRepoType := reflect.TypeOf((*repositories.IUnpublishedVolumeRepository)(nil))

	mockDepFactory := createMockDependencyFactory(controller, mockFileRepo, true)
	mockDepFactory.EXPECT().GetDependency(endpoints.UnpublishedVolumeRepository).Return(mockDockerFileSystemRepo)
	mockDepFactory.EXPECT().GetDepFromType(dockerRepoType).Return(endpoints.UnpublishedVolumeRepository)

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

func TestValidUploadImage(t *testing.T) {
	controller := gomock.NewController(t)
	assert := assert.New(t)
	defer controller.Finish()

	// ==== test setup =====
	entityID := uuid.New()
	parentID := uuid.New()
	entityToCreate := repositories.FilesystemEntry{
		LogicalName:  "a.png",
		ParentFileID: parentID,
		IsDocument:   false,
		OwnerUserId:  1,
	}

	mockFileRepo := repMocks.NewMockIFilesystemRepository(controller)
	mockFileRepo.EXPECT().CreateEntry(entityToCreate).Return(repositories.FilesystemEntry{
		EntityID:     entityID,
		LogicalName:  "a.png",
		IsDocument:   false,
		ChildrenIDs:  []uuid.UUID{},
		ParentFileID: parentID,
	}, nil).Times(1)

	tempFile, _ := ioutil.TempFile(os.TempDir(), "expected")
	defer os.Remove(tempFile.Name())

	mockDockerFileSystemRepo := repMocks.NewMockIUnpublishedVolumeRepository(controller)
	mockDockerFileSystemRepo.EXPECT().AddToVolume(entityID.String()).Return(nil).Times(1)
	mockDockerFileSystemRepo.EXPECT().GetFromVolume(entityID.String()).Return(tempFile, nil).Times(1)

	dockerRepoType := reflect.TypeOf((*repositories.IUnpublishedVolumeRepository)(nil))

	mockDepFactory := createMockDependencyFactory(controller, mockFileRepo, true)
	mockDepFactory.EXPECT().GetDependency(endpoints.UnpublishedVolumeRepository).Return(mockDockerFileSystemRepo)
	mockDepFactory.EXPECT().GetDepFromType(dockerRepoType).Return(endpoints.UnpublishedVolumeRepository)

	// Create request
	const pngBytes = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="
	garbageFile, _ := ioutil.TempFile(os.TempDir(), "input")
	if _, err := garbageFile.WriteString(pngBytes); err != nil {
		panic(err)
	}
	garbageFile.Seek(0, 0)

	defer os.Remove(garbageFile.Name())

	form := models.ValidImageUploadRequest{
		Parent:      parentID,
		LogicalName: "a.png",
		OwnerGroup:  1,
		Image:       garbageFile,
	}

	// ==== test execution =====
	response := endpoints.UploadImage(form, mockDepFactory)
	assert.Equal(response.Status, http.StatusOK)
	assert.Equal(response.Response, models.NewEntityResponse{
		NewID: entityID,
	})

	// Assert that the file was written to
	content, err := os.ReadFile(tempFile.Name())
	assert.Nil(err)
	assert.Equal([]byte(pngBytes), content)
}

// createMockDependencyFactory just constructs an instance of a dependency factory mock
func createMockDependencyFactory(controller *gomock.Controller, mockFileRepo *repMocks.MockIFilesystemRepository, needsLogger bool) *mocks.MockDependencyFactory {
	mockDepFactory := mocks.NewMockDependencyFactory(controller)
	fsRepositoryTypeInfo := reflect.TypeOf((*repositories.IFilesystemRepository)(nil))

	mockDepFactory.EXPECT().GetDependency(endpoints.FileSystemRepository).Return(mockFileRepo)
	mockDepFactory.EXPECT().GetDepFromType(fsRepositoryTypeInfo).Return(endpoints.FileSystemRepository)

	if needsLogger {
		log := logger.OpenLog("new log")
		logType := reflect.TypeOf((**logger.Log)(nil))

		mockDepFactory.EXPECT().GetDependency(endpoints.Log).Return(log)
		mockDepFactory.EXPECT().GetDepFromType(logType).Return(endpoints.Log)
	}

	return mockDepFactory
}
