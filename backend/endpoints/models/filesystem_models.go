package models

import "cms.csesoc.unsw.edu.au/database/repositories"

// Request models outline the general model that an incoming request to a handler must satisfy
type (
	// ValidInfoRequest is the model accepted by handlers that return information regarding an entity
	ValidInfoRequest struct {
		EntityID int `schema:"EntityID"`
	}

	// ValidEntityCreationRequest is the model accepted by handlers that will ever create a FS entity
	ValidEntityCreationRequest struct {
		Parent      int
		LogicalName string `schema:"LogicalName,required"`
		OwnerGroup  int    `schema:"OwnerGroup,required"`
		IsDocument  bool   `schema:"IsDocument,required"`
	}

	// ValidPathRequest is a special request model that is accepted by a handler that takes a path to an entity as an argument
	ValidPathRequest struct {
		Path string `schema:"Path,required"`
	}

	// ValidRenameRequest is the request model accepted by handlers that rename entities
	ValidRenameRequest struct {
		EntityID int    `schema:"EntityID,required"`
		NewName  string `schema:"NewName,required"`
	}
)

// Response models outline the general format a HTTP handler response follows
type (
	// NewEntityResponse is the response model for any handler that returns a new entity
	NewEntityResponse struct {
		NewID int
	}

	// ChildrenRequestResponse is the response model for any handler that will return the children of an entity
	ChildrenRequestResponse struct {
		Children []int
	}

	// EntityInfoResponse is the response model of any handler that returns information regarding an entity
	EntityInfoResponse struct {
		EntityID   int
		EntityName string
		IsDocument bool
		Parent     int
		Children   []EntityInfoResponse
	}
)

// FsEntryToEntityInfo just converts an instance of an FS entry to an instance of an entityInfo object
// entityInfo objects are what is actually displayed to the end user
func FsEntryToEntityInfo(entity repositories.FilesystemEntry, fsRepo repositories.IFilesystemRepository, expandChildren bool) EntityInfoResponse {
	children := []EntityInfoResponse{}
	if expandChildren {
		for _, childId := range entity.ChildrenIDs {
			child, _ := fsRepo.GetEntryWithID(childId)
			children = append(children, FsEntryToEntityInfo(child, fsRepo, false))
		}
	}

	return EntityInfoResponse{
		EntityID:   entity.EntityID,
		EntityName: entity.LogicalName,
		IsDocument: entity.IsDocument,
		Parent:     entity.ParentFileID,
		Children:   children,
	}
}

// CreationReqToFsEntry converts a creation request into a proper filesystem entity
func CreationReqToFsEntry(form ValidEntityCreationRequest) repositories.FilesystemEntry {
	return repositories.FilesystemEntry{
		LogicalName:  form.LogicalName,
		ParentFileID: form.Parent,
		IsDocument:   form.IsDocument,
		OwnerUserId:  form.OwnerGroup,
	}
}
