package endpoints

import (
	"encoding/json"
	"fmt"
	"net/http"

	"cms.csesoc.unsw.edu.au/database/repositories"
	"cms.csesoc.unsw.edu.au/internal/httpUtil"
)

type EntityInfo struct {
	EntityID   int
	EntityName string
	IsDocument bool
	Children   []int
}

type ValidInfoRequest struct {
	EntityID int `schema:"EntityID"`
}

// Defines endpoints consumable via the API
func GetEntityInfo(w http.ResponseWriter, r *http.Request) {

	var input ValidInfoRequest
	if validRequest := httpUtil.ParseParamsToSchema(w, r, []string{"GET"}, map[int]string{
		400: "missing EntityID paramater",
		405: "invalid method",
	}, &input); validRequest {

		var fileInfo repositories.FilesystemEntry
		var err error
		repository := repositories.GetRepository(repositories.FILESYSTEM).(repositories.FilesystemRepository)

		if input.EntityID == 0 {
			fileInfo, err = repository.GetRoot()
		} else {
			fileInfo, err = repository.GetEntryWithID(input.EntityID)
		}

		if err != nil {
			httpUtil.ThrowRequestError(w, 404, "unable to find entity with requested ID")
			return
		}

		out, _ := json.Marshal(EntityInfo{
			EntityID:   fileInfo.EntityID,
			EntityName: fileInfo.LogicalName,
			IsDocument: fileInfo.IsDocument,
			Children:   fileInfo.ChildrenIDs,
		})
		httpUtil.SendResponse(w, string(out))
	}

}

// TODO: this needs to be wrapped around auth and permissions later
type ValidEntityCreationRequest struct {
	Parent      int
	LogicalName string `schema:"LogicalName,required"`
	OwnerGroup  int    `schema:"OwnerGroup,required"`
	IsDocument  bool   `schema:"IsDocument,required"`
}

func CreateNewEntity(w http.ResponseWriter, r *http.Request) {

	var input ValidEntityCreationRequest
	if validRequest := httpUtil.ParseParamsToSchema(w, r, []string{"POST"}, map[int]string{
		400: "missing paramaters, must have: LogicalName, OwnerGroup, IsDocument",
		405: "invalid method",
	}, &input); validRequest {

		repository := repositories.GetRepository(repositories.FILESYSTEM).(repositories.FilesystemRepository)
		entityToCreate := repositories.FilesystemEntry{
			LogicalName:  input.LogicalName,
			ParentFileID: input.Parent,
			IsDocument:   input.IsDocument,
			OwnerUserId:  input.OwnerGroup,
		}

		// If not parent is specified set it to root
		if input.Parent == 0 {
			entityToCreate.ParentFileID = repositories.FILESYSTEM_ROOT_ID
		}

		if e, err := repository.CreateEntry(entityToCreate); err != nil {
			httpUtil.ThrowRequestError(w, 500, "unable to create entity (may be a duplicate)")
		} else {
			httpUtil.SendResponse(w, fmt.Sprintf(`{"success": true, "newID": %d}`, e.EntityID))
		}
	}

}

// Handler for deleting filesystem entities
func DeleteFilesystemEntity(w http.ResponseWriter, r *http.Request) {
	var input ValidInfoRequest
	if validRequest := httpUtil.ParseParamsToSchema(w, r, []string{"POST"}, map[int]string{
		400: "missing paramaters, must have: LogicalName, OwnerGroup, IsDocument",
		405: "invalid method",
	}, &input); validRequest {
		repository := repositories.GetRepository(repositories.FILESYSTEM).(repositories.FilesystemRepository)
		if repository.DeleteEntryWithID(input.EntityID) != nil {
			httpUtil.ThrowRequestError(w, 500, "unable to delete, the requested entity is either the root directory or has children")
		} else {
			httpUtil.SendResponse(w, fmt.Sprintf(`{"success": true, "deleted": %d}`, input.EntityID))
		}
	}
}

// Handler for retrieving children
func GetChildren(w http.ResponseWriter, r *http.Request) {
	var input ValidInfoRequest
	if validRequest := httpUtil.ParseParamsToSchema(w, r, []string{"GET"}, map[int]string{
		400: "missing EntityID paramater",
		405: "invalid method",
	}, &input); validRequest {
		repository := repositories.GetRepository(repositories.FILESYSTEM).(repositories.FilesystemRepository)

		if fileInfo, err := repository.GetEntryWithID(input.EntityID); err != nil {
			httpUtil.ThrowRequestError(w, 404, "unable to find entity with requested ID")
		} else {
			out, _ := json.Marshal(fileInfo.ChildrenIDs)
			httpUtil.SendResponse(w, string(out))
		}
	}
}

type ValidRenameRequest struct {
	EntityID int    `schema:"EntityID,required"`
	NewName  string `schema:"NewName,required"`
}

// Handler for renaming filesystem entities
func RenameFilesystemEntity(w http.ResponseWriter, r *http.Request) {
	var input ValidRenameRequest
	if validRequest := httpUtil.ParseParamsToSchema(w, r, []string{"POST"}, map[int]string{
		400: "missing paramaters, must have: NewName, EntityID",
		405: "invalid method",
	}, &input); validRequest {
		repository := repositories.GetRepository(repositories.FILESYSTEM).(repositories.FilesystemRepository)
		if repository.RenameEntity(input.EntityID, input.NewName) != nil {
			httpUtil.ThrowRequestError(w, 500, "unable rename, the requested name is most likely taken")
		} else {
			httpUtil.SendResponse(w, fmt.Sprintf(`{"success": true, "renamed": %d}`, input.EntityID))
		}
	}
}
