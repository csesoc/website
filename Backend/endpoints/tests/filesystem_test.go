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
	"github.com/stretchr/testify/assert"
)

func TestValidEntityInfo(t *testing.T) {
	controller := gomock.NewController(t)
	assert := assert.New(t)
	defer controller.Finish()

	// ==== test setup =====
	mockFileRepo := repMocks.NewMockIFilesystemRepository(controller)
	mockFileRepo.EXPECT().GetEntryWithID(1).Return(repositories.FilesystemEntry{
		EntityID:     1,
		LogicalName:  "random name",
		IsDocument:   false,
		ParentFileID: 0,
		ChildrenIDs:  []int{},
	}, nil).Times(1)

	mockDepFactory := createMockDependencyFactory(controller, mockFileRepo, true)

	// ==== test execution =====
	form := models.ValidInfoRequest{EntityID: 1}
	response := endpoints.GetEntityInfo(form, mockDepFactory)

	assert.Equal(response.Status, http.StatusOK)
	assert.Equal(response.Response, models.EntityInfoResponse{
		EntityID:   1,
		EntityName: "random name",
		IsDocument: false,
		Parent:     0,
		Children:   []models.EntityInfoResponse{},
	})
}

func TestValidCreateNewEntity(t *testing.T) {
	controller := gomock.NewController(t)
	assert := assert.New(t)
	defer controller.Finish()

	// ==== test setup =====
	entityToCreate := repositories.FilesystemEntry{
		LogicalName:  "random name",
		ParentFileID: 1,
		IsDocument:   false,
		OwnerUserId:  1,
	}

	mockFileRepo := repMocks.NewMockIFilesystemRepository(controller)
	mockFileRepo.EXPECT().CreateEntry(entityToCreate).Return(repositories.FilesystemEntry{
		EntityID:     2,
		LogicalName:  "random name",
		IsDocument:   false,
		ChildrenIDs:  []int{},
		ParentFileID: 1,
	}, nil).Times(1)

	mockDockerFileSystemRepo := repMocks.NewMockIUnpublishedVolumeRepository(controller)
	mockDockerFileSystemRepo.EXPECT().AddToVolume("2").Return(nil).Times(1)
	dockerRepoType := reflect.TypeOf((*repositories.IUnpublishedVolumeRepository)(nil))

	mockDepFactory := createMockDependencyFactory(controller, mockFileRepo, true)
	mockDepFactory.EXPECT().GetDependency(endpoints.UnpublishedVolumeRepository).Return(mockDockerFileSystemRepo)
	mockDepFactory.EXPECT().GetDepFromType(dockerRepoType).Return(endpoints.UnpublishedVolumeRepository)

	form := models.ValidEntityCreationRequest{
		LogicalName: "random name",
		Parent:      1,
		IsDocument:  false,
		OwnerGroup:  1,
	}

	// ==== test execution =====
	response := endpoints.CreateNewEntity(form, mockDepFactory)
	assert.Equal(response.Status, http.StatusOK)
	assert.Equal(response.Response, models.NewEntityResponse{
		NewID: 2,
	})
}

func TestValidDeleteFilesystemEntity(t *testing.T) {
	controller := gomock.NewController(t)
	assert := assert.New(t)
	defer controller.Finish()

	// ==== test setup =====
	mockFileRepo := repMocks.NewMockIFilesystemRepository(controller)
	mockFileRepo.EXPECT().DeleteEntryWithID(1).Return(nil).Times(1)

	mockDepFactory := createMockDependencyFactory(controller, mockFileRepo, true)

	form := models.ValidInfoRequest{
		EntityID: 1,
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
	mockFileRepo := repMocks.NewMockIFilesystemRepository(controller)
	mockFileRepo.EXPECT().GetEntryWithID(1).Return(repositories.FilesystemEntry{
		EntityID:    1,
		LogicalName: "random name",
		IsDocument:  false,
		ChildrenIDs: []int{2},
	}, nil).Times(1)

	mockDepFactory := createMockDependencyFactory(controller, mockFileRepo, true)

	form := models.ValidInfoRequest{
		EntityID: 1,
	}

	// ==== test execution =====
	response := endpoints.GetChildren(form, mockDepFactory)
	assert.Equal(response.Status, http.StatusOK)
	assert.Equal(response.Response, models.ChildrenRequestResponse{
		Children: []int{2},
	})
}

func TestValidUploadImage(t *testing.T) {
	controller := gomock.NewController(t)
	assert := assert.New(t)
	defer controller.Finish()

	// ==== test setup =====
	entityToCreate := repositories.FilesystemEntry{
		LogicalName:  "a.png",
		ParentFileID: 1,
		IsDocument:   false,
		OwnerUserId:  1,
	}

	mockFileRepo := repMocks.NewMockIFilesystemRepository(controller)
	mockFileRepo.EXPECT().CreateEntry(entityToCreate).Return(repositories.FilesystemEntry{
		EntityID:     2,
		LogicalName:  "a.png",
		IsDocument:   false,
		ChildrenIDs:  []int{},
		ParentFileID: 1,
	}, nil).Times(1)

	tempFile, _ := ioutil.TempFile(os.TempDir(), "expected")
	defer os.Remove(tempFile.Name())

	mockDockerFileSystemRepo := repMocks.NewMockIUnpublishedVolumeRepository(controller)
	mockDockerFileSystemRepo.EXPECT().AddToVolume("2").Return(nil).Times(1)
	mockDockerFileSystemRepo.EXPECT().GetFromVolume("2").Return(tempFile, nil).Times(1)

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
		Parent:      1,
		LogicalName: "a.png",
		OwnerGroup:  1,
		Image:       garbageFile,
	}

	// ==== test execution =====
	response := endpoints.UploadImage(form, mockDepFactory)
	assert.Equal(response.Status, http.StatusOK)
	assert.Equal(response.Response, models.NewEntityResponse{
		NewID: 2,
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
