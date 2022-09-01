package endpoints

import (
	"bytes"
	"fmt"
	"io"
	"net/http"
	"strconv"

	"cms.csesoc.unsw.edu.au/database/repositories"
	. "cms.csesoc.unsw.edu.au/endpoints/models"
	"cms.csesoc.unsw.edu.au/internal/logger"
)

// UploadImage takes an image from a request and uploads it to the published docker volume
func UploadImage(form ValidImageUploadRequest, df DependencyFactory) handlerResponse[NewEntityResponse] {
	dockerRepository := getDependency[repositories.IUnpublishedVolumeRepository](df)
	repository := getDependency[repositories.IFilesystemRepository](df)
	log := getDependency[*logger.Log](df)

	// Remember to close all multipart forms
	defer form.Image.Close()

	entityToCreate := repositories.FilesystemEntry{
		LogicalName: form.LogicalName, ParentFileID: form.Parent,
		IsDocument: false, OwnerUserId: form.OwnerGroup,
	}

	// Push the new entry into the repository
	e, err := repository.CreateEntry(entityToCreate)
	if err != nil {
		return handlerResponse[NewEntityResponse]{
			Status: http.StatusNotAcceptable,
		}
	}

	// Create and get a new entry in docker file system
	dockerRepository.AddToVolume(strconv.Itoa(e.EntityID))
	if dockerFile, err := dockerRepository.GetFromVolume(strconv.Itoa(e.EntityID)); err != nil {
		return handlerResponse[NewEntityResponse]{Status: http.StatusInternalServerError}
	} else {
		_, err := io.Copy(dockerFile, form.Image)
		if err != nil {
			log.Write("failed to write image to docker container")
			return handlerResponse[NewEntityResponse]{
				Status: http.StatusInternalServerError,
			}
		}
	}

	log.Write(fmt.Sprintf("created new entity %v", entityToCreate))
	return handlerResponse[NewEntityResponse]{
		Response: NewEntityResponse{NewID: e.EntityID},
		Status:   http.StatusOK,
	}
}

// PublishDocument takes in DocumentID and transfers the document from unpublished to published volume if it exists
func PublishDocument(form ValidPublishDocumentRequest, df DependencyFactory) handlerResponse[empty] {
	log := getDependency[*logger.Log](df)
	log.Write("sdhfkjsdfjlasjfldjlasld")

	unpublishedVol := getDependency[repositories.IUnpublishedVolumeRepository](df)
	publishedVol := getDependency[repositories.IPublishedVolumeRepository](df)

	// fetch the target file form the unpublished volume
	filename := strconv.Itoa(form.DocumentID)
	log.Write("filename")
	log.Write(filename)
	file, err := unpublishedVol.GetFromVolume(filename)
	if err != nil {
		return handlerResponse[empty]{
			Status: http.StatusNotFound,
		}
	}

	// Copy over to the target volume
	if publishedVol.CopyToVolume(file, filename) != nil {
		return handlerResponse[empty]{
			Status: http.StatusInternalServerError,
		}
	}

	return handlerResponse[empty]{}
}

const emptyFile string = "{}"

// GetPublishedDocument retrieves the contents of a published document from the published docker volume
func GetPublishedDocument(form ValidGetPublishedDocumentRequest, df DependencyFactory) handlerResponse[DocumentRetrievalResponse] {
	publishedVol := getDependency[repositories.IPublishedVolumeRepository](df)
	log := getDependency[*logger.Log](df)

	// Get file from published volume
	file, err := publishedVol.GetFromVolume(strconv.Itoa(form.DocumentID))
	if err != nil {
		return handlerResponse[DocumentRetrievalResponse]{
			Status: http.StatusNotFound,
		}
	}
	defer file.Close()

	// Read from the file setting it to empty on error
	buf := &bytes.Buffer{}
	bytes, err := buf.ReadFrom(file)
	if err != nil || bytes == 0 {
		log.Write("failed to read from the requested file")
		buf.WriteString(emptyFile)
	}

	return handlerResponse[DocumentRetrievalResponse]{
		Status: http.StatusOK,
		Response: DocumentRetrievalResponse{
			Contents: buf.String(),
		},
	}
}
