package tests

import (
	"net/http"
	"net/url"
	"reflect"
	"strconv"
	"strings"
	"testing"

	"cms.csesoc.unsw.edu.au/database/repositories"
	repMocks "cms.csesoc.unsw.edu.au/database/repositories/mocks"
	"cms.csesoc.unsw.edu.au/endpoints"
	"cms.csesoc.unsw.edu.au/endpoints/mocks"
	"github.com/golang/mock/gomock"
	"github.com/stretchr/testify/assert"
)

func TestEntityInfo(t *testing.T) {
	controller := gomock.NewController(t)
	assert := assert.New(t)
	defer controller.Finish()

	// ==== test setup =====
	mockFileRepo := repMocks.NewMockIFilesystemRepository(controller)
	mockFileRepo.EXPECT().GetEntryWithID(1).Return(repositories.FilesystemEntry{
		EntityID:    1,
		LogicalName: "random name",
		IsDocument:  false,
		ChildrenIDs: []int{},
	}, nil).Times(1)

	mockDepFactory := mocks.NewMockDependencyFactory(controller)
	mockDepFactory.EXPECT().GetDependency(reflect.TypeOf((*repositories.IFilesystemRepository)(nil))).Return(mockFileRepo)

	req, _ := http.NewRequest("GET", "/filesystem/info", nil)
	q := req.URL.Query()
	q.Add("EntityID", "1")
	req.URL.RawQuery = q.Encode()

	// ==== test execution =====
	status, result, err := endpoints.GetEntityInfo(nil, req, mockDepFactory)
	assert.Nil(err)
	assert.Equal(status, http.StatusOK)
	assert.Equal(result, endpoints.EntityInfo{
		EntityID:   1,
		EntityName: "random name",
		IsDocument: false,
		Children:   []endpoints.EntityInfo{},
	})
}

func TestCreateNewEntity(t *testing.T) {
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

	mockDepFactory := mocks.NewMockDependencyFactory(controller)
	mockDepFactory.EXPECT().GetDependency(reflect.TypeOf((*repositories.IFilesystemRepository)(nil))).Return(mockFileRepo)

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
	status, result, err := endpoints.CreateNewEntity(nil, req, mockDepFactory)
	assert.Nil(err)
	assert.Equal(status, http.StatusOK)
	assert.Equal(result, struct {
		NewID int
	}{
		NewID: 2,
	}, nil)
}

func TestDeleteFilesystemEntity(t *testing.T) {
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
	status, result, err := endpoints.DeleteFilesystemEntity(nil, req, mockDepFactory)
	assert.Nil(err)
	assert.Equal(status, http.StatusOK)
	assert.Equal(result, nil, nil)
}
