package endpoints

import (
	"fmt"
	"net/http"
	"reflect"

	"cms.csesoc.unsw.edu.au/database/repositories"
)

type EntityInfo struct {
	EntityID   int
	EntityName string
	IsDocument bool
	Parent     int
	Children   []EntityInfo
}

type ValidInfoRequest struct {
	EntityID int `schema:"EntityID"`
}

// Defines endpoints consumable via the API
func GetEntityInfo(w http.ResponseWriter, r *http.Request, df DependencyFactory) (int, interface{}, error) {
	var input ValidInfoRequest
	if !ParseParamsToSchema(r, "GET", &input) {
		return http.StatusBadRequest, nil, nil
	}

	fs := reflect.TypeOf((*repositories.IFilesystemRepository)(nil))
	repository := df.GetDependency(fs).(repositories.IFilesystemRepository)

	if entity, err := repository.GetEntryWithID(input.EntityID); err == nil {
		childrenArr := []EntityInfo{}
		for _, id := range entity.ChildrenIDs {
			x, _ := repository.GetEntryWithID(id)
			childrenArr = append(childrenArr, EntityInfo{
				EntityID:   id,
				EntityName: x.LogicalName,
				IsDocument: x.IsDocument,
				Parent:     x.ParentFileID,
				Children:   nil,
			})
		}

		return http.StatusOK, EntityInfo{
			EntityID:   entity.EntityID,
			EntityName: entity.LogicalName,
			IsDocument: entity.IsDocument,
			Parent:     entity.ParentFileID,
			Children:   childrenArr,
		}, nil
	} else {
		return http.StatusNotFound, nil, nil
	}
}

// TODO: this needs to be wrapped around auth and permissions later
type ValidEntityCreationRequest struct {
	Parent      int
	LogicalName string `schema:"LogicalName,required"`
	OwnerGroup  int    `schema:"OwnerGroup,required"`
	IsDocument  bool   `schema:"IsDocument,required"`
}

func CreateNewEntity(w http.ResponseWriter, r *http.Request, df DependencyFactory) (int, interface{}, error) {
	var input ValidEntityCreationRequest
	if !ParseParamsToSchema(r, "POST", &input) {
		return http.StatusBadRequest, nil, nil
	}

	fs := reflect.TypeOf((*repositories.IFilesystemRepository)(nil))
	repository := df.GetDependency(fs).(repositories.IFilesystemRepository)
	entityToCreate := repositories.FilesystemEntry{
		LogicalName:  input.LogicalName,
		ParentFileID: input.Parent,
		IsDocument:   input.IsDocument,
		OwnerUserId:  input.OwnerGroup,
	}

	if e, err := repository.CreateEntry(entityToCreate); err != nil {
		return http.StatusNotAcceptable, nil, nil
	} else {
		return http.StatusOK, struct {
			NewID int
		}{
			NewID: e.EntityID,
		}, nil
	}

}

// Handler for deleting filesystem entities
func DeleteFilesystemEntity(w http.ResponseWriter, r *http.Request, df DependencyFactory) (int, interface{}, error) {
	var input ValidInfoRequest
	if !ParseParamsToSchema(r, "POST", &input) {
		return http.StatusBadRequest, nil, nil
	}

	fs := reflect.TypeOf((*repositories.IFilesystemRepository)(nil))
	repository := df.GetDependency(fs).(repositories.IFilesystemRepository)
	if repository.DeleteEntryWithID(input.EntityID) != nil {
		return http.StatusNotAcceptable, nil, nil
	} else {
		return http.StatusOK, nil, nil
	}
}

// Handler for retrieving children
func GetChildren(w http.ResponseWriter, r *http.Request, df DependencyFactory) (int, interface{}, error) {
	var input ValidInfoRequest
	if !ParseParamsToSchema(r, "GET", &input) {
		return http.StatusBadRequest, nil, nil
	}

	fs := reflect.TypeOf((*repositories.IFilesystemRepository)(nil))
	repository := df.GetDependency(fs).(repositories.IFilesystemRepository)
	if fileInfo, err := repository.GetEntryWithID(input.EntityID); err != nil {
		return http.StatusNotFound, nil, nil
	} else {
		return http.StatusOK, struct {
			Children []int
		}{
			Children: fileInfo.ChildrenIDs,
		}, nil
	}
}

type ValidPathRequest struct {
	Path string `schema:"Path,required"`
}

func GetIDWithPath(w http.ResponseWriter, r *http.Request, df DependencyFactory) (int, interface{}, error) {
	var input ValidPathRequest
	if !ParseParamsToSchema(r, "GET", &input) {
		return http.StatusBadRequest, nil, nil
	}

	fs := reflect.TypeOf((*repositories.IFilesystemRepository)(nil))
	repository := df.GetDependency(fs).(repositories.IFilesystemRepository)
	if entityID, err := repository.GetIDWithPath(input.Path); err != nil {
		return http.StatusNotFound, nil, nil
	} else {
		return http.StatusOK, entityID, nil
	}
}

type ValidRenameRequest struct {
	EntityID int    `schema:"EntityID,required"`
	NewName  string `schema:"NewName,required"`
}

// Handler for renaming filesystem entities
func RenameFilesystemEntity(w http.ResponseWriter, r *http.Request, df DependencyFactory) (int, interface{}, error) {
	var input ValidRenameRequest
	if !ParseParamsToSchema(r, "POST", &input) {
		return http.StatusBadRequest, nil, nil
	}

	fs := reflect.TypeOf((*repositories.IFilesystemRepository)(nil))
	repository := df.GetDependency(fs).(repositories.IFilesystemRepository)
	if repository.RenameEntity(input.EntityID, input.NewName) != nil {
		return http.StatusNotAcceptable, nil, nil
	} else {
		return http.StatusOK, nil, nil
	}
}

type ValidImageUploadRequest struct {
	Parent      int
	LogicalName string `schema:"LogicalName,required"`
	OwnerGroup  int    `schema:"OwnerGroup,required"`
}

// Request struct just needs parent id, and needs to check if it is a directory
// Handler for retrieving children
func UploadImage(w http.ResponseWriter, r *http.Request, df DependencyFactory) (int, interface{}, error) {
	var input ValidImageUploadRequest
	if !ParseParamsToSchema(r, "POST", &input) {
		return http.StatusBadRequest, nil, nil
	}

	// Extract image and check for error
	file, _, err := r.FormFile("Image")
	if err != nil {
		fmt.Println("Error retrieving the file")
		return http.StatusBadRequest, nil, err
	}
	defer file.Close()

	// Create entity in repository
	fs := reflect.TypeOf((*repositories.IFilesystemRepository)(nil))
	repository := df.GetDependency(fs).(repositories.IFilesystemRepository)
	entityToCreate := repositories.FilesystemEntry{
		LogicalName:  input.LogicalName,
		ParentFileID: input.Parent,
		IsDocument:   false,
		OwnerUserId:  input.OwnerGroup,
	}

	// // Create a temporary file
	// tempFile, err := ioutil.TempFile("", "upload-*.png")
	// if err != nil {
	// 	fmt.Println(err)
	// }
	// defer tempFile.Close()

	// // Write bytes to temporary file
	// if fileBytes, err := ioutil.ReadAll(file); err != nil {
	// 	fmt.Println(err)
	// } else {
	// 	tempFile.Write(fileBytes)
	// }

	if e, err := repository.CreateEntry(entityToCreate); err != nil {
		return http.StatusNotAcceptable, nil, nil
	} else {
		return http.StatusOK, struct {
			NewID int
		}{
			NewID: e.EntityID,
		}, nil
	}
}
