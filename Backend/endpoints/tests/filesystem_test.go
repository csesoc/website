package tests

import (
	"bytes"
	"encoding/base64"
	"io/ioutil"
	"mime/multipart"
	"net/http"
	"net/url"
	"os"
	"reflect"
	"strconv"
	"strings"
	"testing"

	"cms.csesoc.unsw.edu.au/database/repositories"
	repMocks "cms.csesoc.unsw.edu.au/database/repositories/mocks"
	"cms.csesoc.unsw.edu.au/endpoints"
	"cms.csesoc.unsw.edu.au/endpoints/mocks"
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

	mockDepFactory := mocks.NewMockDependencyFactory(controller)
	mockDepFactory.EXPECT().GetDependency(reflect.TypeOf((*repositories.IFilesystemRepository)(nil))).Return(mockFileRepo)

	req, _ := http.NewRequest("GET", "/filesystem/info", nil)
	q := req.URL.Query()
	q.Add("EntityID", "1")
	req.URL.RawQuery = q.Encode()

	// ==== test execution =====
	status, result, err := endpoints.GetEntityInfo(nil, req, mockDepFactory, logger.OpenLog("new log"))
	assert.Nil(err)
	assert.Equal(status, http.StatusOK)
	assert.Equal(result, endpoints.EntityInfo{
		EntityID:   1,
		EntityName: "random name",
		IsDocument: false,
		Parent:     0,
		Children:   []endpoints.EntityInfo{},
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

	mockDockerFileSystemRepo := repMocks.NewMockIDockerUnpublishedFilesystemRepository(controller)
	mockDockerFileSystemRepo.EXPECT().AddToVolume("2").Return(nil).Times(1)

	mockDepFactory := mocks.NewMockDependencyFactory(controller)
	mockDepFactory.EXPECT().GetDependency(reflect.TypeOf((*repositories.IFilesystemRepository)(nil))).Return(mockFileRepo)
	mockDepFactory.EXPECT().GetDependency(reflect.TypeOf((*repositories.IUnpublishedVolumeRepository)(nil))).Return(mockDockerFileSystemRepo)

	data := url.Values{}
	data.Set("LogicalName", "random name")
	data.Set("Parent", "1")
	data.Set("IsDocument", "false")
	data.Set("OwnerGroup", "1")

	req, err := http.NewRequest("POST", "/filesystem/info", strings.NewReader(data.Encode())) // URL-encoded payload
	if err != nil {
		t.Fail()
	}

	req.Header.Add("Content-Type", "application/x-www-form-urlencoded")
	req.Header.Add("Content-Length", strconv.Itoa(len(data.Encode())))

	// ==== test execution =====
	status, result, err := endpoints.CreateNewEntity(nil, req, mockDepFactory, logger.OpenLog("new log"))
	assert.Nil(err)
	assert.Equal(status, http.StatusOK)
	assert.Equal(result, struct {
		NewID int
	}{
		NewID: 2,
	}, nil)
}

func TestValidDeleteFilesystemEntity(t *testing.T) {
	controller := gomock.NewController(t)
	assert := assert.New(t)
	defer controller.Finish()

	// ==== test setup =====
	mockFileRepo := repMocks.NewMockIFilesystemRepository(controller)
	mockFileRepo.EXPECT().DeleteEntryWithID(1).Return(nil).Times(1)

	mockDepFactory := mocks.NewMockDependencyFactory(controller)
	mockDepFactory.EXPECT().GetDependency(reflect.TypeOf((*repositories.IFilesystemRepository)(nil))).Return(mockFileRepo)

	data := url.Values{}
	data.Set("EntityID", "1")

	req, err := http.NewRequest("POST", "/filesystem/info", strings.NewReader(data.Encode())) // URL-encoded payload
	if err != nil {
		t.Fail()
	}

	req.Header.Add("Content-Type", "application/x-www-form-urlencoded")
	req.Header.Add("Content-Length", strconv.Itoa(len(data.Encode())))

	// ==== test execution =====
	status, result, err := endpoints.DeleteFilesystemEntity(nil, req, mockDepFactory, logger.OpenLog("new log"))
	assert.Nil(err)
	assert.Equal(status, http.StatusOK)
	assert.Equal(result, nil, nil)
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

	mockDepFactory := mocks.NewMockDependencyFactory(controller)
	mockDepFactory.EXPECT().GetDependency(reflect.TypeOf((*repositories.IFilesystemRepository)(nil))).Return(mockFileRepo)

	req, _ := http.NewRequest("GET", "/filesystem/info", nil)
	q := req.URL.Query()
	q.Add("EntityID", "1")
	req.URL.RawQuery = q.Encode()

	// ==== test execution =====
	status, result, err := endpoints.GetChildren(nil, req, mockDepFactory, logger.OpenLog("new log"))
	assert.Nil(err)
	assert.Equal(status, http.StatusOK)
	assert.Equal(result, struct {
		Children []int
	}{
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

	tempFile, err := ioutil.TempFile("", "")
	assert.Nil(err)
	defer os.Remove(tempFile.Name())

	mockDockerFileSystemRepo := repMocks.NewMockIDockerUnpublishedFilesystemRepository(controller)
	mockDockerFileSystemRepo.EXPECT().AddToVolume("2").Return(nil).Times(1)
	mockDockerFileSystemRepo.EXPECT().GetFromVolume("2").Return(tempFile, nil).Times(1)

	mockDepFactory := mocks.NewMockDependencyFactory(controller)
	mockDepFactory.EXPECT().GetDependency(reflect.TypeOf((*repositories.IFilesystemRepository)(nil))).Return(mockFileRepo)
	mockDepFactory.EXPECT().GetDependency(reflect.TypeOf((*repositories.IUnpublishedVolumeRepository)(nil))).Return(mockDockerFileSystemRepo)

	// Create request
	body := new(bytes.Buffer)
	writer := multipart.NewWriter(body)

	// Add image
	part, err := writer.CreateFormFile("Image", "a.png")
	assert.Nil(err)
	base64Png := "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="
	pngBytes, err := base64.StdEncoding.DecodeString(base64Png)
	assert.Nil(err)
	part.Write(pngBytes)

	// Add params
	writer.WriteField("LogicalName", "a.png")
	writer.WriteField("Parent", "1")
	writer.WriteField("OwnerGroup", "1")
	writer.Close()
	req, err := http.NewRequest("POST", "/filesystem/image-upload", body)
	assert.Nil(err)

	req.Header.Add("Content-Type", writer.FormDataContentType())

	// ==== test execution =====
	status, result, err := endpoints.UploadImage(nil, req, mockDepFactory, logger.OpenLog("new log"))
	assert.Nil(err)
	assert.Equal(http.StatusOK, status)
	assert.Equal(result, struct {
		NewID int
	}{
		NewID: 2,
	}, nil)
	content, err := os.ReadFile(tempFile.Name())
	assert.Nil(err)
	assert.Equal(pngBytes, content)
}
