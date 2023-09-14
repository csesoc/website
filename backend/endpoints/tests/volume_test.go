package tests

import (
	"io/ioutil"
	"net/http"
	"os"
	"testing"

	"cms.csesoc.unsw.edu.au/database/repositories"
	repMocks "cms.csesoc.unsw.edu.au/database/repositories/mocks"
	"cms.csesoc.unsw.edu.au/endpoints"
	"cms.csesoc.unsw.edu.au/endpoints/models"
	"github.com/golang/mock/gomock"
	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"
)

func TestUploadDocument(t *testing.T) {
}

func TestGetPublishedDocument(t *testing.T) {
	controller := gomock.NewController(t)
	assert := assert.New(t)
	defer controller.Finish()

	// ==== test setup =====
	entityID := uuid.New()

	tempFile, _ := ioutil.TempFile(os.TempDir(), "expected")
	if _, err := tempFile.WriteString("hello world"); err != nil {
		panic(err)
	}
	tempFile.Seek(0, 0)
	defer os.Remove(tempFile.Name())

	mockDockerFileSystemRepo := repMocks.NewMockIPublishedVolumeRepository(controller)
	mockDockerFileSystemRepo.EXPECT().GetFromVolume(entityID.String()).Return(tempFile, nil).Times(1)

	mockDepFactory := createMockDependencyFactory(controller, nil, true)
	mockDepFactory.EXPECT().GetPublishedVolumeRepo().Return(mockDockerFileSystemRepo)

	// // ==== test execution =====
	form := models.ValidGetPublishedDocumentRequest{DocumentID: entityID}
	response := endpoints.GetPublishedDocument(form, mockDepFactory)

	assert.Equal(response.Status, http.StatusOK)
	assert.Equal(response.Response, []byte("{\"Contents\": hello world}"))
}

func TestUploadImage(t *testing.T) {
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

	mockDepFactory := createMockDependencyFactory(controller, mockFileRepo, true)
	mockDepFactory.EXPECT().GetUnpublishedVolumeRepo().Return(mockDockerFileSystemRepo)

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
