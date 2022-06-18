package endpoints

import (
	"fmt"
	"net/http"
	"reflect"
	"strconv"

	"cms.csesoc.unsw.edu.au/database/repositories"
	"cms.csesoc.unsw.edu.au/internal/logger"
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
func GetEntityInfo(w http.ResponseWriter, r *http.Request, df DependencyFactory, log *logger.Log) (int, interface{}, error) {
	var input ValidInfoRequest
	if status := ParseParamsToSchema(r, "GET", &input); status != http.StatusOK {
		return status, nil, nil
	}

	fs := reflect.TypeOf((*repositories.IFilesystemRepository)(nil))
	repository := df.GetDependency(fs).(repositories.IFilesystemRepository)

	log.Write([]byte("Acquired repository."))

	if entity, err := repository.GetEntryWithID(input.EntityID); err == nil {
		log.Write([]byte(fmt.Sprintf("Retreived entity: %v", entity)))
		// Return a final structure with the children array mapped over as well
		return http.StatusOK, EntityInfo{
			EntityID:   entity.EntityID,
			EntityName: entity.LogicalName,
			IsDocument: entity.IsDocument,
			Parent:     entity.ParentFileID,
			Children: mapOver(entity.ChildrenIDs, func(id int) EntityInfo {
				x, _ := repository.GetEntryWithID(id)
				return EntityInfo{
					EntityID:   id,
					EntityName: x.LogicalName,
					IsDocument: x.IsDocument,
					Parent:     x.ParentFileID,
					Children:   nil,
				}
			}),
		}, nil
	} else {
		log.Write([]byte("Failed request!"))
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

func CreateNewEntity(w http.ResponseWriter, r *http.Request, df DependencyFactory, log *logger.Log) (int, interface{}, error) {
	var input ValidEntityCreationRequest
	if status := ParseParamsToSchema(r, "POST", &input); status != http.StatusOK {
		return status, nil, nil
	}

	fs := reflect.TypeOf((*repositories.IFilesystemRepository)(nil))
	dfs := reflect.TypeOf((*repositories.IDockerUnpublishedFilesystemRepository)(nil))

	repository := df.GetDependency(fs).(repositories.IFilesystemRepository)
	dockerRepository := df.GetDependency(dfs).(repositories.IDockerPublishedFilesystemRepository)
	log.Write([]byte("Acquired repository."))

	entityToCreate := repositories.FilesystemEntry{
		LogicalName:  input.LogicalName,
		ParentFileID: input.Parent,
		IsDocument:   input.IsDocument,
		OwnerUserId:  input.OwnerGroup,
	}

	if e, err := repository.CreateEntry(entityToCreate); err != nil {
		log.Write([]byte("Failed request!"))
		return http.StatusNotAcceptable, nil, err
	} else {
		// finally create a new entry in the docker filesystem
		dockerRepository.AddToVolume(strconv.Itoa(e.EntityID))

		log.Write([]byte(fmt.Sprintf("Created new entity %v.", entityToCreate)))
		return http.StatusOK, struct {
			NewID int
		}{
			NewID: e.EntityID,
		}, nil
	}

}

// Handler for deleting filesystem entities
func DeleteFilesystemEntity(w http.ResponseWriter, r *http.Request, df DependencyFactory, log *logger.Log) (int, interface{}, error) {
	var input ValidInfoRequest
	if status := ParseParamsToSchema(r, "POST", &input); status != http.StatusOK {
		return status, nil, nil
	}

	fs := reflect.TypeOf((*repositories.IFilesystemRepository)(nil))
	repository := df.GetDependency(fs).(repositories.IFilesystemRepository)
	log.Write([]byte("Acquired repository."))

	if err := repository.DeleteEntryWithID(input.EntityID); err != nil {
		log.Write([]byte("Failed request!"))
		return http.StatusNotAcceptable, nil, err
	} else {
		log.Write([]byte(fmt.Sprintf("Deleted entity wity ID: %d", input.EntityID)))
		return http.StatusOK, nil, nil
	}
}

// Handler for retrieving children
func GetChildren(w http.ResponseWriter, r *http.Request, df DependencyFactory, log *logger.Log) (int, interface{}, error) {
	var input ValidInfoRequest
	if status := ParseParamsToSchema(r, "GET", &input); status != http.StatusOK {
		return status, nil, nil
	}

	fs := reflect.TypeOf((*repositories.IFilesystemRepository)(nil))
	repository := df.GetDependency(fs).(repositories.IFilesystemRepository)
	log.Write([]byte("Acquired repository."))

	if fileInfo, err := repository.GetEntryWithID(input.EntityID); err != nil {
		log.Write([]byte("Failed request!"))
		return http.StatusNotFound, nil, nil
	} else {
		log.Write([]byte(fmt.Sprintf("Fetched children for %d, got %v", input.EntityID, fileInfo.ChildrenIDs)))
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

func GetIDWithPath(w http.ResponseWriter, r *http.Request, df DependencyFactory, log *logger.Log) (int, interface{}, error) {
	var input ValidPathRequest
	if status := ParseParamsToSchema(r, "GET", &input); status != http.StatusOK {
		return status, nil, nil
	}

	fs := reflect.TypeOf((*repositories.IFilesystemRepository)(nil))
	repository := df.GetDependency(fs).(repositories.IFilesystemRepository)
	log.Write([]byte("Acquired repository."))

	if entityID, err := repository.GetIDWithPath(input.Path); err != nil {
		log.Write([]byte("Failed request!"))
		return http.StatusNotFound, nil, nil
	} else {
		log.Write([]byte(fmt.Sprintf("Got ID %d for %s", entityID, input.Path)))
		return http.StatusOK, entityID, nil
	}
}

type ValidRenameRequest struct {
	EntityID int    `schema:"EntityID,required"`
	NewName  string `schema:"NewName,required"`
}

// Handler for renaming filesystem entities
func RenameFilesystemEntity(w http.ResponseWriter, r *http.Request, df DependencyFactory, log *logger.Log) (int, interface{}, error) {
	var input ValidRenameRequest
	if status := ParseParamsToSchema(r, "POST", &input); status != http.StatusOK {
		return status, nil, nil
	}

	fs := reflect.TypeOf((*repositories.IFilesystemRepository)(nil))
	repository := df.GetDependency(fs).(repositories.IFilesystemRepository)

	if err := repository.RenameEntity(input.EntityID, input.NewName); err != nil {
		log.Write([]byte("Failed request!"))
		return http.StatusNotAcceptable, nil, nil
	} else {
		log.Write([]byte(fmt.Sprintf("Renamed %d's name to %s", input.EntityID, input.NewName)))
		return http.StatusOK, nil, nil
	}
}

// generalised map function to make code a little cleaner
func mapOver[T any, V any](input []T, mapFunction func(T) V) []V {
	output := []V{}
	for _, i := range input {
		output = append(output, mapFunction(i))
	}
	return output
}
