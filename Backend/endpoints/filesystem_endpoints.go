package endpoints

import (
	"bytes"
	"errors"
	"fmt"
	"io"
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
		log.Write([]byte(fmt.Sprintf("Retreived entity: %v.", entity)))
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
		log.Write([]byte(fmt.Sprintf("Deleted entity wity ID: %d.", input.EntityID)))
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
		log.Write([]byte(fmt.Sprintf("Fetched children for %d, got %v.", input.EntityID, fileInfo.ChildrenIDs)))
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
		log.Write([]byte(fmt.Sprintf("Renamed %d's name to %s.", input.EntityID, input.NewName)))
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

type ValidImageUploadRequest struct {
	Parent      int
	LogicalName string `schema:"LogicalName,required"`
	OwnerGroup  int    `schema:"OwnerGroup,required"`
}

func UploadImage(w http.ResponseWriter, r *http.Request, df DependencyFactory, log *logger.Log) (int, interface{}, error) {
	var input ValidImageUploadRequest
	if status := ParseMultiPartFormToSchema(r, "POST", &input); status != http.StatusOK {
		return status, nil, nil
	}

	// Parse multipart file, with max size of 10 MB
	// Extract image and check for error
	uploadedFile, _, err := r.FormFile("Image")
	if err != nil {
		log.Write([]byte("Error retrieving the file"))
		return http.StatusBadRequest, nil, err
	}
	defer uploadedFile.Close()

	// Create entity in repository
	fs := reflect.TypeOf((*repositories.IFilesystemRepository)(nil))
	dfs := reflect.TypeOf((*repositories.IDockerUnpublishedFilesystemRepository)(nil))

	repository := df.GetDependency(fs).(repositories.IFilesystemRepository)
	dockerRepository := df.GetDependency(dfs).(repositories.IDockerPublishedFilesystemRepository)
	log.Write([]byte("Acquired repository."))

	entityToCreate := repositories.FilesystemEntry{
		LogicalName:  input.LogicalName,
		ParentFileID: input.Parent,
		IsDocument:   false,
		OwnerUserId:  input.OwnerGroup,
	}

	e, err := repository.CreateEntry(entityToCreate)
	if err != nil {
		log.Write([]byte("Failed request!"))
		return http.StatusNotAcceptable, nil, err
	}

	// Create and get a new entry in docker file system
	dockerRepository.AddToVolume(strconv.Itoa(e.EntityID))
	log.Write([]byte(fmt.Sprintf("Created new entity %v.", entityToCreate)))
	dockerFile, err := dockerRepository.GetFromVolume(strconv.Itoa(e.EntityID))
	if err != nil {
		log.Write([]byte("Unable to get docker file."))
		return http.StatusInternalServerError, nil, err
	}

	if _, err := io.Copy(dockerFile, uploadedFile); err != nil {
		log.Write([]byte("Error copying uploaded image to local file."))
		return http.StatusInternalServerError, nil, err
	}

	return http.StatusOK, struct {
		NewID int
	}{
		NewID: e.EntityID,
	}, nil

}

type ValidPublishDocumentRequest struct {
	DocumentID int `schema:"DocumentID,required"`
}

// Takes in DocumentID and transfers the document from unpublished to published volume if it exists
func PublishDocument(w http.ResponseWriter, r *http.Request, df DependencyFactory, log *logger.Log) (int, interface{}, error) {
	var input ValidPublishDocumentRequest
	if status := ParseMultiPartFormToSchema(r, "POST", &input); status != http.StatusOK {
		return status, nil, nil
	}

	unpublishedFS := reflect.TypeOf((*repositories.IDockerUnpublishedFilesystemRepository)(nil))
	publishedFS := reflect.TypeOf((*repositories.IDockerPublishedFilesystemRepository)(nil))

	unpublishedDockerRepo := df.GetDependency(unpublishedFS).(repositories.IDockerUnpublishedFilesystemRepository)
	publishedDockerRepo := df.GetDependency(publishedFS).(repositories.IDockerPublishedFilesystemRepository)

	filename := strconv.Itoa(input.DocumentID)
	// Get the file from the unpublished volume
	file, err := unpublishedDockerRepo.GetFromVolume(filename)
	if err != nil {
		return http.StatusInternalServerError, nil, errors.New("Requested document doesn't exist or is invalid")
	}
	// CopyToVolume will create or copy source file into published volume
	err = publishedDockerRepo.CopyToVolume(file, filename)
	if err != nil {
		return http.StatusInternalServerError, nil, errors.New("Couldn't copy file to published volume")
	}
	return http.StatusOK, struct{}{}, nil
}

type ValidGetPublishedDocumentRequest struct {
	DocumentID int `schema:"DocumentID,required"`
}

func GetPublishedDocument(w http.ResponseWriter, r *http.Request, df DependencyFactory, log *logger.Log) (int, interface{}, error) {
	var input ValidGetPublishedDocumentRequest
	if status := ParseParamsToSchema(r, "GET", &input); status != http.StatusOK {
		return status, nil, nil
	}

	publishedFS := reflect.TypeOf((*repositories.IDockerPublishedFilesystemRepository)(nil))
	publishedDockerRepo := df.GetDependency(publishedFS).(repositories.IDockerPublishedFilesystemRepository)

	// Get file from published volume
	file, err := publishedDockerRepo.GetFromVolume(strconv.Itoa(input.DocumentID))
	if err != nil {
		return http.StatusInternalServerError, nil, errors.New("Requested document doesn't exist or is invalid")
	}

	defer file.Close()

	// send the current state of the document
	buf := &bytes.Buffer{}
	bytes, err := buf.ReadFrom(file)

	if err != nil {
		return http.StatusInternalServerError, nil, errors.New("Unable to read request document")
	}

	// Empty file
	if bytes == 0 {
		buf.WriteString("[]")
	}

	return http.StatusOK, struct {
		Contents string
	}{
		Contents: buf.String(),
	}, nil
}
